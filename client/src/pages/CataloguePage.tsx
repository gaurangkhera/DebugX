import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import httpClient from '../httpClient';
import { Product } from '../types';
import { api } from '../config';

const CataloguePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resp = await httpClient.get(`${api}/products`);
        setProducts(resp.data);
      } catch (error) {
        console.log("Error while fetching products.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">Browse our catalogue</h2>
        </div>
        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
          {/* product - start */}
          {products.map((product, index) => (
            <div key={index}>
              <Link
                to={`/catalogue/${product.id}`}
                className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3"
              >
                <img
                  src={product.img}
                  loading="lazy"
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                />
              </Link>
              <div>
                <Link
                  to="#"
                  className="hover:gray-800 mb-1 text-gray-500 transition duration-100 lg:text-lg"
                >
                  {product.name}
                </Link>
                <div className="flex items-end gap-2">
                  <span className="font-bold text-gray-800 lg:text-lg">${product.price}</span>
                </div>
              </div>
            </div>
          ))}
          {/* product - end */}
        </div>
      </div>
    </div>
  );
};

export default CataloguePage;
