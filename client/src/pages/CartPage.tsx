import React, { useState, useEffect } from 'react';
import httpClient from '../httpClient';
import { Product } from '../types';
import { api } from '../config';

interface Window {
    Stripe?: any;
  }

const CartPage = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);


  const calculateTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price, 0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resp = await httpClient.get(`${api}/cart`);
        setCart(resp.data);
      } catch (error) {
        console.log("Error while fetching products.");
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setTotal(calculateTotalPrice());
  }, [cart]);

  const buyProduct = async () => {
    fetch(`${api}/stripe_pay`)
      .then((result) => result.json())
      .then((data) => {
        var stripe = (window as any).Stripe(data.checkout_public_key);
        stripe.redirectToCheckout({
          sessionId: data.checkout_session_id
        }).then(function (result:any) {
          console.log(result);
        });
      });
  }

  const removeFromCart = async (productId: string) => {
    try {
      const resp = await httpClient.post(`${api}/removefromcart/${productId}`);
      setCart(resp.data);
    } catch (error: any) {
      console.log('Error while removing from cart.');
    }
  };

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <div className="mb-6 sm:mb-10 lg:mb-16">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            Your Cart
          </h2>
        </div>
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:gap-6">
          {cart.length > 0 ? (
            cart.map((product) => (
              <div
                key={product.id}
                className="flex flex-wrap gap-x-4 overflow-hidden rounded-lg border sm:gap-y-4 lg:gap-6"
              >
                <a
                  href="#"
                  className="group relative block h-48 w-32 overflow-hidden bg-gray-100 sm:h-56 sm:w-40"
                >
                  <img
                    src={product.img}
                    loading="lazy"
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                  />
                </a>
                <div className="flex flex-1 flex-col justify-between py-4">
                  <div>
                    <a
                      href="#"
                      className="mb-1 inline-block text-lg font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-xl"
                    >
                      {product.name}
                    </a>
                  </div>
                  <div>
                    <span className="mb-1 block font-bold text-gray-800 md:text-lg">
                      ${product.price}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      In stock
                    </span>
                  </div>
                </div>
                <div className="flex w-full justify-between border-t p-4 sm:w-auto sm:border-none sm:pl-0 lg:p-6 lg:pl-0">
                  <div className="flex flex-col items-start gap-2">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="select-none text-sm font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="ml-4 pt-3 md:ml-8 md:pt-2 lg:ml-16">
                    <span className="block font-bold text-gray-800 md:text-lg">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span>No products found</span>
          )}
        </div>

        {/* Total Section */}
        <div className="flex flex-col items-end gap-4">
          <div className="w-full rounded-lg bg-gray-100 p-4 sm:max-w-xs">
            <div className="space-y-1">
              <div className="flex justify-between gap-4 text-gray-500">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between gap-4 text-gray-500">
                <span>Shipping</span>
                <span>$4.99</span>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex items-start justify-between gap-4 text-gray-800">
                <span className="text-lg font-bold">Total</span>
                <span className="flex flex-col items-end">
                  <span className="text-lg font-bold">
                    ${total} USD
                  </span>
                  <span className="text-sm text-gray-500">including VAT</span>
                </span>
              </div>
            </div>
          </div>
          <button onClick={buyProduct} className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">
            Check out
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
