// client/src/pages/shopping-view/search.jsx

import { useCallback, useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getSearchResults, clearSearchResults } from '@/store/shop/search-slice';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import debounce from 'lodash.debounce';
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { fetchProductDetails } from '@/store/shop/products-slice';
import { toast } from '@/hooks/use-toast';

function SearchProduct() {
  const dispatch = useDispatch();
  
  // States
  const [keyword, setKeyword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Selectors
  const { searchResults, isLoading, error } = useSelector(state => state.shopSearch);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.shopCart);
  const { productDetails } = useSelector(state => state.shopProducts);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm && searchTerm.trim().length >= 2) {
        setSearchParams({ keyword: searchTerm });
        dispatch(getSearchResults(searchTerm));
      } else {
        setSearchParams({});
        dispatch(clearSearchResults());
      }
    }, 500),
    [dispatch, setSearchParams]
  );

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  const handleGetProductDetails = useCallback((getCurrentProductId) => {
    if (!getCurrentProductId) {
      console.error("Product ID is undefined");
      return;
    }
    dispatch(fetchProductDetails(getCurrentProductId))
      .catch((error) => console.error("fetchProductDetails error:", error));
  }, [dispatch]);

  const handleAddtoCart = useCallback(async (getCurrentProductId, getTotalStock) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart",
        variant: "destructive"
      });
      return;
    }

    // Validate inputs
    if (!getCurrentProductId || !getTotalStock) {
      toast({
        title: "Error",
        description: "Invalid product information",
        variant: "destructive"
      });
      return;
    }

    // Find the product and current cart item
    const items = Array.isArray(cartItems) ? cartItems : [];
    const currentCartItem = items.find(item => item.productId === getCurrentProductId);
    const currentQuantity = currentCartItem?.quantity || 0;

    // Validate stock
    if (currentQuantity >= getTotalStock) {
      toast({
        title: "Stock limit reached",
        description: `Only ${getTotalStock} items available`,
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAddingToCart(true);
      
      const result = await dispatch(addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1
      })).unwrap();

      if (result.success) {
        await dispatch(fetchCartItems(user?.id));
        toast({
          title: "Success",
          description: "Item added to cart",
        });
      } else {
        throw new Error(result.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  }, [user?.id, cartItems, isAuthenticated, dispatch]);

  // Effects
  useEffect(() => {
    const keywordFromUrl = searchParams.get('keyword');
    if (keywordFromUrl) {
      setKeyword(keywordFromUrl);
      dispatch(getSearchResults(keywordFromUrl));
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (productDetails) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  useEffect(() => {
    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  return (
    <div className='container mx-auto md:px-6 px-4 py-8'>
      <div className='flex flex-col items-center gap-4 mb-8'>
        <h1 className="text-2xl font-bold">Search Products</h1>
        <div className='w-full max-w-2xl'>
          <Input
            value={keyword}
            name='keyword'
            onChange={handleSearchInput}
            className='w-full border border-gray-300 rounded-md py-6 px-4 focus:outline-none focus:border-blue-500'
            type="text"
            placeholder="Search products (minimum 2 characters)..."
            disabled={isLoading}
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-pulse">Searching...</div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center mb-4 p-4 bg-red-50 rounded">
          {error}
        </div>
      )}

      {!isLoading && keyword.trim().length >= 2 && (
        <div className="text-center mb-4 text-gray-600">
          Found {searchResults?.length || 0} result{searchResults?.length !== 1 ? 's' : ''} 
          for `{keyword}`
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 cursor-pointer">
        {searchResults && searchResults.length > 0 ? (
          searchResults.map((productItem) => (
            <ShoppingProductTile
              key={productItem._id}
              product={{
                ...productItem,
                image: productItem.image?.startsWith('http://')
                  ? productItem.image.replace('http://', 'https://')
                  : productItem.image
              }}
              handleGetProductDetails={handleGetProductDetails}
              handleAddtoCart={handleAddtoCart}
              isAddingToCart={isAddingToCart}
              isAuthenticated={isAuthenticated}
            />
          ))
        ) : (
          !isLoading && keyword.trim().length >= 2 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No products found matching `{keyword}`
            </div>
          )
        )}
      </div>

      {!isLoading && productDetails && (
        <ProductDetailsDialog
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />
      )}
    </div>
  );
}

export default SearchProduct;