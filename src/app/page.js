"use-client";
import styles from "./page.module.css";
import Navbar from "../Components/Navbar/Navbar";

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      {/* <h1 className="h1main">hello</h1> */}
    </main>
  );
}
