import { Listener, OrderCreatedEvent, Topics } from '@jong_ecommerce/common';
import { Message } from 'node-nats-streaming';
import { CONSUMER_CREATE_GROUP_ID } from './group-info/group-id';
import { expirationQueue } from '../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;
  queueGroupName = CONSUMER_CREATE_GROUP_ID;

  async onMessage(value: OrderCreatedEvent['value'], msg: Message) {
    const delay = new Date(value.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add(
      {
        orderId: value.id,
      },
      {
        delay,
      }
    );
    msg.ack();
  }
}
