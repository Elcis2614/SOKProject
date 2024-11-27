//server/routes/common/feature-routes.js 

const express = require('express');

const { 
    addFeatureImage,
    getFeatureImages,
    deleteFeatureImage  // Add this line to delete a feature image
    } = require('../../controllers/common/feature-controller');

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);
router.delete("/delete/:id", deleteFeatureImage);


module.exports = router;
