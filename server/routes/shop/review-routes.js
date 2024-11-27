// server/routes/shop/review-routes.js

const express = require('express');

const { 
    addProductReview,
    getProductReviews
    } = require('../../controllers/shop/product-review-controller');

const router = express.Router();

// pass the keyword receiver from our params in our controller then import this in our server.js
router.post("/add", addProductReview);
router.get("/:productId", getProductReviews);

module.exports = router;