import styles from "./page.module.css";
import Navbar from "../Components/Navbar/Navbar";
// import Landingpage from "@/Components/Homepage/Landingpage";
import Footer from "@/Components/Footer/Footer";
import Homepage from "@/Components/Homepage/Homepage";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <Navbar /> */}
      {/* <Landingpage /> */}
      <Homepage />
      {/* <Footer /> */}
    </main>
  );
}
