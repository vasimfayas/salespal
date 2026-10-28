import type { MetadataRoute } from "next";

/** Lets phones install SalesPal to the home screen and open it full screen, without the browser bars. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SalesPal",
    short_name: "SalesPal",
    description: "Sales monitoring for logistics teams",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f4f4f0",
    theme_color: "#f4f4f0",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
