import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { app } from '../app';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'jwt-key';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

declare global {
  var signin: (id?: string, email?: string) => string[];
}

global.signin = (
  id: string = new mongoose.Types.ObjectId().toHexString(),
  email: string = 'test@test.com'
) => {
  //if async is on, typescript would think we are returning promise
  const payload = {
    id,
    email,
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build fake session
  const session = { jwt: token };
  const JSONsession = JSON.stringify(session);
  const base64 = Buffer.from(JSONsession).toString('base64'); //string 을 Buffer.from으로 utf-8형식으로 바꾸고 다시 base 64로 인코딩
  return [`express:sess=${base64}`];
};
