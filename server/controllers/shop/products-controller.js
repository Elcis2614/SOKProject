// server/controllers/shop/products-controller.js 

const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
    try {
        const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;
        
        let filters = {};
        
        // Building filters
        if (category.length) {
            filters.category = { $in: category.split(',') };
        }
        if (brand.length) {
            filters.brand = { $in: brand.split(',') };
        }
        
        // Building sort options
        let sort = {};
        switch (sortBy) {
            case "price-lowtohigh": // Enclosed in quotes
                sort.price = 1;
                break;
            case "price-hightolow": 
                sort.price = -1;
                break;
            case "title-atoz":  // Enclosed in quotes
                sort.title = 1;
                break;
            case "title-ztoa":    // Enclosed in quotes
                sort.title = -1;
                break;
            default:
                sort.price = 1;
                break;
        }
        
        // Fetching products with filters and sorting
        const products = await Product.find(filters).sort(sort);
        
        res.status(200).json({
            success: true,
            data: products,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred',
        });
    }
};

const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching product with ID:', id);
        const product = await Product.findById(id);
        console.log('Product fetched from DB:', product); // Log this to check if product is retrieved
        
        if (!product) return res.status(404).json({
            success: false,
            message: 'Product not found!',
        });

        console.log('Returning product:', product);  // Add this log
        res.status(200).json({
            success: true,
            data: product,  // Ensure the response contains the `data` field with the product
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred',
        });
    }
};

module.exports = { getFilteredProducts, getProductDetails };
