import Crosschaindashboard from "@/Components/Dashboard/Crosschaindashboard";

import React from "react";

function page() {
  return <div>{<Crosschaindashboard />}</div>;
}

export default page;
export const metadata = {
  title: "CrossChain Page",
  // description: "Home Page Description...",
  openGraph: {
    title: "CrossChain Page",
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
