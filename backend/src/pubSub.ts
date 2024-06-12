import { createPubSub } from '@graphql-yoga/subscription'
import { Message } from './entities/Message'

export const pubSub = createPubSub<{
  MESSAGES: [Message]
}>()
