import { ID, ObjectType, Field } from '@nestjs/graphql';
@ObjectType()
export class TransactionNode {
  @Field()
  nonce: number;
  @Field()
  value: string;
  @Field()
  sender: string;
  @Field()
  receiver: string;
  @Field()
  gasPrice: number;
  @Field()
  gasLimit: number;
  @Field()
  data: string;
  @Field()
  chainID: string;
  @Field()
  version: number;
  @Field()
  options: string;
  @Field()
  status: string;
}
