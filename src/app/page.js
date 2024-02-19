import styles from "./page.module.css";
import Landingpage from "../Components/Homepage/Landingpage";
import { Providers } from "@/Providers";

export default function Home({ children }) {
  return (
    <main className={styles.main}>
      <Landingpage />
    </main>
  );
  // reportWebVitals();
}
export const metadata = {
  title: "Home Page",
  // description: "Home Page Description...",
  openGraph: {
    title: "Home Page",
    // description: "Home Page Description...",
    url: "https://smartdisperse.vercel.app/",
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
