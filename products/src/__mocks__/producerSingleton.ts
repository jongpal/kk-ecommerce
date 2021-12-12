import { Topics } from '@jong_ecommerce/common';
import { ITopicConfig } from 'kafkajs';
export const producerSingleton = {
  producer: {
    connect: jest.fn(),
    send: jest.fn((topic: Topics, messages: any[]) => {}),
    disconnect: jest.fn(),
  },
  adminClient: {
    connect: jest.fn(),
    createTopics: jest.fn((topics: ITopicConfig[]) => {}),
    disconnect: jest.fn(),
  },
};
