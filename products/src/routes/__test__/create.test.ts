import request from 'supertest';
import { app } from '../../app';
import { Product } from '../../models/products';
import { natsConnector } from './../../nats-connector';

it('fails if not authenticated user tries to create a product', async () => {
  const response = await request(app).post('/api/products').send({
    title: 'product1',
    price: 100,
    description: 'bed',
  });

  expect(response.statusCode).toEqual(401); // NotAuthorizedError
});

it('fails if required field is empty', async () => {
  // first, sign up logic
  const cookie = (await global.signin())[0];

  // first, title
  await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 100,
      description: 'bed',
    })
    .expect(400); // RequestValidationError

  // price
  await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'product1',
      price: '',
      description: 'bed',
    })
    .expect(400); // RequestValidationError

  // description
  await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'product1',
      price: 100,
      description: '',
    })
    .expect(400); // RequestValidationError
});

it('correctly creates a product with valid inputs and authentication and check correct amount', async () => {
  const cookie = (await global.signin())[0];
  let products = await Product.find({});
  expect(products.length).toEqual(0);

  await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'product1',
      price: 100,
      description: 'bed',
    })
    .expect(201);

  await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'product2',
      price: 100,
      description: 'bed',
      amount: 2,
    })
    .expect(201);
  products = await Product.find({});

  expect(products.length).toEqual(2);
  expect(products[0].amount).toEqual(1);
  expect(products[1].amount).toEqual(2);
});

it('publishes product-created event', async () => {
  const cookie = (await global.signin())[0];

  // first, title
  await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      price: 100,
      description: 'bed',
      amount: 2,
    })
    .expect(201); // RequestValidationError
  expect(natsConnector.client.publish).toHaveBeenCalled();
});
