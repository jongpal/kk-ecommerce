import mongoose from 'mongoose';
import { Order } from './../../models/orders';
import { Product } from './../../models/products';
import { OrderStatus } from '@jong_ecommerce/common';
import { app } from './../../app';
import request from 'supertest';
import { producerSingleton } from './../../producerSingleton';

it('returns NotFoundError if the product is not there', async () => {
  const productId = new mongoose.Types.ObjectId();
  const cookie = (await global.signin())[0];

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      productId,
    })
    .expect(404);
});

it('returns 400 if the order is occupied', async () => {
  // signup -> post ticket -> make it occupied
  const cookie = (await global.signin())[0];
  //  const id = "id";
  const saveProduct = Product.build({
    amount: 1,
    title: 'test',
    price: 10,
    userId: 'test',
    version: 0,
  });
  await saveProduct.save();
  // const order = Order.build({
  //   amount: 1,
  //   userId: 'tees2',
  //   expiresAt: new Date(),
  //   status: OrderStatus.Created,
  //   products: saveProduct.id
  // })
  // await order.save();

  let response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      productId: saveProduct.id,
    })
    .expect(201);

  response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      productId: saveProduct.id,
    })
    .expect(400);
});

it('publishes order-created event', async () => {
  // make product
  const cookie = (await global.signin())[0];
  //  const id = "id";
  const saveProduct = Product.build({
    amount: 1,
    title: 'test',
    price: 10,
    userId: 'test',
    version: 0,
  });
  await saveProduct.save();
  // hit createRouter and see if event publisher invoked
  // first, title
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      productId: saveProduct.id,
    })
    .expect(201); // RequestValidationError
  expect(producerSingleton.producer.connect).toHaveBeenCalled();
  expect(producerSingleton.producer.send).toHaveBeenCalled();
  expect(producerSingleton.producer.disconnect).toHaveBeenCalled();
});
