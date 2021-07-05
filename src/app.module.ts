import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import { ScheduleModule } from '@nestjs/schedule';
import { ServicesModule } from './common/services';
import { GraphQLModule } from '@nestjs/graphql';
import { AccountsModuleDb } from './db/accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'reflect-metadata';
import { TokensModuleGraph } from './modules/tokens/tokens.module';
import { AssetsModuleGraph } from './modules/assets/assets.module';
import { AuctionsModuleGraph } from './modules/auctions/auctions.module';
import { OrdersModuleGraph } from './modules/orders/orders.module';
import { AuctionsModuleDb } from './db/auctions/auctions.module';
import { AccountsModuleGraph } from './modules/accounts/accounts.module';
import { IpfsModule } from './modules/ipfs/ipfs.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-graphql-dataloader';
import { assetAuctionLoader } from './db/auctions/asset-auction.loader';
import { acountAuctionLoader } from './db/auctions/account-auction.loader';
import { auctionOrdersLoader } from './db/orders/auction-orders.loader';
import { accountsLoader } from './db/accounts/accounts.loader';
import { auctionLoaderById } from './db/auctions/auctionLoaderById';
import { RedisModule } from 'nestjs-redis';

const logTransports: Transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike(),
    ),
  }),
];

const logLevel = !!process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'error';

if (!!process.env.LOG_FILE) {
  logTransports.push(
    new winston.transports.File({
      filename: process.env.LOG_FILE,
      dirname: 'logs',
      maxsize: 100000,
      level: logLevel,
    }),
  );
}

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      transports: logTransports,
    }),
    TypeOrmModule.forRoot({}),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      playground: true,
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            error.extensions?.exception?.response?.message || error.message,
        };
        return graphQLFormattedError;
      },
      uploads: {
        maxFileSize: 100000000,
        maxFiles: 5,
      },
      context: {
        assetAuctionLoader: assetAuctionLoader(),
        auctionLoaderById: auctionLoaderById(),
        acountAuctionLoader: acountAuctionLoader(),
        auctionOrdersLoader: auctionOrdersLoader(),
        accountsLoader: accountsLoader(),
      },
    }),
    RedisModule.register([
      {
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        db: 0,
      },
      {
        name: 'auctions',
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        db: 2,
      },
      {
        name: 'orders',
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        db: 3,
      },
      {
        name: 'assets',
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        db: 4,
      },
    ]),
    ScheduleModule.forRoot(),
    ConfigModule,
    TokensModuleGraph,
    AssetsModuleGraph,
    AuctionsModuleGraph,
    OrdersModuleGraph,
    AccountsModuleGraph,
    ServicesModule,
    AuctionsModuleDb,
    AccountsModuleDb,
    IpfsModule,
  ],
})
export class AppModule {}
