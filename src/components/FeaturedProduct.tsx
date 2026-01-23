"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product, formatPrice } from "@/lib/shopify";

interface FeaturedProductProps {
  product?: Product;
}

export default function FeaturedProduct({ product }: FeaturedProductProps) {
  // Fallback product data if Shopify is not connected
  const featuredProduct = product || {
    id: "1",
    title: "Minimalist Ceramic Vase",
    handle: "minimalist-ceramic-vase",
    description: "A timeless piece that brings elegance to any space.",
    price: "2499",
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
        altText: "Minimalist Ceramic Vase",
      },
    ],
    variants: [],
  };

  const mainImage = featuredProduct.images[0]?.url || "/placeholder.jpg";
  const price = formatPrice(featuredProduct.price, "INR");

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F4F1EB]">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-[#3B3528] mb-4">
            Featured
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square bg-[#C8BFAF]/20 rounded-sm overflow-hidden"
          >
            <Image
              src={mainImage}
              alt={featuredProduct.images[0]?.altText || featuredProduct.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-3xl md:text-4xl font-serif text-[#3B3528]">
              {featuredProduct.title}
            </h3>
            <p className="text-lg text-[#2E2B26]/70 leading-relaxed">
              {featuredProduct.description}
            </p>
            <div className="text-2xl font-medium text-[#3B3528]">
              {price}
            </div>
            <Link
              href={`/product/${featuredProduct.handle}`}
              className="inline-flex items-center justify-center px-8 py-4 bg-[#3B3528] text-[#F4F1EB] rounded-sm text-sm font-medium hover:bg-[#3B3528]/90 transition-colors"
            >
              View Product
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
