import Samechaindashboard from "@/Components/Dashboard/Samechaindashboard";
import React from "react";

function page() {
  return (
    <div>
      <Samechaindashboard />
    </div>
  );
}

export default page;
export const metadata = {
  title: "SameChain Page",
  // description: "Home Page Description...",
  openGraph: {
    title: "SameChain Page",
    // description: "Home Page Description...",
    url: "https://smartdisperse.vercel.app/same-chain",
    siteName: "SmartDisperse",
    // images: [
    //   {
    //     url: "https://app.optimism.io/og-image.png", // Must be an absolute URL
    //     width: 800,
    //     height: 600,
    //   },
    //   {
    //     url: "https://app.optimism.io/og-image.png", // Must be an absolute URL
    //     width: 1800,
    //     height: 1600,
    //     alt: "My custom alt",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
};
