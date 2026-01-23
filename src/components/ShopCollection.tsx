import { getProducts } from "@/lib/shopify";
import CollectionProductCard from "./CollectionProductCard";

/**
 * Shop Collection Section
 * Premium, editorial product gallery - the only selling section on homepage
 * Curated, calm, and gallery-like - not a marketplace
 */
export default async function ShopCollection() {
  const products = await getProducts(12);

  return (
    <section className="w-full max-w-full bg-[#F4F1EB] mt-24 md:mt-32">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        {/* Section Header */}
        <div className="text-center">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#2E2B26] mb-5 md:mb-6 font-light tracking-wide leading-[1.1]"
            style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 400, letterSpacing: "0.05em" }}
          >
            Shop Our Collection
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-[#2E2B26]/55 font-sans font-light leading-relaxed tracking-wide mt-4 md:mt-6">
            A curated selection of sculptural decor designed for calm, modern spaces.
          </p>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#2E2B26]/55 font-sans font-light">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            {products.map((product) => (
              <CollectionProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
