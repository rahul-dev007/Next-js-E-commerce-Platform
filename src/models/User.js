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
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'user'],
      default: 'user',
    },

    // ==========================================================
    // ===== ★★★ পাসওয়ার্ড রিসেটের জন্য নতুন ফিল্ড (এখানে যোগ করা হয়েছে) ★★★ =====
    // ==========================================================
    resetPasswordToken: String,
    resetPasswordExpire: Date,

  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);

export default User;