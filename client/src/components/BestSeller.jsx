import React from 'react'
import ProductCard from './productCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
    const {Products} =useAppContext();
  return (
    <div className='mt-16'>
        <p className='text-2xl md:text-3xl font-medium'>
            Best Sellers
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8 mt-6">

            {Products.filter((product)=>product.inStock).slice(0,5).map((product,index)=>(
                
                <ProductCard key={index} product={product}/>
            ))}
            

        </div>
      
    </div>
  )
}

export default BestSeller
