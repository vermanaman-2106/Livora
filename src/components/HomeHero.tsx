"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomeHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#F4F1EB]">
      <div className="grid md:grid-cols-2 w-full px-4 sm:px-6 lg:px-8">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-[60vh] md:h-[90vh] order-2 md:order-1"
        >
          <div className="relative w-full h-full bg-[#C8BFAF]/20 rounded-sm overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
              alt="Modern living space"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col justify-center px-4 md:px-12 py-12 md:py-0 order-1 md:order-2"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#3B3528] mb-6 leading-tight">
            Transform Your Space
            <br />
            <span className="text-[#B89B5E]">Into Home</span>
          </h1>
          <p className="text-lg text-[#2E2B26]/70 mb-8 leading-relaxed max-w-md">
            Curated home decor pieces that bring warmth and elegance to your everyday living.
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center justify-center w-fit px-8 py-4 bg-[#3B3528] text-[#F4F1EB] rounded-sm text-sm font-medium hover:bg-[#3B3528]/90 transition-colors"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
