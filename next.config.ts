import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import rehypeKatex from "rehype-katex";
import rehypePrism from "@mapbox/rehype-prism";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypePrism, rehypeKatex],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/bigjmn/crude-euler/main/**",
      },
    ],
  },
};

export default withMDX(nextConfig);
