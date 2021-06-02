import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { ElrondCommunicationModule } from '../../common/services/elrond-communication/elrond-communication.module';
import { CacheManagerModule } from '../../common/services/cache-manager/cache-manager.module';
import * as redisStore from 'cache-manager-redis-store';
import { AssetsService } from './assets.service';
import { AssetsResolver } from './assets.resolver';
import { AccountsModuleGraph } from '../accounts/accounts.module';
import { IpfsModule } from '../ipfs/ipfs.module';
import { AuctionsModuleGraph } from '../auctions/auctions.module';
import { AssetsLikesRepository } from 'src/db/assets/assets-likes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'src/common/services/redis-cache.module';

@Module({
  providers: [AssetsService, AssetsResolver],
  imports: [
    ElrondCommunicationModule,
    CacheManagerModule,
    IpfsModule,
    forwardRef(() => AccountsModuleGraph),
    forwardRef(() => AuctionsModuleGraph),
    CacheModule.register({
      ttl: 30, // default cache to 30 seconds. it will be overridden when needed
      store: redisStore,
      host: process.env.REDIS_URL,
      port: process.env.REDIS_PORT,
      prefix: process.env.REDIS_PREFIX,
    }),
    TypeOrmModule.forFeature([
      AssetsLikesRepository
    ]),
    RedisCacheModule.register({
      host: process.env.REDIS_URL,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      db: 2,
    }),
  ],
  exports: [AssetsService],
})
export class AssetsModuleGraph { }
