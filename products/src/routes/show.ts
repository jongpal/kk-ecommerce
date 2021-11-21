import express, { Request, Response, NextFunction } from 'express';
import { Product } from './../models/products';

import { NotFoundError } from '@jong_ecommerce/common';

const router = express.Router();

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

export { router as showRouter };
