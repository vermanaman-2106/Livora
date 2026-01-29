import { NextRequest, NextResponse } from "next/server";
import { addToCartAndGetCheckoutUrl } from "@/lib/shopify-cart";

/**
 * Headless cart: add variant to cart (create if needed), return Shopify hosted checkout URL.
 * No /cart URLs. Client should redirect to checkoutUrl.
 */
export async function POST(request: NextRequest) {
  try {
    const { variantId, quantity = 1, cartId } = await request.json();

    if (!variantId) {
      return NextResponse.json(
        { error: "Variant ID is required (e.g. gid://shopify/ProductVariant/...)" },
        { status: 400 }
      );
    }

    const qty = Math.max(1, parseInt(String(quantity), 10) || 1);
    const result = await addToCartAndGetCheckoutUrl(
      variantId,
      qty,
      cartId || null
    );

    return NextResponse.json({
      success: true,
      cartId: result.cartId,
      checkoutUrl: result.checkoutUrl,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add to cart";
    console.error("Cart add error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
