// client/src/App.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import AdminLayout from './components/admin-view/layout'
import AuthLayout from './components/auth/layout'
import CheckAuth from './components/common/check-auth'
import { checkAuth } from "./store/auth-slice";
import ShoppingLayout from './components/shopping-view/layout'
import AdminDashboard from './pages/admin-view/dashboard'
import AdminFeatures from './pages/admin-view/features'
import AdminOrders from './pages/admin-view/orders'
import AdminProducts from './pages/admin-view/products'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import NotFound from './pages/NotFound'
import ShoppingAccount from './pages/shopping-view/account'
import ShoppingCheckout from './pages/shopping-view/checkout'
import ShoppingHome from './pages/shopping-view/home'
import ShoppingListing from './pages/shopping-view/listing'
import UnAuthPage from './pages/unauth-page'
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from './hooks/use-toast'
import PaypalReturnPages from './pages/shopping-view/paypal-return'
import PayementSuccessPage from './pages/shopping-view/payment-success'
import SearchProduct from './pages/shopping-view/search'





function App() {
  
  const { user, isAuthenticated, isLoading } = useSelector(state => {
    console.log("Current Redux State:", state);
    console.log("Auth State:", state.auth);
    return state.auth;
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  
  // Hooks should always be called unconditionally
  useEffect(() => {
    console.log("Dispatching checkAuth");
    dispatch(checkAuth()).then((action) => {
      console.log("checkAuth result:", action);
    });
  }, [dispatch]);
  
  
  useEffect(() => {
    console.log("Auth state changed:", { isAuthenticated, isLoading, user });
    if (!isAuthenticated && !isLoading) {
      toast({
        title: "Session expired",
        description: "Please log in again.",
        status: "error",
      });
      navigate('/auth/login');
    }
  }, [isAuthenticated, isLoading, user]);

  console.log("Render - isLoading:", isLoading, "user:", user);

  if (isLoading) {
    return <Skeleton className="w-[600px] h-[600px] rounded-full" />;
  }

  console.log(isLoading, user)

  return (
    <div className="flex flex-col overflow-hidden bg-white">
    {/** common component */}
    <Routes>
      <Route
        path="/"
        element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
            user={user}
          ></CheckAuth>
        }
      />
          
      <Route 
        path="/auth" 
        element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AuthLayout/>
        </CheckAuth>
      }>
      
        <Route path="login" element={<AuthLogin/>} />
        <Route path="register" element={<AuthRegister/>}/>
      </Route>
      
      <Route path="admin" element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AdminLayout/>
        </CheckAuth>
      } >
        <Route path="dashboard" element={<AdminDashboard/>}/>
        <Route path="products" element={<AdminProducts/>}/>
        <Route path="orders" element={<AdminOrders/>}/>
        <Route path="features" element={<AdminFeatures/>}/>
      </Route>
      
      <Route path="/shop" element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <ShoppingLayout />
        </CheckAuth>
      }>
      
        <Route path="account" element={<ShoppingAccount />} />
        <Route path="checkout" element={<ShoppingCheckout />} />
        <Route path="home" element={<ShoppingHome />} />
        <Route path="listing" element={<ShoppingListing />} />
        <Route path="paypal-return" element={<PaypalReturnPages />} />
        <Route path="payment-success" element={<PayementSuccessPage />} />
        <Route path="search" element={<SearchProduct />} />
        
      </Route>
      
      <Route path="*" element={<NotFound/>}/>
      <Route path="unauth-page" element={<UnAuthPage />} />
    </Routes>
    
    </div>
  )
}

export default App
