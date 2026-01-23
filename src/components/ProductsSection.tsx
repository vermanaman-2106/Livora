import { getProducts } from "@/lib/shopify";
import ProductsGrid from "./ProductsGrid";

/**
 * ProductsSection Component
 * Server component that fetches products from Shopify and displays them
 * Fetches the first 12 products for the homepage
 */
export default async function ProductsSection() {
  const products = await getProducts(12);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F4F1EB]">
      <div className="w-full">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#3B3528] mb-4">
            Shop Our Collection
          </h2>
          <p className="text-[#2E2B26]/70 max-w-2xl mx-auto">
            Discover curated home decor pieces that bring warmth and elegance to your space.
          </p>
        </div>

        <ProductsGrid products={products} />
      </div>
    </section>
  );
}
