import { json } from 'body-parser';
import express from 'express';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@jong_ecommerce/common';

import 'express-async-errors';
import cookieSession from 'cookie-session';

const app = express();

app.set('trust proxy', true); // tell express we are behind of proxy of nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, // no encryption
    secure: process.env.NODE_ENV !== 'test', // https
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
