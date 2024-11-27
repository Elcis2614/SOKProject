// client/src/components/shopping-view/product-tile.jsx 

import { brandOptionsMap, categoryOptionsMap } from '@/config'
import { toast } from '@/hooks/use-toast'
import { useCallback, useEffect, useState } from 'react'

import { useSelector } from 'react-redux'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

import { CardFooter, CardContent, Card } from '../ui/card'

function ShoppingProductTile({
    product,
    handleGetProductDetails,
    handleAddtoCart,
    isAddingToCart = false,

}) 
{
    const [remainingStock, setRemainingStock] = useState(product?.totalStock || 0);
    const { cartItems = [] } = useSelector((state) => state.shopCart);
    const [ isUpdating, setIsUpdating ] = useState(false);

    // Function to calculate remaining stock based on cart items
    const calculateRemainingStock = useCallback(() => {
        if (!product?._id || !cartItems) return product?.totalStock || 0;
        
        if (!Array.isArray(cartItems)){
            console.warn('cartItem is not an Array : ', cartItems);
            return product?.totalStock || 0;
        }
        
        // Ensure cartItems is an array and calculate remaining stock
        const items = Array.isArray(cartItems) ? cartItems : [];
        
        const cartItem = items.find(item => item.productId === product._id);
        const cartQuantity = cartItem?.quantity || 0;
        const totalStock = product?.totalStock || 0;
        const newStock = Math.max(0, totalStock - cartQuantity);
        
        // Debug logging
        console.log('Stock calculation:', {
            productId: product._id,
            totalStock,
            cartQuantity,
            newStock,
            cartItemFound: !!cartItem
        });
        
        return newStock;
    }, [product?._id, product?.totalStock, cartItems]);
        
    // Update stock whenever cart items or product changes
    useEffect(() => {
        const newStock = calculateRemainingStock();
        if (newStock !== remainingStock) {
            console.log('Updating remaining stock:', {
                productId: product?._id,
                oldStock: remainingStock,
                newStock,
                cartItems: cartItems?.length
            });
            setRemainingStock(newStock);
        }
    }, [calculateRemainingStock, cartItems, product]);
    
  // Modified handleAddToCartClick
  const handleClick = () => {
    if (isUpdating || remainingStock <= 0) {
        return;
    }

    try {
        setIsUpdating(true);
        handleAddtoCart(product._id, remainingStock);
    } catch (error) {
        console.error('Add to cart error:', error);
        toast({
            title: "Error",
            description: "Failed to add item to cart",
            variant: "destructive"
        });
    } finally {
        setIsUpdating(false);
    }
};

if (!product) return null;


    const isOutOfStock = remainingStock <= 0;
    const isLowStock = remainingStock > 0 && remainingStock < 10;
    const hasDiscount = product.salePrice > 0;



    return (
        <Card className="w-full max-w-sm mx-auto">
            <div onClick={() => handleGetProductDetails(product?._id)}>
                <div className="relative">
                    <img
                        src={product?.image}
                        alt={product?.title || 'Product Image'}
                        className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                    {isOutOfStock ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Out of Stock</Badge>
                    ) : isLowStock ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            {`Only ${remainingStock} left`}
                        </Badge>
                    ) : hasDiscount ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Sale</Badge>
                    ) : null}
                </div>
                <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">{categoryOptionsMap[product?.category] || 'Unknown'}</span>
                        <span className="text-sm text-muted-foreground">{brandOptionsMap[product?.brand] || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`${hasDiscount ? 'line-through' : ''} text-lg font-semibold text-primary`}>
                            ${product?.price}
                        </span>
                        {hasDiscount && (
                            <span className="text-lg font-semibold text-primary">${product?.salePrice}</span>
                        )}
                    </div>
                </CardContent>
            </div>
            
            <CardFooter>
                <Button
                    onClick={handleClick}
                    className="w-full"
                    disabled={isOutOfStock || isAddingToCart || isUpdating}
                    variant={isOutOfStock ? "secondary" : "default"}
                    >
                        {isAddingToCart || isUpdating ? (
                            'Adding...'
                        ) : isOutOfStock ? (
                            'Out of Stock'
                        ) : (
                            `Add to Cart (${remainingStock} left)`
                        )}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ShoppingProductTile;