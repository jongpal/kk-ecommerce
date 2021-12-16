import mongoose from 'mongoose';
import { Order } from './../../models/orders';
import { Product } from './../../models/products';
import { OrderStatus } from '@jong_ecommerce/common';
import { app } from './../../app';
import request from 'supertest';
import { natsConnector } from '../../nats-connector';

it('marks Cancelled object', async () => {
  let cookie = (await global.signin())[0];
  // create product

  const saveProduct = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    amount: 2,
    title: 'product1',
    price: 10,
    userId: 'some user',
    // version: 0,
  });
  await saveProduct.save();

  // make an order
  let res = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      productId: saveProduct.id,
    })
    .expect(201);

  const orderid = res.body.id;
  // delete an order
  res = await request(app)
    .patch(`/api/orders/${orderid}`)
    .set('Cookie', cookie)
    .send({});
  // .expect(204);

  // expect Cancelled status
  const order = await Order.findById(orderid);

  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('publishes order-cancelled event', async () => {
  // make product
  const cookie = (await global.signin())[0];
  //  const id = "id";
  const saveProduct = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    amount: 1,
    title: 'test',
    price: 10,
    userId: 'test',
    // version: 0,
  });
  await saveProduct.save();
  // create an order

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      productId: saveProduct.id,
    })
    .expect(201); // RequestValidationError

  // hit deleteRouter and see if it already has invoked
  await request(app)
    .patch(`/api/orders/${response.body.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(204);

  expect(natsConnector.client.publish).toHaveBeenCalled();
});
