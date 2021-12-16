import express, { NextFunction, Request, Response } from 'express';
import {
  setCurrentUser,
  requireAuth,
  NotFoundError,
  validateRequest,
  NotAuthorizedError,
  OrderStatus,
  BadRequestError,
} from '@jong_ecommerce/common';
import { body } from 'express-validator';
import { Order } from './../models/orders';
import { stripe } from './../utils/stripe';
import { Payment } from './../models/payment';
import { PaymentCreatedPublisher } from './../events/payment-created-publisher';
import { natsConnector } from '../nats-connector';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/payments',
  setCurrentUser,
  requireAuth,
  [
    body('token').notEmpty().withMessage('token should be provided'),
    body('orderId').notEmpty().withMessage('orderId should be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return next(new NotFoundError());
    }
    if (req.currentUser!.id !== order.orderUserId.toString()) {
      return next(new NotAuthorizedError());
    }
    if (order.status === OrderStatus.Cancelled) {
      return next(new BadRequestError('cannot pay for cancelled event'));
    }

    const stripeCharge = await stripe.charges.create({
      currency: 'usd',
      amount: order.productPrice * order.orderAmount * 100, // cents
      source: token,
    });

    // create charge and save it to database

    const payment = Payment.build({
      stripeId: stripeCharge.id,
      amountPaid: stripeCharge.amount,
      orderId,
    });

    await payment.save();

    // we could await this or not
    await new PaymentCreatedPublisher(natsConnector.client).publish({
      id: payment.id,
      stripeId: payment.stripeId,
      amountPaid: payment.amountPaid,
      orderId: payment.orderId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as chargeRouter };
