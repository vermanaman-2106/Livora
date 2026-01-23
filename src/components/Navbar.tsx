"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/**
 * Premium Luxury Navbar
 * Editorial, minimal, old-money inspired
 * Quiet luxury - confident and designed, not decorated
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-[#F4F1EB]/90 backdrop-blur-md border-b border-black/5"
          : "bg-[#F4F1EB]/90 backdrop-blur-md border-b border-black/4"
      }`}
    >
      <div className="w-full max-w-full">
        {/* Desktop: 3-Column Grid Layout */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center h-16 md:h-[72px] px-6 md:px-10 py-4">
          {/* LEFT: Navigation Links */}
          <div className="flex items-center justify-start gap-8">
            <Link
              href="/"
              className="text-[14px] md:text-[15px] text-[#2E2B26] uppercase tracking-[0.08em] font-sans font-normal transition-opacity duration-200 ease-in-out hover:opacity-60"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-[14px] md:text-[15px] text-[#2E2B26] uppercase tracking-[0.08em] font-sans font-normal transition-opacity duration-200 ease-in-out hover:opacity-60"
            >
              About
            </Link>
            <Link
              href="/products"
              className="text-[14px] md:text-[15px] text-[#2E2B26] uppercase tracking-[0.08em] font-sans font-normal transition-opacity duration-200 ease-in-out hover:opacity-60"
            >
              Collection
            </Link>
          </div>

          {/* CENTER: Brand Logo */}
          <div className="flex items-center justify-center">
            <Link
              href="/"
              className="text-[36px] md:text-[40px] text-[#2E2B26] leading-none tracking-tight transition-opacity duration-200 ease-in-out hover:opacity-60"
              style={{
                fontFamily: "var(--font-signature), cursive",
                fontWeight: 400,
                transform: "translateY(2px)", // Slight vertical optical adjustment
              }}
            >
              Livora
            </Link>
          </div>

          {/* RIGHT: Cart Icon */}
          <div className="flex items-center justify-end">
            <Link
              href="/cart"
              className="transition-opacity duration-200 ease-in-out hover:opacity-60"
              aria-label="Shopping Cart"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#2E2B26]"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile: Hamburger Menu */}
        <div className="md:hidden flex items-center justify-between h-16 px-6 py-4">
          {/* Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#2E2B26] transition-opacity duration-200 ease-in-out hover:opacity-60"
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          {/* Mobile Logo */}
          <Link
            href="/"
            className="text-[32px] text-[#2E2B26] leading-none tracking-tight transition-opacity duration-200 ease-in-out hover:opacity-60"
            style={{
              fontFamily: "var(--font-signature), cursive",
              fontWeight: 400,
              transform: "translateY(2px)",
            }}
          >
            Livora
          </Link>

          {/* Mobile Cart Icon */}
          <Link
            href="/cart"
            className="transition-opacity duration-200 ease-in-out hover:opacity-60"
            aria-label="Shopping Cart"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#2E2B26]"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/5 bg-[#F4F1EB]">
            <div className="px-6 py-6 space-y-5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg text-[#2E2B26] uppercase tracking-[0.08em] font-sans font-normal transition-opacity duration-200 ease-in-out hover:opacity-60"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg text-[#2E2B26] uppercase tracking-[0.08em] font-sans font-normal transition-opacity duration-200 ease-in-out hover:opacity-60"
              >
                About
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg text-[#2E2B26] uppercase tracking-[0.08em] font-sans font-normal transition-opacity duration-200 ease-in-out hover:opacity-60"
              >
                Collection
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
