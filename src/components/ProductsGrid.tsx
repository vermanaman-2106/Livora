import { Product } from "@/lib/shopify";
import ProductCard from "./ProductCard";

interface ProductsGridProps {
  products: Product[];
}

/**
 * ProductsGrid Component
 * Displays products in a responsive grid layout
 * Used on homepage and collection pages
 */
export default function ProductsGrid({ products }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#2E2B26]/70">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
