import React, { useState, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../common/LoadingSpinner';
import CartItem from './CartItem';

const Cart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    discountInfo,
    isLoading
  } = useStore();

  // Memoize the toggle function to prevent unnecessary re-renders
  const toggleCart = useCallback(() => {
    setIsOpen(prevState => !prevState);
  }, []);

  const totalAfterDiscount = discountInfo
    ? cartTotal - discountInfo.appliedDiscount
    : cartTotal;

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        onClick={toggleCart}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-primary-light dark:bg-primary-dark text-white p-3 sm:p-4 rounded-full shadow-lg z-10 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
      >
        <FontAwesomeIcon icon={faShoppingCart} className="text-lg sm:text-xl" />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-error-light dark:bg-error-dark text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-background-light dark:bg-background-dark shadow-xl z-50 transform transition-transform duration-300 ease-in-out will-change-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-satoshi-medium text-text-light dark:text-text-dark">Your Cart</h2>
            <button
              onClick={toggleCart}
              className="text-secondary-light dark:text-secondary-dark hover:text-text-light dark:hover:text-text-dark"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center text-secondary-light dark:text-secondary-dark py-8 font-sans">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {/* Discount Section */}
              <div className="mb-3 min-h-[80px] flex items-center justify-center">
                {isLoading ? (
                  <div className="flex justify-center items-center py-2">
                    <LoadingSpinner size="small" color="border-primary-light dark:border-primary-dark" />
                    <span className="ml-2 text-sm text-secondary-light dark:text-secondary-dark">
                      Calculating discount...
                    </span>
                  </div>
                ) : discountInfo ? (
                  <div className="w-full bg-green-100 dark:bg-green-900/20 p-2 rounded-md">
                    <p className="text-sm text-green-800 dark:text-green-300 font-sans">
                      <span className="font-satoshi-medium">NFT Score Discount:</span> {discountInfo.percentage.toFixed(0)}%
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400">
                      You saved ${discountInfo.appliedDiscount.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <div className="w-full bg-blue-100 dark:bg-blue-900/20 p-2 rounded-md">
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-sans">
                      <span className="font-satoshi-medium">Minimum 5% Discount Applied</span>
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Mint an NFT on the Mint page to get higher discounts!
                    </p>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="flex justify-between mb-1">
                <span className="text-sm text-secondary-light dark:text-secondary-dark font-sans">Subtotal:</span>
                <span className="text-sm text-text-light dark:text-text-dark font-sans">${cartTotal.toFixed(2)}</span>
              </div>

              {discountInfo && (
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-secondary-light dark:text-secondary-dark font-sans">Discount:</span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-sans">
                    -${discountInfo.appliedDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-satoshi-medium mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-text-light dark:text-text-dark">Total:</span>
                <span className="text-text-light dark:text-text-dark">${totalAfterDiscount.toFixed(2)}</span>
              </div>

              {/* Buttons */}
              <div className="mt-4 space-y-2">
                <button className="w-full bg-primary-light dark:bg-primary-dark text-white py-2 rounded-md transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 font-satoshi-medium">
                  Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark py-2 rounded-md transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 font-satoshi-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleCart}
        />
      )}
    </div>
  );
};

export default Cart;
