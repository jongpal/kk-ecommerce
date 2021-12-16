import { OrderCreatedListener } from './events/order-created-listener';
import { natsConnector } from './nats-connector';

const port = 3000;

const start = async () => {
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

    new OrderCreatedListener(natsConnector.client).listen();
  } catch (err) {
    console.error(err);
  }
};

start();
