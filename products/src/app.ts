import { json } from 'body-parser';
import express from 'express';

import { errorHandler, NotFoundError } from '@jong_ecommerce/common';
import { createRouter } from './routes/create';
import { showRouter } from './routes/show';
import { updateRouter } from './routes/update';
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
app.use(createRouter);
app.use(showRouter);
app.use(updateRouter);

app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
