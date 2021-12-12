import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Topics,
} from '@jong_ecommerce/common';
import { Message } from 'kafkajs';
import { Product } from './../../models/products';
import { CONSUMER_CANCELL_GROUP_ID } from '../group-info/group-id';
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher';
import { producerSingleton } from '../../producerSingleton';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;
  groupId = CONSUMER_CANCELL_GROUP_ID;

  async onMessage(value: OrderCancelledEvent['value'], msg: Message) {
    const {
      product: { id },
      amount,
    } = value;
    const orderAmount = amount;
    // revoke product
    const product = await Product.findById(id);

    if (!product) {
      throw new NotFoundError();
    }

    // restore previous state : restore amount
    product.amount += orderAmount;
    // product.orderId = undefined;
    await product.save();

    await new ProductUpdatedPublisher(
      producerSingleton.producer,
      producerSingleton.adminClient
    ).publish({
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      userId: product.userId,
      amount: product.amount,
    });
  }
}
