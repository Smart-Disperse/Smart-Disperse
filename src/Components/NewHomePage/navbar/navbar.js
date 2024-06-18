import React, { useState, useEffect } from "react";
import logo from "../assests/logo.png";
import navStyle from "./navbar.module.css";
import Link from "next/link";
import Image from "next/image";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${navStyle.navMain} ${scrolled ? navStyle.navScrolled : ""}`}
    >
      <div className={navStyle.navFixed}>
        <div className={navStyle.navSub}>
          <a href="/">
            <Image className={navStyle.logo} src={logo} alt="not foundd" />
          </a>
          <nav className={navStyle.navDiv}>
            <a href="/milestone">
              <div className={navStyle.navTab}>Milestone</div>
            </a>
            <a
              href="https://smart-disperse.gitbook.io/smart-disperse"
              target="blank"
            >
              <div className={navStyle.navTab}>Docs</div>
            </a>
          </nav>
          <div className={navStyle.appMain}>
            <a href="/cross-chain" target="_blank">
              <button className={navStyle.launchapp}>LAUNCH APP</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
