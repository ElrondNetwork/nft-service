import { GenericEvent } from '../generic.event';
import { ListingEventTopics } from './listing.event.topics';

export class ListingEvent extends GenericEvent {
  private decodedTopics: ListingEventTopics;

  constructor(init?: Partial<GenericEvent>) {
    super(init);
    this.decodedTopics = new ListingEventTopics(this.topics);
  }

  getTopics() {
    return this.decodedTopics.toPlainObject();
  }
}
