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
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
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

  const addToCartApi = async (qty: number) => {
    const existingCartId = localStorage.getItem("shopify_cart_id");
    const response = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        variantId: selectedVariant,
        quantity: qty,
        cartId: existingCartId,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not add to cart");
    return data;
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      const data = await addToCartApi(quantity);
      if (data.cartId) {
        localStorage.setItem("shopify_cart_id", data.cartId);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart-updated"));
      }
      setAddedToBag(true);
      setTimeout(() => setAddedToBag(false), 3000);
    } catch (error) {
      console.error("Add to cart error:", error);
      const message = error instanceof Error ? error.message : "Something went wrong";
      alert(message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || isBuyingNow) return;

    setIsBuyingNow(true);
    try {
      const data = await addToCartApi(quantity);
      if (data.cartId) {
        localStorage.setItem("shopify_cart_id", data.cartId);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart-updated"));
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (error) {
      console.error("Buy now error:", error);
      const message = error instanceof Error ? error.message : "Something went wrong";
      alert(message);
    } finally {
      setIsBuyingNow(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f6f2ec]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 sm:py-12 md:py-24 lg:py-32">
        {/* Main Product Section: wide grid, gallery uses full column width */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20"
        >
          {/* LEFT: Image Gallery — full available width */}
          <div className="space-y-4 md:space-y-6 min-w-0">
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
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
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

          {/* RIGHT: Product Info — constrained width for readability */}
          <div className="mt-6 md:mt-0 max-w-2xl">
            {/* Title, Price, Description */}
            <div className="mb-8 md:mb-10">
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#2E2B26] leading-[1.15] mb-4 md:mb-6"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 400
                }}
              >
                {cleanedTitle}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-[#2E2B26]/70 font-sans font-normal mb-5 md:mb-7">
                {price}
              </p>
              <p className="text-sm sm:text-base md:text-lg text-[#2E2B26]/60 font-sans font-light leading-relaxed break-words mb-0">
                {oneLineDescription}
              </p>
            </div>

            {/* Variant Selection */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <label className="block text-xs sm:text-sm text-[#2E2B26]/70 mb-3 md:mb-4 font-sans font-normal">
                  Select Variant
                </label>
                <div className="flex flex-wrap gap-3 md:gap-4">
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

            {/* Quantity selector */}
            <div className="mb-6">
              <label className="block text-xs sm:text-sm text-[#2E2B26]/70 mb-3 md:mb-4 font-sans font-normal">
                Quantity
              </label>
              <div className="inline-flex items-center border border-[#2E2B26]/20 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="h-10 w-10 flex items-center justify-center text-[#2E2B26] transition-opacity hover:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <span className="min-w-[2.5rem] text-center text-sm font-sans font-medium text-[#2E2B26]" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  disabled={quantity >= 99}
                  className="h-10 w-10 flex items-center justify-center text-[#2E2B26] transition-opacity hover:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Add to Cart & Buy Now */}
            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || isAddingToCart || isBuyingNow}
                className="w-full px-6 sm:px-8 py-3.5 sm:py-4 md:py-5 bg-[#D4C4B0] text-[#2E2B26] uppercase tracking-wider text-sm sm:text-base font-medium transition-opacity duration-300 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? "Adding…" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!selectedVariant || isAddingToCart || isBuyingNow}
                className="w-full px-6 sm:px-8 py-3.5 sm:py-4 md:py-5 bg-[#2E2B26] text-[#F4F1EB] uppercase tracking-wider text-sm sm:text-base font-medium transition-opacity duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBuyingNow ? "Redirecting…" : "Buy Now"}
              </button>
              <AnimatePresence>
                {addedToBag && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-3 rounded-md border border-[#2E2B26]/15 bg-[#F4F1EB] px-4 py-3 text-sm font-sans text-[#2E2B26]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2E2B26]/10 text-[#2E2B26]" aria-hidden>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>Added to bag.</span>
                    <a href="/cart" className="font-medium underline hover:no-underline">
                      View bag
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Material & Craftsmanship */}
            <div className="border-t border-[#2E2B26]/10 pt-10 md:pt-14 pb-10 md:pb-14">
              <h2 
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#2E2B26] mb-4 md:mb-6 font-light"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Material & Craftsmanship
              </h2>
              <p className="text-sm sm:text-base text-[#2E2B26]/70 leading-relaxed font-sans font-light max-w-xl">
                Each piece is carefully handcrafted using premium materials, designed to bring calm and elegance to modern living spaces. Our collection focuses on sculptural forms that stand as quiet statements in your home.
              </p>
            </div>

            {/* Product Details */}
            <div className="border-t border-[#2E2B26]/10 pt-10 md:pt-14 pb-10 md:pb-14">
              <h2 
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#2E2B26] mb-4 md:mb-6 font-light"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Product Details
              </h2>
              <div className="space-y-3 md:space-y-4 text-sm sm:text-base text-[#2E2B26]/60 font-sans font-light leading-relaxed">
                <div className="flex justify-between gap-4">
                  <span className="font-normal">Material</span>
                  <span className="text-right">Handcrafted Polyresin</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-normal">Dimensions</span>
                  <span className="text-right">Varies by product</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-normal">Weight</span>
                  <span className="text-right">Lightweight</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-normal">Care</span>
                  <span className="text-right">Dust with soft cloth</span>
                </div>
              </div>
            </div>

            {/* Shipping & Returns */}
            <div className="border-t border-[#2E2B26]/10 pt-10 md:pt-14 pb-10 md:pb-14">
              <h2 
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#2E2B26] mb-4 md:mb-6 font-light"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Shipping & Returns
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#2E2B26]/70 leading-relaxed font-sans font-light max-w-xl">
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
            className="mt-16 md:mt-24 lg:mt-32 max-w-3xl mx-auto px-4 sm:px-0 pt-14 md:pt-20 border-t border-[#2E2B26]/10 w-full"
          >
            <h2 
              className="text-xl sm:text-2xl md:text-3xl text-[#2E2B26] mb-6 md:mb-8 font-light"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              About This Piece
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#2E2B26]/70 leading-relaxed font-sans font-light whitespace-pre-line break-words max-w-none">
              {fullDescription}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}