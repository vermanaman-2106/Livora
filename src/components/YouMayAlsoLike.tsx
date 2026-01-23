import { getProducts, Product } from "@/lib/shopify";
import CollectionProductCard from "./CollectionProductCard";

interface YouMayAlsoLikeProps {
  currentProductId: string;
}

/**
 * You May Also Like Section
 * Shows related products in an editorial, gallery-style layout
 * Excludes the current product from the recommendations
 */
export default async function YouMayAlsoLike({ currentProductId }: YouMayAlsoLikeProps) {
  // Fetch products and exclude the current one
  const allProducts = await getProducts(20);
  const relatedProducts = allProducts
    .filter((product) => product.id !== currentProductId)
    .slice(0, 4); // Show 4 related products

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-7xl mx-auto py-24 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-[#f6f2ec] border-t border-[#2E2B26]/10">
      <div className="w-full">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 lg:mb-24 text-center">
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl text-[#2E2B26] font-light tracking-wide"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            You may also like
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-20">
          {relatedProducts.map((product) => (
            <CollectionProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
