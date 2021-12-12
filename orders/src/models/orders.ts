import { OrderStatus } from '@jong_ecommerce/common';
import mongoose from 'mongoose';
import { ProductDoc } from './products';
// import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttrs {
  userId: string;
  // status: OrderStatus;
  status: string;
  amount: number;
  expiresAt: Date;
  products: ProductDoc[];
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  // status: OrderStatus;
  status: string;
  amount: number;
  expiresAt: Date;
  products: ProductDoc[];
  // version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
    },
    status: {
      // type: OrderStatus,
      type: String,
      // required : true,
      // enum: Object.values(OrderStatus), // mongoose will force users to input one of status in OrdetStatus
      // default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.SchemaTypes.Date,
      required: true,
    },
    products: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
// orderSchema.set('versionKey', 'version');
// orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
