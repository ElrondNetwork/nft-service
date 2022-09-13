import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountStatsRepository } from 'src/db/account-stats/account-stats.repository';
import { AssetsLikesRepository } from 'src/db/assets/assets-likes.repository';
import { TagsRepository } from 'src/db/auctions/tags.repository';
import { CollectionStatsRepository } from 'src/db/collection-stats/collection-stats.repository';
import { PersistenceService } from './persistance.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AssetsLikesRepository])],
  providers: [
    PersistenceService,
    AccountStatsRepository,
    TagsRepository,
    CollectionStatsRepository,
  ],
  exports: [PersistenceService],
})
export class PersistenceModule {}
