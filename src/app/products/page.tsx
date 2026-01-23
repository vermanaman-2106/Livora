import { getProducts } from "@/lib/shopify";
import CollectionProductCard from "@/components/CollectionProductCard";

/**
 * Products Page Component
 * Luxury home decor collection gallery
 * Editorial, minimal, premium - not a marketplace
 */
export default async function ProductsPage() {
  const products = await getProducts(50);

  return (
    <div className="w-full max-w-full min-h-screen bg-[#F4F1EB] py-20 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-full">
        {/* Header Section */}
        <div className="mb-20 md:mb-24 lg:mb-28 text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl text-[#2E2B26] mb-6 font-light tracking-wide leading-[1.1]"
            style={{ 
              fontFamily: "var(--font-cormorant), serif",
              fontWeight: 400,
              letterSpacing: "0.05em"
            }}
          >
            The Collection
          </h1>
          <p className="text-sm md:text-base text-[#2E2B26]/55 font-sans font-light tracking-wide">
            Objects selected for calm, modern living.
          </p>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#2E2B26]/55 font-sans font-light">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-20">
            {products.map((product) => (
              <CollectionProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
