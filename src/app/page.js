import styles from "./page.module.css";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "@/Components/Footer/Footer";
import Landingpage from "../Components/Homepage/Landingpage";
import { Providers } from "@/Providers";

// import { ThemeProvider } from "@ThemeProvider/ThemeProvider";
// import reportWebVitals from "@/reportWebVitals";

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
