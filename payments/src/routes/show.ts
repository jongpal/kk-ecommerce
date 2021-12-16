import express, { NextFunction, Request, Response } from 'express';
import {
  setCurrentUser,
  requireAuth,
  NotFoundError,
  validateRequest,
  // NotAuthorizedError,
  OrderStatus,
  BadRequestError,
} from '@jong_ecommerce/common';
import { Order } from './../models/orders';
import { Payment } from './../models/payment';
// import mongoose from 'mongoose';

const router = express.Router();

router.get(
  '/api/payments/:orderId',
  setCurrentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    // check if this user owns this order
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return next(new NotFoundError());
    }
    if (order.status !== OrderStatus.Complete) {
      return next(new BadRequestError('Order is not completed'));
    }

    const payment = await Payment.find({ orderId: order.id });

    res.status(200).send(payment);
  }
);

export { router as showRouter };
