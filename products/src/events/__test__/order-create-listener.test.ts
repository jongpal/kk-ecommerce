import {
  OrderCreatedEvent,
  OrderCancelledEvent,
  OrderStatus,
} from '@jong_ecommerce/common';
import { Product } from '../../models/products';
import mongoose from 'mongoose';
import { Message } from 'kafkajs';

import { Consumers } from '../../consumer';
import { producerSingleton } from '../../producerSingleton';
import { OrderCreatedListener } from '../listeners/order-created-listener';
import { OrderCancelledListener } from '../listeners/order-cancelled-listener';

const setup = async () => {
  const listener = new Consumers();

  const product = Product.build({
    title: 'product',
    price: 10,
    description: 'test',
    amount: 2,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await product.save();

  const value: OrderCreatedEvent['value'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    amount: 2,
    expiresAt: new Date().toISOString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    product: {
      id: product.id,
      price: product.price,
    },
  };

  const cancellValue: OrderCancelledEvent['value'] = {
    id: value.id,
    status: OrderStatus.Cancelled,
    amount: 2,
    userId: value.userId,
    product: {
      id: product.id,
    },
  };
  //@ts-ignore
  const msg: Message = {};
  return { product, cancellValue, value, msg, listener };
};

it('test product locking mechanism', async () => {
  // consumer mocking mechanism
  const { cancellValue, value, msg, listener } = await setup();
  await new OrderCreatedListener(listener.consumer).onMessage(value, msg);
  // create product
  const product = await Product.findById(value.product.id);

  // check if product is updated
  expect(product!.amount).toEqual(0);
  expect(producerSingleton.producer.send).toHaveBeenCalled();

  // order cancell event
  await new OrderCancelledListener(listener.consumer).onMessage(
    cancellValue,
    msg
  );
  const pdt = await Product.findById(cancellValue.product.id);
  // check if product is updated
  expect(pdt!.amount).toEqual(2);
  expect(producerSingleton.producer.send).toHaveBeenCalled();
});

// it.todo('test product locking mechanism');
