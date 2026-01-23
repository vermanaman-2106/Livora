/**
 * Test Script to Verify Shopify Storefront API Connection
 * Run with: node test-shopify-api.js
 */

import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(__dirname, ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env.local file not found!");
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, "utf8");
  const envVars = {};
  
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join("=").trim();
      }
    }
  });
  
  return envVars;
}

const envVars = loadEnv();
const storeDomain = envVars.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const accessToken = envVars.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

console.log("🔍 Testing Shopify Storefront API Connection\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// Check if credentials exist
if (!storeDomain || !accessToken) {
  console.error("❌ Missing credentials!");
  console.log(`   Domain: ${storeDomain ? "✅ Set" : "❌ Missing"}`);
  console.log(`   Token: ${accessToken ? "✅ Set" : "❌ Missing"}`);
  process.exit(1);
}

console.log("✅ Credentials found:");
console.log(`   Domain: ${storeDomain}`);
console.log(`   Token: ${accessToken.substring(0, 15)}...${accessToken.substring(accessToken.length - 5)}`);
console.log(`   Token Length: ${accessToken.length} characters\n`);

// Create client
const cleanDomain = storeDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

console.log("🔗 Connecting to Shopify...");
console.log(`   API Endpoint: https://${cleanDomain}/api/2025-10/graphql.json\n`);

const client = createStorefrontApiClient({
  storeDomain: cleanDomain,
  apiVersion: "2025-10",
  publicAccessToken: accessToken,
});

// Test query - simple products query
const TEST_QUERY = `
  query {
    products(first: 1) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

console.log("📡 Sending test query...\n");

try {
  const response = await client.request(TEST_QUERY);
  
  if (response.data) {
    console.log("✅ SUCCESS! Storefront API is working!\n");
    console.log("Response Data:");
    console.log(JSON.stringify(response.data, null, 2));
    
    const products = response.data.products?.edges || [];
    if (products.length > 0) {
      console.log(`\n✅ Found ${products.length} product(s):`);
      products.forEach((edge, index) => {
        console.log(`   ${index + 1}. ${edge.node.title} (${edge.node.handle})`);
      });
    } else {
      console.log("\n⚠️  No products found (but API connection works!)");
    }
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Your Storefront API is configured correctly!");
    console.log("   The issue might be in your Next.js app code.");
    process.exit(0);
  } else {
    console.error("❌ No data in response");
    console.log("Response:", response);
    process.exit(1);
  }
} catch (error) {
  console.error("\n❌ ERROR: Storefront API connection failed!\n");
  
  if (error.errors?.networkStatusCode === 401) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("🔴 401 UNAUTHORIZED - Your token is being REJECTED by Shopify");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.error("The token you're using is NOT valid. Here's what to check:\n");
    console.error("STEP 1: Verify App Installation");
    console.error("  → Go to: https://livora-5492.myshopify.com/admin/settings/apps");
    console.error("  → Find your app and check if it says 'Installed'");
    console.error("  → If NOT installed, click 'Install app'\n");
    console.error("STEP 2: Verify Storefront API Configuration");
    console.error("  → Click on your app");
    console.error("  → Go to 'API credentials' tab");
    console.error("  → Scroll to 'Storefront API' section");
    console.error("  → Click 'Configure'");
    console.error("  → Enable these REQUIRED scopes:");
    console.error("     ✓ unauthenticated_read_product_listings");
    console.error("     ✓ unauthenticated_read_product_inventory");
    console.error("     ✓ unauthenticated_read_collection_listings");
    console.error("  → Click 'Save'\n");
    console.error("STEP 3: Get Fresh Token");
    console.error("  → After enabling scopes, the token may change");
    console.error("  → Copy the NEW 'Storefront API access token'");
    console.error("  → It should start with 'shpat_' and be ~40+ characters");
    console.error("  → Update .env.local with the new token\n");
    console.error("STEP 4: Verify Token Type");
    console.error("  → Make sure you're copying from 'Storefront API' section");
    console.error("  → NOT from 'Admin API' section (different token!)\n");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("After fixing, run this test again: node test-shopify-api.js");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } else {
    console.error("Error details:", error.message);
    if (error.errors) {
      console.error("Errors:", JSON.stringify(error.errors, null, 2));
    }
  }
  
  process.exit(1);
}
