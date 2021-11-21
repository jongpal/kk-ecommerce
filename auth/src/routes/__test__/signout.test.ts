import request from 'supertest';
import { app } from './../../app';

it('unset jwt cookie when signout', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test.com',
    })
    .expect(201);
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'test.com',
    })
    .expect(200);
  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
