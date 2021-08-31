import { Account } from './models/Account.dto';
import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { AccountsService } from './accounts.service';
import { FollowEntityArgs, UnfollowEntityArgs } from './CreateAccountArgs';
import { connectionFromArraySlice } from 'graphql-relay';
import ConnectionArgs from '../ConnectionArgs';
import AccountResponse from './models/AccountResponse';
import { User } from '../user';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private accountsService: AccountsService) {}

  @Mutation(() => Boolean)
  async follow(
    @Args('input') input: FollowEntityArgs,
    @User() user: any,
  ): Promise<boolean> {
    return this.accountsService.follow(user.publicKey, input.addressToFollow);
  }

  @Mutation(() => Boolean)
  async unfollow(
    @Args('input') input: UnfollowEntityArgs,
    @User() user: any,
  ): Promise<boolean> {
    return this.accountsService.unfollow(
      user.publicKey,
      input.addressToUnfollow,
    );
  }

  @Query(() => AccountResponse)
  async followers(
    @Args({ name: 'address', type: () => String, nullable: true })
    address,
    @Args({ name: 'pagination', type: () => ConnectionArgs, nullable: true })
    pagination: ConnectionArgs,
  ): Promise<AccountResponse> {
    const { limit, offset } = pagination.pagingParams();
    const [followers, count] = await this.accountsService.getFollowers(address);
    const page = connectionFromArraySlice(followers, pagination, {
      arrayLength: count,
      sliceStart: offset || 0,
    });
    return {
      edges: page.edges,
      pageInfo: page.pageInfo,
      pageData: { count, limit, offset },
    };
  }

  @Query(() => AccountResponse)
  async following(
    @Args({ name: 'address', type: () => String, nullable: true })
    address,
    @Args({ name: 'pagination', type: () => ConnectionArgs, nullable: true })
    pagination: ConnectionArgs,
  ): Promise<AccountResponse> {
    const { limit, offset } = pagination.pagingParams();
    const [accounts, count] = await this.accountsService.getFollowing(address);
    const page = connectionFromArraySlice(accounts, pagination, {
      arrayLength: count,
      sliceStart: offset || 0,
    });
    return {
      edges: page.edges,
      pageInfo: page.pageInfo,
      pageData: { count, limit, offset },
    };
  }
}
