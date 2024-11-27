// server/server.js 

const express = require('express')
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes')
const adminProductsRouter = require('./routes/admin/products-routes')
const adminOrdersRouter = require('./routes/admin/order-routes')


const shopProductsRouter = require('./routes/shop/products-routes')
const shopCartRouter = require('./routes/shop/cart-routes');
const shopAddressRouter = require('./routes/shop/address-routes');
const shopOrderRouter = require('./routes/shop/order-routes');  
const shopSearchRouter = require('./routes/shop/search-routes');  
const shopReviewRouter = require('./routes/shop/review-routes'); 

const commonFeatureRouter = require('./routes/common/feature-routes')



// create a database connection -> u can also create a separate file for this and then  import  use that file here
// Connect to MongoDB
mongoose
    .connect(
        "mongodb+srv://imsba13:CuffV8U4rKi3Llnh@instamood.nfy0n.mongodb.net/"
    )
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: [
            "Content-Type", // Corrected here
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials: true
    })
);

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrdersRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);  
app.use("/api/shop/search", shopSearchRouter);  
app.use("/api/shop/review", shopReviewRouter);  
app.use('/api/common/feature', commonFeatureRouter);


app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});


app.listen(PORT, () => console.log(`Server is now running on Port ${PORT}`));