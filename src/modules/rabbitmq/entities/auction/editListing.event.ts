import { GenericEvent } from '../generic.event';
import { EditListingEventsTopics } from './editListing.event.topics';

export class EditListingEvent extends GenericEvent {
  private decodedTopics: EditListingEventsTopics;

  constructor(init?: Partial<GenericEvent>) {
    super(init);
    this.decodedTopics = new EditListingEventsTopics(this.topics);
  }

  getTopics() {
    return this.decodedTopics.toPlainObject();
  }
}
