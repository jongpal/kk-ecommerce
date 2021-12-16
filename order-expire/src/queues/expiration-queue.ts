import Queue from 'bull';
import { ExpiratedPublisher } from './../events/expirated-publisher';
import { natsConnector } from './../nats-connector';

interface Payload {
  orderId: string;
}

const QUEUE_NAME = 'order-expire';

const expirationQueue = new Queue<Payload>(QUEUE_NAME, {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  const publisher = new ExpiratedPublisher(natsConnector.client);
  await publisher.publish({
    orderId: job.data.orderId,
  });
  console.log('publish a event', job.data.orderId);
});

export { expirationQueue };
