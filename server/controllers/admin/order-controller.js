// server/controllers/admin/order-controller.js

const Order = require('../../models/Order')


const getAllOrdersOfAllUsers = async(req, res) =>{
    try{
        const orders = await Order.find({ });
        
        if(!orders.length){
            return res.status(404).json({
                success : false,
                message : 'No orders found!'
            })
        }
        
        res.status(200).json({
            success : true,
            data : orders
        })
    
    }catch (error) {
        console.log(error);
        res.status(500).json({
            success : false, 
            message: 'Some Error occured!'
        });
    }
}


const getOrderDetailsForAdmin = async(req, res) =>{
    try{
        const { id } = req.params;
        console.log('Fetching order details for ID:', id);
        
        const order = await Order.findById(id);
        
        if(!order) {
            return res.status(404).json({
                success : false,
                message : 'Order not found!'
            });
        }
        
        console.log('Order details found:', order);
        
        res.status(200).json({
            success : true,
            data : order
        });
    
    } catch (error) {
        console.error('Error in getOrderDetails:', error);
        res.status(500).json({
            success : false, 
            message: 'An error occurred while fetching order details',
            error: error.message
        });
    }
};

const updateOrderStatus = async(req, res)=>{
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;
        
        if (!orderStatus) {
            return res.status(400).json({
                success: false,
                message: 'Order status is required'
            });
        }

        const order = await Order.findById(id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found!'
            });
        }
        
        order.orderStatus = orderStatus;
        await order.save();
        
        
        res.status(200).json({
            success: true,
            message: 'Order status updated successfully!',
            data: order
        });
    } catch (error) {
        console.error('Error in updateOrderStatus: ', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating order status',
            error: error.message
        });
    }
}


module.exports = { 
    getAllOrdersOfAllUsers,
    getOrderDetailsForAdmin,
    updateOrderStatus
};