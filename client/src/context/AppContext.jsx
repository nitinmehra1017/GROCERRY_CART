
import React,{ createContext, useContext ,useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyProducts } from '../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL =import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();


export const AppProvider = ({ children }) => {
 
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;
  const [user, setUser] = useState(null); 
  const [isseller, setIsseller] = useState(false); 
  const [showUserLogin ,setShowUserLogin]= useState(false);
  const [Products ,setProducts]= useState([]);
  const [cartItems ,setCartItems]= useState({});
  const [searchQuery ,setSearchQuery]= useState({});

  //Fetch Seller status

  const fetchSeller =async ()=>{
    try {
      const {data} =await axios.get('/api/seller/is-auth')
      if(data.success){
        setIsseller(true);
      }else{
        setIsseller(false);
      }
    } catch (error) {
      setIsseller(false);
    }
  }

  //Fetch user status  ,user data , cart items

  const fetchUser =async ()=>{
    try {
      const {data} =await axios.get('/api/user/is-auth');
      if(data.success){
        setUser(data.user);
        setCartItems(data.user.cartItems)
      }
    } catch (error) {
      setUser(null);
    }
  }



  //FETCH ALL PRODUCTS
  const fetchProducts =async()=>{
    try {
      const {data} =await axios.get('/api/product/list');
      if(data.success){
        setProducts(data.products)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const addToCart =(itemId)=> {
    let CartData = structuredClone(cartItems);
    if(CartData[itemId]){
      CartData[itemId] +=1
    }else {
     CartData[itemId] =1;
    }
    setCartItems(CartData);
    toast.success("Added to Cart")

  } 
  //update CART item quantity
  const updateCartItem =(itemId,quantity)=>{
    let CartData =structuredClone(cartItems);
    CartData[itemId]=quantity;
    setCartItems(CartData)
    toast.success("Cart Updated")
  }
  //remove product from cart
  const removeFromCart =(itemId)=>{
     let CartData =structuredClone(cartItems);
     if(CartData[itemId]){
      CartData[itemId]-=1;
     
     if(CartData[itemId]===0){
      delete CartData[itemId];
     }
    }
    toast.success("Removed from Cart")
    setCartItems(CartData)

  }

  const  getCartCount =()=>{
    let totalCount=0;
    for(const item in cartItems){
      totalCount+=cartItems[item];
    }
    return totalCount;

  }


  const getCartAmount =()=>{
    let totalAmount=0;
    for(const items in cartItems){
      let itemInfo=Products.find((product)=>product._id===items);
      if(cartItems[items]>0){
        totalAmount+=itemInfo.offerPrice*cartItems[items];
      }
    }
    return Math.floor(totalAmount*100) /100;
  }
  useEffect(()=>{
    fetchUser();
    fetchSeller()
    fetchProducts()
  },[])

  //update database cart items
  useEffect(()=>{

    const updateCart =async()=>{
      try {
        const {data} =await axios.post('/api/cart/update',{userId: user._id,cartItems});
        if(!data.success){
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error.message)
        
      }
    }
    if(user){
      updateCart();
    }

  },[cartItems]);
  
  
  const value = {navigate, user, setUser, isseller, setIsseller ,showUserLogin ,setShowUserLogin,Products,currency,addToCart,updateCartItem,removeFromCart,cartItems,setCartItems,searchQuery ,setSearchQuery,getCartAmount,getCartCount,axios,fetchProducts};

  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}


export const useAppContext = () => {
  return useContext(AppContext);
}