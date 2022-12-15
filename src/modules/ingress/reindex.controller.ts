import { Controller, Post } from '@nestjs/common';
import { NsfwUpdaterService } from 'src/crons/elastic.updater/nsfw.updater.service';
import { RarityUpdaterService } from 'src/crons/elastic.updater/rarity.updater.service';
import { MarketplaceEventsIndexingService } from '../marketplaces/marketplaces-events-indexing.service';
import { NftScamService } from '../nft-scam/nft-scam.service';
import { NftTraitsService } from '../nft-traits/nft-traits.service';

@Controller()
export class ReindexController {
  constructor(
    private nsfwRService: NsfwUpdaterService,
    private rarityUpdaterService: RarityUpdaterService,
    private nftTraitsService: NftTraitsService,
    private nftScamService: NftScamService,
    private marketplacesEventsIndexingService: MarketplaceEventsIndexingService,
  ) {}

  @Post('/trigger-reindex-all') async triggerAllReindexes(): Promise<void> {
    await this.triggerNsfwReindex();
    await this.triggerScamReindex();
    await this.triggerTraitsReindex();
    await this.triggerRarityValidation();
    await this.triggerLatestMarketplacesEventsReindex();
  }

  @Post('/trigger-nsfw-reindex')
  async triggerNsfwReindex(): Promise<void> {
    return await this.nsfwRService.updateNsfwWhereNone();
  }

  @Post('/trigger-nsfw-clean-reindex')
  async triggerNsfwReindexFromDb(): Promise<void> {
    return await this.nsfwRService.cleanReindexing();
  }

  @Post('/trigger-rarity-reindex')
  async triggerRarityReindex(): Promise<void> {
    return this.rarityUpdaterService.handleReindexAllTokenRarities();
  }

  @Post('/trigger-rarity-validation')
  async triggerRarityValidation(): Promise<void> {
    return this.rarityUpdaterService.handleValidateAllTokenRarities();
  }

  @Post('/trigger-traits-reindex')
  async triggerTraitsReindex(): Promise<void> {
    return this.nftTraitsService.updateAllCollectionTraits();
  }

  @Post('/trigger-scam-reindex')
  async triggerScamReindex(): Promise<void> {
    return this.nftScamService.validateOrUpdateAllNftsScamInfo();
  }

  @Post('/trigger-latest-marketplaces-events-reindex')
  async triggerLatestMarketplacesEventsReindex(): Promise<void> {
    return this.marketplacesEventsIndexingService.reindexAllMarketplaceEvents();
  }
}
