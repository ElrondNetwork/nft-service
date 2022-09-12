import DataLoader = require('dataloader');
import { getRepository } from 'typeorm';
import { getLowestAuctionForIdentifiers } from 'src/db/auctions/sql.queries';
import { DateUtils } from 'src/utils/date-utils';
import { LowestAuctionRedisHandler } from './lowest-auctions.redis-handler';
import { Injectable, Scope } from '@nestjs/common';
import { BaseProvider } from 'src/modules/common/base.loader';
import { AuctionEntity } from 'src/db/auctions';

@Injectable({
  scope: Scope.REQUEST,
})
export class LowestAuctionProvider extends BaseProvider<string> {
  constructor(lowestAuctionProviderRedisHandler: LowestAuctionRedisHandler) {
    super(
      lowestAuctionProviderRedisHandler,
      new DataLoader(async (keys: string[]) => await this.batchLoad(keys)),
    );
  }

  async getData(identifiers: string[]) {
    const auctions = await getRepository(AuctionEntity).query(
      getLowestAuctionForIdentifiers(identifiers),
    );

    return auctions?.groupBy((auction) => auction.identifier);
  }
}
