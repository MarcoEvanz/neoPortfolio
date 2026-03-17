import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isProd ? "/neoPortfolio" : "",
  assetPrefix: isProd ? "/neoPortfolio/" : "",
};

export default nextConfig;
