import { GenericEvent } from '../generic.event';
import { WithdrawListingEventTopics } from './withdrawListing.event.topics';

export class WithdrawListingEvent extends GenericEvent {
  private decodedTopics: WithdrawListingEventTopics;

  constructor(init?: Partial<GenericEvent>) {
    super(init);
    this.decodedTopics = new WithdrawListingEventTopics(this.topics);
  }

  getTopics() {
    return this.decodedTopics.toPlainObject();
  }
}
