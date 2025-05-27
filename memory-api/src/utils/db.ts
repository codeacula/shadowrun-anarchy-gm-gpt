import mongoose from 'mongoose';
import config from '../config';

async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

export default connectToDatabase;