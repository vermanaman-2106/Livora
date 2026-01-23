"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product, formatPrice } from "@/lib/shopify";

interface ProductCardProps {
  product: Product;
  index?: number;
}

/**
 * ProductCard Component
 * Displays a single product with image, title, and price
 * Includes hover effects and links to product detail page
 */
export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const mainImage = product.images[0]?.url;
  const price = formatPrice(product.price, "INR");
  const comparePrice = product.compareAtPrice
    ? formatPrice(product.compareAtPrice, "INR")
    : null;

  // Fallback image if no product image
  if (!mainImage) {
    return (
      <div className="group">
        <div className="relative overflow-hidden bg-[#C8BFAF]/30 rounded-sm aspect-[4/5] flex items-center justify-center">
          <p className="text-[#2E2B26]/50 text-sm">No image</p>
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium text-[#3B3528] line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#2E2B26]">{price}</span>
            {comparePrice && (
              <span className="text-xs text-[#2E2B26]/50 line-through">
                {comparePrice}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/product/${product.handle}`}>
        <div className="relative overflow-hidden bg-[#C8BFAF]/30 rounded-sm">
          <div className="aspect-[4/5] relative overflow-hidden">
            <Image
              src={mainImage}
              alt={product.images[0]?.altText || product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium text-[#3B3528] line-clamp-2 group-hover:opacity-70 transition-opacity">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#2E2B26]">{price}</span>
            {comparePrice && (
              <span className="text-xs text-[#2E2B26]/50 line-through">
                {comparePrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
