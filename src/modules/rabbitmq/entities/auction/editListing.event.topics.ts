import { Address } from '@multiversx/sdk-core';
import { BinaryUtils } from '@multiversx/sdk-nestjs-common';

export class EditListingEventsTopics {
  private auctionId: string;
  private newBid: string;
  private paymentToken: string;
  private paymentTokenNonce: string;
  constructor(rawTopics: string[]) {
    this.auctionId = Buffer.from(rawTopics[3], 'base64').toString('hex');
    this.paymentToken = BinaryUtils.base64Decode(rawTopics[7]);
    this.paymentTokenNonce = '0';
    this.newBid = Buffer.from(rawTopics[6], 'base64').toString('hex').hexBigNumberToString();


  }

  toPlainObject() {
    return {
      auctionId: this.auctionId,
      newBid: this.newBid,
      paymentToken: this.paymentToken,
      paymentTokenNonce: this.paymentTokenNonce,
    };
  }
}
