import { AccountsStatsService } from '../accounts-stats.service';
import { Test, TestingModule } from '@nestjs/testing';
import { MxApiService } from 'src/common';
import { AccountStatsEntity } from 'src/db/account-stats/account-stats';
import { PersistenceService } from 'src/common/persistence/persistence.service';
import { Logger } from '@nestjs/common';
import { CollectionsGetterService } from 'src/modules/nftCollections/collections-getter.service';
import { MarketplacesService } from 'src/modules/marketplaces/marketplaces.service';
import { OffersService } from 'src/modules/offers/offers.service';
import { UsdPriceService } from 'src/modules/usdPrice/usd-price.service';
import { AccountsStatsCachingService } from '../accounts-stats.caching.service';
import { CacheInfo } from 'src/common/services/caching/entities/cache.info';

describe('AccountsStatsService', () => {
  let service: AccountsStatsService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        AccountsStatsService,
        {
          provide: PersistenceService,
          useValue: {},
        },
        {
          provide: CollectionsGetterService,
          useFactory: () => ({}),
        },
        {
          provide: MxApiService,
          useValue: {
            getNftsCountForCollection: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn().mockImplementation(() => {}),
          },
        },
        {
          provide: AccountsStatsCachingService,
          useValue: {
            getStatsForOwner: jest.fn(),
            getPublicStats: jest.fn(),
            getClaimableCount: jest.fn(),
            getCollectedCount: jest.fn(),
            getCollectionsCount: jest.fn(),
            getArtistCreationsInfo: jest.fn(),
          },
        },
        {
          provide: MarketplacesService,
          useValue: {
            getCollectionsByMarketplace: jest.fn(),
          },
        },
        {
          provide: UsdPriceService,
          useValue: {
            getOrSet: jest.fn(),
          },
        },
        {
          provide: OffersService,
          useValue: {
            getOrSet: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountsStatsService>(AccountsStatsService);
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStats', () => {
    it('should return the public account stats when isOwner is false and call with correct args', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      const stub = jest.spyOn(accountsStatsCachingService, 'getPublicStats').mockImplementation(() =>
        Promise.resolve(
          new AccountStatsEntity({
            address: 'erd1dc3yzxxeq69wvf583gw0h67td226gu2ahpk3k50qdgzzym8npltq7ndgha',
            auctions: '2',
            biddingBalance: '0',
            orders: '0',
          }),
        ),
      );
      const expected = new AccountStatsEntity({
        address: 'erd1dc3yzxxeq69wvf583gw0h67td226gu2ahpk3k50qdgzzym8npltq7ndgha',
        auctions: '2',
        biddingBalance: '0',
        orders: '0',
      });
      const results = await service.getStats('erd1dc3yzxxeq69wvf583gw0h67td226gu2ahpk3k50qdgzzym8npltq7ndgha', false);

      expect(stub).toBeCalledWith('erd1dc3yzxxeq69wvf583gw0h67td226gu2ahpk3k50qdgzzym8npltq7ndgha', expect.anything());
      expect(results).toMatchObject(expected);
    });

    it('should return the owner account stats when isOwner is true and call with correct args', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      const stub = jest.spyOn(accountsStatsCachingService, 'getStatsForOwner').mockImplementation(() =>
        Promise.resolve(
          new AccountStatsEntity({
            address: 'erd1dc3yzxxeq69wvf583gw0h67td226gu2ahpk3k50qdgzzym8npltq7ndgha',
            auctions: '3',
            biddingBalance: '0',
            orders: '0',
          }),
        ),
      );
      const expected = new AccountStatsEntity({
        address: 'erd1dc3yzxxeq69wvf583gw0h67td226gu2ahpk3k50qdgzzym8npltq7ndgha',
        auctions: '3',
        biddingBalance: '0',
        orders: '0',
      });
      const results = await service.getStats('erd1dc3yzxxeq69wvf583gw0h67td226gu2ahpk3k50qdgzzym8npltq7ndgha', true);
      expect(stub).toBeCalledWith('erd1dc3yzxxeq69wvf583gw0h67td226gu2ahpk3k50qdgzzym8npltq7ndgha', expect.anything());
      expect(results).toMatchObject(expected);
    });

    it('when filter by owner and returns error returns empty object', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      jest.spyOn(accountsStatsCachingService, 'getStatsForOwner').mockImplementation(() => {
        throw new Error();
      });

      const results = await service.getStats('erd1dc3yzxxeq69wvf583gw0h67td226gu2ahpk3k50qdgzzym8npltq7ndgha', true);
      expect(results).toMatchObject(new AccountStatsEntity());
    });

    it('when not owner and returns error returns empty object', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      jest.spyOn(accountsStatsCachingService, 'getPublicStats').mockImplementation(() => {
        throw new Error();
      });

      const results = await service.getStats('erd1dc3yzxxeq69wvf583gw0h67td226gu2ahpk3k50qdgzzym8npltq7ndgha', false);
      expect(results).toMatchObject(new AccountStatsEntity());
    });
  });

  describe('getClaimableCount', () => {
    it('should return total claimable count and call with right params', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      const stub = jest.spyOn(accountsStatsCachingService, 'getClaimableCount').mockImplementation(() => Promise.resolve(4));

      const results = await service.getClaimableCount('address');

      expect(stub).toBeCalledWith('address', expect.anything());
      expect(results).toStrictEqual(4);
    });

    it('should return total claimable count and call with only address for key', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      const stub = jest.spyOn(accountsStatsCachingService, 'getClaimableCount').mockImplementation(() => Promise.resolve(4));

      const results = await service.getClaimableCount('address', 'marketplace');

      expect(stub).toBeCalledWith('address_marketplace', expect.anything());
      expect(results).toStrictEqual(4);
    });

    it('when error occurs returns 0', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      jest.spyOn(accountsStatsCachingService, 'getClaimableCount').mockImplementation(() => {
        throw new Error();
      });

      const results = await service.getClaimableCount('address');
      expect(results).toStrictEqual(0);
    });
  });

  describe('getCollectedCount', () => {
    it('when search by address return total collected nfts and cacheService is called with right args', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      const getCollectedCountStub = jest
        .spyOn(accountsStatsCachingService, 'getCollectedCount')
        .mockImplementation(() => Promise.resolve(4));

      const results = await service.getCollectedCount('address');

      expect(getCollectedCountStub).toBeCalledWith('address', expect.anything());
      expect(results).toStrictEqual(4);
    });

    it('when search by address should return total collected nfts count', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      const getCollectedStub = jest.spyOn(accountsStatsCachingService, 'getCollectedCount').mockImplementation(() => Promise.resolve(4));
      const marketplaceService = module.get<MarketplacesService>(MarketplacesService);
      const getCollectionsStub = jest
        .spyOn(marketplaceService, 'getCollectionsByMarketplace')
        .mockImplementation(() => Promise.resolve(['string']));

      const results = await service.getCollectedCount('address', 'marketplace');

      expect(getCollectedStub).toBeCalledWith('address', expect.anything());
      expect(getCollectionsStub).toBeCalledWith('marketplace');
      expect(results).toStrictEqual(4);
    });

    it('when error on search without marketplace occurs returns 0', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      jest.spyOn(accountsStatsCachingService, 'getCollectedCount').mockImplementation(() => {
        throw new Error();
      });

      const results = await service.getCollectedCount('address');
      expect(results).toStrictEqual(0);
    });

    it('when error on search with marketplace occurs returns 0', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      jest.spyOn(accountsStatsCachingService, 'getCollectedCount').mockImplementation(() => {
        throw new Error();
      });

      const results = await service.getCollectedCount('address', 'marketplace');
      expect(results).toStrictEqual(0);
    });
  });

  describe('getCollectionsCount', () => {
    it('should return total collections count', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      const getCollectionsCountStub = jest
        .spyOn(accountsStatsCachingService, 'getCollectionsCount')
        .mockImplementation(() => Promise.resolve(2));

      const results = await service.getCollectionsCount('address');

      expect(getCollectionsCountStub).toBeCalledWith('address', expect.anything());
      expect(results).toStrictEqual(2);
    });

    it('when error on search without marketplace occurs returns 0', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      jest.spyOn(accountsStatsCachingService, 'getCollectionsCount').mockImplementation(() => {
        throw new Error();
      });

      const results = await service.getCollectionsCount('address');
      expect(results).toStrictEqual(0);
    });
  });

  describe('getCreationsCount', () => {
    it('should return total created nfts count', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      const getCreationsCountStub = jest
        .spyOn(accountsStatsCachingService, 'getArtistCreationsInfo')
        .mockImplementation(() => Promise.resolve({ artist: 'string', nfts: 0, collections: ['collections'] }));
      const results = await service.getArtistCreationsInfo('address');

      expect(getCreationsCountStub).toBeCalledWith('address', expect.anything());
      expect(results).toMatchObject({ artist: 'string', nfts: 0, collections: ['collections'] });
    });

    it('when error on search without marketplace occurs returns 0', async () => {
      const accountsStatsCachingService = module.get<AccountsStatsCachingService>(AccountsStatsCachingService);
      jest.spyOn(accountsStatsCachingService, 'getArtistCreationsInfo').mockImplementation(() => {
        throw new Error();
      });

      const results = await service.getArtistCreationsInfo('address');

      expect(results).toBeNull();
    });
  });
});
