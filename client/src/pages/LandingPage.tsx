import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";
import { User } from "../types";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <section className="relative py-12 sm:py-16 lg:pb-40">
        <div className="absolute bottom-0 right-0 overflow-hidden">
            <img className="w-full h-auto origin-bottom-right transform scale-150 lg:w-auto lg:mx-auto lg:object-cover lg:scale-75" src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/background-pattern.png" alt="" />
        </div>

        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-y-4 lg:items-center lg:grid-cols-2 xl:grid-cols-2">
                <div className="text-center xl:col-span-1 lg:text-left md:px-16 lg:px-0 xl:pr-20">
                    <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-pj">Debug your code, without spending hours.</h1>
                    <p className="mt-2 text-lg text-gray-600 sm:mt-6 font-inter">Ever spent hours on finding a bug? Only to realise it was due to a silly mistake? Avoid that today with DebugX.</p>

                    <a href="#" title="" className="inline-flex px-8 py-4 mt-8 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded sm:mt-10 font-pj hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" role="button">
                        Try our free editor
                    </a>
                </div>

                <div className="xl:col-span-1">
                    <img className="w-full mx-auto" src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/illustration.png" alt="" />
                </div>
            </div>
        </div>
    </section>

  );
};

export default LandingPage;
