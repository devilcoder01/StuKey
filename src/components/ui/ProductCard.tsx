import React from 'react';
import { Product, useStore } from '../../context/StoreContext';
import { useToastNotification } from '../../hooks/useToastNotification';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();
  const { showSuccess } = useToastNotification();

  const handleAddToCart = () => {
    addToCart(product);
    showSuccess(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-background-light dark:bg-[#1E1E1E] rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {/* Product image with fallback */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/products/placeholder.svg"
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30">
            <div className="text-5xl sm:text-6xl text-white">
              {product.category === 'hosting' && '🌐'}
              {product.category === 'domain' && '🔠'}
              {product.category === 'storage' && '☁️'}
              {product.category === 'software' && '💻'}
              {product.category === 'education' && '📚'}
              {product.category === 'security' && '🔒'}
            </div>
            <span className="text-xs sm:text-sm mt-2 text-white font-medium">{product.category}</span>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-satoshi-medium text-text-light dark:text-text-dark mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-secondary-light dark:text-secondary-dark text-xs sm:text-sm mb-3 line-clamp-2 font-sans">{product.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-base sm:text-lg font-satoshi-bold text-text-light dark:text-text-dark">
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            className="bg-primary-light dark:bg-primary-dark text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-satoshi-medium transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
