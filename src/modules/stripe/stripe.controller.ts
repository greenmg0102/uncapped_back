import { Request } from 'express'
import { Body, Controller, Delete, Get, Post, RawBodyRequest, Req, UseGuards } from '@nestjs/common'
import { StripeService } from './stripe.service'
import { AuthGuard } from '@nestjs/passport'
import { GetCustomerId } from '../../common/decorators'
import { AddCardDto, CancelSubscriptionDto, ConfirmPaymentIntentDto, CreatePaymentIntentDto, CreateSubscriptionDto, RemoveCardDto } from './dtos'

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('payment-methods')
  async getPaymentMethods(@GetCustomerId() customerId: string) {
    return await this.stripeService.getPaymentMethods(customerId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('subscription')
  async getActiveSubscription(@GetCustomerId() customerId: string) {
    return await this.stripeService.getActiveSubscription(customerId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addCard(@Body() body: AddCardDto, @GetCustomerId() customerId: string) {
    return await this.stripeService.addCard(body.sourceToken, customerId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteCard(@Body() body: RemoveCardDto, @GetCustomerId() customerId: string) {
    return await this.stripeService.deleteCard(body.sourceId, customerId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('payment-intent-create')
  async createPaymentIntent(@Body() body: CreatePaymentIntentDto, @GetCustomerId() customerId: string) {
    return await this.stripeService.createPaymentIntent(body.totalPrice, customerId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('payment-intent-confirm')
  async confirmPaymentIntent(@Body() body: ConfirmPaymentIntentDto) {
    return await this.stripeService.confirmPaymentIntent(body.intentId, body.methodId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('subscription-create')
  async createSubscription(@Body() body: CreateSubscriptionDto, @GetCustomerId() customerId: string) {
    return await this.stripeService.createSubscription(body.priceId, customerId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('subscription-cancel')
  async cancelSubscription(@Body() body: CancelSubscriptionDto, @GetCustomerId() customerId: string) {
    return await this.stripeService.cancelSubscription(customerId, body.subscriptionId)
  }

  @Post('webhook')
  async webhook(@Req() req: RawBodyRequest<Request>) {
    return await this.stripeService.webhook(req.rawBody, req.headers['stripe-signature'])
  }
}
