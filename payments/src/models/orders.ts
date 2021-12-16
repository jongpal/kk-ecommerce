import mongoose from 'mongoose';
import { OrderStatus } from '@jong_ecommerce/common';
// import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttrs {
  id: string;
  productPrice: number;
  orderUserId: string;
  // status: OrderStatus;
  status: string;
  orderAmount: number;
  // version : number
}

interface OrderDoc extends mongoose.Document {
  // id is already included in Document so we don't have to specify id field here
  productPrice: number;
  orderUserId: string;
  // status: OrderStatus;
  status: string;
  orderAmount: number;
  // version : number;
}
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attr: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    productPrice: {
      type: Number,
      required: true,
    },
    orderUserId: {
      type: String,
      required: true,
    },
    status: {
      // type: OrderStatus,
      type: String,
      required: true,
    },
    orderAmount: {
      type: Number,
      required: true,
    },
    // version : {
    //   type : Number,
    //   required : true
    // }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    // optimisticConcurrency: true,
  }
);

// orderSchema.set('versionKey', 'version');
// orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    // version: attrs.version,
    orderAmount: attrs.orderAmount,
    status: attrs.status,
    productPrice: attrs.productPrice,
    orderUserId: attrs.orderUserId,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, OrderDoc };
