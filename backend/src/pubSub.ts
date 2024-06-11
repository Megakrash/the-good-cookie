import { createPubSub } from '@graphql-yoga/subscription'
import { NotificationPayload } from './types/Notifications.types'

export const pubSub = createPubSub<{
  NOTIFICATIONS: [NotificationPayload]
}>()
