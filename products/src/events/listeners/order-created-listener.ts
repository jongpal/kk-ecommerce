import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  Topics,
} from '@jong_ecommerce/common';
import { Message } from 'kafkajs';
import { Product } from './../../models/products';
import { CONSUMER_CREATE_GROUP_ID } from '../group-info/group-id';
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher';
import { producerSingleton } from '../../producerSingleton';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;
  groupId = CONSUMER_CREATE_GROUP_ID;

  async onMessage(value: OrderCreatedEvent['value'], msg: Message) {
    const {
      product: { id },
      amount,
    } = value;
    const orderAmount = amount;
    // secure product , amount of 0 would be product that is in ordering process
    const product = await Product.findById(id);

    if (!product) {
      throw new NotFoundError();
    }
    product.amount -= orderAmount;
    // product.orderId = orderId;

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
