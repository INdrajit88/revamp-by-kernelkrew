import { Db, MongoClient, MongoClientOptions } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

interface CachedConnection {
  conn: DbConnection | null;
  promise: Promise<DbConnection> | null;
}

interface DbConnection {
  client: MongoClient;
  db: Db;
}

declare global {
  var mongo: CachedConnection | undefined;
}

let cached = global.mongo as CachedConnection;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<DbConnection> {
  if (!cached.promise) {
    const opts: MongoClientOptions = {};

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(),
      };
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
