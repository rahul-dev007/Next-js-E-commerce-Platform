// src/models/Notification.js (নতুন ফাইল)

import mongoose, { Schema, models } from 'mongoose';

const notificationSchema = new Schema({
    // কোন ইউজারকে নোটিফিকেশন পাঠানো হবে (প্রোডাক্টের মালিক)
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // কে কাজটি করেছে (লাইক/কমেন্টকারী)
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // কোন প্রোডাক্টের উপর কাজটি হয়েছে
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    // কী ধরনের নোটিফিকেশন ('like' বা 'comment')
    type: {
        type: String,
        enum: ['like', 'comment'],
        required: true
    },
    // নোটিফিকেশনটি পড়া হয়েছে কিনা
    read: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Notification = models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;