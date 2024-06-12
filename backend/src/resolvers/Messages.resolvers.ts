import {
  Arg,
  Query,
  Resolver,
  Mutation,
  Authorized,
  Ctx,
  Subscription,
  Root,
} from 'type-graphql'
import {
  Message,
  MessageConversationInput,
  MessageCreateInput,
} from '../entities/Message'
import { MyContext } from '../types/Users.types'
import { User } from '../entities/User'
import { pubSub } from '../pubSub'
import { Ad } from '../entities/Ad'

@Resolver(Message)
export class MessagesResolver {
  // CREATE
  @Authorized('ADMIN', 'USER')
  @Mutation(() => Message)
  async sendMessage(
    @Arg('data', () => MessageCreateInput) data: MessageCreateInput,
    @Ctx() context: MyContext
  ): Promise<Message> {
    // Check if sender is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }

    try {
      // Validate receiver
      const receiver = await User.findOneBy({ id: data.receiver.id })
      if (!receiver) {
        throw new Error('The specified receiver does not exist')
      }

      // Validate adId
      const ad = await Ad.findOneBy({ id: data.adId })
      if (!ad) {
        throw new Error('The specified ad does not exist')
      }

      // Create and save new message
      const newMessage = Message.create({
        adId: data.adId,
        content: data.content,
        sender: context.user,
        receiver,
      })

      await newMessage.save()

      // Publish new message event
      pubSub.publish('MESSAGES', newMessage)

      return newMessage
    } catch (error) {
      console.error(error)
      throw new Error('Failed to send message')
    }
  }

  // GET
  @Authorized('ADMIN', 'USER')
  @Query(() => [Message])
  async getConversationMessages(
    @Arg('data', () => MessageConversationInput) data: MessageConversationInput,
    @Ctx() context: MyContext
  ): Promise<Message[]> {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }

    // Ensure that the requesting user is either one of the participants or an admin
    const isParticipant =
      context.user.id === data.userId1 || context.user.id === data.userId2
    if (!isParticipant) {
      throw new Error('Not authorized to view these conversation messages')
    }

    try {
      // Fetch the conversation messages for the specified adId
      const messages = await Message.find({
        where: [
          {
            sender: { id: data.userId1 },
            receiver: { id: data.userId2 },
            adId: data.adId,
          },
          {
            sender: { id: data.userId2 },
            receiver: { id: data.userId1 },
            adId: data.adId,
          },
        ],
        order: {
          createdAt: 'ASC',
        },
        relations: { sender: true, receiver: true },
      })

      return messages
    } catch (error) {
      console.error(error)
      throw new Error('Failed to fetch conversation messages')
    }
  }

  // SUBSCRIPTION
  @Authorized('ADMIN', 'USER')
  @Subscription(() => Message, {
    topics: 'MESSAGES',
    filter: ({ payload, args, context }) => {
      if (!context.user) {
        throw new Error('User context is missing or user is not authenticated')
      }
      return (
        payload.receiver.id === context.user.id && payload.adId === args.adId
      )
    },
  })
  async newMessage(
    @Root() payload: Message,
    @Arg('adId') adId: number
  ): Promise<Message> {
    const ad = await Ad.findOneBy({ id: adId })
    if (!ad) {
      throw new Error('The specified ad does not exist')
    }
    return payload
  }
}
