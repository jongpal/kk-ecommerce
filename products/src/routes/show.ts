import express, { Request, Response, NextFunction } from 'express';
import { Product } from './../models/products';

import {
  NotFoundError,
  setCurrentUser,
  requireAuth,
} from '@jong_ecommerce/common';

const router = express.Router();

// for api test
router.get(
  '/api/products/success',
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
      status: 'success',
    });
  }
);

router.get(
  '/api/products',
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({
      amount: {
        $gte: 1,
      },
    });
    if (!products.length) return next(new NotFoundError());

    res.status(200).send(products);
  }
);
router.get(
  '/api/products/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.find({ _id: req.params.id });

    if (!product.length) {
      return next(new NotFoundError());
    }

    res.status(200).send(product);
  }
);

// specific users' product lists
router.get(
  '/api/products/:userId',
  setCurrentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({ userId: req.params.userId });

    res.status(200).send(products);
  }
);

export { router as showRouter };
