import { Publisher, ExpiratedEvent, Topics } from '@jong_ecommerce/common';

export class ExpiratedPublisher extends Publisher<ExpiratedEvent> {
  readonly topic = Topics.Expirated;
}
