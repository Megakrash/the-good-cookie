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
  MessageGetConversationInput,
  MessageCreateInput,
} from '../entities/Message'
import { MyContext } from '../types/Users.types'
import { User } from '../entities/User'
import { pubSub } from '../pubSub'
import { Ad } from '../entities/Ad'
import { Conversation } from '../entities/Conversation'

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
      const ad = await Ad.findOneBy({ id: data.ad.id })
      if (!ad) {
        throw new Error('The specified ad does not exist')
      }

      // Check if the conversation already exists
      let conversation = await Conversation.findOne({
        where: [
          {
            user1: { id: context.user.id },
            user2: { id: receiver.id },
            ad: { id: ad.id },
          },
          {
            user1: { id: receiver.id },
            user2: { id: context.user.id },
            ad: { id: ad.id },
          },
        ],
      })

      // If the conversation does not exist, create a new one
      if (!conversation) {
        conversation = Conversation.create({
          user1: context.user,
          user2: data.receiver,
          ad,
        })
        await conversation.save()
      }

      // Create and save new message
      const newMessage = Message.create({
        conversation,
        ad: ad,
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
    @Arg('data', () => MessageGetConversationInput)
    data: MessageGetConversationInput,
    @Ctx() context: MyContext
  ): Promise<Message[]> {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }

    // Fetch the conversation messages for the specified conversation
    if (data.conversation) {
      try {
        const messages = await Message.find({
          where: {
            conversation: { id: data.conversation.id },
          },
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

    // Ensure that the requesting user is either one of the participants or an admin
    const isParticipant =
      context.user.id === data.userId1 || context.user.id === data.userId2
    if (!isParticipant) {
      throw new Error('Not authorized to view these conversation messages')
    }

    // Validate adId
    const ad = await Ad.findOneBy({ id: data.adId })
    if (!ad) {
      throw new Error('The specified ad does not exist')
    }

    try {
      // Fetch the conversation messages for the specified adId
      const messages = await Message.find({
        where: [
          {
            sender: { id: data.userId1 },
            receiver: { id: data.userId2 },
            ad: ad,
          },
          {
            sender: { id: data.userId2 },
            receiver: { id: data.userId1 },
            ad: ad,
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
        payload.receiver.id === context.user.id && payload.ad.id === args.adId
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
