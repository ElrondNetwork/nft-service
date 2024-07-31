import { Address } from '@multiversx/sdk-core/out';
import { BinaryUtils } from '@multiversx/sdk-nestjs-common';

export class ListingEventTopics {
  private auctionId: string;
  private collection: string;
  private nonce: string;
  private nrAuctionTokens: string;
  private originalOwner: Address;
  private minBid: string;
  private maxBid: string;
  private startTime: number;
  private endTime: number;
  private paymentToken: string;
  private paymentNonce: number;
  private auctionType: string;

  constructor(rawTopics: string[]) {
    this.auctionId = Buffer.from(rawTopics[1], 'base64').toString('hex');
    this.originalOwner = new Address(Buffer.from(rawTopics[2], 'base64'));
    this.paymentToken = BinaryUtils.base64Decode(rawTopics[3]);
    this.paymentNonce = 0;
    this.minBid = BinaryUtils.hexToNumber(BinaryUtils.base64ToHex(rawTopics[4])).toString();
    this.maxBid = '0';
    this.auctionType = BinaryUtils.hexToNumber(BinaryUtils.base64ToHex(rawTopics[5])).toString();
    this.collection = Buffer.from(rawTopics[6], 'base64').toString();
    this.nonce = Buffer.from(rawTopics[7], 'base64').toString('hex');
    this.nrAuctionTokens = parseInt(Buffer.from(rawTopics[8], 'base64').toString('hex'), 16).toString();
  }

  toPlainObject() {
    return {
      originalOwner: this.originalOwner.bech32(),
      collection: this.collection,
      nonce: this.nonce,
      auctionId: this.auctionId,
      nrAuctionTokens: this.nrAuctionTokens,
      minBid: this.minBid,
      price: this.minBid,
      maxBid: this.maxBid,
      startTime: this.startTime,
      endTime: this.endTime,
      paymentToken: this.paymentToken,
      paymentNonce: this.paymentNonce,
      auctionType: this.auctionType,
    };
  }
}
