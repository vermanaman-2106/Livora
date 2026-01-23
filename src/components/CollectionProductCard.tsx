"use client";

import Image from "next/image";
import Link from "next/link";
import { Product, formatPrice } from "@/lib/shopify";

interface CollectionProductCardProps {
  product: Product;
}

/**
 * Clean product title - frontend-only transformation
 * Transforms long supplier titles into curated, elegant names
 */
function cleanProductTitle(title: string): string {
  // Remove common supplier prefixes
  let cleaned = title
    .replace(/^eCraftIndia\s+/i, "")
    .replace(/^ecraftindia\s+/i, "")
    .replace(/\s+Handcrafted.*$/i, "")
    .replace(/\s+Polyresin.*$/i, "")
    .replace(/\s+Decorative.*$/i, "")
    .replace(/\s+Figure.*$/i, "")
    .replace(/\s+Sculpture.*$/i, "")
    .trim();

  // Specific title transformations
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

  // If title is still too long, truncate intelligently
  if (cleaned.length > 40) {
    // Try to break at a word boundary
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

/**
 * Collection Product Card
 * Minimal, editorial product card for the shop collection section
 * Only image, title, and price - no buttons, badges, or heavy animations
 */
export default function CollectionProductCard({ product }: CollectionProductCardProps) {
  const mainImage = product.images[0]?.url;
  const price = formatPrice(product.price, "INR");
  const cleanedTitle = cleanProductTitle(product.title);

  // Fallback for products without images
  if (!mainImage) {
    return (
      <Link href={`/product/${product.handle}`} className="group block">
        <div className="relative overflow-hidden bg-[#C8BFAF]/20 aspect-[3/4] flex items-center justify-center mb-4">
          <p className="text-[#2E2B26]/30 text-xs font-sans">No image</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-sans font-light text-[#2E2B26] line-clamp-2 group-hover:opacity-60 transition-opacity duration-300">
            {cleanedTitle}
          </h3>
          <p className="text-xs font-sans font-light text-[#2E2B26]/50">
            {price}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.handle}`} className="group block">
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-[4/5] mb-6">
        <div className="relative w-full h-full bg-[#C8BFAF]/10">
          <Image
            src={mainImage}
            alt={product.images[0]?.altText || product.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-sm font-sans font-normal text-[#2E2B26] line-clamp-2 leading-relaxed group-hover:opacity-70 transition-opacity duration-500 ease-out">
          {cleanedTitle}
        </h3>
        <p className="text-xs font-sans font-light text-[#2E2B26]/50">
          {price}
        </p>
      </div>
    </Link>
  );
}
