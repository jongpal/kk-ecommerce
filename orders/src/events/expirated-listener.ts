import {
  Listener,
  ExpiratedEvent,
  Topics,
  OrderStatus,
  NotFoundError,
} from '@jong_ecommerce/common';
// import { CONSUMER_EXPIRATED_GROUP_ID } from './group-info/group-id';
import { CONSUMER_CREATE_GROUP_ID } from './group-info/group-id';
import { Message } from 'node-nats-streaming';
import { OrderCancelledPublisher } from './order-cancelled-publisher';
import { Order } from './../models/orders';
import { Product } from './../models/products';
import { natsConnector } from './../nats-connector';

export class ExpiratedListener extends Listener<ExpiratedEvent> {
  readonly topic = Topics.Expirated;
  queueGroupName = CONSUMER_CREATE_GROUP_ID;

  async onMessage(value: ExpiratedEvent['value'], msg: Message) {
    const order = await Order.findById(value.orderId).populate('products');
    if (!order) {
      msg.ack();
      throw new NotFoundError();
    }
    if (order.status === OrderStatus.Complete) {
      msg.ack();
      return;
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    const product = await Product.findById(order.products[0].id);
    if (!product) {
      msg.ack();
      throw new NotFoundError();
    }
    product.setAmount(product.amount + order.amount);
    await product.save();

    const publisher = new OrderCancelledPublisher(natsConnector.client);

    await publisher.publish({
      id: value.orderId,
      status: OrderStatus.Cancelled,
      amount: order.amount,
      // version: order.version,
      userId: order.userId,
      product: { id: order.products[0].id },
    });
    msg.ack();
  }
}
