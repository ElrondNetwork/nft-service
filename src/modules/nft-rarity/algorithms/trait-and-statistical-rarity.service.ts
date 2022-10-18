import { Injectable } from '@nestjs/common';
import { NftRarityData } from '../models/nft-rarity-data.model';
import { RarityAlgorithmsEnum } from '../models/rarity-algortihms.enum';

// https://github.com/xterr/nft-generator/blob/d8992d2bcfa729a6b2ef443f9404ffa28102111b/src/components/RarityResolver.ts

@Injectable()
export class TraitAndStatisticalRarityService {
  async computeTraitAndStatisticalRarities(
    nfts: NftRarityData[],
    dnaSummary: { [key: string]: { [key: string]: { [key: string]: number } } },
    algorithms: RarityAlgorithmsEnum[],
  ): Promise<{ [key: string]: { [key: string]: number } }> {
    let rarities = [];
    for (const nft of nfts) {
      if (algorithms.includes(RarityAlgorithmsEnum.TraitRarity)) {
        rarities[nft.nonce] = {
          ...rarities[nft.nonce],
          traitAvgRarity: 0,
          traitScore: 0,
          traitScoreNormed: 0,
        };
      }
      if (algorithms.includes(RarityAlgorithmsEnum.StatisticalRarity)) {
        rarities[nft.nonce] = { ...rarities[nft.nonce], statisticalScore: 1 };
      }

      for (let traitKey = 0; traitKey < nft.DNA.length; traitKey++) {
        const attributeKey = nft.DNA[traitKey];

        if (algorithms.includes(RarityAlgorithmsEnum.TraitRarity)) {
          rarities[nft.nonce].traitAvgRarity +=
            dnaSummary[traitKey][attributeKey].frequency;
          rarities[nft.nonce].traitScore +=
            dnaSummary[traitKey][attributeKey].rarity;
          rarities[nft.nonce].traitScoreNormed +=
            dnaSummary[traitKey][attributeKey].rarityNormed;
        }

        if (algorithms.includes(RarityAlgorithmsEnum.StatisticalRarity)) {
          rarities[nft.nonce].statisticalScore *=
            dnaSummary[traitKey][attributeKey].frequency;
        }
      }

      rarities[nft.nonce].traitAvgRarity /= nft.DNA.length;
    }

    let raritiesObj = {};

    if (algorithms.includes(RarityAlgorithmsEnum.TraitRarity)) {
      const raritiesSortAsc = [...rarities].sort(function (a, b) {
        return a.traitScore - b.traitScore;
      });
      for (let i = 0; i < nfts.length; i++) {
        const nonce = nfts[i].nonce;
        raritiesObj[nonce] = { ...rarities[nonce], ...raritiesObj[nonce] };
        raritiesObj[nonce].traitRank =
          nfts.length - raritiesSortAsc.indexOf(rarities[nonce]);
      }
    }

    if (algorithms.includes(RarityAlgorithmsEnum.StatisticalRarity)) {
      const raritiesSortAsc = [...rarities].sort(function (a, b) {
        return b.statisticalScore - a.statisticalScore;
      });
      for (let i = 0; i < nfts.length; i++) {
        const nonce = nfts[i].nonce;
        raritiesObj[nonce] = { ...rarities[nonce], ...raritiesObj[nonce] };
        raritiesObj[nonce].statisticalRank =
          nfts.length - raritiesSortAsc.indexOf(rarities[nonce]);
      }
    }

    return raritiesObj;
  }
}
