import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(collection: string): Collection {
    return this.client.db().collection(collection);
  },

  map<Model>(data: any): Model {
    const { _id, ...collectionWithoutId } = data;
    return { id: _id, ...collectionWithoutId };
  },
};
