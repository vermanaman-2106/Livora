"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/shopify";
import { motion } from "framer-motion";

interface CartItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
      handle: string;
      images: {
        edges: Array<{
          node: {
            url: string;
            altText?: string;
          };
        }>;
      };
    };
  };
}

interface Cart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: CartItem;
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get cart ID from localStorage
    const cartId = localStorage.getItem("shopify_cart_id");

    if (!cartId) {
      setLoading(false);
      return;
    }

    async function fetchCart() {
      try {
        const response = await fetch(`/api/cart/get?cartId=${cartId}`);
        if (response.ok) {
          const data = await response.json();
          setCart(data.cart);
        } else {
          setError("Failed to load cart");
        }
      } catch (err) {
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  const handleRemoveItem = async (lineId: string) => {
    const cartId = localStorage.getItem("shopify_cart_id");
    if (!cartId) return;

    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId,
          lineId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cart-updated"));
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleUpdateQuantity = async (lineId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveItem(lineId);
      return;
    }

    const cartId = localStorage.getItem("shopify_cart_id");
    if (!cartId) return;

    try {
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId,
          lineId,
          quantity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cart-updated"));
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F1EB]">
        <div className="text-[#3B3528]">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F1EB]">
        <div className="text-center">
          <p className="text-[#3B3528] mb-4">{error}</p>
          <Link
            href="/"
            className="text-[#B89B5E] hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.lines.edges.length === 0) {
    return (
      <div className="w-full max-w-full min-h-screen bg-[#F4F1EB] py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1200px] mx-auto">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl text-[#2E2B26] mb-12 md:mb-16 font-normal tracking-tight" 
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Your Cart
          </h1>
          <div className="text-center py-24 md:py-32">
            <p className="text-[#2E2B26]/60 mb-8 text-lg">Your cart is empty</p>
            <Link
              href="/"
              className="inline-block text-sm text-[#2E2B26]/60 hover:text-[#2E2B26] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode);

  return (
    <div className="w-full max-w-full min-h-screen bg-[#F4F1EB] py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12 lg:pb-20">
      <div className="w-full max-w-[1200px] mx-auto">
        {/* Page Title */}
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl text-[#2E2B26] mb-12 md:mb-16 font-normal tracking-tight" 
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Your Cart
        </h1>

        {/* 2-Column Grid Layout */}
        <div className="flex flex-col md:grid md:grid-cols-[65%_35%] gap-8 md:gap-12 lg:gap-16">
          {/* LEFT: Cart Items (65%) */}
          <div className="space-y-6 order-1 md:order-1 pb-4 md:pb-0">
            {cart.lines.edges.map(({ node: item }, index) => {
              const image = item.merchandise.product.images.edges[0]?.node;
              const price = formatPrice(
                item.merchandise.price.amount,
                item.merchandise.price.currencyCode
              );

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-6"
                >
                  {/* Product Image */}
                  {image && (
                    <Link
                      href={`/product/${item.merchandise.product.handle}`}
                      className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 bg-[#C8BFAF]/10 rounded-sm overflow-hidden"
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || item.merchandise.product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                      />
                    </Link>
                  )}

                  {/* Product Info & Controls */}
                  <div className="flex-1 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.merchandise.product.handle}`}
                        className="text-base md:text-lg font-medium text-[#2E2B26] hover:opacity-70 transition-opacity block mb-1"
                      >
                        {item.merchandise.product.title}
                      </Link>
                      {item.merchandise.title !== "Default Title" && (
                        <p className="text-sm text-[#2E2B26]/60 mb-3">
                          {item.merchandise.title}
                        </p>
                      )}
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center border border-[#2E2B26]/20 rounded-full text-[#2E2B26] hover:bg-[#2E2B26] hover:text-[#F4F1EB] transition-all duration-200 text-sm font-medium"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-[#2E2B26] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center border border-[#2E2B26]/20 rounded-full text-[#2E2B26] hover:bg-[#2E2B26] hover:text-[#F4F1EB] transition-all duration-200 text-sm font-medium"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Remove Link */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs text-[#2E2B26]/50 hover:text-[#2E2B26] transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg md:text-xl text-[#2E2B26] font-semibold">
                        {price}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: Order Summary (35%) */}
          <div className="order-2 md:order-2 md:sticky md:top-24 h-fit mt-8 md:mt-0">
            <div className="bg-white rounded-xl border border-[#E6E0D6] p-6">
              <h2 
                className="text-xl md:text-2xl text-[#2E2B26] mb-6 font-light"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Order Summary
              </h2>
              
              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#2E2B26]">
                  <span className="font-normal">Subtotal</span>
                  <span className="font-semibold">{total}</span>
                </div>
                <div className="flex justify-between text-sm text-[#2E2B26]/60">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              {/* Divider */}
              <div className="border-t border-[#E6E0D6] my-6"></div>
              
              {/* Total */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg md:text-xl text-[#2E2B26] font-semibold">Total</span>
                <span className="text-xl md:text-2xl text-[#2E2B26] font-bold">{total}</span>
              </div>
              
              {/* Checkout Button */}
              <a
                href={cart.checkoutUrl}
                className="block w-full h-[52px] flex items-center justify-center bg-white border border-[#2E2B26] text-[#2E2B26] uppercase tracking-wider text-sm font-medium transition-all duration-300 hover:text-white hover:-translate-y-0.5 mb-4"
              >
                Checkout
              </a>
              
              {/* Continue Shopping Link */}
              <Link
                href="/"
                className="block w-full text-center text-sm text-[#2E2B26]/60 hover:text-[#2E2B26] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Fixed Bottom Order Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E6E0D6] p-4 z-50 md:hidden">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          {/* Total Price */}
          <div className="flex flex-col">
            <span className="text-xs text-[#2E2B26]/60 mb-1">Total</span>
            <span className="text-xl font-bold text-[#2E2B26]">{total}</span>
          </div>
          
          {/* Checkout Button */}
          <a
            href={cart.checkoutUrl}
            className="flex-1 h-[52px] flex items-center justify-center bg-white border border-[#2E2B26] text-[#2E2B26] uppercase tracking-wider text-sm font-medium transition-all duration-300 hover:bg-[#2E2B26] hover:text-white"
          >
            Checkout
          </a>
        </div>
      </div>
    </div>
  );
}
