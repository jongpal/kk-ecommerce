import {
  Listener,
  Topics,
  ProductUpdateEvent,
  NotFoundError,
} from '@jong_ecommerce/common';
import { Product } from '../models/products';
import { Message } from 'kafkajs';
import { CONSUMER_UPDATE_GROUP_ID } from './group-info/group-id';

export class ProductUpdatedListener extends Listener<ProductUpdateEvent> {
  readonly topic = Topics.ProductUpdated;
  groupId = CONSUMER_UPDATE_GROUP_ID;
  // to be improved : concurrency (autoCommit : false)
  async onMessage(value: ProductUpdateEvent['value'], msg: Message) {
    //first find if it exists
    //if it is , ticketNumber++
    const { id, amount, title, price, userId } = value;

    const product = await Product.findById(id);
    if (!product) throw new NotFoundError();
    product.set({ title, price, amount });
    await product.save();

    // TODO : commit here (manual commit)
  }
}
