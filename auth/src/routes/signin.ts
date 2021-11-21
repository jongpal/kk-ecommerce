import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

import { Password } from '../services/password';
import { validateRequest, BadRequestError } from '@jong_ecommerce/common';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('input a valid email form'),
    body('password').trim().notEmpty().withMessage('input valid password'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new BadRequestError('Invalid credentials'));
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      return next(new BadRequestError('Invalid Credentials'));
    }

    // generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
