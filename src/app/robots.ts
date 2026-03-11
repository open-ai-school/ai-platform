import type { MetadataRoute } from "next";

const BASE_URL = "https://aieducademy.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/admin/", "/signin/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
