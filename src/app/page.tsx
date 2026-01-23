import Hero from "@/components/Hero";
import ShopCollection from "@/components/ShopCollection";

/**
 * Homepage Component
 * Minimal, premium homepage with hero and curated shop collection
 */
export default async function Home() {
  return (
    <>
      <Hero />
      <ShopCollection />
    </>
  );
}
