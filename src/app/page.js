import React from "react";
import Home from "../Components/Homepage/Home";

export default function page({ children }) {
  return (
    <main>
      <Home />
    </main>
  );
}
export const metadata = {
  metadataBase: new URL("https://smartdisperse.xyz/"),
  title: "Home Page",
  description:
    "All Chains, One Solution Smart-Disperse Your Crypto Transactions",
  openGraph: {
    title: "Home Page",
    description:
      "All Chains, One Solution Smart-Disperse Your Crypto Transactions",
    url: "https://smartdisperse.xyz/",
    siteName: "SmartDisperse",
    images: [
      {
        url: "https://gateway.lighthouse.storage/ipfs/QmeUAbno6D5VeiJCvaamzuiWugoe5xxfQD7hEm3mTGNxti", // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: "https://gateway.lighthouse.storage/ipfs/QmeUAbno6D5VeiJCvaamzuiWugoe5xxfQD7hEm3mTGNxti", // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
