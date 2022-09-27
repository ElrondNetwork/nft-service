import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { BaseResolver } from '../common/base.resolver';
import { Price } from '../assets/models';
import { UsdPriceService } from './loaders/usd-price.service';
import { Token } from 'src/common/services/elrond-communication/models/Token.model';

@Resolver(() => Price)
export class UsdAmountResolver extends BaseResolver(Price) {
  constructor(private readonly UsdPriceService: UsdPriceService) {
    super();
  }

  @ResolveField(() => String)
  async usdAmount(@Parent() price: Price) {
    return this.UsdPriceService.getUsdAmountDenom(price.token, price.amount);
  }

  @ResolveField(() => Token)
  async tokenData(@Parent() price: Price) {
    return this.UsdPriceService.getToken(price.token);
  }
}
