import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Topics,
} from '@jong_ecommerce/common';
import { Message } from 'node-nats-streaming';
import { Product } from './../../models/products';
// import { CONSUMER_CANCELL_GROUP_ID } from '../group-info/group-id';
import { CONSUMER_CREATE_GROUP_ID } from '../group-info/group-id';
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher';
import { natsConnector } from '../../nats-connector';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;
  // queueGroupName = CONSUMER_CANCELL_GROUP_ID;
  queueGroupName = CONSUMER_CREATE_GROUP_ID;

  async onMessage(value: OrderCancelledEvent['value'], msg: Message) {
    const {
      product: { id },
      amount,
    } = value;
    const orderAmount = amount;
    // revoke product
    const product = await Product.findById(id);

    if (!product) {
      msg.ack();
      throw new NotFoundError();
    }

    // restore previous state : restore amount
    product.amount += orderAmount;
    // product.orderId = undefined;
    await product.save();

    await new ProductUpdatedPublisher(natsConnector.client).publish({
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      userId: product.userId,
      amount: product.amount,
    });

    msg.ack();
  }
}
