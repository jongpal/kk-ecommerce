import { json } from 'body-parser';
import express from 'express';

import { errorHandler, NotFoundError } from '@jong_ecommerce/common';
import { chargeRouter } from './routes/charge';
import { showRouter } from './routes/show';

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
app.use(chargeRouter);
app.use(showRouter);

app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
