import Stripe from 'stripe'
import { Test } from "@nestjs/testing"
import { StripeController } from "../stripe.controller"
import { StripeService } from "../stripe.service"
import { confirmedPaymentIntentStub, createdIntentStub, createdSubscriptionStub, customerSourceStub, deletedCardStub, paymentMethodStub } from "./stubs"
import { AddCardDto, ConfirmPaymentIntentDto, CreatePaymentIntentDto, CreateSubscriptionDto, RemoveCardDto } from "../dtos"
import { ActiveSubscription, CreatedIntent, CreatedSubscription } from "../interfaces"
import { userStub } from "../../users/test/stubs"
import { activeSubscriptionStub } from './stubs/active-subscription.stub'

jest.mock('../stripe.service')

describe('ProfileController', () => {
  let stripeController: StripeController
  let stripeService: StripeService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [StripeController],
      providers: [StripeService],
    }).compile()

    stripeController = moduleRef.get<StripeController>(StripeController)
    stripeService = moduleRef.get<StripeService>(StripeService)
    jest.clearAllMocks()
  })

  describe('getPaymentMethods', () => {
    describe('when getPaymentMethods is called', () => {
      let paymentMethods: Stripe.ApiList<Stripe.PaymentMethod>

      beforeEach(async () => {
        paymentMethods = await stripeController.getPaymentMethods(userStub().customerId)
      })

      test('then it should call stripeService', () => {
        expect(stripeService.getPaymentMethods).toBeCalledWith(userStub().customerId)
      })

      test('then it should return payment methods', () => {
        expect(paymentMethods).toEqual(paymentMethodStub())
      })
    })
  })

  describe('getActiveSubscription', () => {
    describe('when getActiveSubscription is called', () => {
      let activeSubscription: ActiveSubscription

      beforeEach(async () => {
        activeSubscription = await stripeController.getActiveSubscription(userStub().customerId)
      })

      test('then it should call stripeService', () => {
        expect(stripeService.getActiveSubscription).toBeCalledWith(userStub().customerId)
      })

      test('then it should return active subscription', () => {
        expect(activeSubscription).toEqual(activeSubscriptionStub())
      })
    })
  })

  describe('addCard', () => {
    describe('when addCard is called', () => {
      let customerSource: Stripe.CustomerSource

      const dto: AddCardDto = {
        sourceToken: 'tok_1NlBOtD01gDO29nqeAHztaAD'
      }
      const customerId = userStub().customerId

      beforeEach(async () => {
        customerSource = await stripeController.addCard(dto, customerId)
      })

      test('then it should call stripeService', () => {
        expect(stripeService.addCard).toBeCalledWith(dto.sourceToken, customerId)
      })

      test('then it should return created source', () => {
        expect(customerSource).toEqual(customerSourceStub())
      })
    })
  })

  describe('deleteCard', () => {
    describe('when deleteCard is called', () => {
      let result: Stripe.CustomerSource | Stripe.DeletedCard | Stripe.DeletedBankAccount

      const dto: RemoveCardDto = {
        sourceId: 'card_1NlB6BD01gDO29nqgbpaWbzf'
      }
      const customerId = userStub().customerId

      beforeEach(async () => {
        result = await stripeController.deleteCard(dto, customerId)
      })

      test('then it should call stripeService', () => {
        expect(stripeService.deleteCard).toBeCalledWith(dto.sourceId, customerId)
      })

      test('then it should return result', () => {
        expect(result).toEqual(deletedCardStub())
      })
    })
  })

  describe('createPaymentIntent', () => {
    describe('when createPaymentIntent is called', () => {
      let createdIntent: CreatedIntent

      const dto: CreatePaymentIntentDto = {
        totalPrice: 50
      }
      const customerId = userStub().customerId

      beforeEach(async () => {
        createdIntent = await stripeController.createPaymentIntent(dto, customerId)
      })

      test('then it should call stripeService', () => {
        expect(stripeService.createPaymentIntent).toBeCalledWith(dto.totalPrice, customerId)
      })

      test('then it should return created payment intent', () => {
        expect(createdIntent).toEqual(createdIntentStub())
      })
    })
  })

  describe('confirmPaymentIntent', () => {
    describe('when confirmPaymentIntent is called', () => {
      let confirmedIntent: Stripe.PaymentIntent

      const dto: ConfirmPaymentIntentDto = {
        intentId: 'pi_3NlBBYD01gDO29nq0TGpgGUU',
        methodId: 'card_1NlB6BD01gDO29nqgbpaWbzf'
      }

      beforeEach(async () => {
        confirmedIntent = await stripeController.confirmPaymentIntent(dto)
      })

      test('then it should call stripeService', () => {
        expect(stripeService.confirmPaymentIntent).toBeCalledWith(dto.intentId, dto.methodId)
      })

      test('then it should return confirmed intent', () => {
        expect(confirmedIntent).toEqual(confirmedPaymentIntentStub())
      })
    })
  })

  describe('createSubscription', () => {
    describe('when createSubscription is called', () => {
      let createdSubscription: CreatedSubscription

      const dto: CreateSubscriptionDto = {
        priceId: 'price_1NlTvKD01gDO29nqnGLW1mYn'
      }

      const customerId = userStub().customerId

      beforeEach(async () => {
        createdSubscription = await stripeController.createSubscription(dto, customerId)
      })

      test('then it should call stripeService', () => {
        expect(stripeService.createSubscription).toBeCalledWith(dto.priceId, customerId)
      })

      test('then it should return created subscription', () => {
        expect(createdSubscription).toEqual(createdSubscriptionStub())
      })
    })
  })
})