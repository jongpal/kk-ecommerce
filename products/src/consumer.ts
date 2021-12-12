// import { randomBytes } from 'crypto';
// import { ProductCreatedListener } from './product-created-listener';
import { createConsumer, Topics } from '@jong_ecommerce/common';
import { Consumer } from 'kafkajs';

export class Consumers {
  private _consumer?: Consumer;

  public get consumer() {
    if (!this._consumer) {
      throw new Error('initialize connection first');
    }
    return this._consumer;
  }

  create(consumerId: string, groupId: string, consumerBrokerList: string[]) {
    return new Promise<void>((resolve, reject) => {
      try {
        this._consumer = createConsumer(
          consumerId,
          groupId,
          consumerBrokerList
        );
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
