import { NextRequest, NextResponse } from "next/server";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
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

const ADD_TO_CART_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
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
    const { variantId, quantity = 1, cartId } = await request.json();

    if (!variantId) {
      return NextResponse.json(
        { error: "Variant ID is required" },
        { status: 400 }
      );
    }

    const client = getClient();

    // If cartId exists, add to existing cart, otherwise create new cart
    if (cartId) {
      const response = await client.request(ADD_TO_CART_MUTATION, {
        variables: {
          cartId,
          lines: [
            {
              merchandiseId: variantId,
              quantity: parseInt(quantity),
            },
          ],
        },
      });

      if (response.data?.cartLinesAdd?.userErrors?.length > 0) {
        return NextResponse.json(
          { error: response.data.cartLinesAdd.userErrors[0].message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        cart: response.data?.cartLinesAdd?.cart,
        success: true,
      });
    } else {
      // Create new cart
      const response = await client.request(CREATE_CART_MUTATION, {
        variables: {
          input: {
            lines: [
              {
                merchandiseId: variantId,
                quantity: parseInt(quantity),
              },
            ],
          },
        },
      });

      if (response.data?.cartCreate?.userErrors?.length > 0) {
        return NextResponse.json(
          { error: response.data.cartCreate.userErrors[0].message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        cart: response.data?.cartCreate?.cart,
        success: true,
      });
    }
  } catch (error: any) {
    console.error("Error in cart API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
