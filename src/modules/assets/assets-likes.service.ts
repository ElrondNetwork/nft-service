import { Inject, Injectable } from '@nestjs/common';
import { AssetLikeEntity } from 'src/db/assets/assets-likes.entity';
import { AssetsLikesRepository } from 'src/db/assets/assets-likes.repository';
import '../../utils/extentions';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RedisCacheService } from 'src/common/services/redis-cache.service';
import * as Redis from 'ioredis';
import { generateCacheKeyFromParams } from 'src/utils/generate-cache-key';

@Injectable()
export class AssetsLikesService {
  private redisClient: Redis.Redis;
  constructor(
    private assetsLikesRepository: AssetsLikesRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private redisCacheService: RedisCacheService,
  ) {
    this.redisClient = this.redisCacheService.getClient('assets');
  }

  getAssetLikesCount(identifier: string, nonce: number): Promise<number> {
    try {
      const cacheKey = this.getAssetLikesCountCacheKey(identifier, nonce);
      const getAssetLikes = () =>
        this.assetsLikesRepository.getAssetLikesCount(identifier, nonce);
      return this.redisCacheService.getOrSet(
        this.redisClient,
        cacheKey,
        getAssetLikes,
        300,
      );
    } catch (err) {
      this.logger.error(
        "An error occurred while loading asset's likes count.",
        {
          path: 'AssetsService.getAssetLikesCount',
          identifier,
          nonce,
        },
      );
    }
  }

  getAssetLiked(
    limit: number = 50,
    offset: number,
    address: string,
  ): Promise<[AssetLikeEntity[], number]> {
    try {
      const cacheKey = this.getAssetLikedByCacheKey(address);
      const getAssetLiked = () =>
        this.assetsLikesRepository.getAssetsLiked(limit, offset, address);
      return this.redisCacheService.getOrSet(
        this.redisClient,
        cacheKey,
        getAssetLiked,
        300,
      );
    } catch (err) {
      this.logger.error("An error occurred while loading asset's liked.", {
        path: 'AssetsService.getAssetLiked',
        address,
      });
    }
  }

  isAssetLiked(
    token: string,
    nonce: number,
    address: string,
  ): Promise<boolean> {
    try {
      const cacheKey = this.getAssetLikedCacheKey(token, nonce, address);
      const getIsAssetLiked = () =>
        this.assetsLikesRepository.isAssetLiked(token, nonce, address);
      return this.redisCacheService.getOrSet(
        this.redisClient,
        cacheKey,
        getIsAssetLiked,
        300,
      );
    } catch (err) {
      this.logger.error('An error occurred while checking if asset is liked.', {
        path: 'AssetsService.isAssetLiked',
        token,
        nonce,
        address,
      });
      return Promise.resolve(false);
    }
  }

  async addLike(
    token: string,
    nonce: number,
    address: string,
  ): Promise<boolean> {
    try {
      const assetLike = await this.saveAssetLikeEntity(token, nonce, address);
      this.invalidateCache(token, nonce, address);
      return !!assetLike;
    } catch (err) {
      this.logger.error('An error occurred while adding Asset Like.', {
        path: 'AssetsService.addLike',
        token,
        nonce,
        address,
        err,
      });
      return false;
    }
  }

  async removeLike(
    token: string,
    nonce: number,
    address: string,
  ): Promise<any> {
    try {
      await this.assetsLikesRepository.removeLike(token, nonce, address);
      await this.invalidateCache(token, nonce, address);
      return true;
    } catch (err) {
      this.logger.error('An error occurred while removing Asset Like.', {
        path: 'AssetsService.removeLike',
        token,
        nonce,
        address,
        err,
      });
      return false;
    }
  }

  private getAssetLikesCountCacheKey(token: string, nonce: number) {
    return generateCacheKeyFromParams('assetLikesCount', token, nonce);
  }

  private getAssetLikedByCacheKey(filters) {
    return generateCacheKeyFromParams('assetLiked', filters);
  }

  private async invalidateCache(
    token: string,
    nonce: number,
    address: string,
  ): Promise<void> {
    await this.invalidateAssetLikeCache(token, nonce, address);
    await this.invalidateAssetLikedByCount(address);
    await this.invalidateAssetLikesCount(token, nonce);
  }

  private invalidateAssetLikedByCount(address: string): Promise<void> {
    const cacheKey = this.getAssetLikedByCacheKey(address);
    return this.redisCacheService.del(this.redisClient, cacheKey);
  }

  private invalidateAssetLikesCount(
    token: string,
    nonce: number,
  ): Promise<void> {
    const cacheKey = this.getAssetLikesCountCacheKey(token, nonce);
    return this.redisCacheService.del(this.redisClient, cacheKey);
  }

  private invalidateAssetLikeCache(
    token: string,
    nonce: number,
    address: string,
  ): Promise<void> {
    const cacheKey = this.getAssetLikedCacheKey(token, nonce, address);
    return this.redisCacheService.del(this.redisClient, cacheKey);
  }

  private getAssetLikedCacheKey(token: string, nonce: number, address: string) {
    return generateCacheKeyFromParams('isAssetLiked', token, nonce, address);
  }

  private saveAssetLikeEntity(
    token: string,
    nonce: number,
    address: string,
  ): Promise<any> {
    const assetLikeEntity = this.buildAssetLikeEntity(token, nonce, address);
    return this.assetsLikesRepository.addLike(assetLikeEntity);
  }

  private buildAssetLikeEntity(
    token: string,
    nonce: number,
    address: string,
  ): AssetLikeEntity {
    return new AssetLikeEntity({
      token,
      nonce,
      address,
    });
  }
}
