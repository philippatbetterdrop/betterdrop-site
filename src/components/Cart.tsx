import React from 'react';
import { ShoppingCart, X, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function Cart() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { items, removeItem, updateQuantity, total } = useCartStore();

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    if (!stripe) return;

    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            price: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const session = await response.json();
      
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:top-4 md:bottom-auto z-10 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <ShoppingCart className="h-6 w-6" />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {items.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <p className="text-center text-gray-500">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: item.product.currency,
                            }).format(item.product.price / 100)}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, Math.max(0, item.quantity - 1))
                              }
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 hover:bg-gray-200 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(total / 100)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}