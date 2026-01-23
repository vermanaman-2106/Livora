import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full max-w-full bg-[#F4F1EB] border-t border-[#E6E0D6] mt-24 md:mt-32 lg:mt-40">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
          <div>
            <h3 className="text-xl font-serif text-[#2E2B26] mb-6" style={{ fontFamily: "var(--font-playfair), serif" }}>Livora</h3>
            <p className="text-sm text-[#2E2B26]/55 leading-relaxed font-sans font-light">
              Curated home decor for modern living. Warm minimal luxury.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-[#2E2B26] mb-6 font-sans">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/collections/living-room" className="text-sm text-[#2E2B26]/55 hover:text-[#2E2B26] transition-colors font-sans font-light">
                  Living Room
                </Link>
              </li>
              <li>
                <Link href="/collections/bedroom" className="text-sm text-[#2E2B26]/55 hover:text-[#2E2B26] transition-colors font-sans font-light">
                  Bedroom
                </Link>
              </li>
              <li>
                <Link href="/collections/minimal-corners" className="text-sm text-[#2E2B26]/55 hover:text-[#2E2B26] transition-colors font-sans font-light">
                  Minimal Corners
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-[#2E2B26] mb-6 font-sans">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-[#2E2B26]/55 hover:text-[#2E2B26] transition-colors font-sans font-light">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[#2E2B26]/55 hover:text-[#2E2B26] transition-colors font-sans font-light">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-[#2E2B26] mb-6 font-sans">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shipping" className="text-sm text-[#2E2B26]/55 hover:text-[#2E2B26] transition-colors font-sans font-light">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-[#2E2B26]/55 hover:text-[#2E2B26] transition-colors font-sans font-light">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-[#E6E0D6] text-center">
          <p className="text-xs text-[#2E2B26]/60">
            © {new Date().getFullYear()} Livora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
