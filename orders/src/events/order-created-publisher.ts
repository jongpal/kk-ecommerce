import { Publisher, Topics, OrderCreatedEvent } from '@jong_ecommerce/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;
}
