import Stripe from 'stripe'

export const customerStub = (): Stripe.Customer => {
  return {
    id: 'cus_OXk9Z4XqTmpKbg',
    object: 'customer',
    address: null,
    balance: 0,
    created: 1693488282,
    currency: null,
    default_source: null,
    delinquent: false,
    description: null,
    discount: null,
    email: 'test@test.com',
    invoice_prefix: '165EFE18',
    invoice_settings: {
      custom_fields: null,
      default_payment_method: null,
      footer: null,
      rendering_options: null,
    },
    livemode: false,
    metadata: {},
    name: null,
    next_invoice_sequence: 1,
    phone: null,
    preferred_locales: [],
    shipping: null,
    tax_exempt: 'none',
    test_clock: null
  }
}