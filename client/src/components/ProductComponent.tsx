import React from 'react'
import { useParams } from 'react-router-dom'
import { Product } from '../types';
import { useState, useEffect } from "react"
import httpClient from '../httpClient';
import { api } from '../config';

const ProductComponent:React.FC = () => {

  const { productId } = useParams<{ productId: string }>();
  const [buttonText, setButtonText] = useState<string | null>('Add to cart')
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get(`${api}/product/${productId}`);
        setProduct(resp.data);
      } catch (error) {
        console.log("Error while fetching product");
      }
    })();
  }, []);

  const addToCart = async() => {
    try{
      const resp = await httpClient.post(`${api}/addtocart/${productId}`);
      setButtonText('Remove from cart')
    } catch(error : any){
      console.log('error while adding to cart.')
    }
  }

  const removeFromCart = async() => {
    try{
      const resp = await httpClient.post(`${api}/removefromcart/${productId}`);
      setButtonText('Add to cart')
    } catch(error : any){
      console.log('error while removing from cart.')
    }
  }

  useEffect(() => {
    // Define an async function to use with useEffect
    const checkCart = async () => {
      try {
        const resp = await httpClient.get(`${api}/checkcart/${productId}`);
        const { in_cart } = resp.data;
  
        // Update the button text based on cart status
        if (in_cart) {
          setButtonText('Remove from cart');
        } else {
          setButtonText('Add to cart');
        }
      } catch (error) {
        console.log('Error while checking if the product is in the cart.');
        setButtonText('Add to cart'); // Set the button text to default if there is an error
      }
    };
  
    // Call the checkCart function
    checkCart();
  }, []);
  
  
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
  <div className="mx-auto max-w-screen-lg px-4 md:px-8">
    <div className="grid gap-8 md:grid-cols-2">
      {/* images - start */}
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product?.img}
            loading="lazy"
            alt="Photo by Himanshu Dewangan"
            className="h-full w-full object-cover object-center"
          />
          <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
            sale
          </span>
        </div>
      </div>
      {/* images - end */}
      {/* content - start */}
      <div className="md:py-8">
        {/* name - start */}
        <div className="mb-2 md:mb-3">
          <span className="mb-0.5 inline-block text-gray-500">{product?.category}</span>
          <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
            {product?.name}
          </h2>
        </div>
        {/* name - end */}
        {/* price - start */}
        <div className="mb-4">
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-gray-800 md:text-2xl">
              ${product?.price}
            </span>
          </div>
          <span className="text-sm text-gray-500">incl. VAT plus shipping</span>
        </div>
        {/* price - end */}
        {/* shipping notice - start */}
        <div className="mb-6 flex items-center gap-2 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
            />
          </svg>
          <span className="text-sm">2-4 day shipping</span>
        </div>
        {/* shipping notice - end */}
        {/* buttons - start */}
        <div className="flex gap-2.5">
          <button
            onClick={buttonText == 'Remove from cart' ? removeFromCart : addToCart}
            className={`inline-block flex-1 rounded ${buttonText == "Add to cart" ? 'bg-black hover:bg-gray-700': 'bg-red-400 hover:bg-red-500'} px-8 py-3 text-center text-sm font-semibold text-white outline-none transition duration-100 focus-visible:ring sm:flex-none md:text-base`}
          >
            {buttonText}
          </button>
          <a
            href="#"
            className="inline-block rounded-lg bg-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </a>
        </div>
        {/* buttons - end */}
      </div>
      {/* content - end */}
    </div>
  </div>
</div>

  )
}

export default ProductComponent