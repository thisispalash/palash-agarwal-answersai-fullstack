import mongoose from 'mongoose';

const dbURI = 'mongodb://localhost:27017/democluster';

async function connectDB() {
  try {
    await mongoose.connect(dbURI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
}

export default connectDB;