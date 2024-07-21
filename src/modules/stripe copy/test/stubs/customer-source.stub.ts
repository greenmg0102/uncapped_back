import Stripe from 'stripe'

export const customerSourceStub = (): Stripe.CustomerSource => {
  return {
    id: 'card_1NlB0AD01gDO29nqCnXQglQU',
    object: 'card',
    address_city: 'Toronto',
    address_country: 'CA',
    address_line1: '74 Some Ave',
    address_line1_check: 'pass',
    address_line2: '',
    address_state: 'ON',
    address_zip: 'M3C 0E4',
    address_zip_check: 'pass',
    brand: 'Visa',
    country: 'CA',
    customer: 'cus_OXk9Z4XqTmpKbg',
    cvc_check: 'pass',
    dynamic_last4: null,
    exp_month: 2,
    exp_year: 2025,
    fingerprint: 'XivMWZllXT8fJZy1',
    funding: 'debit',
    last4: '4242',
    metadata: {},
    name: 'John Doe',
    tokenization_method: null,
  }
}