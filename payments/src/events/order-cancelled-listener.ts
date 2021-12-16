import {
  Listener,
  OrderCancelledEvent,
  Topics,
  OrderStatus,
} from '@jong_ecommerce/common';
import { Message } from 'node-nats-streaming';
import { natsConnector } from './../nats-connector';
// import { CONSUMER_CANCELL_GROUP_ID } from './group-info/group-id';
import { CONSUMER_CREATE_GROUP_ID } from './group-info/group-id';
import { Order } from './../models/orders';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;
  // queueGroupName = CONSUMER_CANCELL_GROUP_ID;
  queueGroupName = CONSUMER_CREATE_GROUP_ID;

  async onMessage(value: OrderCancelledEvent['value'], msg: Message) {
    const order = await Order.findOne({
      _id: value.id,
    });
    if (!order) {
      msg.ack();
      throw new Error('Order not found');
    }
    if (order.status === OrderStatus.Cancelled) {
      await order.save();
      msg.ack();
      return;
    }

    console.log('found order');

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    msg.ack();
  }
}
