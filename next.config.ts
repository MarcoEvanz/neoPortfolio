import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const basePath = isProd ? "/neoPortfolio" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  assetPrefix: isProd ? "/neoPortfolio/" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
