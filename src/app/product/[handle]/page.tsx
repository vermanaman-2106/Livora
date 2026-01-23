import { getProductByHandle, Product } from "@/lib/shopify";
import ProductPageClient from "./ProductPageClient";
import YouMayAlsoLike from "@/components/YouMayAlsoLike";

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

/**
 * Product Page - Server Component
 * Fetches product data and passes it to client component for interactivity
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F1EB]">
        <div className="text-center">
          <div className="text-[#3B3528] mb-4">Product not found</div>
          <a
            href="/products"
            className="text-[#B89B5E] hover:underline"
          >
            Browse all products
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProductPageClient product={product} />
      <YouMayAlsoLike currentProductId={product.id} />
    </>
  );
}
