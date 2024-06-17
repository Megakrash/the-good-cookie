import { Arg, Authorized, Ctx, ID, Query, Resolver } from 'type-graphql'
import { Conversation } from '../entities/Conversation'
import { MyContext } from '../types/Users.types'

@Resolver(Conversation)
export class ConversationsResolver {
  // CREATE
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

  // GET BY ID
  @Query(() => Conversation)
  async conversationById(
    @Arg('id', () => ID) id: number
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
