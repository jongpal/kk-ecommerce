import { ExpiratedListener } from './events/expirated-listener';
import { ProductCreatedListener } from './events/product-created-listener';
import { ProductUpdatedListener } from './events/product-update-listener';
import { PaymentCreatedListener } from './events/payment-created-listener';
import { app } from './app';
import { natsConnector } from './nats-connector';
import mongoose from 'mongoose';

const port = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT key not defined ');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not defined ');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID not defined ');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('Nats_Cluster_ID not defined ');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  console.log('Starting expiration service ....');
  try {
    await natsConnector.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      {
        url: process.env.NATS_URL,
      }
    );
    natsConnector.client.on('close', () => {
      console.log('NATS connection closing ...');
      process.exit();
    });
    process.on('SIGINT', () => natsConnector.client.close());
    process.on('SIGTERM', () => natsConnector.client.close());

    new ProductCreatedListener(natsConnector.client).listen();
    new ProductUpdatedListener(natsConnector.client).listen();
    new ExpiratedListener(natsConnector.client).listen();
    new PaymentCreatedListener(natsConnector.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to mongodb.');
  } catch (err) {
    console.error(err);
  }
  app.listen(port, () => {
    console.log(`listening at port ${port} !!`);
  });
};

start();
