import { Logger, Module } from '@nestjs/common';
import { ElrondCommunicationModule } from 'src/common';
import { ApiConfigService } from 'src/utils/api.config.service';
import { FeaturedCollectionsResolver } from './featured-collections.resolver';
import { FeaturedNftsResolver } from './featured-nfts.resolver';
import { FeaturedService } from './featured.service';

@Module({
  providers: [
    Logger,
    ApiConfigService,
    FeaturedService,
    FeaturedNftsResolver,
    FeaturedCollectionsResolver,
  ],
  imports: [ElrondCommunicationModule],
})
export class FeaturedModuleGraph {}
