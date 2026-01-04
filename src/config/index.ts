import mongoose from 'mongoose';
import { MONGODB_URI } from '../database/mongodb';

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');
  } catch (error) {
    console.error('Error Connecting To MongoDB', error);
    process.exit(1);
  }
}
