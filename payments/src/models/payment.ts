import { OrderStatus } from '@jong_ecommerce/common';
// import { OrderDoc } from './order';
import mongoose, { Document, Model } from 'mongoose';

interface PaymentAttrs {
  orderId: string;
  amountPaid: number;
  stripeId: string;
}

interface PaymentDoc extends Document {
  orderId: string;
  amountPaid: number;
  stripeId: string;
  version: number;
}

interface PaymentModel extends Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
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

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    orderId: attrs.orderId,
    amountPaid: attrs.amountPaid,
    stripeId: attrs.stripeId,
  });
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
