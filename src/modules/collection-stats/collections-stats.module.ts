import { Module } from '@nestjs/common';
import { ElrondCommunicationModule } from 'src/common';
import { CollectionsStatsResolver } from './collections-stats.resolver';
import { CollectionsStatsService } from './collections-stats.service';

@Module({
  providers: [CollectionsStatsService, CollectionsStatsResolver],
  imports: [ElrondCommunicationModule],
  exports: [CollectionsStatsService],
})
export class CollectionsStatsModuleGraph {}
