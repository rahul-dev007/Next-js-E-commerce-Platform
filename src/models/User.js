import mongoose, { Schema, models } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      default: '', 
    },
    // role ফিল্ডটি আমাদের নতুন সিস্টেম অনুযায়ী আপডেট করা হয়েছে
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'user'], // এখন তিনটি সম্ভাব্য Role আছে
      default: 'user', // নতুন ব্যবহারকারীরা ডিফল্টভাবে 'user' হবে
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);

export default User;