import {
  Arg,
  Query,
  Resolver,
  Mutation,
  ID,
  Authorized,
  Ctx,
  Subscription,
  Root,
} from 'type-graphql'
import { Message, MessageCreateInput } from '../entities/Message'
import { MyContext } from '../types/Users.types'
import { User } from '../entities/User'
import { PubSub as GraphQLPubSub } from 'graphql-subscriptions'

const pubsub = new GraphQLPubSub()

@Resolver(Message)
export class MessagesResolver {
  // CREATE
  @Authorized('ADMIN', 'USER')
  @Mutation(() => Message)
  async sendMessage(
    @Arg('data', () => MessageCreateInput) data: MessageCreateInput,
    @Ctx() context: MyContext
  ): Promise<Message> {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }
    if (context.user?.id !== data.sender.id) {
      throw new Error('Sender id does not match the authenticated user')
    }
    // Find the receiver in the database
    const receiver = await User.findOneBy({ id: data.receiver.id })
    if (!receiver) {
      throw new Error('Receiver not found')
    }

    const message = Message.create({
      content: data.content,
      sender: context.user,
      receiver,
    })

    await message.save()
    await pubsub.publish('MESSAGE_SENT', { messageSent: message })
    return message
  }

  // GET
  @Authorized('ADMIN', 'USER')
  @Query(() => [Message])
  async getConversationMessages(
    @Arg('userId1', () => ID) userId1: number,
    @Arg('userId2', () => ID) userId2: number,
    @Ctx() context: MyContext
  ): Promise<Message[]> {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }

    // Ensure that the requesting user is either one of the participants or an admin
    const isParticipantOrAdmin =
      context.user.id === userId1 ||
      context.user.id === userId2 ||
      context.user.role === 'ADMIN'
    if (!isParticipantOrAdmin) {
      throw new Error('Not authorized to view these messages')
    }

    // Fetch the conversation messages
    const messages = await Message.find({
      where: [
        { sender: { id: userId1 }, receiver: { id: userId2 } },
        { sender: { id: userId2 }, receiver: { id: userId1 } },
      ],
      order: {
        createdAt: 'ASC',
      },
      relations: ['sender', 'receiver'],
    })

    return messages
  }

  // SUBSCRIPTION
  @Subscription(() => Message, {
    topics: 'MESSAGE_SENT',
  })
  messageSent(@Root() message: Message): Message {
    return message
  }
}
