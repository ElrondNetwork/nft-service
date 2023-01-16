import { BinaryUtils } from '@elrondnetwork/erdnest';
import { Injectable, Logger } from '@nestjs/common';
import { Token } from 'src/common/services/mx-communication/models/Token.model';
import { AuctionEntity } from 'src/db/auctions';
import { ExternalAuctionEventEnum } from 'src/modules/assets/models';
import {
  AuctionsGetterService,
  AuctionsSetterService,
} from 'src/modules/auctions';
import { MarketplacesService } from 'src/modules/marketplaces/marketplaces.service';
import { MarketplaceTypeEnum } from 'src/modules/marketplaces/models/MarketplaceType.enum';
import { UsdPriceService } from 'src/modules/usdPrice/usd-price.service';
import { BigNumberUtils } from 'src/utils/bigNumber-utils';
import { UpdateListingEvent } from '../../entities/auction/updateListing.event';

@Injectable()
export class UpdateListingEventHandler {
  private readonly logger = new Logger(UpdateListingEventHandler.name);
  constructor(
    private auctionsGetterService: AuctionsGetterService,
    private auctionsService: AuctionsSetterService,
    private readonly marketplaceService: MarketplacesService,
    private usdPriceService: UsdPriceService,
  ) {}

  async handle(event: any, hash: string, marketplaceType: MarketplaceTypeEnum) {
    const updateListingEvent = new UpdateListingEvent(event);
    const topics = updateListingEvent.getTopics();
    const marketplace = await this.marketplaceService.getMarketplaceByType(
      updateListingEvent.getAddress(),
      marketplaceType,
      topics.collection,
    );
    this.logger.log(
      `Update listing event detected for hash '${hash}' and marketplace '${marketplace?.name}'`,
    );
    let auction = await this.auctionsGetterService.getAuctionByIdAndMarketplace(
      parseInt(topics.auctionId, 16),
      marketplace.key,
    );

    if (auction && marketplace) {
      const paymentToken = await this.usdPriceService.getToken(
        auction.paymentToken,
      );

      this.updateAuctionListing(auction, updateListingEvent, paymentToken);

      this.auctionsService.updateAuction(
        auction,
        ExternalAuctionEventEnum.UpdateListing,
      );
    }
  }

  private updateAuctionListing(
    auction: AuctionEntity,
    event: UpdateListingEvent,
    paymentToken: Token,
  ) {
    const eventTopics = event.getTopics();

    if (eventTopics.newBid) {
      auction.minBid = eventTopics.newBid;
      auction.minBidDenominated = BigNumberUtils.denominateAmount(
        eventTopics.newBid,
        paymentToken.decimals,
      );
    }

    if (eventTopics.deadline) {
      auction.endDate = eventTopics.deadline;
    }

    if (eventTopics.paymentToken) {
      auction.paymentToken = eventTopics.paymentToken;
      auction.paymentNonce = BinaryUtils.hexToNumber(
        eventTopics.paymentTokenNonce,
      );
    }
  }
}
