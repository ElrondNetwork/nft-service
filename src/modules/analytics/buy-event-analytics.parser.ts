import { Injectable } from '@nestjs/common';
import { AuctionEntity } from 'src/db/auctions';
import {
  ElrondNftsSwapAuctionEventEnum,
  ExternalAuctionEventEnum,
} from 'src/modules/assets/models';
import { AuctionsGetterService } from 'src/modules/auctions';
import { MarketplacesService } from 'src/modules/marketplaces/marketplaces.service';
import { BuySftEvent } from 'src/modules/rabbitmq/entities/auction';
import { ClaimEvent } from 'src/modules/rabbitmq/entities/auction/claim.event';
import { ElrondSwapBuyEvent } from 'src/modules/rabbitmq/entities/auction/elrondnftswap/elrondswap-buy.event';
import { UsdPriceService } from 'src/modules/usdPrice/usd-price.service';
import { BigNumberUtils } from 'src/utils/bigNumber-utils';
import { computeUsd } from 'src/utils/helpers';

@Injectable()
export class BuyEventAnalyticsParser {
  constructor(
    private auctionsGetterService: AuctionsGetterService,
    private readonly marketplaceService: MarketplacesService,
    private readonly usdPriceService: UsdPriceService,
  ) {}

  async handle(event: any, timestamp: number) {
    const { buySftEvent, topics } = this.getEventAndTopics(event);
    let auction: AuctionEntity;

    const marketplace = await this.marketplaceService.getMarketplaceByAddress(
      buySftEvent.getAddress(),
    );

    if (!marketplace) return;

    if (topics.auctionId) {
      auction = await this.auctionsGetterService.getAuctionByIdAndMarketplace(
        parseInt(topics.auctionId, 16),
        marketplace.key,
      );
    } else {
      const auctionIdentifier = `${topics.collection}-${topics.nonce}`;
      auction =
        await this.auctionsGetterService.getAuctionByIdentifierAndMarketplace(
          auctionIdentifier,
          marketplace.key,
        );
    }
    if (!auction) return;

    const tokenData = await this.usdPriceService.getToken(auction.paymentToken);
    const tokenPrice = await this.usdPriceService.getTokenPriceFromDate(
      auction.paymentToken,
      timestamp,
    );

    const volume = topics.bid === '0' ? auction.minBid : topics.bid;

    const data = [];
    data[topics.collection] = {
      usdPrice: tokenPrice,
      volume: BigNumberUtils.denominateAmount(volume, tokenData?.decimals),
      volumeUSD:
        volume === '0' || !tokenPrice
          ? '0'
          : computeUsd(
              tokenPrice.toString(),
              volume,
              tokenData?.decimals,
            ).toFixed(),
      paymentToken: tokenData?.identifier,
      marketplaceKey: marketplace.key,
    };
    return data;
  }

  private getEventAndTopics(event: any) {
    if (event.identifier === ElrondNftsSwapAuctionEventEnum.Purchase) {
      if (
        Buffer.from(event.topics[0], 'base64').toString() ===
        ElrondNftsSwapAuctionEventEnum.UpdateListing
      ) {
        return;
      }
      const buySftEvent = new ElrondSwapBuyEvent(event);
      const topics = buySftEvent.getTopics();
      return { buySftEvent, topics };
    }

    if (event.identifier === ExternalAuctionEventEnum.BuyNft) {
      const buySftEvent = new ClaimEvent(event);
      const topics = buySftEvent.getTopics();
      return { buySftEvent, topics };
    }
    const buySftEvent = new BuySftEvent(event);
    const topics = buySftEvent.getTopics();
    return { buySftEvent, topics };
  }
}
