// server/routes/shop/order-routes.js 

const express = require('express');

const { 
    createOrder, 
    capturePayment,
    getAllOrdersByUser,
    getOrderDetails
    } = require('../../controllers/shop/order-controller')

const router = express.Router();

// router.post('/create', createOrder);
// router.post('/capture', capturePayment);
// router.get('/list/:userId', getAllOrdersByUser,);
// router.get('/details/:id', getOrderDetails);

router.post('/create', async (req, res, next) => {
    try {
        // console.log('Received create order request');
        await createOrder(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/capture', async (req, res, next) => {
    try {
        await capturePayment(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/list/:userId', async (req, res, next) => {
    try {
        await getAllOrdersByUser(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/details/:id', async (req, res, next) => {
    try {
        await getOrderDetails(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;