import {
  OrderCreatedEvent,
  OrderCancelledEvent,
  OrderStatus,
} from '@jong_ecommerce/common';
import { Product } from './../../models/products';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsConnector } from './../../nats-connector';
import { OrderCreatedListener } from '../listeners/order-created-listener';
import { OrderCancelledListener } from '../listeners/order-cancelled-listener';

const setup = async () => {
  const listener = natsConnector.client;

  const product = Product.build({
    title: 'test ticket',
    price: 10,
    description: 'descr',
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
    // version : 1,
    product: {
      id: product.id,
      price: product.price,
    },
  };

  const cancellData: OrderCancelledEvent['value'] = {
    id: value.id,
    status: OrderStatus.Cancelled,
    amount: 2,
    userId: new mongoose.Types.ObjectId().toHexString(),
    // version : 2,
    product: {
      id: product.id,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { product, cancellData, value, msg, listener };
};

it('emulates a creation of order created/cancelled event and check ack and check the functioning of order created event', async () => {
  const { cancellData, value, msg, listener } = await setup();
  await new OrderCreatedListener(listener).onMessage(value, msg);
  expect(msg.ack).toHaveBeenCalled();
  const product = await Product.findById(value.product.id);
  expect(product!.amount).toEqual(0);

  // expect(product!.version).toEqual(1);
  expect(natsConnector.client.publish).toHaveBeenCalled();

  let productUpdatedData = JSON.parse(
    (natsConnector.client.publish as jest.Mock).mock.calls[0][1]
  );

  await new OrderCancelledListener(listener).onMessage(cancellData, msg);
  expect(msg.ack).toHaveBeenCalled();
  const ccProduct = await Product.findById(cancellData.product.id);
  expect(ccProduct!.amount).toEqual(2);
  // expect(ccProduct!.version).toEqual(2);
  expect(natsConnector.client.publish).toHaveBeenCalled();

  productUpdatedData = JSON.parse(
    (natsConnector.client.publish as jest.Mock).mock.calls[1][1]
  );
  expect(productUpdatedData.id).toEqual(cancellData.product.id);
});
