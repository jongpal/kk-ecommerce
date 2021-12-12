import mongoose from 'mongoose';
import { OrderStatus } from '@jong_ecommerce/common';

// should be revised !!
interface ProductAttrs {
  id: string;
  title: string;
  price: number;
  userId: string;
  amount?: number;
  // version?: number;
}

interface ProductDoc extends mongoose.Document {
  id: string;
  title: string;
  price: number;
  userId: string;
  amount: number;
  // version: number;
  isReserved(orderTicketNumber: number): boolean;
  setAmount(to: number): void;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
    },
    // version: {
    //   type: Number,
    //   // required:true,
    // },
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

productSchema.methods.setAmount = function (to: Number) {
  this.amount = to;
};

productSchema.methods.isReserved = function (orderAmount: number) {
  //if orderId exists, it will return 1, if not, if will return false.
  // return !!this.orderId;
  return this.amount - orderAmount < 0 ? 1 : 0;
};

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
    userId: attrs.userId,
    amount: attrs.amount,
    // version: attrs.version,
  });
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  'Product',
  productSchema
);

export { Product, ProductDoc };
