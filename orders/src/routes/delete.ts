import express, { NextFunction, Response, Request } from 'express';
import {
  setCurrentUser,
  requireAuth,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  OrderCancelledEvent,
} from '@jong_ecommerce/common';
import { Order } from './../models/orders';
import { producerSingleton } from '../producerSingleton';
import { OrderCancelledPublisher } from '../events/order-cancelled-publisher';

// import { Product } from './../models/products';
// import mongoose from 'mongoose';

const router = express.Router();

// mark as cancelled

router.patch(
  '/api/orders/:orderId',
  setCurrentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.orderId).populate('products');
    if (!order) return next(new NotFoundError());

    if (order.userId !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    const producer = new OrderCancelledPublisher(
      producerSingleton.producer,
      producerSingleton.adminClient
    );
    // topic: Topics.OrderCancelled;
    // value: {
    //   id: string;
    //   status: OrderStatus.Cancelled;
    //   amount: number;
    //   version: number;
    //   userId: string;
    //   product: {
    //     id: string;
    //   };
    // };
    await producer.publish({
      id: order.id,
      status: OrderStatus.Cancelled,
      userId: order.userId,
      amount: order.amount,
      // version: order.version,
      product: {
        // design decision : array of product ?
        id: order.products[0].id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteRouter };
