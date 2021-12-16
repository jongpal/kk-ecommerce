import {
  Listener,
  Topics,
  ProductUpdateEvent,
  NotFoundError,
} from '@jong_ecommerce/common';
import { Product } from '../models/products';
import { Message } from 'node-nats-streaming';
// import { CONSUMER_UPDATE_GROUP_ID } from './group-info/group-id';
import { CONSUMER_CREATE_GROUP_ID } from './group-info/group-id';

export class ProductUpdatedListener extends Listener<ProductUpdateEvent> {
  readonly topic = Topics.ProductUpdated;
  // queueGroupName = CONSUMER_UPDATE_GROUP_ID;
  queueGroupName = CONSUMER_CREATE_GROUP_ID;
  // to be improved : concurrency (autoCommit : false)
  async onMessage(value: ProductUpdateEvent['value'], msg: Message) {
    //first find if it exists
    //if it is , ticketNumber++
    const { id, amount, title, price, userId } = value;

    const product = await Product.findById(id);
    if (!product) throw new NotFoundError();
    product.set({ title, price, amount });
    await product.save();
    msg.ack();
  }
}
