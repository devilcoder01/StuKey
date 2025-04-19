import React, { useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../ui/ProductCard';
import Cart from '../ui/Cart';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Store: React.FC = () => {
  const { products } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useGSAP(() => {
    // Make sure elements are visible initially
    if (titleRef.current) gsap.set(titleRef.current, { opacity: 1 });
    if (descriptionRef.current) gsap.set(descriptionRef.current, { opacity: 1 });
    if (productsRef.current?.children) {
      gsap.set(productsRef.current.children, { opacity: 1 });
    }

    // Then animate them
    const tl = gsap.timeline();

    tl.from(titleRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from(descriptionRef.current, {
      y: -15,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3')
    

    // Ensure everything is visible at the end
    tl.eventCallback('onComplete', () => {
      if (productsRef.current?.children) {
        gsap.set(productsRef.current.children, { clearProps: 'all' });
      }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl font-satoshi-bold text-text-light dark:text-text-dark mb-3 sm:mb-4"
          >
            Student Store
          </h1>
          <p
            ref={descriptionRef}
            className="text-base sm:text-lg text-secondary-light dark:text-secondary-dark max-w-2xl mx-auto px-2 font-sans"
          >
            Exclusive products and services for students with special discounts based on your StuKey NFT score.
          </p>
        </div>

        {/* Products Grid */}
        <div
          ref={productsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Cart Component */}
      <Cart />
    </div>
  );
};

export default Store;
