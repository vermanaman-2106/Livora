import Link from "next/link";

/**
 * About Page - Premium Minimal Design
 * Luxury home decor brand - calm, warm, old-money aesthetic
 */
export default function AboutPage() {
  return (
    <div className="w-100vw max-w-full min-h-screen bg-[#F4F1EB] py-16 md:py-24 lg:py-32">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-24">
        {/* SECTION 1 — HERO */}
        <section className="flex flex-col items-center text-center">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#2E2B26] mb-6 font-normal tracking-tight leading-[1.1]"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            About Livora
          </h1>
          
          <p
            className="text-xl md:text-2xl lg:text-3xl text-[#2E2B26] mb-6 font-light italic leading-relaxed"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Objects made to belong —<br />
            not to shout for attention.
          </p>
          
          <p className="text-sm md:text-base text-[#2E2B26]/60 font-sans font-light tracking-wide">
            Sculptural decor designed for quiet spaces.
          </p>
        </section>

        {/* SECTION 2 — OUR PHILOSOPHY */}
        <section className="mt-28">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#2E2B26] mb-8 font-light tracking-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Our Philosophy
          </h2>
          
          <div className="space-y-6">
            <p className="text-base md:text-lg lg:text-xl text-[#2E2B26]/80 font-sans font-light leading-relaxed">
              At Livora, we believe that a space is never defined by how much it holds —<br />
              but by what truly belongs within it.
            </p>
            
            <p className="text-base md:text-lg lg:text-xl text-[#2E2B26]/80 font-sans font-light leading-relaxed">
              Every piece in our collection is selected to bring stillness, balance,<br />
              and quiet beauty into everyday living.
            </p>
            
            <p className="text-base md:text-lg lg:text-xl text-[#2E2B26]/80 font-sans font-light leading-relaxed">
              Designed not to impress at first glance,<br />
              but to feel essential over time.
            </p>
          </div>
        </section>

        {/* SECTION 3 — WHAT WE CREATE */}
        <section className="mt-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Card 1 */}
            <div className="text-center md:text-left">
              <h3
                className="text-xl md:text-2xl text-[#2E2B26] mb-4 font-light"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Sculptural Decor
              </h3>
              <p className="text-sm md:text-base text-[#2E2B26]/70 font-sans font-light leading-relaxed">
                Objects inspired by form, texture, and calm expression.
              </p>
            </div>

            {/* Card 2 */}
            <div className="text-center md:text-left">
              <h3
                className="text-xl md:text-2xl text-[#2E2B26] mb-4 font-light"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Timeless Design
              </h3>
              <p className="text-sm md:text-base text-[#2E2B26]/70 font-sans font-light leading-relaxed">
                Free from trends. Built to remain relevant for years.
              </p>
            </div>

            {/* Card 3 */}
            <div className="text-center md:text-left">
              <h3
                className="text-xl md:text-2xl text-[#2E2B26] mb-4 font-light"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Thoughtful Living
              </h3>
              <p className="text-sm md:text-base text-[#2E2B26]/70 font-sans font-light leading-relaxed">
                Decor that completes a space without overwhelming it.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4 — MATERIAL & CRAFTSMANSHIP */}
        <section className="mt-28">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#2E2B26] mb-8 font-light tracking-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Material & Craftsmanship
          </h2>
          
          <div className="space-y-6">
            <p className="text-base md:text-lg lg:text-xl text-[#2E2B26]/80 font-sans font-light leading-relaxed">
              Each Livora piece is crafted using premium materials with careful<br />
              attention to finish, proportion, and durability.
            </p>
            
            <p className="text-base md:text-lg lg:text-xl text-[#2E2B26]/80 font-sans font-light leading-relaxed">
              From ceramic forms to handcrafted polyresin,<br />
              every detail exists for a reason —<br />
              to create harmony within your space.
            </p>
          </div>
        </section>

        {/* SECTION 5 — BRAND STATEMENT (EMOTIONAL) */}
        <section className="mt-32 mb-32">
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#2E2B26] font-light italic leading-[1.2]"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Some pieces don&apos;t stand out.
            </p>
            <p
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#2E2B26] font-light italic leading-[1.2] mt-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              They belong.
            </p>
            <p
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#2E2B26] font-light italic leading-[1.2] mt-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              And once they do,<br />
              everything else feels unfinished.
            </p>
          </div>
        </section>

        {/* SECTION 6 — CTA */}
        <section className="mt-28">
          <div className="text-center">
            <Link
              href="/products"
              className="inline-block px-8 md:px-12 py-3 md:py-4 border border-[#2E2B26] text-[#2E2B26] uppercase tracking-wider text-sm md:text-base font-normal transition-all duration-300 hover:bg-[#2E2B26] hover:text-[#F4F1EB]"
            >
              Explore the Collection
            </Link>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
