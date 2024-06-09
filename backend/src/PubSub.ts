import { PubSub as OriginalPubSub, PubSubEngine } from 'graphql-subscriptions'

class PubSub implements PubSubEngine {
  private pubsub: OriginalPubSub

  constructor() {
    this.pubsub = new OriginalPubSub()
  }

  async publish(triggerName: string, payload: any): Promise<void> {
    await this.pubsub.publish(triggerName, payload)
  }

  async subscribe(
    triggerName: string,
    onMessage: (payload: any) => void
  ): Promise<number> {
    return this.pubsub.subscribe(triggerName, onMessage)
  }

  unsubscribe(subscriptionId: number): void {
    this.pubsub.unsubscribe(subscriptionId)
  }

  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
    return this.pubsub.asyncIterator(triggers)
  }
}

export default PubSub
