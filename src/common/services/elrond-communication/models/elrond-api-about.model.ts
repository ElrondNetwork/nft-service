export class ElrondApiAbout {
  appVersion: string;
  pluginsVersion: string;
  network: string;
  cluster: string;
  version: string;
  scamEngineVersion: string;

  constructor(init?: Partial<ElrondApiAbout>) {
    Object.assign(this, init);
  }
}
