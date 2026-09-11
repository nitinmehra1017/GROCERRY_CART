import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/productCard';

const AllProducts = () => {
    const {Products,searchQuery} = useAppContext()

    const [filteredProducts, setfilteredProducts]=useState([]);

   useEffect(() => {
  //const validProducts = Array.isArray(products) ? products : [];

  if (searchQuery.length > 0) {
    setfilteredProducts(
      Products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  } else {
   setfilteredProducts(Products);
  }
}, [Products, searchQuery]);


  return (
    <div className='mt-16 flex flex-col'>
        <div className='flex flex-col items-end w-max'>
            <p className='text-2xl font-medium uppercase'>
                All Products
            </p>
            <div className='w-16 h-0.5 bg-[#4fbf8b] rounded-full'></div>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8 mt-6'>
            
            {filteredProducts.filter((product)=>product.inStock).map((product,index)=>(
                <ProductCard key={index} product={product}/>
            ))}

        </div>
      
    </div>
  )
}

export default AllProducts;
