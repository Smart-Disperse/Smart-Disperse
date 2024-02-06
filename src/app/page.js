"use-client";
import styles from "./page.module.css";
import Navbar from "../Components/Navbar/Navbar";
import Landingpage from "@/Components/Homepage/Landingpage";

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <Landingpage />
    </main>
  );
}
