import Stripe from 'stripe'

export const confirmedPaymentIntentStub = (): Stripe.PaymentIntent => {
  return {
    id: 'pi_3NlBBYD01gDO29nq0TGpgGUU',
    object: 'payment_intent',
    amount: 5000,
    amount_capturable: 0,
    amount_received: 5000,
    application: null,
    application_fee_amount: null,
    automatic_payment_methods: null,
    canceled_at: null,
    cancellation_reason: null,
    capture_method: 'automatic',
    client_secret: 'pi_3NlBBYD01gDO29nq0TGpgGUU_secret_Wyr5dUHPc6nOVeByObYveuS36',
    confirmation_method: 'automatic',
    created: 1693489750,
    currency: 'usd',
    customer: 'cus_OXk9Z4XqTmpKbg',
    description: null,
    invoice: null,
    last_payment_error: null,
    latest_charge: 'ch_3NlBFCD01gDO29nq07i9GXS6',
    livemode: false,
    metadata: {},
    next_action: null,
    on_behalf_of: null,
    payment_method: 'card_1NlB0AD01gDO29nqCnXQglQU',
    payment_method_options: {
      card: {
        installments: null,
        mandate_options: null,
        network: null,
        request_three_d_secure: 'automatic'
      }
    },
    payment_method_types: ['card'],
    processing: null,
    receipt_email: null,
    review: null,
    setup_future_usage: null,
    shipping: null,
    source: null,
    statement_descriptor: null,
    statement_descriptor_suffix: null,
    status: 'succeeded',
    transfer_data: null,
    transfer_group: null
  }
}