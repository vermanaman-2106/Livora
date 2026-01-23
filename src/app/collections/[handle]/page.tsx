import { getProducts } from "@/lib/shopify";
import ProductsGrid from "@/components/ProductsGrid";

interface CollectionPageProps {
  params: Promise<{
    handle: string;
  }>;
}

/**
 * Collection Page Component
 * Server component that fetches and displays products for a specific collection
 * Currently shows all products (can be filtered by collection in the future)
 */
export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const products = await getProducts(20);

  const collectionTitles: Record<string, string> = {
    "living-room": "Living Room",
    bedroom: "Bedroom",
    "minimal-corners": "Minimal Corners",
  };

  const title = collectionTitles[handle] || "Shop";

  return (
    <div className="w-full max-w-full min-h-screen bg-[#F4F1EB] py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-full">
        <div className="mb-16 md:mb-20 lg:mb-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2E2B26] mb-6 font-normal tracking-tight" style={{ fontFamily: "var(--font-playfair), serif" }}>
            {title}
          </h1>
          <p className="text-sm md:text-base text-[#2E2B26]/55 font-sans font-light">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>

        <ProductsGrid products={products} />
      </div>
    </div>
  );
}
