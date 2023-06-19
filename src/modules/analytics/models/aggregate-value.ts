import { Field, Float, ObjectType } from '@nestjs/graphql';
import * as moment from 'moment';

@ObjectType()
export class AggregateValue {
  @Field(() => String, { nullable: true })
  time?: string;

  @Field({ nullable: true })
  series: string;

  @Field(() => Float, { nullable: true })
  min?: number;

  @Field(() => Float, { nullable: true })
  max?: number;

  @Field(() => Float, { nullable: true })
  count?: number;

  @Field(() => Float, { nullable: true })
  value?: number;

  @Field(() => Float, { nullable: true })
  avg?: number;

  constructor(init?: Partial<AggregateValue>) {
    Object.assign(this, init);
  }

  static fromDataApi(row: any) {
    return new AggregateValue({
      series: row.series,
      time: moment.utc(row.timestamp ?? row.time).format('yyyy-MM-DD HH:mm:ss'),
      min: row.min ?? 0,
      max: row.max ?? 0,
      count: row.count ?? 0,
      value: row.sum ?? 0,
      avg: row.avg ?? 0,
    });
  }
}
