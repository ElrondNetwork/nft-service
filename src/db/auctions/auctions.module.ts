import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheService } from 'src/common/services/redis-cache.service';
import { AuctionsProvider } from 'src/modules/auctions/asset-auctions.loader';
import { AuctionEntity } from './auction.entity';
import { AuctionsServiceDb } from './auctions.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionEntity])],
  providers: [AuctionsServiceDb, AuctionsProvider, RedisCacheService],
  exports: [AuctionsServiceDb, AuctionsProvider, RedisCacheService],
})
export class AuctionsModuleDb {}
