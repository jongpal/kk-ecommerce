import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 on invalid email', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'invalidemail',
      password: 'test.com',
    })
    .expect(400);
});

//return or async await is also fine
it('returns a 400 on invalid password', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'invalidemail',
      password: '.',
    })
    .expect(400);
});

it('returns a 400 with missing password or email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'test.com',
    })
    .expect(400);
});

it('returns a 400 with duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test.com',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test.com',
    })
    .expect(400);
});

it('set cookie after successful sign up', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test.com',
    })
    .expect(201);
  // console.log(response.get("Set-Cookie"));
  expect(response.get('Set-Cookie')).toBeDefined();
});
