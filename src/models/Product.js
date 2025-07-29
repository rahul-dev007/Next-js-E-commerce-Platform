// src/models/Product.js

import mongoose, { Schema, models } from 'mongoose';

const productSchema = new Schema(
  {
    // ===================================
    // ===== আপনার পুরনো ফিল্ডগুলো (অপরিবর্তিত) =====
    // ===================================
    name: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long."],
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
      minlength: [10, "Description must be at least 10 characters long."],
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price cannot be negative."],
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required."],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // 'User' মডেলের সাথে সম্পর্ক
      required: true, // নতুন প্রোডাক্ট যোগ করার সময় এটি বাধ্যতামূলক করা উচিত
    },

    // ==========================================================
    // ===== ★★★ নতুন ফিচারগুলোর জন্য নতুন ফিল্ড (এখানে যোগ করা হয়েছে) ★★★ =====
    // ==========================================================
    
    // ★★★ লাইকের জন্য ★★★
    // এখানে আমরা ইউজারদের আইডি রাখব যারা লাইক দিয়েছে
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // ★★★ কমেন্টের জন্য ★★★
    // এখানে কমেন্টের একটি অ্যারে থাকবে
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

  },
  { 
    timestamps: true, // এটি createdAt এবং updatedAt যোগ করবে
    // ★★★ ভার্চুয়াল ফিল্ডগুলোকে JSON আউটপুটে আনার জন্য এই অপশনগুলো জরুরি ★★★
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  } 
);

// ★★★ ভার্চুয়াল ফিল্ড: লাইক এবং কমেন্টের সংখ্যা সহজে পাওয়ার জন্য ★★★
// এটি ডেটাবেসে সেভ হবে না, কিন্তু আমরা যখন ডেটা চাইব তখন এটি গণনা করে দেবে
productSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

productSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});


// ★★★ আপনার পুরনো কোড অনুযায়ী মডেল কম্পাইল করা (অপরিবর্তিত এবং সঠিক) ★★★
const Product = models.Product || mongoose.model('Product', productSchema);

export default Product;