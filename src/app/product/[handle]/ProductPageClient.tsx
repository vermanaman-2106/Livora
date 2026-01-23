"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { formatPrice, Product } from "@/lib/shopify";
import { motion, AnimatePresence } from "framer-motion";

interface ProductPageClientProps {
  product: Product;
}

/**
 * Clean product title - frontend-only transformation
 */
function cleanProductTitle(title: string): string {
  let cleaned = title
    .replace(/^eCraftIndia\s+/i, "")
    .replace(/^ecraftindia\s+/i, "")
    .replace(/\s+Handcrafted.*$/i, "")
    .replace(/\s+Polyresin.*$/i, "")
    .replace(/\s+Decorative.*$/i, "")
    .replace(/\s+Figure.*$/i, "")
    .replace(/\s+Sculpture.*$/i, "")
    .trim();

  const titleMap: Record<string, string> = {
    "black loving swan couple": "Loving Swan Sculpture",
    "black and golden meditating lord buddha": "Meditative Buddha Figure",
    "aesthetic face vase": "Aesthetic Face Vase",
    "wind bell for home": "Minimal Wind Bell",
  };

  const lowerTitle = cleaned.toLowerCase();
  for (const [key, value] of Object.entries(titleMap)) {
    if (lowerTitle.includes(key)) {
      return value;
    }
  }

  if (cleaned.length > 40) {
    const words = cleaned.split(" ");
    let result = "";
    for (const word of words) {
      if ((result + " " + word).length <= 40) {
        result += (result ? " " : "") + word;
      } else {
        break;
      }
    }
    return result || cleaned.substring(0, 40) + "...";
  }

  return cleaned;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.variants[0]?.id || null
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const price = formatPrice(product.price, "INR");
  const cleanedTitle = cleanProductTitle(product.title);
  const mainImage = product.images[selectedImage]?.url || product.images[0]?.url;
  
  // Clean and format description
  const cleanDescription = (desc: string | null | undefined): string => {
    if (!desc) return "";
    // Remove HTML tags
    let cleaned = desc.replace(/<[^>]*>/g, "");
    // Replace multiple spaces with single space
    cleaned = cleaned.replace(/\s+/g, " ");
    // Replace multiple newlines with single newline
    cleaned = cleaned.replace(/\n\s*\n/g, "\n");
    return cleaned.trim();
  };

  const fullDescription = cleanDescription(product.description);
  
  // Extract one-line description from full description
  const oneLineDescription = fullDescription
    ? fullDescription.split('\n')[0].trim().substring(0, 150) + (fullDescription.split('\n')[0].trim().length > 150 ? "..." : "")
    : "A carefully selected piece for modern living.";

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && selectedImage < product.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
    if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const goToNextImage = () => {
    if (selectedImage < product.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const goToPreviousImage = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    try {
      // Get existing cart ID from localStorage
      const existingCartId = localStorage.getItem("shopify_cart_id");
      
      // Create or add to cart using Shopify Storefront API
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId: selectedVariant,
          quantity: 1,
          cartId: existingCartId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Save cart ID to localStorage
        if (data.cart?.id) {
          localStorage.setItem("shopify_cart_id", data.cart.id);
        }
        
        // Redirect to cart page
        window.location.href = "/cart";
      } else {
        // Fallback: redirect to Shopify cart
        const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "livora-5492.myshopify.com";
        const checkoutUrl = `https://${storeDomain}/cart/${selectedVariant}:1`;
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Fallback: redirect to Shopify cart
      const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "livora-5492.myshopify.com";
      const checkoutUrl = `https://${storeDomain}/cart/${selectedVariant}:1`;
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="w-full max-w-full min-h-screen bg-[#f6f2ec]">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-12 md:py-24 lg:py-32">
        {/* Main Product Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-20 lg:gap-24 xl:gap-28"
        >
          {/* LEFT: Image Gallery */}
          <div className="space-y-3 sm:space-y-4 md:space-y-8">
            {/* Main Image with Swipe Support */}
            <div 
              ref={imageContainerRef}
              className="relative aspect-square bg-white overflow-hidden touch-pan-y select-none"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={product.images[selectedImage]?.url || mainImage}
                    alt={product.images[selectedImage]?.altText || cleanedTitle}
                    fill
                    className="object-cover"
                    priority={selectedImage === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows (Desktop) */}
              {product.images.length > 1 && (
                <>
                  {/* Previous Arrow */}
                  {selectedImage > 0 && (
                    <button
                      onClick={goToPreviousImage}
                      className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/80 hover:bg-white transition-colors duration-200 z-10"
                      aria-label="Previous image"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#2E2B26]"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                  )}

                  {/* Next Arrow */}
                  {selectedImage < product.images.length - 1 && (
                    <button
                      onClick={goToNextImage}
                      className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/80 hover:bg-white transition-colors duration-200 z-10"
                      aria-label="Next image"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#2E2B26]"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  )}
                </>
              )}

              {/* Image Counter (Mobile) */}
              {product.images.length > 1 && (
                <div className="md:hidden absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
                  {selectedImage + 1} / {product.images.length}
                </div>
              )}
            </div>
            
            {/* Horizontal Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 sm:gap-3 md:gap-5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 overflow-hidden transition-all duration-300 rounded-sm ${
                      selectedImage === index
                        ? "opacity-100 ring-2 ring-[#2E2B26] ring-offset-2 ring-offset-[#f6f2ec]"
                        : "opacity-60 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${cleanedTitle} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 80px"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-5 sm:space-y-6 md:space-y-12 mt-4 sm:mt-6 md:mt-0">
            {/* Title, Price, Description Group */}
            <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#2E2B26] leading-[1.1]"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 400
                }}
              >
                {cleanedTitle}
              </h1>
              
              {/* Price */}
              <p className="text-lg sm:text-xl md:text-2xl text-[#2E2B26]/70 font-sans font-normal mt-1">
                {price}
              </p>

              {/* One-line Description */}
              <p className="text-sm sm:text-base md:text-lg text-[#2E2B26]/60 font-sans font-light leading-relaxed mt-2 break-words">
                {oneLineDescription}
              </p>
            </div>

            {/* Variant Selection (Quantity/Variant) */}
            {product.variants.length > 1 && (
              <div>
                <label className="block text-xs sm:text-sm text-[#2E2B26]/70 mb-3 sm:mb-4 font-sans font-normal">
                  Select Variant
                </label>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-sans font-normal transition-all duration-300 ${
                        selectedVariant === variant.id
                          ? "bg-[#2E2B26] text-[#f6f2ec]"
                          : "bg-transparent text-[#2E2B26] border border-[#2E2B26]/20 hover:border-[#2E2B26]/40"
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="mt-5 sm:mt-6 md:mt-8">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant}
                className="w-full px-6 sm:px-8 py-3.5 sm:py-4 md:py-5 bg-[#D4C4B0] text-[#2E2B26] uppercase tracking-wider text-sm sm:text-sm md:text-base font-medium transition-opacity duration-300 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>

            {/* Material & Craftsmanship */}
            <div className="border-t border-[#2E2B26]/10 pt-5 sm:pt-6 md:pt-8">
              <h2 
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#2E2B26] mb-3 sm:mb-4 md:mb-6 font-light"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Material & Craftsmanship
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#2E2B26]/70 leading-relaxed font-sans font-light">
                Each piece is carefully handcrafted using premium materials, designed to bring calm and elegance to modern living spaces. Our collection focuses on sculptural forms that stand as quiet statements in your home.
              </p>
            </div>

            {/* Product Details */}
            <div className="border-t border-[#2E2B26]/10 pt-5 sm:pt-6 md:pt-8">
              <h2 
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#2E2B26] mb-3 sm:mb-4 md:mb-6 font-light"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Product Details
              </h2>
              <div className="space-y-2.5 sm:space-y-3 md:space-y-4 text-xs sm:text-sm text-[#2E2B26]/60 font-sans font-light">
                <div className="flex justify-between">
                  <span className="font-normal">Material</span>
                  <span className="text-right">Handcrafted Polyresin</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-normal">Dimensions</span>
                  <span className="text-right">Varies by product</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-normal">Weight</span>
                  <span className="text-right">Lightweight</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-normal">Care</span>
                  <span className="text-right">Dust with soft cloth</span>
                </div>
              </div>
            </div>

            {/* Shipping & Returns */}
            <div className="border-t border-[#2E2B26]/10 pt-5 sm:pt-6 md:pt-8">
              <h2 
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#2E2B26] mb-3 sm:mb-4 md:mb-6 font-light"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Shipping & Returns
              </h2>
              <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm md:text-base text-[#2E2B26]/70 leading-relaxed font-sans font-light">
                <p>
                  Free shipping on orders above ₹2,000. Orders are carefully packaged and typically ship within 2-3 business days.
                </p>
                <p>
                  30-day return policy. If you're not completely satisfied, you can return your purchase for a full refund.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Editorial Description Below (Full Width) */}
        {fullDescription && fullDescription.length > oneLineDescription.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 sm:mt-16 md:mt-24 lg:mt-32 xl:mt-40 max-w-3xl mx-auto px-4 sm:px-0"
          >
            <h2 
              className="text-xl sm:text-2xl md:text-3xl text-[#2E2B26] mb-6 sm:mb-8 font-light"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              About This Piece
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-sm sm:text-base md:text-lg text-[#2E2B26]/70 leading-relaxed font-sans font-light whitespace-pre-line break-words">
                {fullDescription}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}