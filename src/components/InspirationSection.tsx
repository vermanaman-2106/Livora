"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const inspirationImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&q=80",
    alt: "Minimalist living room",
    collection: "living-room",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    alt: "Cozy bedroom",
    collection: "bedroom",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    alt: "Modern dining space",
    collection: "dining",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    alt: "Serene corner",
    collection: "minimal-corners",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80",
    alt: "Elegant workspace",
    collection: "workspace",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    alt: "Warm reading nook",
    collection: "minimal-corners",
  },
];

export default function InspirationSection() {
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
            Inspiration
          </h2>
          <p className="text-[#2E2B26]/70 max-w-2xl mx-auto">
            Discover curated spaces that inspire. Click to shop the look.
          </p>
        </motion.div>

        {/* Pinterest-style masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {inspirationImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="break-inside-avoid mb-4"
            >
              <Link href={`/collections/${image.collection}`}>
                <div className="relative overflow-hidden rounded-sm bg-[#C8BFAF]/20 group cursor-pointer">
                  <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
