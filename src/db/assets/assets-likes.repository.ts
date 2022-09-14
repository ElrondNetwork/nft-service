import { MYSQL_ALREADY_EXISTS } from 'src/utils/constants';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { AssetLikeEntity } from './assets-likes.entity';

@EntityRepository(AssetLikeEntity)
export class AssetsLikesRepository extends Repository<AssetLikeEntity> {
  async getAssetsLiked(
    limit: number = 20,
    offset: number = 0,
    address: string,
  ): Promise<[AssetLikeEntity[], number]> {
    const assetsLiked = await this.createQueryBuilder('assetsLiked')
      .where({
        address: address,
      })
      .skip(offset)
      .take(limit)
      .getManyAndCount();
    return assetsLiked;
  }

  async isAssetLiked(identifier: string, address: string): Promise<boolean> {
    const count = await this.count({
      where: {
        identifier,
        address,
      },
    });

    return count > 0;
  }

  async getAssetLikesCount(identifier: string): Promise<number> {
    return await this.count({
      where: {
        identifier,
      },
    });
  }

  async getBulkAssetLikesCount(identifiers: string[]): Promise<any> {
    return await this.createQueryBuilder('al')
      .select('al.identifier as identifier')
      .addSelect('COUNT(al.identifier) as likesCount')
      .where(`al.identifier IN(${identifiers.map((value) => `'${value}'`)})`, {
        identifiers: identifiers,
      })
      .groupBy('al.identifier')
      .execute();
  }

  async getIsLikedAsset(identifiers: string[]): Promise<any> {
    return await this.createQueryBuilder('al')
      .select('CONCAT(al.identifier,"_",al.address) as identifier')
      .addSelect('true as liked')
      .where(
        `al.identifier IN(${identifiers.map(
          (value) => `'${value.split('_')[0]}'`,
        )})`,
        {
          identifiers: identifiers,
        },
      )
      .andWhere(`al.address = '${identifiers[0].split('_')[1]}'`)
      .groupBy('al.identifier, al.address')
      .execute();
  }

  async addLike(assetLikeEntity: AssetLikeEntity): Promise<AssetLikeEntity> {
    try {
      return await this.save(assetLikeEntity);
    } catch (err) {
      // If like already exists, we ignore the error.
      if (err.errno === MYSQL_ALREADY_EXISTS) {
        return null;
      }
      throw err;
    }
  }

  async removeLike(identifier: string, address: string): Promise<DeleteResult> {
    return await this.delete({
      identifier,
      address,
    });
  }
}
