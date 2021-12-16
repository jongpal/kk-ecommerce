import { Listener, Topics, ProductCreatedEvent } from '@jong_ecommerce/common';
import { Product } from '../models/products';
import { Message } from 'node-nats-streaming';
import { CONSUMER_CREATE_GROUP_ID } from './group-info/group-id';
import mongoose from 'mongoose';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  readonly topic = Topics.ProductCreated;
  queueGroupName = CONSUMER_CREATE_GROUP_ID;

  // to be improved : concurrency (autoCommit : false)
  async onMessage(value: ProductCreatedEvent['value'], msg: Message) {
    //first find if it exists
    //if it is , ticketNumber++
    const { id, amount, title, price, userId } = value;

    // if already exists, then just increase the number
    const product = await Product.findById(id);
    if (product) {
      product.set({ amount: product.amount + amount });
      console.log('existing product');
      await product.save();
    } else {
      const newProduct = Product.build({
        id,
        title,
        price,
        userId,
        amount,
      });
      console.log(`saving product ${id}`);
      await newProduct.save();
    }
    msg.ack();
  }
}
