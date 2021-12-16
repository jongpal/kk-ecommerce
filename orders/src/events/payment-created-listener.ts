import {
  Topics,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
  NotFoundError,
} from '@jong_ecommerce/common';
import { CONSUMER_CREATE_GROUP_ID } from './group-info/group-id';
import { Message } from 'node-nats-streaming';
import { Order } from './../models/orders';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly topic = Topics.PaymentCreated;
  // queueGroupName = CONSUMER_EXPIRATED_GROUP_ID;
  queueGroupName = CONSUMER_CREATE_GROUP_ID;

  async onMessage(value: PaymentCreatedEvent['value'], msg: Message) {
    const order = await Order.findById(value.orderId).populate('products');
    if (!order) {
      msg.ack();
      throw new NotFoundError();
    }
    if (order.status === OrderStatus.Complete) {
      msg.ack();
      return;
    }
    order.status = OrderStatus.Complete;
    await order.save();
    msg.ack();
  }
}
