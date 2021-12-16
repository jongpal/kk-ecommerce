import express, { NextFunction, Response, Request } from 'express';
import {
  setCurrentUser,
  requireAuth,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from '@jong_ecommerce/common';
import { Order } from './../models/orders';
import { Product } from './../models/products';
import { isNamedExportBindings } from 'typescript';
// import mongoose from 'mongoose';

const router = express.Router();

router.get(
  '/api/orders',
  setCurrentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    // all the orders that this user has made
    const userId = req.currentUser!.id;
    const allOrders = await Order.find({ userId }).populate('products');

    res.status(200).send({
      status: 'success',
      data: allOrders,
    });
  }
);

router.get(
  '/api/orders/paid',
  setCurrentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const paidOrders = await Order.find({
      userId,
      status: OrderStatus.Complete,
    });

    res.status(200).send(paidOrders);
  }
);

router.get(
  '/api/orders/:id',
  setCurrentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).populate('products');
    if (!order) return next(new NotFoundError());

    if (order.userId !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }

    res.status(200).send(order);
  }
);

export { router as showRouter };
