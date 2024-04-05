import Crosschaindashboard from "@/Components/Dashboard/Crosschaindashboard";

import React from "react";

function page() {
  return <div>{<Crosschaindashboard />}</div>;
}

export default page;
export const metadata = {
  metadataBase: new URL("https://smartdisperse.xyz/cross-chain"),
  title: "CrossChain Page",
  description:
    " Disperse Your Tokens to CHAINs and Other Networks, Embracing Multi-Network Distribution",

  openGraph: {
    title: "CrossChain Page",
    description:
      " Disperse Your Tokens to CHAINs and Other Networks, Embracing Multi-Network Distribution",
    url: "https://smartdisperse.xyz/cross-chain",
    siteName: "SmartDisperse",
    images: [
      {
        url: "https://gateway.lighthouse.storage/ipfs/QmbYmsp4EtqRqR1ALup5y2srwrtxU26tHQzVCttmcmXTqb", // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: "https://gateway.lighthouse.storage/ipfs/QmbYmsp4EtqRqR1ALup5y2srwrtxU26tHQzVCttmcmXTqb", // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
