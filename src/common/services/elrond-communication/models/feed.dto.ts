export class Feed {
  address: string;
  topic: TopicEnum = TopicEnum.nft;
  event: EventEnum;
  reference: string;
  subscription: string;
  extraInfo: { [key: string]: unknown };
  constructor(init?: Partial<Feed>) {
    Object.assign(this, init);
  }
}

export enum EventEnum {
  like = 'like',
  unlike = 'unlike',
  follow = 'follow',
  unfollow = 'unfollow',
  createCollection = 'createCollection',
  mintNft = 'mintNft',
  startAuction = 'startAuction',
  bid = 'bid',
  buy = 'buy',
  won = 'won',
}

export enum TopicEnum {
  account = 'account',
  nft = 'nft',
}
