import mongoose from 'mongoose';
import { Order } from './../../models/orders';
import { Product } from './../../models/products';
import { OrderStatus } from '@jong_ecommerce/common';
import { app } from './../../app';
import request from 'supertest';

it('fetches all orders for an particular user', async () => {
  const productId = new mongoose.Types.ObjectId();
  const userId = new mongoose.Types.ObjectId().toHexString();
  const userId2 = new mongoose.Types.ObjectId().toHexString();
  let cookie = (await global.signin())[0];
  // create total of 4 products ,  product1 : 2, product2: 2

  const saveProduct = Product.build({
    amount: 2,
    title: 'product1',
    price: 10,
    userId: 'some user',
    version: 0,
  });
  await saveProduct.save();
  const saveProduct2 = Product.build({
    amount: 2,
    title: 'product2',
    price: 10,
    userId: 'some user2',
    version: 0,
  });
  await saveProduct2.save();
  // create one order as user 1
  let response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      productId: saveProduct.id,
    })
    .expect(201);
  // create one order as user 2
  const cookie2 = (await global.signin(userId2, 'user2@test.com'))[0];
  await saveProduct2.save();
  // create one order as user 1
  response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie2)
    .send({
      productId: saveProduct2.id,
    })
    .expect(201);
  response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie2)
    .send({
      productId: saveProduct2.id,
    })
    .expect(201);
  response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie2)
    .send({
      productId: saveProduct.id,
    })
    .expect(201);

  // fetch orders
  response = await request(app)
    .get('/api/orders')
    .set('Cookie', cookie2)
    .send({})
    .expect(200);

  expect(response.body.data.length).toEqual(3);
});

it('fetches a spectific order', async () => {
  let cookie = (await global.signin())[0];

  const saveProduct = Product.build({
    amount: 2,
    title: 'product1',
    price: 10,
    userId: 'some user',
    version: 0,
  });
  await saveProduct.save();

  let response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ productId: saveProduct.id })
    .expect(201);

  response = await request(app)
    .get(`/api/orders/${response.body.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(response.body.products[0].id).toEqual(saveProduct.id);
});
