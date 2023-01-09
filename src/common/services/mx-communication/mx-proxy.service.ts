import { mxConfig } from '../../../config';
import { ProxyNetworkProvider } from '@multiversx/erdjs-network-providers';
import * as Agent from 'agentkeepalive';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MxProxyService {
  private readonly proxy: ProxyNetworkProvider;
  constructor() {
    const keepAliveOptions = {
      maxSockets: mxConfig.keepAliveMaxSockets,
      maxFreeSockets: mxConfig.keepAliveMaxFreeSockets,
      timeout: parseInt(process.env.KEEPALIVE_TIMEOUT_DOWNSTREAM),
      freeSocketTimeout: mxConfig.keepAliveFreeSocketTimeout,
    };
    const httpAgent = new Agent(keepAliveOptions);
    const httpsAgent = new Agent.HttpsAgent(keepAliveOptions);

    this.proxy = new ProxyNetworkProvider(process.env.ELROND_GATEWAY, {
      timeout: parseInt(process.env.KEEPALIVE_TIMEOUT_DOWNSTREAM),
      httpAgent: mxConfig.keepAlive ? httpAgent : null,
      httpsAgent: mxConfig.keepAlive ? httpsAgent : null,
    });
  }

  getService(): ProxyNetworkProvider {
    return this.proxy;
  }
}
