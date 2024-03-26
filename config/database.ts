import mongoose from 'mongoose';
import 'dotenv/config';

export const mongooseConnect = async () => {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error('Database connection string is not provided!');
  }

  try {
    await mongoose.connect(connectionString);
    console.log(`Successfully connected to the database!`);
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
};
