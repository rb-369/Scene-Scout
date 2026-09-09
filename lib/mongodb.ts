import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoDBConfigured(): boolean {
  const currentUri = process.env.MONGODB_URI || '';
  return Boolean(currentUri && currentUri.trim().length > 0);
}

export async function getMongoClient(): Promise<MongoClient | null> {
  const currentUri = process.env.MONGODB_URI || '';
  if (!currentUri || currentUri.trim().length === 0) {
    return null;
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(currentUri, options);
      global._mongoClientPromise = client.connect().catch((err) => {
        global._mongoClientPromise = undefined;
        throw err;
      });
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(currentUri, options);
      clientPromise = client.connect().catch((err) => {
        clientPromise = null;
        throw err;
      });
    }
    return clientPromise;
  }
}

export async function getMongoDb(dbName?: string): Promise<Db | null> {
  const client = await getMongoClient();
  if (!client) return null;
  const targetDb = dbName || process.env.MONGODB_DB || 'scenescout';
  return client.db(targetDb);
}
