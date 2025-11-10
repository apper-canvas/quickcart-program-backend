import React from "react";
import ProductGrid from "@/components/organisms/ProductGrid";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-primary">
              Discover Amazing{" "}
              <span className="bg-gradient-to-r from-accent to-red-500 bg-clip-text text-transparent">
                Products
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Shop the latest electronics, fashion, and home essentials with fast shipping and great prices.
            </p>
          </div>

          <ProductGrid />
        </div>
      </div>
    </div>
  );
};

export default HomePage;