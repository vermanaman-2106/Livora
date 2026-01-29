/**
 * Headless Shopify Cart — Storefront API only.
 * No /cart URLs, no theme. Uses cartCreate + cartLinesAdd → redirect to checkoutUrl.
 *
 * Env:
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_DOMAIN
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
 * API version: 2024-10
 */

const API_VERSION = "2024-10";

function getConfig() {
  const storeDomain =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  if (!storeDomain || !accessToken) {
    throw new Error(
      "Missing Shopify env: set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN"
    );
  }

  const domain = storeDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return {
    storeDomain: domain,
    accessToken,
    graphqlUrl: `https://${domain}/api/${API_VERSION}/graphql.json`,
  };
}

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
};

export type AddToCartResult = {
  cartId: string;
  checkoutUrl: string;
};

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function storefrontFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const { graphqlUrl, accessToken } = getConfig();

  const res = await fetch(graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Storefront API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join("; "));
  }
  return json.data as T;
}

/**
 * Create a new cart with optional lines.
 * Returns cart.id and cart.checkoutUrl.
 */
export async function cartCreate(lines: CartLineInput[] = []): Promise<{ cartId: string; checkoutUrl: string }> {
  const data = await storefrontFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(CART_CREATE_MUTATION, {
    input: { lines: lines.length ? lines : undefined },
  });

  const { cartCreate: result } = data;
  if (result.userErrors?.length) {
    throw new Error(result.userErrors.map((e) => e.message).join("; "));
  }
  if (!result.cart?.id || !result.cart?.checkoutUrl) {
    throw new Error("Cart create did not return cart id or checkoutUrl");
  }
  return {
    cartId: result.cart.id,
    checkoutUrl: result.cart.checkoutUrl,
  };
}

/**
 * Add lines to an existing cart.
 * Returns updated checkoutUrl.
 */
export async function cartLinesAdd(
  cartId: string,
  lines: CartLineInput[]
): Promise<{ checkoutUrl: string }> {
  const data = await storefrontFetch<{
    cartLinesAdd: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(CART_LINES_ADD_MUTATION, { cartId, lines });

  const { cartLinesAdd: result } = data;
  if (result.userErrors?.length) {
    throw new Error(result.userErrors.map((e) => e.message).join("; "));
  }
  if (!result.cart?.checkoutUrl) {
    throw new Error("cartLinesAdd did not return checkoutUrl");
  }
  return { checkoutUrl: result.cart.checkoutUrl };
}

/**
 * Add one variant to cart (create cart if needed).
 * variantId: GID e.g. gid://shopify/ProductVariant/42823468449855
 * Returns { cartId, checkoutUrl } for redirect to Shopify hosted checkout.
 * If existingCartId is stale/invalid ("cart does not exist"), creates a new cart.
 */
export async function addToCartAndGetCheckoutUrl(
  variantId: string,
  quantity: number = 1,
  existingCartId: string | null = null
): Promise<AddToCartResult> {
  const line: CartLineInput = { merchandiseId: variantId, quantity };

  if (existingCartId) {
    try {
      const { checkoutUrl } = await cartLinesAdd(existingCartId, [line]);
      return { cartId: existingCartId, checkoutUrl };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("cart does not exist") || msg.toLowerCase().includes("specified cart")) {
        return cartCreate([line]);
      }
      throw err;
    }
  }

  return cartCreate([line]);
}
