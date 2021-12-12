import mongoose from 'mongoose';
import { producerSingleton } from './producerSingleton';
import { Consumers } from './consumer';
import { Topics } from '@jong_ecommerce/common';
import { app } from './app';
import {
  CONSUMER_CREATE_GROUP_ID,
  CONSUMER_CANCELL_GROUP_ID,
} from './events/group-info/group-id';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const port = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT key not defined ');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not defined ');
  }
  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error('KAFKA_CLIENT_ID not defined ');
  }
  if (!process.env.KAFKA_ADMIN_ID) {
    throw new Error('KAFKA_ADMIN_ID not defined ');
  }
  if (!process.env.BROKER_1) {
    throw new Error('BROKER_1 not defined ');
  }

  try {
    producerSingleton.create(
      process.env.KAFKA_CLIENT_ID,
      process.env.KAFKA_ADMIN_ID,
      [process.env.BROKER_1],
      [process.env.BROKER_1]
    );
    // await producerSingleton.createTopic(Topics.ProductCreated);
    await producerSingleton.createTopic([
      { topic: Topics.ProductCreated, numPartitions: 2, replicationFactor: 1 },
      { topic: Topics.ProductUpdated, numPartitions: 2, replicationFactor: 1 },
    ]);
    // await producerSingleton.createTopic(Topics.ProductUpdated);

    producerSingleton.producer.on('producer.disconnect', function (arg: any) {
      console.log('producer disconnected. ' + JSON.stringify(arg));
    });

    console.log('producer and admin client created');

    const consumer1 = new Consumers();
    consumer1.create(
      process.env.KAFKA_CLIENT_ID + 'create',
      CONSUMER_CREATE_GROUP_ID,
      [process.env.BROKER_1]
    );
    console.log(`${CONSUMER_CREATE_GROUP_ID} created.`);
    consumer1.consumer.on('consumer.disconnect', function (arg: any) {
      console.log(
        `${CONSUMER_CREATE_GROUP_ID} disconnected. ` + JSON.stringify(arg)
      );
    });
    await new OrderCreatedListener(consumer1.consumer).listen();

    const consumer2 = new Consumers();
    consumer2.create(
      process.env.KAFKA_CLIENT_ID + 'cancell',
      CONSUMER_CANCELL_GROUP_ID,
      [process.env.BROKER_1]
    );
    console.log(`${CONSUMER_CANCELL_GROUP_ID} created.`);
    consumer2.consumer.on('consumer.disconnect', function (arg: any) {
      console.log(
        `${CONSUMER_CANCELL_GROUP_ID} disconnected. ` + JSON.stringify(arg)
      );
    });
    await new OrderCancelledListener(consumer2.consumer).listen();

    // process.on('SIGINT', () => {
    //   producerSingleton.producer.disconnect();
    //   consumerSingleton.consumer.disconnect();
    // });
    // process.on('SIGTERM', () => {
    //   consumerSingleton.consumer.disconnect();
    //   producerSingleton.producer.disconnect();
    // });

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to mongodb.');
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

start();
