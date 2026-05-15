import createMDX from "@next/mdx"

/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const sessionCookie = isProd ? '__Secure-next-auth.session-token' : 'next-auth.session-token';

const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete
    // even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Similarly, if TypeScript errors are blocking you:
    ignoreBuildErrors: true,
  },
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // See https://lucide.dev/guide/packages/lucide-react#nextjs-example
  transpilePackages: ["lucide-react"],

  // See https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs
  async redirects() {
    return [
      // Redirects are now primarily handled in middleware.ts for better auth/locale control.
      // Add any non-auth static redirects here if needed.
    ]
  },

}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
