import Stripe from 'stripe'

export const paymentMethodStub = (): Stripe.ApiList<Stripe.PaymentMethod> => {
  return {
    object: 'list',
    data: [{
      id: 'card_1NlAcxD01gDO29nqlfBgcgUo',
      object: 'payment_method',
      billing_details: {
        address: null,
        email: null,
        name: null,
        phone: null,
      },
      card: {
        brand: 'Visa',
        checks: null,
        country: 'CA',
        exp_month: 2,
        exp_year: 2025,
        funding: 'debit',
        last4: '4242',
        networks: null,
        three_d_secure_usage: null,
        wallet: null
      },
      created: 1693487379,
      customer: 'cus_OYF3drZ5dM67UJ',
      livemode: false,
      metadata: {},
      type: 'card'
    }],
    has_more: false,
    url: '/v1/customers/cus_OYF3drZ5dM67UJ/payment_methods'
  }
}