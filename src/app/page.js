import styles from "./page.module.css";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "@/Components/Footer/Footer";
import Landingpage from "../Components/Homepage/Landingpage";

export default function Home() {
  return (
    <main className={styles.main}>
      <Landingpage />
    </main>
  );
}
