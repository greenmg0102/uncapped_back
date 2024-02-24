import { ActiveSubscription } from '../../interfaces'

export const activeSubscriptionStub = (): ActiveSubscription => {
  return {
    gameType: 'MTT',
    name: 'Standard'
  }
}