import { forwardRef, Logger, Module } from '@nestjs/common';
import { NftEventsService } from './nft-events.service';
import { NftEventsConsumer } from './nft-events.consumer';
import { RevertEventsConsumer } from './revert-events.consumer';
import { RevertEventsService } from './revert.events.service';
import { MxCommunicationModule } from 'src/common';
import { MinterEventsService } from './minter-events.service';
import { CommonModule } from 'src/common.module';
import { CachingModule } from 'src/common/services/caching/caching.module';
import { RarityUpdaterService } from 'src/crons/elastic.updater/rarity.updater.service';
import { NsfwUpdaterService } from 'src/crons/elastic.updater/nsfw.updater.service';
import { FlagNftService } from 'src/modules/admins/flag-nft.service';
import { AssetByIdentifierService } from 'src/modules/assets';
import { AssetRarityInfoRedisHandler } from 'src/modules/assets/loaders/assets-rarity-info.redis-handler';
import { VerifyContentService } from 'src/modules/assets/verify-content.service';
import { AuctionsModuleGraph } from 'src/modules/auctions/auctions.module';
import { CampaignsModuleGraph } from 'src/modules/campaigns/campaigns.module';
import { NftRarityComputeService } from 'src/modules/nft-rarity/nft-rarity.compute.service';
import { NftRarityService } from 'src/modules/nft-rarity/nft-rarity.service';
import { NotificationsModuleGraph } from 'src/modules/notifications/notifications.module';
import { OrdersModuleGraph } from 'src/modules/orders/orders.module';
import { CacheEventsPublisherModule } from '../cache-invalidation/cache-invalidation-publisher/change-events-publisher.module';
import { ElasiticUpdatesConsumer } from '../elastic-updates/elastic-updates-events.consumer';
import { ElasticUpdatesEventsService } from '../elastic-updates/elastic-updates-events.service';
import { MarketplacesModuleGraph } from 'src/modules/marketplaces/marketplaces.module';
import { FeedEventsSenderService } from './feed-events.service';
import { UsdPriceModuleGraph } from 'src/modules/usdPrice/usd-price.module';
import { UsdPriceService } from 'src/modules/usdPrice/usd-price.service';
import { NftRarityModuleGraph } from 'src/modules/nft-rarity/nft-rarity.module';
import { NftScamModule } from 'src/modules/nft-scam/nft-scam.module';
import { BuyEventHandler } from './handlers/buy-event.handler';
import { BidEventHandler } from './handlers/bid-event.handler';
import { StartAuctionEventHandler } from './handlers/startAuction-event.handler';
import { EndAuctionEventHandler } from './handlers/endAuction-event.handler';
import { AcceptGlobalOfferEventHandler } from './handlers/acceptGlobalOffer-event.handler';
import { SendOfferEventHandler } from './handlers/sendOffer-event.handler';
import { UpdatePriceEventHandler } from './handlers/updatePrice-event.handler';
import { WithdrawAuctionEventHandler } from './handlers/withdrawAuction-event.handler';
import { MarketplaceEventsService } from './marketplace-events.service';
import { SwapUpdateEventHandler } from './handlers/swapUpdate-event.handler';
import { OffersModuleGraph } from 'src/modules/offers/offers.module';

@Module({
  imports: [
    CommonModule,
    CacheEventsPublisherModule,
    forwardRef(() => CachingModule),
    forwardRef(() => AuctionsModuleGraph),
    forwardRef(() => CampaignsModuleGraph),
    forwardRef(() => OrdersModuleGraph),
    forwardRef(() => NotificationsModuleGraph),
    forwardRef(() => MarketplacesModuleGraph),
    forwardRef(() => MxCommunicationModule),
    forwardRef(() => OffersModuleGraph),
    UsdPriceModuleGraph,
    NftRarityModuleGraph,
    NftScamModule,
  ],
  providers: [
    Logger,
    BuyEventHandler,
    BidEventHandler,
    StartAuctionEventHandler,
    EndAuctionEventHandler,
    WithdrawAuctionEventHandler,
    AcceptGlobalOfferEventHandler,
    SendOfferEventHandler,
    UpdatePriceEventHandler,
    SwapUpdateEventHandler,
    NftEventsConsumer,
    NftEventsService,
    MarketplaceEventsService,
    MinterEventsService,
    RevertEventsConsumer,
    RevertEventsService,
    ElasiticUpdatesConsumer,
    ElasticUpdatesEventsService,
    AssetRarityInfoRedisHandler,
    VerifyContentService,
    NftRarityService,
    NftRarityComputeService,
    FlagNftService,
    RarityUpdaterService,
    AssetByIdentifierService,
    NsfwUpdaterService,
    FeedEventsSenderService,
    UsdPriceService,
  ],
  exports: [NftEventsService],
})
export class NftEventsModule {}
