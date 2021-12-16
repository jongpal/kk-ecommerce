import { Topics } from '@jong_ecommerce/common';
import { ITopicConfig, Consumer } from 'kafkajs';

const consumerObject = {
  consumer: {
    subscribe: jest.fn((topic: Topics, fromBeginning: boolean) => {}),
    connect: jest.fn(),
    run: jest.fn(),
    disconnect: jest.fn(),
  },
};

export class Consumers {
  protected client;

  constructor() {
    this.client = consumerObject;
  }
}
