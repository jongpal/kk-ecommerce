import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { Product } from './../models/products';

import {
  validateRequest,
  BadRequestError,
  setCurrentUser,
  requireAuth,
} from '@jong_ecommerce/common';

const router = express.Router();

router.post(
  '/api/products',
  setCurrentUser,
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('title required'),
    body('price').trim().notEmpty().withMessage('price required'),
    body('description').trim().notEmpty().withMessage('description required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // amount not specified : default 1
    let amount;
    amount = req.body.amount === undefined ? 1 : req.body.amount;

    const product = Product.build({
      amount,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      userId: req.currentUser!.id,
    });
    await product.save();

    res.status(201).send(product);
  }
);

export { router as createRouter };
