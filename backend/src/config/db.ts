import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Connect to MongoDB (Mongoose). Call once at startup.
 */
export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  console.log(`[db] connected to ${env.mongoUri}`);
}
