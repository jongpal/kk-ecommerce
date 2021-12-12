import { Publisher, Topics, ProductUpdateEvent } from '@jong_ecommerce/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdateEvent> {
  readonly topic = Topics.ProductUpdated;
}
