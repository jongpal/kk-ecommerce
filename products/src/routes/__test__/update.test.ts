import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
// import { Product } from '../../models/products';
import { producerSingleton } from './../../producerSingleton';

const createTicket = async (
  title: string = 'product1',
  price: number = 100,
  description: string = 'bed',
  amount: number = 1
) => {
  const cookie = (await global.signin())[0];

  let response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title,
      price,
      description,
      amount,
    })
    .expect(201);

  return response;
};

it('fails if user is not authenticated', async () => {
  // first create product
  const response = await createTicket();
  const correctId = response.body.id;

  // another user
  // unauthenticated user tries to update this product
  await request(app)
    .put(`/api/products/${correctId}`)
    .send({
      title: 'product1',
      price: 100,
      description: 'bed',
    })
    .expect(401); // NotAuthorizedError
});

it('fails if wrong user tries to update a product', async () => {
  // first create product
  let response = await createTicket();
  const correctId = response.body.id;

  // another user
  const cookie = await global.signin('anotherId', 'test_@test.com');
  // unauthorized user tries to update this product
  response = await request(app)
    .put(`/api/products/${correctId}`)
    .set('Cookie', cookie)
    .send({
      title: 'product1',
      price: 100,
      description: 'bed',
    });

  expect(response.statusCode).toEqual(401); // NotAuthorizedError
});

it('fails if wrong productId is requested', async () => {
  const wrongId = new mongoose.Types.ObjectId().toHexString();
  const cookie = (await global.signin())[0];

  let response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'product1',
      price: 100,
      description: 'bed',
    })
    .expect(201);

  response = await request(app)
    .put(`/api/products/${wrongId}`)
    .set('Cookie', cookie)
    .send({
      title: 'product1',
      price: 100,
      description: 'bed',
    });
  expect(response.statusCode).toEqual(404); // NotFoundError
});

it('returns 200 and update accordingly if valid inputs are given', async () => {
  const cookie = (await global.signin())[0];

  let response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'product1',
      price: 100,
      description: 'bed',
    })
    .expect(201);

  const correctId = response.body.id;

  response = await request(app)
    .put(`/api/products/${correctId}`)
    .set('Cookie', cookie)
    .send({
      title: 'product1',
      price: 100,
      description: 'bed',
      amount: 2,
    });

  expect(response.statusCode).toEqual(200);
  expect(response.body.amount).toEqual(2);
});

it('publishes product-updated event', async () => {
  const cookie = (await global.signin())[0];
  // const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'sdasd',
      price: 100,
      description: 'bed',
      amount: 2,
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'dsad',
      price: 100,
      description: 'bed',
      amount: 2,
    })
    .expect(200); // RequestValidationError
  expect(producerSingleton.producer.connect).toHaveBeenCalled();
  expect(producerSingleton.producer.send).toHaveBeenCalled();
  expect(producerSingleton.producer.disconnect).toHaveBeenCalled();
});

it.todo('reject if the product is reserved');
