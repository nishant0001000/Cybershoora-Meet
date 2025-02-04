import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable for database connection');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, Promise:null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn; // If connection is cached, return the cached connection
  }
  
  if (!cached.Promise) {
    const options = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    };

    cached.Promise = mongoose.connect(MONGODB_URI, options).then((mongooseInstance) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.Promise; // Wait for the connection to resolve
  } catch (error) {
    cached.Promise = null;
    throw error; // If an error occurs during the connection, throw it
  }

  return cached.conn; // Return the database connection
}

export default dbConnect;
