import React from 'react';
import { Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem } = useCartStore();
  const isInCart = items.some((item) => item.product.id === product.id);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative pb-[56.25%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: product.currency,
            }).format(product.price / 100)}
          </span>
          <button
            onClick={() => addItem(product)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              isInCart
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isInCart ? (
              <>
                <Check size={16} /> Added
              </>
            ) : (
              <>
                <Plus size={16} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}