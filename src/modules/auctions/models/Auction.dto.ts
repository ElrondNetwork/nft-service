import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { AuctionEntity } from 'src/db';
import { Account } from 'src/modules/accounts/models/account.dto';
import { Asset, Price } from 'src/modules/assets/models';
import { Order } from 'src/modules/orders/models';
import { AuctionStatusEnum } from '.';

@ObjectType()
export class Auction {
  @Field(() => ID)
  id: number;

  @Field(() => String, { nullable: true })
  ownerAddress: string;

  @Field(() => Account, { nullable: true })
  owner: Account;

  @Field(() => AuctionStatusEnum, { nullable: true })
  status: AuctionStatusEnum;

  @Field(() => String)
  token: string;

  @Field(() => String)
  identifier: string;

  @Field(() => Int)
  nonce: number;

  @Field(() => Asset)
  asset: Asset;

  @Field(() => Price)
  minBid: Price;

  @Field(() => Price)
  maxBid: Price;

  @Field(() => String)
  startDate: string;

  @Field(() => String)
  endDate: string;

  @Field(() => Price, { nullable: true })
  topBid: Price;

  @Field(() => Account, { nullable: true })
  topBidder: Account;

  @Field(() => [Order], { nullable: true })
  orders: Order[];

  constructor(init?: Partial<Auction>) {
    Object.assign(this, init);
  }

  static fromEntity(auction: AuctionEntity) {
    return auction
      ? new Auction({
          id: auction.id,
          status: auction.status,
          ownerAddress: auction.ownerAddress,
          token: auction.token,
          nonce: auction.nonce,
          identifier: auction.identifier,
          startDate: auction.startDate,
          endDate: auction.endDate,
          minBid: new Price({
            token: 'EGLD',
            nonce: 1,
            amount: auction.minBid,
          }),
          maxBid: new Price({
            token: 'EGLD',
            nonce: 1,
            amount: auction.maxBid,
          }),
        })
      : null;
  }
}
