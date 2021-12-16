import request from 'supertest';
import { app } from './../../app';
import mongoose from 'mongoose';
import { Order } from './../../models/orders';
import { OrderStatus } from '@jong_ecommerce/common';
import { stripe } from './../../utils/stripe';
import { Payment } from './../../models/payment';

// jest.mock('./../../utils/stripe');

it('throws not found error 404 if order is not found', async () => {
  // const cookie = (await global.signin())[0];
  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin()[0])
    .send({
      token: 'asdasdad',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});
it('throws authorization error 401 if the user is not matched', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const orderUserId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: orderId,
    orderAmount: 1,
    status: OrderStatus.Created,
    productPrice: 10,
    orderUserId,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin()[0])
    .send({
      token: 'asdasdad',
      orderId: order.id,
    })
    .expect(401);
});
it('throws badRequestError 400 if order status is cancelled', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const orderUserId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: orderId,
    orderAmount: 1,
    status: OrderStatus.Cancelled,
    productPrice: 10,
    orderUserId,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(orderUserId)[0])
    .send({
      token: 'asdasdad',
      orderId: order.id,
    })
    .expect(400);
});

it('creates a valid charge', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const orderUserId = new mongoose.Types.ObjectId().toHexString();

  const randomPrice = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: orderId,
    orderAmount: 1,
    status: OrderStatus.Created,
    productPrice: randomPrice,
    orderUserId,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(orderUserId)[0])
    .send({
      token: 'tok_visa',
      orderId,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });

  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === randomPrice * 100;
  });
  expect(stripeCharge).toBeDefined();

  const payment = await Payment.findOne({
    stripeId: stripeCharge?.id,
    orderId: orderId,
  });
  expect(payment).not.toBeNull();
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  // expect(chargeOptions.amount).toEqual(
  //   order.productPrice * order.orderAmount * 100
  // );
  // expect(chargeOptions.currency).toEqual('usd');
  // expect(chargeOptions.source).toEqual('tok_visa');
});
