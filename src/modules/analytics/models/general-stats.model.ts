import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AnalyticsAggregateValue } from './analytics-aggregate-value';

@ObjectType()
export class GeneralAnalyticsModel {
  @Field(() => Int)
  holders: number;
  @Field(() => Int)
  marketplaces: number;
  @Field(() => Int)
  collections: number;
  @Field(() => [AnalyticsAggregateValue])
  nfts: AnalyticsAggregateValue[];
  @Field(() => [AnalyticsAggregateValue])
  volume: AnalyticsAggregateValue[];
  @Field(() => [AnalyticsAggregateValue])
  listing: AnalyticsAggregateValue[];

  constructor(init?: Partial<GeneralAnalyticsModel>) {
    Object.assign(this, init);
  }
}
