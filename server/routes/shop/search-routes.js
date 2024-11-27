// server/routes/shop/search-routes.js

const express = require('express');

const { 
    searchProducts
    } = require('../../controllers/shop/search-controller');

const router = express.Router();

// pass the keyword receiver from our params in our controller then import this in our server.js
router.get("/:keyword", searchProducts);

module.exports = router;