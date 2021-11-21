import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@jong_ecommerce/common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signup',
  body('email').isEmail().withMessage('invalid email'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new BadRequestError('Email in use'));
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT (synchronized)

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
