import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url);
    this.uri = url;
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection(collection: string): Promise<Collection> {
    if (this.client === null) await this.connect(this.uri);
    return this.client.db().collection(collection);
  },

  map<Model>(data: any): Model {
    const { _id, ...collectionWithoutId } = data;
    return { id: _id, ...collectionWithoutId };
  },
};
