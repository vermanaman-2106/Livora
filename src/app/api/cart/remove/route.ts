import { NextRequest, NextResponse } from "next/server";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const REMOVE_FROM_CART_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
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
      userErrors {
        field
        message
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

export async function POST(request: NextRequest) {
  try {
    const { cartId, lineId } = await request.json();

    if (!cartId || !lineId) {
      return NextResponse.json(
        { error: "Cart ID and Line ID are required" },
        { status: 400 }
      );
    }

    const client = getClient();
    const response = await client.request(REMOVE_FROM_CART_MUTATION, {
      variables: {
        cartId,
        lineIds: [lineId],
      },
    });

    if (response.data?.cartLinesRemove?.userErrors?.length > 0) {
      return NextResponse.json(
        { error: response.data.cartLinesRemove.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      cart: response.data?.cartLinesRemove?.cart,
      success: true,
    });
  } catch (error: any) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
