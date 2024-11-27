// server/routes/admin/order-routes.js 

const express = require('express');

const { 
    getAllOrdersOfAllUsers,
    getOrderDetailsForAdmin,
    updateOrderStatus
    
    } = require('../../controllers/admin/order-controller')

const router = express.Router();

// router.get('/list/:userId', getAllOrdersByUser,);

router.get('/get', async (req, res, next) => {
    try {
        await getAllOrdersOfAllUsers(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/details/:id', async (req, res, next) => {
    try {
        await getOrderDetailsForAdmin(req, res);
    } catch (error) {
        next(error);
    }
});

router.put('/update/:id', async (req, res, next) => {
    try {
        await updateOrderStatus(req, res);
    } catch (error) {
        next(error);
    }
});


module.exports = router;