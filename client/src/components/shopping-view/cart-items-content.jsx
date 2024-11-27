// client/src/components/shopping-view/cart-items-content.jsx 

import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, Trash, Loader2Icon, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { deleteCartItem, fetchCartItems, updateCartQuantity } from '@/store/shop/cart-slice';
import { useToast } from '@/hooks/use-toast';
import PropTypes from 'prop-types';

function UserCartItemsContent({ cartItem }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector(state => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  
  // Get real-time product data
  const productData = productList.find(product => product._id === cartItem.productId);
  const currentStock = productData?.totalStock ?? cartItem.totalStock ?? 0;
  
  // Get current quantity in cart
  const getCartQuantity = useCallback(() => {
    if (!cartItems || !Array.isArray(cartItems)) return 0;
    const item = cartItems.find(item => item.productId === cartItem.productId);
    return item?.quantity || 0;
  }, [cartItems, cartItem.productId]);
  
  // Calculate remaining stock
  const remainingStock = Math.max(0, currentStock - getCartQuantity());
  const isLowStock = remainingStock > 0 && remainingStock <= 5;

  const handleCartItemDelete = useCallback(async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      setError(null);
      
      const result = await dispatch(deleteCartItem({ 
        userId: user?.id, 
        productId: cartItem?.productId 
      })).unwrap();
      
      if (result.success) {
        await dispatch(fetchCartItems(user?.id));
        toast({ title: 'Item removed from cart' });
      } else {
        throw new Error(result.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      setError('Failed to remove item. Please try again.');
      toast({ 
        title: 'Failed to remove item',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  }, [dispatch, user?.id, cartItem?.productId, toast, isUpdating]);

  const handleUpdateQuantity = useCallback(async (newQuantity, typeOfAction) => {
    if (!cartItem || isUpdating) return;

    try {
      // Validate quantity
      if (newQuantity < 1) {
        toast({
          title: "Invalid quantity",
          description: "Quantity cannot be less than 1",
          variant: "destructive",
        });
        return;
      }

      // Validate stock for increase
      if (typeOfAction === 'plus') {
        const availableStock = currentStock;
        const currentQuantity = getCartQuantity();
        
        console.log('Stock check:', {
          availableStock,
          currentQuantity,
          newQuantity,
          remainingStock
        });

        if (newQuantity > availableStock) {
          toast({
            title: "Stock limit reached",
            description: `Only ${availableStock} items available`,
            variant: "destructive",
          });
          return;
        }
      }
      
      setIsUpdating(true);
      setError(null);

      const result = await dispatch(updateCartQuantity({
        userId: user?.id,
        productId: cartItem?.productId,
        quantity: newQuantity,
      })).unwrap();
      
      if (result.success) {
        await dispatch(fetchCartItems(user?.id));
        toast({ title: 'Quantity updated' });
      } else {
        throw new Error(result.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setError('Failed to update quantity. Please try again.');
      toast({ 
        title: 'Failed to update quantity',
        variant: 'destructive' 
      });
    } finally {
      setIsUpdating(false);
    }
  }, [
    dispatch, 
    user?.id, 
    cartItem, 
    currentStock, 
    getCartQuantity, 
    toast, 
    isUpdating
  ]);

  if (!cartItem) return null;

  return (
    <div className="relative flex items-center space-x-4">
      <img
        src={cartItem.image?.startsWith('http://') 
          ? cartItem.image.replace('http://', 'https://') 
          : cartItem.image}
        alt={cartItem.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem.title}</h3>
        <div className="flex flex-col items-end">
          <p className="text-sm">
            ${((cartItem.salePrice > 0 ? cartItem.salePrice : cartItem.price) * cartItem.quantity).toFixed(2)}
          </p>
          <Trash 
            onClick={handleCartItemDelete} 
            className="cursor-pointer mt-1"
            size={20}
          />
        </div>
        <div className="flex items-center mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem.quantity <= 1 || isUpdating}
            onClick={() => handleUpdateQuantity(cartItem.quantity - 1, 'minus')}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="mx-2">{cartItem.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={isUpdating || cartItem.quantity >= currentStock}
            onClick={() => handleUpdateQuantity(cartItem.quantity + 1, 'plus')}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {isLowStock && (
          <p className="text-sm text-yellow-600 mt-1">
            Only {remainingStock} left in stock
          </p>
        )}
      </div>
      {isUpdating && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <Loader2Icon className="animate-spin h-8 w-8" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
          <p className="text-red-500 mb-2">{error}</p>
          <Button onClick={() => setError(null)} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

UserCartItemsContent.propTypes = {
  cartItem: PropTypes.shape({
    _id: PropTypes.string,
    productId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    price: PropTypes.number.isRequired,
    salePrice: PropTypes.number,
    quantity: PropTypes.number.isRequired,
    totalStock: PropTypes.number,
  }).isRequired,
};

export default UserCartItemsContent;