import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/stats" },
    sitemap: "https://hvorserjegvm.no/sitemap.xml",
    host: "https://hvorserjegvm.no",
  };
}
