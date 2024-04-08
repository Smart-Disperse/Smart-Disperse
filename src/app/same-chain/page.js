import Samechaindashboard from "@/Components/Dashboard/Samechaindashboard";
import React from "react";

function page() {

  return <div>
    {<Samechaindashboard />}
    </div>;
}

export default page;
export const metadata = {
  metadataBase: new URL("https://smartdisperse.xyz/same-chain"),
  title: "SameChain Page",
  description:
    " Instant Multi-Account Dispersement – Seamlessly Send Tokens to Multiple Accounts in One Click",
  openGraph: {
    title: "SameChain Page",
    description:
      " Instant Multi-Account Dispersement – Seamlessly Send Tokens to Multiple Accounts in One Click",
    url: "https://smartdisperse.xyz/same-chain",
    siteName: "SmartDisperse",
    images: [
      {
        url: "https://gateway.lighthouse.storage/ipfs/QmYf4Agh1vKGQodyyXRBvm5cGP3YxopmsvE66JujavpdF4", // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: "https://gateway.lighthouse.storage/ipfs/QmYf4Agh1vKGQodyyXRBvm5cGP3YxopmsvE66JujavpdF4", // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
