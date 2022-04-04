import { Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/common';
import { AuctionEntity } from 'src/db/auctions';
import { RedisKeyValueDataloaderHandler } from 'src/modules/common/redis-key-value-dataloader.handler';
import { RedisValue } from 'src/modules/common/redis-value.dto';
import { TimeConstants } from 'src/utils/time-utils';

@Injectable()
export class LowestAuctionRedisHandler extends RedisKeyValueDataloaderHandler<string> {
  constructor(redisCacheService: RedisCacheService) {
    super(redisCacheService, 'lowest_auctions');
  }

  mapValues(
    returnValues: { key: string; value: any }[],
    auctionsIdentifiers: { [key: string]: AuctionEntity[] },
  ) {
    const redisValues = [];
    for (const item of returnValues) {
      if (item.value === null) {
        item.value = auctionsIdentifiers[item.key]
          ? auctionsIdentifiers[item.key][0]
          : {};
        redisValues.push(item);
      }
    }

    return [
      new RedisValue({
        values: redisValues,
        ttl: 30 * TimeConstants.oneSecond,
      }),
    ];
  }
}
