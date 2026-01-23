import { createStorefrontApiClient, type StorefrontApiClient } from "@shopify/storefront-api-client";

/**
 * Initialize Shopify Storefront API client
 * Uses environment variables:
 * - NEXT_PUBLIC_SHOPIFY_DOMAIN: Your Shopify store domain (e.g., "your-store.myshopify.com")
 * - NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: Your Storefront API access token
 */
const getClient = (): StorefrontApiClient => {
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  if (!storeDomain || !accessToken) {
    throw new Error(
      "Missing Shopify credentials. Please set NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN in your .env.local file"
    );
  }

  // Clean domain: remove protocol and trailing slashes
  const cleanDomain = storeDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return createStorefrontApiClient({
    storeDomain: cleanDomain,
    apiVersion: "2025-10",
    publicAccessToken: accessToken,
  });
};

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  images: {
    id: string;
    url: string;
    altText?: string;
  }[];
  variants: {
    id: string;
    title: string;
    price: string;
    availableForSale: boolean;
  }[];
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: {
    url: string;
    altText?: string;
  };
}

// GraphQL queries
const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query getCollections {
    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

// Helper function to format price
export function formatPrice(amount: string, currencyCode: string = "INR"): string {
  const price = parseFloat(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Fetch products from Shopify
 * @param first - Number of products to fetch (default: 20)
 * @returns Array of Product objects (empty array if error or no credentials)
 */
export async function getProducts(first: number = 20): Promise<Product[]> {
  try {
    // Check for credentials first
    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

    if (!storeDomain || !accessToken) {
      console.warn(
        "Shopify credentials not found. Please set NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN in your .env.local file"
      );
      return [];
    }

    const client = getClient();
    
    // Debug: Verify token is being read (only show first/last few chars for security)
    if (process.env.NODE_ENV === "development") {
      const tokenPreview = accessToken 
        ? `${accessToken.substring(0, 10)}...${accessToken.substring(accessToken.length - 5)}` 
        : "MISSING";
      console.log("Shopify Connection Debug:", {
        domain: storeDomain,
        tokenPresent: !!accessToken,
        tokenLength: accessToken?.length || 0,
        tokenPreview: tokenPreview,
      });
    }
    
    const response = await client.request(PRODUCTS_QUERY, {
      variables: { first },
    });

    // Debug: Log the raw response structure
    if (process.env.NODE_ENV === "development") {
      console.log("Shopify API Response:", {
        hasData: !!response.data,
        hasProducts: !!response.data?.products,
        edgesCount: response.data?.products?.edges?.length || 0,
        firstProduct: response.data?.products?.edges?.[0]?.node?.title || "none",
      });
    }

    if (!response.data?.products) {
      console.warn("No products data in Shopify response:", response);
      return [];
    }

    if (!response.data.products.edges || response.data.products.edges.length === 0) {
      console.warn("No products found in Shopify store. Make sure products are published and available.");
      return [];
    }

    const products = response.data.products.edges.map((edge: any) => {
      const node = edge.node;
      
      // Validate required fields
      if (!node.id || !node.title || !node.handle) {
        console.warn("Skipping product with missing required fields:", node);
        return null;
      }

      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description || "",
        price: node.priceRange?.minVariantPrice?.amount || "0",
        compareAtPrice: node.compareAtPriceRange?.minVariantPrice?.amount,
        images: (node.images?.edges || []).map((img: any) => ({
          id: img.node.id,
          url: img.node.url,
          altText: img.node.altText || node.title,
        })),
        variants: (node.variants?.edges || []).map((variant: any) => ({
          id: variant.node.id,
          title: variant.node.title,
          price: variant.node.price?.amount || "0",
          availableForSale: variant.node.availableForSale || false,
        })),
      };
    }).filter((product: Product | null) => product !== null) as Product[];

    if (process.env.NODE_ENV === "development") {
      console.log(`Successfully fetched ${products.length} products from Shopify`);
    }

    return products;
  } catch (error: any) {
    // Check for 401 Unauthorized specifically
    if (error?.errors?.networkStatusCode === 401) {
      const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
      const tokenPreview = token 
        ? `${token.substring(0, 15)}...${token.substring(token.length - 5)}` 
        : "MISSING";
      
      console.error(
        "❌ Shopify API Authentication Failed (401 Unauthorized)\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
        "Your Storefront API token is being REJECTED by Shopify.\n\n" +
        "Current Status:\n" +
        `  • Domain: ${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "NOT SET"}\n` +
        `  • Token: ${token ? "Present" : "MISSING"}\n` +
        `  • Token Preview: ${tokenPreview}\n` +
        `  • Token Length: ${token?.length || 0} characters\n\n` +
        "Common Causes:\n" +
        "  1. ❌ Token is incorrect or copied wrong\n" +
        "  2. ❌ App is NOT installed in Shopify\n" +
        "  3. ❌ Storefront API scopes are NOT enabled\n" +
        "  4. ❌ Using Admin API token instead of Storefront API token\n\n" +
        "How to Fix:\n" +
        "  1. Go to: https://livora-5492.myshopify.com/admin/settings/apps\n" +
        "  2. Find your app and click on it\n" +
        "  3. Go to 'API credentials' tab\n" +
        "  4. Under 'Storefront API', click 'Configure'\n" +
        "  5. Enable these scopes:\n" +
        "     - unauthenticated_read_product_listings\n" +
        "     - unauthenticated_read_product_inventory\n" +
        "     - unauthenticated_read_collection_listings\n" +
        "  6. Click 'Save'\n" +
        "  7. Click 'Install app' (if not already installed)\n" +
        "  8. Copy the NEW Storefront API access token\n" +
        "  9. Update .env.local with the new token\n" +
        "  10. Restart your dev server\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      );
    } else {
      console.error("Error fetching products from Shopify:", {
        message: error?.message,
        error: error,
      });
    }
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

// Fetch product by handle
export async function getProductByHandle(handle: string): Promise<Product | null> {
  try {
    // Check for credentials first
    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

    if (!storeDomain || !accessToken) {
      console.warn(
        "Shopify credentials not found. Please set NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN in your .env.local file"
      );
      return null;
    }

    const client = getClient();
    const response = await client.request(PRODUCT_BY_HANDLE_QUERY, {
      variables: { handle },
    });

    const product = response.data?.product;
    if (!product) {
      console.warn(`Product with handle "${handle}" not found`);
      return null;
    }

    // Validate required fields
    if (!product.id || !product.title || !product.handle) {
      console.warn("Product missing required fields:", product);
      return null;
    }

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description || "",
      price: product.priceRange?.minVariantPrice?.amount || "0",
      compareAtPrice: product.compareAtPriceRange?.minVariantPrice?.amount,
      images: (product.images?.edges || []).map((img: any) => ({
        id: img.node.id,
        url: img.node.url,
        altText: img.node.altText || product.title,
      })),
      variants: (product.variants?.edges || []).map((variant: any) => ({
        id: variant.node.id,
        title: variant.node.title,
        price: variant.node.price?.amount || "0",
        availableForSale: variant.node.availableForSale || false,
      })),
    };
  } catch (error: any) {
    // Check for 401 Unauthorized specifically
    if (error?.errors?.networkStatusCode === 401) {
      console.error(
        "❌ Shopify API Authentication Failed (401 Unauthorized)\n" +
        "Your Storefront API token is being REJECTED by Shopify.\n" +
        "Please check FIX_401_ERROR.md for troubleshooting steps."
      );
    } else {
      console.error("Error fetching product by handle:", {
        handle,
        message: error?.message,
        error: error,
      });
    }
    return null;
  }
}

// Fetch collections
export async function getCollections(): Promise<Collection[]> {
  try {
    const client = getClient();
    const response = await client.request(COLLECTIONS_QUERY);

    const collections = response.data?.collections?.edges?.map((edge: any) => {
      const node = edge.node;
      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,
        image: node.image
          ? {
              url: node.image.url,
              altText: node.image.altText,
            }
          : undefined,
      };
    });

    return collections || [];
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

