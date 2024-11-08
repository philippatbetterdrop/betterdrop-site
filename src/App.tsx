import React from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Product } from './types';

// This would typically come from your Stripe API
const products: Product[] = [
  {
    id: 'price_H5ggYwtDq4fbrJ',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 29900,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'price_H5ggYwtDq4fbrK',
    name: 'Smart Watch Series X',
    description: 'Advanced smartwatch with health tracking and seamless connectivity.',
    price: 39900,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'price_H5ggYwtDq4fbrL',
    name: 'Ultra HD Camera',
    description: 'Professional-grade camera for stunning photography and videography.',
    price: 99900,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
  },
  // Add more products as needed
];

function App() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">TechStore</h1>
            </div>
            <div className="relative flex-1 max-w-lg mx-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Cart />
    </div>
  );
}

export default App;