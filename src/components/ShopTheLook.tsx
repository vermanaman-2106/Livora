"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const collections = [
  {
    id: "living-room",
    title: "Living Room",
    description: "Create a space that welcomes",
    image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80",
  },
  {
    id: "bedroom",
    title: "Bedroom",
    description: "Your sanctuary, reimagined",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  },
  {
    id: "minimal-corners",
    title: "Minimal Corners",
    description: "Thoughtful details for quiet moments",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  },
];

export default function ShopTheLook() {
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
            Shop the Look
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/collections/${collection.id}`}>
                <div className="group relative overflow-hidden rounded-sm bg-[#C8BFAF]/20">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-serif text-white mb-1">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-white/90">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
