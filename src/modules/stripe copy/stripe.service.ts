import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { ActiveSubscription, CreatedIntent, CreatedSubscription } from './interfaces'
import { UserService } from '../users/user.service'

@Injectable()
export class StripeService {
  private stripe: Stripe
  constructor(private readonly userService: UserService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    })
  }

  async updateSubscription(customerId: string, subscriptionId: string) {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
    const subscriptionDetails: ActiveSubscription = {
      gameType: subscription.metadata.gameType,
      name: subscription.metadata.name
    }
    return await this.userService.updateSubscription(customerId, subscriptionId, subscriptionDetails)
  }

  async getPaymentMethods(customerId: string) {
    return await this.stripe.customers.listPaymentMethods(customerId)
  }

  async getActiveSubscription(customerId: string): Promise<any> {
    return await this.userService.getActiveSubscription(customerId)
  }

  async createCustomer(email: string) {
    return await this.stripe.customers.create({
      email
    })
  }

  async addCard(sourceToken: string, customerId: string) {
    try {
      return await this.stripe.customers.createSource(customerId, { source: sourceToken })
    }
    catch (e) {
      throw new Error(e)
    }
  }

  async deleteCard(sourceId: string, customerId: string) {
    try {
      return await this.stripe.customers.deleteSource(customerId, sourceId)
    }
    catch (e) {
      throw new Error(e)
    }
  }

  async createPaymentIntent(totalPrice: number, customerId: string): Promise<CreatedIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: totalPrice * 100,
        currency: "usd",
        payment_method_types: ['card'],
        customer: customerId,
      })
      return { intentId: paymentIntent.id, clientSecret: paymentIntent.client_secret }
    }
    catch (e) {
      throw new Error(e)
    }
  }

  async confirmPaymentIntent(intentId: string, methodId: string) {
    try {
      return await this.stripe.paymentIntents.confirm(intentId, { payment_method: methodId })
    }
    catch (e) {
      throw new Error(e)
    }
  }

  async createSubscription(priceId: string, customerId: string): Promise<CreatedSubscription> {
    try {
      let subscription

      subscription = await this.stripe.subscriptions.list({ customer: customerId, price: priceId, status: 'incomplete' })

      if (!subscription.data.length) {
        const price = await this.stripe.prices.retrieve(priceId)
        const product = await this.stripe.products.retrieve(String(price.product))

        subscription = await this.stripe.subscriptions.create({
          customer: customerId,
          items: [{
            price: priceId
          }],
          metadata: {
            gameType: product.name.split(' ')[0],
            name: product.name.split(' ')[1]
          },
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          expand: ['latest_invoice.payment_intent'],
        })
        return { intentId: subscription.latest_invoice.payment_intent.id, clientSecret: subscription.latest_invoice.payment_intent.client_secret }
      }

      const latestInvoice = await this.stripe.invoices.retrieve(subscription.data[0].latest_invoice)
      const paymentIntent = await this.stripe.paymentIntents.retrieve(String(latestInvoice.payment_intent))

      return { intentId: paymentIntent.id, clientSecret: paymentIntent.client_secret }
    }
    catch (e) {
      throw new Error(e)
    }
  }

  async cancelSubscription(customerId: string, subscriptionId?: string) {
    if (subscriptionId) {
      return await this.stripe.subscriptions.cancel(subscriptionId)
    }

    return this.userService.cancelSubscription(customerId)
  }

  async webhook(body, signature) {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

      const event: any = await this.stripe.webhooks.constructEventAsync(body, signature, webhookSecret)

      switch (event.type) {
        case 'customer.subscription.updated':
          if (event.data.object.status === 'active') {
            await this.updateSubscription(event.data.object.customer, event.data.object.id)
          }
          break
        case 'customer.subscription.deleted':
          await this.cancelSubscription(event.data.object.customer)
          break
      }
    }
    catch (e) {
      throw new Error(e)
    }
  }
}