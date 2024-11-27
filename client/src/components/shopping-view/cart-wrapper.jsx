// client/src/components/shopping-view/cart-wrapper.jsx 

import { Loader2Icon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { SheetTitle } from '../ui/sheet'
import { SheetHeader } from '../ui/sheet'
import { SheetContent } from '../ui/sheet'
import UserCartItemsContent from './cart-items-content'

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
    const { isLoading } = useSelector((state) => state.shopCart);
    const navigate = useNavigate();
    
    console.log("Cart Items in UserCartWrapper:", cartItems);
    
    if (isLoading) {
        return (
          <SheetContent className="sm:max-w-md">
            <div className="flex justify-center items-center h-full">
              <Loader2Icon className="animate-spin h-8 w-8" />
            </div>
          </SheetContent>
        );
      }
    
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <SheetContent className="sm:max-w-md flex flex-col h-full p-1">
        {/* Fixed Header */}
        <div className="px-6 py-4 border-b">
                <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>
        </div>
            
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <UserCartItemsContent 
                                key={item.productId} 
                                cartItem={item} 
                            />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-32">
                            <p className="text-gray-500">Your cart is empty</p>
                        </div>
                    )}
                </div>
            </div>
            
          {/* Fixed Footer */}
          <div className="border-t px-6 py-4 bg-background">
                {cartItems.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                )}
                <Button
                    onClick={() => {
                        navigate('/shop/checkout');
                        setOpenCartSheet(false);
                    }}
                    className="w-full mt-4"
                    disabled={cartItems.length === 0}
                >
                    Checkout
                </Button>
            </div>
        </SheetContent>
    );
}

export default UserCartWrapper;