import styles from "./page.module.css";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "@/Components/Footer/Footer";
import Landingpage from "../Components/Homepage/Landingpage";
import { Providers } from "@/Providers";

import { ThemeProvider } from "@/ThemeProvider";
// import { ThemeProvider } from "@ThemeProvider/ThemeProvider";
// import reportWebVitals from "@/reportWebVitals";

export default function Home({ children }) {
  return (
    // <Providers>
    <ThemeProvider>
      <main className={styles.main}>
        <Navbar />
        <Landingpage />
        <Footer />
      </main>
    </ThemeProvider>
    // </Providers>
  );
  // reportWebVitals();
}
