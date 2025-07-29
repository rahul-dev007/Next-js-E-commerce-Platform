// src/lib/db.js

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    // এখানে নামটি ঠিক করা হয়েছে
    await mongoose.connect(process.env.MONGODB_URI); // <-- সঠিক নাম
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB.");
  }
};

export default connectDB;