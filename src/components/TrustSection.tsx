"use client";

import { motion } from "framer-motion";

const trustFeatures = [
  {
    icon: "🚚",
    title: "Free Shipping",
    description: "On orders above ₹2,000",
  },
  {
    icon: "↩️",
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: "💬",
    title: "Support",
    description: "We're here to help",
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F4F1EB] border-t border-[#E6E0D6]">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium text-[#3B3528] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#2E2B26]/70">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
