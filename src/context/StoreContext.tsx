import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useStudentContract } from '../utils/ContractInterection';
import { useWallet } from './WalletContext';
import { useToastNotification } from '../hooks/useToastNotification';

// Define types for our store
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface DiscountInfo {
  percentage: number;
  appliedDiscount: number;
}

interface StoreContextType {
  products: Product[];
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  discountInfo: DiscountInfo | null;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Student Hosting Plan',
    description: 'Affordable web hosting for student projects',
    price: 5.99,
    category: 'hosting',
    image: '/products/hosting.png',
  },
  {
    id: '2',
    name: 'Domain Name (.edu)',
    description: 'Get your own .edu domain name',
    price: 12.99,
    category: 'domain',
    image: '/products/domain.png',
  },
  {
    id: '3',
    name: 'Cloud Storage (100GB)',
    description: 'Secure cloud storage for your assignments and projects',
    price: 4.99,
    category: 'storage',
    image: '/products/storage.png',
  },
  {
    id: '4',
    name: 'Student Developer Pack',
    description: 'Essential software tools for student developers',
    price: 29.99,
    category: 'software',
    image: '/products/devpack.png',
  },
  {
    id: '5',
    name: 'Online Course Subscription',
    description: 'Access to premium online courses',
    price: 19.99,
    category: 'education',
    image: '/products/course.png',
  },
  {
    id: '6',
    name: 'Student VPN Service',
    description: 'Secure VPN service for students',
    price: 3.99,
    category: 'security',
    image: '/products/vpn.png',
  },
];

// Calculate discount based on NFT score
const calculateDiscount = (score: number): number => {
  // Convert score to number if it's a string
  const numScore = typeof score === 'string' ? parseInt(score, 10) : score;

  if (numScore > 70) return 0.15; // 15% discount for scores above 70
  if (numScore >= 41) return 0.13; // 13% discount for scores 41-70
  if (numScore >= 20) return 0.07; // 7% discount for scores 20-40
  return 0.05; // 5% discount for scores below 20
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(sampleProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { userAccount } = useWallet();
  const { getScoreandNFT } = useStudentContract();
  const { showError } = useToastNotification();

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Store the NFT score in a ref to avoid unnecessary re-fetches
  const nftScoreRef = useRef<number | null>(null);
  const lastUserAccountRef = useRef<string | null>(null);

  // Fetch NFT score once when user account changes
  useEffect(() => {
    const fetchNFTScore = async () => {
      if (!userAccount) {
        nftScoreRef.current = null;
        lastUserAccountRef.current = null;
        return;
      }

      // Skip if we already have the score for this account
      if (userAccount === lastUserAccountRef.current && nftScoreRef.current !== null) {
        return;
      }

      try {
        setIsLoading(true);
        const result = await getScoreandNFT(userAccount);

        if (result.success) {
          const score = result.score !== undefined ? parseInt(result.score) : null;
          if (score !== null && !isNaN(score)) {
            nftScoreRef.current = score;
            lastUserAccountRef.current = userAccount;
            console.log('NFT Score retrieved and cached:', score);
          } else {
            nftScoreRef.current = null;
            console.warn('Invalid score value:', result.score);
          }
        } else {
          nftScoreRef.current = null;
          console.warn('Failed to get NFT score:', result);
        }
      } catch (error) {
        nftScoreRef.current = null;
        console.error("Error fetching score:", error);
        showError("Failed to retrieve NFT score");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTScore();
  }, [userAccount, getScoreandNFT, showError]);

  // Calculate discount when cart total or NFT score changes
  useEffect(() => {
    // Don't calculate if cart is empty
    if (cartItems.length === 0) {
      setDiscountInfo(null);
      return;
    }

    // Use a small delay to prevent rapid recalculations during quantity changes
    const timer = setTimeout(() => {
      // Calculate discount based on cached NFT score
      const score = nftScoreRef.current;
      if (score !== null) {
        const discountPercentage = calculateDiscount(score);
        const appliedDiscount = cartTotal * discountPercentage;

        setDiscountInfo({
          percentage: discountPercentage * 100,
          appliedDiscount
        });
      } else {
        // Default discount if no NFT score is available
        const defaultDiscount = 0.05; // 5% minimum discount
        setDiscountInfo({
          percentage: defaultDiscount * 100,
          appliedDiscount: cartTotal * defaultDiscount
        });
      }
    }, 300); // 300ms delay to debounce calculations

    // Clean up timer on component unmount or when dependencies change
    return () => clearTimeout(timer);
  }, [cartItems, cartTotal]);

  // Add product to cart
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  // Update quantity of a product in cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        discountInfo,
        isLoading
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
