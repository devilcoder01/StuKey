import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { CartItem as CartItemType } from '../../context/StoreContext';

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-3">
      <div className="flex-grow">
        <h3 className="text-sm font-medium text-text-light dark:text-text-dark">
          {item.product.name}
        </h3>
        <p className="text-xs text-secondary-light dark:text-secondary-dark">
          ${item.product.price.toFixed(2)} each
        </p>
        <div className="flex items-center mt-1">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="text-xs bg-gray-200 dark:bg-gray-700 rounded-full h-5 w-5 flex items-center justify-center"
            aria-label="Decrease quantity"
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="mx-2 text-sm text-text-light dark:text-text-dark">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="text-xs bg-gray-200 dark:bg-gray-700 rounded-full h-5 w-5 flex items-center justify-center"
            aria-label="Increase quantity"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium text-text-light dark:text-text-dark">
          ${(item.product.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => removeFromCart(item.product.id)}
          className="text-error-light dark:text-error-dark text-xs mt-1"
          aria-label="Remove item"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(CartItem);
