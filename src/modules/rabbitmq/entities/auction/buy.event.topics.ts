import { Address } from '@multiversx/sdk-core';
import '../../../../utils/extensions';
import { BinaryUtils } from '@multiversx/sdk-nestjs-common';

export class BuySftEventsTopics {
  private auctionId: string;
  private collection: string;
  private nonce: string;
  private currentWinner: Address;
  private bid: string;
  private boughtTokens: string;
  private paymentToken: string;

  constructor(rawTopics: string[]) {
    this.auctionId = Buffer.from(rawTopics[1], 'base64').toString('hex');
    this.paymentToken = BinaryUtils.base64Decode(rawTopics[3] ?? '');
    this.bid = Buffer.from(rawTopics[4], 'base64').toString('hex').hexBigNumberToString();

    this.collection = Buffer.from(rawTopics[6], 'base64').toString();
    this.nonce = Buffer.from(rawTopics[7], 'base64').toString('hex');
    this.boughtTokens = Buffer.from(rawTopics[8], 'base64').toString('hex').hexBigNumberToString();
    this.currentWinner = new Address(Buffer.from(rawTopics[9], 'base64'));
  }

  toPlainObject() {
    return {
      currentWinner: this.currentWinner.bech32(),
      collection: this.collection,
      nonce: this.nonce,
      auctionId: this.auctionId,
      bid: this.bid,
      boughtTokens: this.boughtTokens,
      paymentToken: this.paymentToken,
    };
  }
}
