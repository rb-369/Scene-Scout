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
  if (!currentUri || currentUri.trim().length === 0) return false;
  // If the URI still contains template placeholders like <db_username> or <password>, it is not configured
  if (currentUri.includes('<') || currentUri.includes('>')) return false;
  if (!currentUri.startsWith('mongodb://') && !currentUri.startsWith('mongodb+srv://')) return false;
  return true;
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!isMongoDBConfigured()) {
    return null;
  }

  const currentUri = process.env.MONGODB_URI!.trim();
  const safeOptions = {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000,
    ...options
  };

  try {
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        client = new MongoClient(currentUri, safeOptions);
        global._mongoClientPromise = client.connect().catch((err) => {
          global._mongoClientPromise = undefined;
          console.warn('[MongoDB] Connection failed, falling back to local storage:', err.message);
          return null as any;
        });
      }
      return await global._mongoClientPromise;
    } else {
      if (!clientPromise) {
        client = new MongoClient(currentUri, safeOptions);
        clientPromise = client.connect().catch((err) => {
          clientPromise = null;
          console.warn('[MongoDB] Connection failed, falling back to local storage:', err.message);
          return null as any;
        });
      }
      return await clientPromise;
    }
  } catch (err: any) {
    console.warn('[MongoDB] Initialization error:', err.message);
    return null;
  }
}

export async function getMongoDb(dbName?: string): Promise<Db | null> {
  try {
    const client = await getMongoClient();
    if (!client) return null;
    const targetDb = dbName || process.env.MONGODB_DB || 'scenescout';
    return client.db(targetDb);
  } catch (err: any) {
    console.warn('[MongoDB] getMongoDb error:', err.message);
    return null;
  }
}
