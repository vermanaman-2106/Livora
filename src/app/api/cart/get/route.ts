import { NextRequest, NextResponse } from "next/server";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const GET_CART_QUERY = `
  query getCart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;

function getClient() {
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  if (!storeDomain || !accessToken) {
    throw new Error("Missing Shopify credentials");
  }

  const cleanDomain = storeDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return createStorefrontApiClient({
    storeDomain: cleanDomain,
    apiVersion: "2025-10",
    publicAccessToken: accessToken,
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get("cartId");

    if (!cartId) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      );
    }

    const client = getClient();
    const response = await client.request(GET_CART_QUERY, {
      variables: { id: cartId },
    });

    return NextResponse.json({
      cart: response.data?.cart,
      success: true,
    });
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
