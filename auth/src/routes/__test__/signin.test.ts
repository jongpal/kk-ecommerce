import request from 'supertest';
import { app } from './../../app';

it('returns 400 on not existing user', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: '13677@567.com',
      password: '11111',
    })
    .expect(400);
});

it('fails if an incorrect password given', async () => {
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
      password: 'wrongPassword',
    })
    .expect(400);
});

it('success if correct password and email is given and jwt cookie is set', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test.com',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'test.com',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('returns a 400 with missing password or email', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signin')
    .send({
      password: 'test.com',
    })
    .expect(400);
});
