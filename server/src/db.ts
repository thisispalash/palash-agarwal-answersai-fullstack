import mongoose from 'mongoose';

const dbURI = `mongodb://${process.env.MONGODB_HOST ?? '127.0.0.1'}:27017/democluster`;

async function connectDB() {
  try {
    await mongoose.connect(dbURI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
}

export default connectDB;