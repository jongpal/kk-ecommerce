import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
// import { Product } from '../../models/products';

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

it('returns NotFoundError if specified product does not exist', async () => {
  // first, create a ticket
  const wrongId = new mongoose.Types.ObjectId().toHexString();

  let response = await createTicket();
  // body with wrong id
  // const correctId = response.body.id;

  response = await request(app).get(`/api/products/${wrongId}`).send({});
  expect(response.statusCode).toEqual(404);
});

it('shows a single product that is requested', async () => {
  let response = await createTicket();

  const correctId = response.body.id;

  response = await request(app).get(`/api/products/${correctId}`).send({});
  expect(response.statusCode).toEqual(200);
  // console.log(response.body);
  expect(response.body[0].id).toEqual(correctId);
});

it('shows all the products', async () => {
  await createTicket();
  await createTicket('product2', 100, 'bed', 3);

  const response = await request(app).get('/api/products').send({}).expect(200);

  expect(response.body.length).toEqual(2);
});
