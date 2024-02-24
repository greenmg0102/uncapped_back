import { paymentMethodStub, customerStub, customerSourceStub, deletedCardStub, createdIntentStub, confirmedPaymentIntentStub, createdSubscriptionStub } from "../test/stubs"
import { activeSubscriptionStub } from "../test/stubs/active-subscription.stub"

export const StripeService = jest.fn().mockReturnValue({
  getPaymentMethods: jest.fn().mockResolvedValue(paymentMethodStub()),
  getActiveSubscription: jest.fn().mockResolvedValue(activeSubscriptionStub()),
  createCustomer: jest.fn().mockResolvedValue(customerStub()),
  addCard: jest.fn().mockResolvedValue(customerSourceStub()),
  deleteCard: jest.fn().mockResolvedValue(deletedCardStub()),
  createPaymentIntent: jest.fn().mockResolvedValue(createdIntentStub()),
  confirmPaymentIntent: jest.fn().mockResolvedValue(confirmedPaymentIntentStub()),
  createSubscription: jest.fn().mockResolvedValue(createdSubscriptionStub())
})
