# Livroa - Home Decor Ecommerce

A production-ready headless Shopify ecommerce website for Livroa, a home decor brand. Built with Next.js, Tailwind CSS, and Framer Motion.

## Brand Identity

- **Style**: Pinterest-inspired, editorial, aesthetic
- **Vibe**: Warm minimal luxury
- **Target**: Urban India, age 22-40, aesthetic-driven buyers

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Ecommerce**: Shopify Storefront API
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Shopify store with Storefront API access

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## Shopify Setup

1. Go to your Shopify admin
2. Navigate to Settings > Apps and sales channels > Develop apps
3. Create a new app and enable Storefront API
4. Copy the Storefront API access token
5. Add it to your `.env.local` file

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Navbar & Footer
│   ├── page.tsx            # Homepage
│   ├── product/[handle]/   # Product detail pages
│   └── collections/[handle]/ # Collection pages
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── Footer.tsx          # Footer
│   ├── ProductCard.tsx     # Product card component
│   ├── HomeHero.tsx        # Homepage hero section
│   ├── InspirationSection.tsx # Pinterest-style grid
│   ├── ShopTheLook.tsx     # Collection previews
│   ├── FeaturedProduct.tsx  # Featured product section
│   └── TrustSection.tsx     # Trust indicators
└── lib/
    └── shopify.ts           # Shopify API utilities
```

## Brand Colors

- **Primary**: `#3B3528` (headings, CTAs)
- **Background**: `#F4F1EB`
- **Muted UI**: `#C8BFAF` (cards)
- **Accent**: `#B89B5E` (highlights)
- **Text**: `#2E2B26`
- **Borders**: `#E6E0D6`

## Features

- ✅ Pinterest-style masonry grid
- ✅ Mobile-first responsive design
- ✅ Product detail pages
- ✅ Collection pages
- ✅ Shopify Storefront API integration
- ✅ Subtle animations with Framer Motion
- ✅ SEO optimized
- ✅ TypeScript for type safety

## Build

```bash
npm run build
```

## Deploy

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables
4. Deploy!

## License

Private - Livroa Brand
