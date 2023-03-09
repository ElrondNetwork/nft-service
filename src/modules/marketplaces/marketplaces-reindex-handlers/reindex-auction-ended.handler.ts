import { Injectable } from '@nestjs/common';
import { Token } from 'src/common/services/mx-communication/models/Token.model';
import { AuctionStatusEnum } from 'src/modules/auctions/models';
import { OrderStatusEnum } from 'src/modules/orders/models';
import { DateUtils } from 'src/utils/date-utils';
import { MarketplaceReindexState } from '../models/MarketplaceReindexState';
import { AuctionEndedSummary } from '../models/marketplaces-reindex-events-summaries/AuctionEndedSummary';

@Injectable()
export class ReindexAuctionEndedHandler {
  constructor() {}

  handle(
    marketplaceReindexState: MarketplaceReindexState,
    input: AuctionEndedSummary,
    paymentToken: Token,
  ): void {
    const auctionIndex = marketplaceReindexState.getAuctionIndexByNonce(
      input.auctionId,
    );
    const modifiedDate = DateUtils.getUtcDateFromTimestamp(input.timestamp);

    if (auctionIndex === -1) {
      return;
    }

    marketplaceReindexState.auctions[auctionIndex].status =
      AuctionStatusEnum.Ended;
    marketplaceReindexState.auctions[auctionIndex].blockHash =
      marketplaceReindexState.auctions[auctionIndex].blockHash ??
      input.blockHash;
    marketplaceReindexState.auctions[auctionIndex].modifiedDate = modifiedDate;

    const winnerOrderId =
      marketplaceReindexState.setAuctionOrderWinnerStatusAndReturnId(
        marketplaceReindexState.auctions[auctionIndex].id,
        OrderStatusEnum.Bought,
        modifiedDate,
      );

    if (winnerOrderId !== -1) {
      marketplaceReindexState.setInactiveOrdersForAuction(
        marketplaceReindexState.auctions[auctionIndex].id,
        modifiedDate,
        winnerOrderId,
      );
    } else {
      marketplaceReindexState.createBoughtOrderFromEventSummaryAndToken(
        auctionIndex,
        input,
        paymentToken,
      );
    }
  }
}
