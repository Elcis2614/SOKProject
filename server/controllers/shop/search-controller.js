
// server/controllers/shop/search-controller.js

const Product = require('../../models/Product');

exports.searchProducts = async (req, res) => {
  try {
    const keyword = req.params.keyword?.trim();
    
    if (!keyword) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    console.log('Searching with keyword:', keyword);

   // Create a more flexible search pattern
   const searchPattern = new RegExp(keyword.split('').join('.*'), 'i');

   // Expanded search criteria
   const products = await Product.find({
     $or: [
       { title: { $regex: searchPattern } },
       { description: { $regex: searchPattern } },
       { brand: { $regex: searchPattern } },
       { category: { $regex: searchPattern } }
     ]
   }).lean();


    // Transform the products to ensure proper image URLs
    const transformedProducts = products.map(product => ({
      ...product,
      image: product.image?.replace('http://', 'https://') || '',
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      totalStock: Number(product.totalStock || 0)
    }));

    console.log(`Search results for "${keyword}":`, transformedProducts.length);
    
    // Log sample of matches for debugging
    if (transformedProducts.length > 0) {
      console.log('Sample matches:', transformedProducts.slice(0, 2).map(p => ({
        title: p.title,
        description: p.description,
        brand: p.brand,
        category: p.category
      })));
    }

    return res.status(200).json({
      success: true,
      data: transformedProducts,
      searchMetadata: {
        keyword,
        totalResults: transformedProducts.length,
        fields: ['title', 'description', 'brand', 'category']
      }
    });
    
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};