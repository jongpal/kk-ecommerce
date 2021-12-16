import { Publisher, Topics, PaymentCreatedEvent } from '@jong_ecommerce/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly topic = Topics.PaymentCreated;
}
