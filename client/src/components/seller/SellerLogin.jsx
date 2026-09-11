import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios';
import toast from 'react-hot-toast';

const SellerLogin = () => {
    const {isseller, setIsseller ,navigate , axios} =useAppContext();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    useEffect(()=>{
        if(isseller){
            navigate("/seller")
        }
    },[isseller]);
    const onSubmitHandler =async (event)=>{
       try {
        event.preventDefault();
        const {data} =await axios.post('/api/seller/login' ,{email,password});
        if(data.success){
            setIsseller(true);
            navigate('/seller')
        }else{
            toast.error(data.message)
        }
       } catch (error) {
            toast.error(error.message);
       }
       
    };
  return !isseller && (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600'>
        <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
            <p className='text-2xl font-medium m-auto'><span className='text-[#4fbf8b]'>Seller </span><span>Login</span></p>
            <div className='w-full'>
            <p>Email</p>
            <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='enter your email' className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' required/>
            </div>
             <div className='w-full'>
            <p>Password</p>
            <input onChange={(e)=>setPassword(e.target.value)} type="text"  placeholder='enter your password' className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' required/>
            </div>
            <button className='w-full mt-6 bg-[#4fbf8b] text-white py-2 hover:bg-[#44ae7c] transition cursor-pointer '>Login</button>
        </div>

    </form>
  )
}

export default SellerLogin
