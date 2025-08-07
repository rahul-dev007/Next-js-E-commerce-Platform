import mongoose, { Schema, models } from 'mongoose';

// ★★★ একটি আলাদা রিভিউ স্কিমা তৈরি করা হয়েছে, যা কোডকে পরিষ্কার রাখে ★★★
const reviewSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    }, // ডিনরমালাইজেশন: রিভিউয়ের সাথে ইউজারের নাম সেভ করা হচ্ছে
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    comment: { 
        type: String, 
        required: true, 
        maxlength: 500 
    },
}, { timestamps: true });


const productSchema = new Schema(
  {
    // ===== তোমার পুরনো ফিল্ডগুলো (কিছু ফিল্ড আমি যোগ করে দিয়েছি) =====
    name: { type: String, required: [true, "Product name is required."], trim: true },
    description: { type: String, required: [true, "Product description is required."] },
    price: { type: Number, required: [true, "Price is required."], min: 0 },
    category: { type: String, required: [true, "Category is required."], trim: true },
    imageUrl: { type: String, required: [true, "Image URL is required."] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    views: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    stock: { type: Number, default: 1, min: 0 },
    
    // ==========================================================
    // ===== ★★★ রিভিউ সিস্টেমের জন্য নতুন ফিল্ড (এখানে যোগ করা হয়েছে) ★★★ =====
    // ==========================================================
    reviews: [reviewSchema], // প্রতিটি প্রোডাক্টের সাথে এখন রিভিউয়ের একটি তালিকা থাকবে
    
    rating: { // গড় রেটিং, যা প্রতিটি নতুন রিভিউর সাথে আপডেট হবে
        type: Number,
        required: true,
        default: 0
    },
    numReviews: { // মোট রিভিউর সংখ্যা
        type: Number,
        required: true,
        default: 0
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  } 
);

// ===== ভার্চুয়াল ফিল্ড =====
productSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

productSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

const Product = models.Product || mongoose.model('Product', productSchema);

export default Product;