// client/src/components/shopping-view/header.jsx 

import { shoppingViewHeaderMenuItems } from '@/config'
import { logoutUser } from '@/store/auth-slice'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { House, Loader2Icon, LogOut, Menu, ShoppingCart, UserCog } from 'lucide-react'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { AvatarFallback } from '../ui/avatar'
import { Avatar } from '../ui/avatar'
import { Button } from '../ui/button'
import { DropdownMenu } from '../ui/dropdown-menu'
import { Label } from '../ui/label'
import { SheetContent } from '../ui/sheet'
import { SheetTrigger } from '../ui/sheet'
import { Sheet } from '../ui/sheet'
import UserCartWrapper from './cart-wrapper'


function MenuItems(){
    const navigate = useNavigate();
    const location = useLocation();
    const [ searchParams, setSearchParams ] = useSearchParams();
    
    {/** Organizing the header menu item to fecth the appropriete product category */}
    function handleNavigate(getCurrentItemMenuItem){
        sessionStorage.removeItem('filters')
        // help to navigate through the header link with appropriete pathname
        const currentFilter =
            getCurrentItemMenuItem.id !== 'home' && 
            getCurrentItemMenuItem.id !== 'products' && 
            getCurrentItemMenuItem.id !== 'search'
            ? {
                category : [getCurrentItemMenuItem.id]
              } : null
        
        sessionStorage.setItem('filters', JSON.stringify(currentFilter));
      
        // help to navigate through the header link with appropriete pathname 
        if (location.pathname.includes('listing') && currentFilter !== null) {
            setSearchParams(new URLSearchParams(`?category=${getCurrentItemMenuItem.id}`));
          } else {
            navigate(getCurrentItemMenuItem.path);
          }
    }
    
    return <nav className="flex flex-col space-y-4 lg:space-y-0 lg:space-x-6 lg:flex-row">
    {
        shoppingViewHeaderMenuItems.map((menuItem)=>
       ( 
       <Label 
            onClick={()=> handleNavigate(menuItem)}
            key={menuItem.id } 
            className="text-sm font-medium hover:text-primary transition-colors text-left px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
            >
            {menuItem.label}
        </Label>
        )
        )
    }
    </nav>
}

function HeaderRightContent(){
    const {user, isAuthenticated} = useSelector((state)=> state.auth);
    const [openCartSheet, setOpenCartSheet] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems, isLoading, error } = useSelector((state) => state.shopCart);

    if (error) {
        return <div>Error loading cart: {error}</div>;
    }

    function handleLogout(){
        dispatch(logoutUser());
    }
    
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            dispatch(fetchCartItems(user?.id));
        }
    }, [dispatch, isAuthenticated, user?.id]);

    return (
        <div className="flex items-center space-x-4 w-full lg:w-auto">
            {/* Cart Button */}
            <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
                <Button 
                    onClick={() => setOpenCartSheet(true)} 
                    variant="outline" 
                    size="icon"
                    className="relative"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <ShoppingCart className="h-6 w-6" />
                            {cartItems?.length > 0 && (
                                <span className="absolute top-[-5px] right-[2px] bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {cartItems.length}
                                </span>
                            )}
                        </>
                    )}
                    <span className="sr-only">User Cart</span>
                </Button>
                {/* Pass cartItems to the cart wrapper */}
                <UserCartWrapper 
                    setOpenCartSheet={setOpenCartSheet}
                    isLoading={isLoading}
                    cartItems={!isLoading && cartItems?.length > 0 ? cartItems : []} 
                />
            </Sheet>
            
            {/* Avatar Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="bg-black hover:bg-black cursor-pointer">
                        <AvatarFallback className="text-gray-900 font-extrabold">
                            {user?.userName ? user.userName[0].toUpperCase() : 'U'}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                    align="end"
                    className="w-56 mt-2 z-50 bg-white shadow-lg rounded-lg"
                >
                    <DropdownMenuLabel 
                        className="text-gray-700 font-semibold px-4 py-2 mt-2 mb-2"
                    >
                        Logged in as {user?.userName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={() => navigate('/shop/account')}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors gap-2"
                    >
                        <UserCog className="mr-2 h-4 w-4 text-gray-600" />  
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors gap-2"
                    >
                        <LogOut className="mr-2 h-4 w-4 text-gray-600"/>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

function ShoppingHeader() {
    // const {isAuthenticated} = useSelector(state=> state.auth)
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:-6">
            {/* Logo */}
                <Link to='/shop/home' className="flex h-16 items-center gap-2">
                    <House className="w-6 h-10" />
                    <span className="font-bold"> Insta_Shop</span>    
                </Link>
                
                {/* Mobile Menu Trigger */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden"
                        >
                        <Menu  className="h-6 w-6"/>
                            <span className="sr-only" > Toggle header menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-xs">
                        <MenuItems />
                        <HeaderRightContent className='mt-4' />
                    </SheetContent>
                </Sheet>
                
                {/* Desktop Menu */}
                <div className="hidden lg:block">
                    <MenuItems />
                </div>
               <div>
                        <HeaderRightContent className="hidden lg:block"/>
                </div> 
            </div>
        </header>
    )
}

export default ShoppingHeader
