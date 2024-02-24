import Stripe from 'stripe'

export const deletedCardStub = (): Stripe.CustomerSource | Stripe.DeletedCard | Stripe.DeletedBankAccount => {
  return {
    id: 'card_1NlB6BD01gDO29nqgbpaWbzf',
    object: 'card',
    deleted: true
  }
}