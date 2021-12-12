import { Publisher, Topics, ProductCreatedEvent } from '@jong_ecommerce/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  readonly topic = Topics.ProductCreated;
}
