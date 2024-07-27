import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'
import { Conversation, ConversationCreateInput } from '../entities/Conversation'
import { MyContext } from '../types/Users.types'
import { UserServices } from '../services/Users.services'
import { Ad } from '../entities/Ad'

@Resolver(Conversation)
export class ConversationsResolver {
  // GET ALL
  @Authorized('ADMIN', 'USER')
  @Query(() => [Conversation])
  async conversationGetAll(@Ctx() context: MyContext): Promise<Conversation[]> {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }

    const conversations = await Conversation.find({
      where: [
        { user1: { id: context.user.id } },
        { user2: { id: context.user.id } },
      ],
      relations: {
        user1: true,
        user2: true,
        ad: true,
        messages: true,
      },
      order: { updatedAt: 'ASC' },
    })
    return conversations
  }

  // GET ONE
  @Authorized('ADMIN', 'USER')
  @Query(() => Conversation)
  async conversationGetOne(
    @Arg('adId') adId: string,
    @Ctx() context: MyContext
  ): Promise<Conversation | null> {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }

    const conversation = await Conversation.findOne({
      where: [
        { ad: { id: adId }, user1: { id: context.user.id } },
        { ad: { id: adId }, user2: { id: context.user.id } },
      ],
    })
    if (!conversation) {
      return null
    }
    return conversation
  }

  // CREATE
  @Authorized('ADMIN', 'USER')
  @Mutation(() => Conversation)
  async conversationCreate(
    @Arg('data') data: ConversationCreateInput,
    @Ctx() context: MyContext
  ): Promise<Conversation | null> {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }

    // Check if conversation already exists
    const conversation = await Conversation.findOne({
      where: {
        ad: { id: data.ad.id },
        user1: { id: context.user.id },
        user2: { id: context.user.id },
      },
    })
    if (conversation) {
      return conversation
    }

    // If not, create a new conversation
    const newReceiver = await UserServices.findUserById(data.user2.id)
    const existingAd = await Ad.findOne({
      where: { id: data.ad.id },
      relations: { user: true },
    })
    if (!existingAd) {
      throw new Error('Ad not found')
    }
    if (existingAd.user.id === context.user.id) {
      throw new Error('You cannot contact yourself')
    }
    const newConversation = new Conversation()
    newConversation.user1 = context.user
    newConversation.user2 = newReceiver
    newConversation.ad = existingAd
    await newConversation.save()
    return newConversation
  }

  // GET BY ID
  @Query(() => Conversation)
  async conversationById(
    @Arg('id', () => ID) id: string
  ): Promise<Conversation> {
    const conversation = await Conversation.findOne({
      where: { id },
      relations: {
        user1: true,
        user2: true,
        ad: true,
        messages: true,
      },
    })
    if (!conversation) {
      throw new Error('Conversation not found')
    }
    return conversation
  }
}
