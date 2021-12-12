import {
  createAdminClient,
  createProducer,
  Topics,
} from '@jong_ecommerce/common';
import { Producer, Admin } from 'kafkajs';

interface TopicCreation {
  topic: Topics;
  numPartitions: number;
  replicationFactor: number;
}

class ProducerSingleton {
  private _producer?: Producer;
  private _adminClient?: Admin;

  public get producer() {
    if (!this._producer) {
      throw new Error('initialize connection first');
    }
    return this._producer;
  }
  public get adminClient() {
    if (!this._adminClient) {
      throw new Error('initialize connection first');
    }
    return this._adminClient;
  }

  async createTopic(tc: TopicCreation[]) {
    await this.adminClient.connect();
    await this.adminClient.createTopics({
      // topics: [{ topic, numPartitions, replicationFactor }],
      topics: tc,
    });
    console.log('created ', tc);
    await this.adminClient.disconnect();
  }

  create(
    producerId: string,
    adminId: string,
    producerBrokerList: string[],
    adminBrokerList: string[]
  ) {
    this._producer = createProducer(producerId, producerBrokerList);
    this._adminClient = createAdminClient(adminId, adminBrokerList);
    // return new Promise<void>((resolve, reject) => {
    //   try {
    //     this._producer = createProducer(producerId, producerBrokerList);
    //     this._adminClient = createAdminClient(adminId, adminBrokerList);
    //     resolve();
    //   } catch (err) {
    //     reject(err);
    //   }
    // });
  }
}

export const producerSingleton = new ProducerSingleton();
