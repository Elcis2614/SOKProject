// client/src/pages/shopping-view/home.jsx 

import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Card } from '@/components/ui/card'
import { fetchAllFilteredProducts } from '@/store/shop/products-slice'
import { ChevronLeftIcon, ChevronRightIcon, ShirtIcon, Watch, Cctv, CloudLightning, BabyIcon, Footprints, Heater, Airplay } from 'lucide-react'
import  { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SiAdidas, SiNike, SiPuma, SiZara } from "react-icons/si";


import bannerOne from '../../assets/banner-1.jpg'
import bannerTwo from '../../assets/banner-2.jpg'
import bannerThree from '../../assets/banner-3.jpg'
import { useNavigate } from 'react-router-dom'
import { fetchProductDetails } from '@/store/shop/products-slice'
import { addToCart } from '@/store/shop/cart-slice'
import { useToast } from '@/hooks/use-toast'
import { fetchCartItems } from '@/store/shop/cart-slice'
import ProductDetailsDialog from '@/components/shopping-view/product-details'

{/** home categories with Icons section */}
const categoriesWithIcon = [
    {id: "men", label: "Men" , icon : ShirtIcon},
    {id: "women", label: "Women", icon : CloudLightning },
    {id: "watch", label: "Watch", icon : Watch },
    {id: "kids", label: "Kids", icon : BabyIcon },
    {id: "accessories", label: "Accessories", icon : Cctv },
    {id: "footwear", label: "Footwear", icon : Footprints },
  
  ];
  
  {/** home Brands with Icons section */}
const brandWithIcon = [
    {id: "nike", label: "Nike", icon : SiNike },
    {id: "adidas", label: "Adidas", icon : SiAdidas  },
    {id: "puma", label: "Puma", icon : SiPuma  },
    {id: "levi", label: "Levi's", icon : Airplay  },
    {id: "zara", label: "Zara", icon : SiZara  },
    {id: "h&m", label: "H&M", icon : Heater  },
  ]


function ShoppingHome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const  slides = [ bannerOne, bannerTwo, bannerThree];
    const dispatch = useDispatch();
    const { productList, productDetails, isLoading } = useSelector((state)=> state.shopProducts);
    const { user, isAuthenticated } = useSelector((state)=> state.auth);
    const { cartItems} = useSelector((state) => state.shopCart); 
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const navigate = useNavigate();
    const {toast} = useToast();
    
    
    useEffect(()=>{
        const timer = setInterval(()=> {
            setCurrentSlide(prevSlide => (prevSlide + 1)% slides.length)
        }, 5000)
        
        return ()=> clearInterval(timer);
    
    },[])
    
    useEffect(()=>{
        dispatch(fetchAllFilteredProducts({
            filterParams : {}, 
            sortParams : 'price-lowtohigh'
            }))
        }, [dispatch]);
  
    console.log(productList, "productList");
    
    {/** this will help to navigor /shop/listing?category=women when category/brand icon is clicked */}
    function handleNavigateToListingPage(getCurrentItem, section){
        sessionStorage.removeItem('filters');
        const currentFilter = {
            [section] : [getCurrentItem.id]
        }
        sessionStorage.setItem("filters", JSON.stringify(currentFilter));
        navigate(`/shop/listing`)
    }
    
    {/** Handle to display product details */}
    const handleGetProductDetails = (getCurrentProductId) => {
        if (!getCurrentProductId) {
          console.error("Product ID is undefined");
          return;
        }
        dispatch(fetchProductDetails(getCurrentProductId))
          .catch((error) => console.error("fetchProductDetails error:", error));
      };
      
      {/** Handle Add product to Cart */}
    const handleAddtoCart = useCallback((productId, getTotalStock) => {
        console.log(cartItems);
        let getCartItems = cartItems.items || [];
      
        // Check stock availability in cart
        if (getCartItems.length) {
          const indexOfCurrentItem = getCartItems.findIndex(
            (item) => item.productId === productId
          );
          if (indexOfCurrentItem > -1) {
            const getQuantity = getCartItems[indexOfCurrentItem].quantity;
            if (getQuantity + 1 > getTotalStock) {
              toast({
                title: `Only ${getQuantity} quantity can be added for this item`,
                variant: "destructive",
              });
              return;
            }
          }
        }
      
        // Set loading state while adding to cart
        setIsAddingToCart(true);
      
        dispatch(
          addToCart({
            userId: user?.id,
            productId: productId,
            quantity: 1,
          })
        )
          .then((data) => {
            if (data?.payload?.success) {
              dispatch(fetchCartItems(user?.id));
              toast({
                title: "Product added to cart successfully",
                status: "success",
              });
            } else {
              toast({
                title: "Error",
                description: "Failed to add item to cart.",
                status: "error",
              });
            }
          })
          .catch((error) => {
            toast({
              title: "Error",
              description: error.message || "An unexpected error occurred.",
              variant: "destructive",
            });
          })
          .finally(() => {
            setIsAddingToCart(false);  // Ensure we reset the loading state
          });
       }, [user, cartItems, isAuthenticated, dispatch]);
       
       
       useEffect(() => {
        if (productDetails) {
          setOpenDetailsDialog(true);
        } else {
          setOpenDetailsDialog(false);
        }
      }, [productDetails]);
    
    
    return (
        <div className="flex flex-col min-h-screen">
            <div className="relative w-full h-[600px] overflow-hidden">
                {
                slides.map((slide, index)=> 
                <img 
                    src={slide}
                    key={index}
                    className={ ` ${index === currentSlide ? 'opacity-100' : 'opacity-0'}
                    absolute top-0 left-0 w-full object-cover transition-opacity duration-1000`}
                />
                )}
                <Button 
                    variant="outline" 
                    size="icon"
                    onClick={()=>setCurrentSlide(prevSlide=> (
                        prevSlide -1 + slides.length) % slides.length)
                        }
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
                    >
                    <ChevronLeftIcon className="w-4 h-4"/>
                </Button>
                <Button 
                    variant="outline" 
                    size="icon"
                    onClick={()=>setCurrentSlide(prevSlide=> (
                        prevSlide +1 ) % slides.length)
                        }
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
                    >
                    <ChevronRightIcon className="w-4 h-4"/>
                </Button>
                
            </div>
            {/** home categories section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Shop by category
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {
                            categoriesWithIcon.map((categoryItem)=> 
                            <Card onClick={()=>handleNavigateToListingPage(categoryItem, 'category')} className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                                    <span className="font-bold">{categoryItem.label}</span>
                                </CardContent>
                            </Card>
                            )
                        }
                    </div>
                </div>
            </section>
            
            {/** home brands section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Shop by Brand
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {
                            brandWithIcon.map((brandItem)=> 
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardContent onClick={()=>handleNavigateToListingPage(brandItem, 'brand')} className="flex flex-col items-center justify-center p-6">
                                    <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                                    <span className="font-bold">{brandItem.label}</span>
                                </CardContent>
                            </Card>
                            )
                        }
                    </div>
                </div>
            </section>
            
             {/** home Products section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Feature Products
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {
                            productList && productList.length > 0 ?
                            productList.map((productItem)=> (
                                <ShoppingProductTile 
                                handleGetProductDetails={handleGetProductDetails}
                                handleAddtoCart={handleAddtoCart}
                                product={productItem}/>
                                )
                            ) : null
                        }
                    </div>
                </div>
            </section>
            {!isLoading && productDetails && (
                    <ProductDetailsDialog
                      open={openDetailsDialog}
                      setOpen={setOpenDetailsDialog}
                      productDetails={productDetails}
                    />
                )}
        </div>
    )
}

export default ShoppingHome
