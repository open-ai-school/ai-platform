import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Open AI School",
    short_name: "AI School",
    description:
      "Free, multilingual AI education platform. Learn Artificial Intelligence from scratch through interactive lessons, hands-on experiments, and real-world projects.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0a1e",
    theme_color: "#6366f1",
    orientation: "any",
    categories: ["education", "technology"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
