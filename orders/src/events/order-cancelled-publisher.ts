import { Publisher, Topics, OrderCancelledEvent } from '@jong_ecommerce/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;
}
