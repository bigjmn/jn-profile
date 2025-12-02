import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      require.resolve("remark-gfm"),
      require.resolve("remark-math"),
    ],
    rehypePlugins: [
      require.resolve("@mapbox/rehype-prism"),
      require.resolve("rehype-katex"),
    ],
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
