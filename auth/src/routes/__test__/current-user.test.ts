import request from 'supertest';
import { app } from './../../app';

it('responds with details about the current user', async () => {
  const cookie = await global.signup();

  // console.log(cookie);
  // should set cookie because Jest will not automatically deliver it for you unlike browser
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  // console.log(response.body);
  expect(response.body.currentUser.id).toBeDefined();
});

it('returns 401 Unauthorized if it not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);

  // expect(response.body.currentUser).toEqual(null);
});
