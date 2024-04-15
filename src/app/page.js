import styles from "./page.module.css";
import Landingpage from "../Components/Homepage/Landingpage";
import { Providers } from "@/Providers";
import Samechaindashboard from "@/Components/Dashboard/Samechaindashboard";

export default function Home({ children }) {
  return (
    <main className={styles.main}>
      <Samechaindashboard />
    </main>
  );
  // reportWebVitals();
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
