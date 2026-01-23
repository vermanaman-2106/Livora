"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * Typewriter Component
 * Creates a typewriter effect for text
 */
function Typewriter({ 
  text, 
  speed = 60, 
  delay = 0
}: { 
  text: string; 
  speed?: number; 
  delay?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isStarted || currentIndex >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, isStarted]);

  return <span>{displayedText}</span>;
}

/**
 * Premium Text-Only Hero Section
 * Editorial, minimal, luxury - relies solely on typography and spacing
 * No images, gradients, or heavy animations - just confident, quiet elegance
 */
export default function Hero() {
  const headlineLine1 = "Once it belongs,";
  const headlineLine2 = "everything else feels unfinished.";

  return (
    <section className="relative w-full max-w-full min-h-[85vh] flex items-center justify-center bg-[#F4F1EB] px-4 sm:px-6 lg:px-8 py-24 md:py-0 mb-0">
      <div className="w-full max-w-[1000px] mx-auto text-center" style={{ transform: 'translateY(-8%)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="space-y-8 md:space-y-10 lg:space-y-12"
        >
          {/* Main Headline */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#2E2B26] tracking-[-0.01em]"
            style={{ 
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.05
            }}
          >
            <Typewriter text={headlineLine1} speed={70} delay={400} />
            <br />
            <Typewriter 
              text={headlineLine2} 
              speed={70} 
              delay={400 + headlineLine1.length * 70 + 300}
            />
          </h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.5
            }}
            className="text-sm tracking-wide text-[#6B645C] mt-6 font-sans font-normal"
          >
            Sculptural decor designed for quiet spaces.
          </motion.p>

          {/* Luxury Editorial CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.8
            }}
            className="mt-10 md:mt-12"
          >
            <Link
              href="/products"
              className="group inline-block relative pb-2"
            >
              <span
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#2E2B26] uppercase transition-opacity duration-250 group-hover:opacity-70"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontWeight: 500,
                  letterSpacing: "0.25em"
                }}
              >
                SHOP
              </span>
              {/* Underline - positioned with breathing space */}
              <span 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[108%] h-[1px] bg-[#B89B5E] transition-all duration-250 ease-out opacity-70 group-hover:opacity-90"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
