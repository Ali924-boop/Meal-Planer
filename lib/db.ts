import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env');

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (process.env.NODE_ENV !== 'production') global.mongoose = cached;

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // <-- Add ! to assert non-null
    cached.promise = mongoose.connect(MONGODB_URI!).then(m => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
