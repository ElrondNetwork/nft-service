import { CollectionAssetApi } from './collection.dto';

export interface Nft {
  collection: string;
  identifier: string;
  name: string;
  type: string;
  owner: string;
  minted: string;
  burnt: string;
  decimals: number;
  isPaused: boolean;
  canUpgrade: boolean;
  canMint: boolean;
  canBurn: boolean;
  canChangeOwner: boolean;
  canPause: boolean;
  canFreeze: boolean;
  canWipe: boolean;
  canAddSpecialRoles: boolean;
  canTransferNFTCreateRole: boolean;
  isWhitelistedStorage: boolean;
  isNsfw: boolean;
  wiped: string;
  attributes: string;
  balance: string;
  supply: string;
  creator: string;
  hash: string;
  nonce: number;
  royalties: string;
  timestamp: number;
  uris: string[];
  tags: string[];
  metadata: NftMetadata;
  media: NftMedia[];
  scamInfo: NftScamInfo;
  assets: CollectionAssetApi;
  // todo map
  rank_custom: number;
  score_openRarity: number;
  rank_openRarity: number;
  score_jaccardDistances: number;
  rank_jaccardDistances: number;
  score_trait: number;
  rank_trait: number;
  score_statistical: number;
  rank_statistical: number;
}

export interface NftMedia {
  url: string;
  originalUrl: string;
  thumbnailUrl: string;
  fileType: string;
  fileSize;
}

export interface NftScamInfo {
  type: string;
  info: string;
}

export interface NftTag {
  tag: string;
  count: number;
}

export interface NftMetadata {
  description: string;
  attributes: [{ [key: string]: string }];
}

export interface NftRarity {
  rank: number;
  score: number;
}
