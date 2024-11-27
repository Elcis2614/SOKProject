// server/models/Review.js

const mongoose = require('mongoose');

const ProductReviewSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  userName: String,
  reviewValue: Number,
  reviewMessage: String,
},
{
    timestamps: true
});

module.exports = mongoose.model('ProductReview', ProductReviewSchema);
