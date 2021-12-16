import nats, { Stan, StanOptions } from 'node-nats-streaming';

class NatsConnector {
  private _client?: Stan;

  public get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connection !');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, options?: StanOptions) {
    this._client = nats.connect(clusterId, clientId, options);

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to Nats');
        resolve();
      });
      this.client.on('error', (err: any) => {
        reject(err);
      });
    });
  }
}

//exporting just a single instance
export const natsConnector = new NatsConnector();
