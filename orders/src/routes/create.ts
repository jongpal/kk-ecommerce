import express, { NextFunction, Response, Request } from 'express';
import {
  setCurrentUser,
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from '@jong_ecommerce/common';
import { body } from 'express-validator';
import { Order } from '../models/orders';
import { Product } from '../models/products';
import { producerSingleton } from '../producerSingleton';
// import { consumerSingleton } from '../consumerSingleton';
import { OrderCreatedPublisher } from '../events/order-created-publisher';
import mongoose from 'mongoose';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 20; //15 * 60;

router.post(
  '/api/orders',
  setCurrentUser,
  requireAuth,
  body('productId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('proper product id should be provided'),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser!.id;
    let amount;
    const { productId } = req.body;

    amount = req.body.amount === undefined ? 1 : req.body.amount;

    const product = await Product.findById(productId);

    if (!product) return next(new NotFoundError());

    if (product.isReserved(amount))
      return next(new BadRequestError('order is already set'));

    product.setAmount(product.amount - amount);
    await product.save();

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // set new order
    const newOrder = await Order.build({
      userId,
      status: OrderStatus.Created,
      amount,
      expiresAt,
      products: productId,
    });
    await newOrder.save();

    const publisher = new OrderCreatedPublisher(
      producerSingleton.producer,
      producerSingleton.adminClient
    );

    await publisher.publish({
      id: newOrder.id,
      status: OrderStatus.Created,
      amount: newOrder.amount,
      expiresAt: newOrder.expiresAt.toISOString(),
      userId: newOrder.userId,
      // version: newOrder.version,
      product: {
        id: product.id,
        price: product.price,
      },
    });
    res.status(201).send(newOrder);
  }
);

export { router as createRouter };
