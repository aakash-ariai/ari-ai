import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/shared"],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",
  output: "standalone",
  webpack: (config) => {
    // Add alias for @/ imports from the shared package
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/lib": path.resolve(__dirname, "../../packages/shared/src/lib"),
      "@/components": path.resolve(__dirname, "../../packages/shared/src/components"),
      "@/hooks": path.resolve(__dirname, "../../packages/shared/src/hooks"),
    }
    return config
  },
}

export default nextConfig
