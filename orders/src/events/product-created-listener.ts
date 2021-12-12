import { Listener, Topics, ProductCreatedEvent } from '@jong_ecommerce/common';
import { Product } from '../models/products';
import { Message } from 'kafkajs';
import { CONSUMER_CREATE_GROUP_ID } from './group-info/group-id';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  readonly topic = Topics.ProductCreated;
  groupId = CONSUMER_CREATE_GROUP_ID;

  // to be improved : concurrency (autoCommit : false)
  async onMessage(value: ProductCreatedEvent['value'], msg: Message) {
    //first find if it exists
    //if it is , ticketNumber++
    const { id, amount, title, price, userId } = value;

    const product = Product.build({
      id,
      title,
      price,
      userId,
      amount,
    });
    await product.save();

    // TODO : commit here (manual commit)
  }
}
