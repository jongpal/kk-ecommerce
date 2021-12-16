import {
  Listener,
  OrderCreatedEvent,
  Topics,
  OrderStatus,
} from '@jong_ecommerce/common';
import { Message } from 'node-nats-streaming';
import { natsConnector } from '../nats-connector';
import { CONSUMER_CREATE_GROUP_ID } from './group-info/group-id';
import { Order } from './../models/orders';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;
  queueGroupName = CONSUMER_CREATE_GROUP_ID;

  async onMessage(value: OrderCreatedEvent['value'], msg: Message) {
    const order = Order.build({
      id: value.id,
      productPrice: value.product.price,
      status: OrderStatus.Created,
      orderAmount: value.amount,
      orderUserId: value.userId,
    });
    await order.save();
    msg.ack();
  }
}
