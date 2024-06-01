import React from "react";
import logo from "../assests/logo.webp";
import navStyle from "./navbar.module.css";
import Link from "next/link";
import Image from "next/image";

function Navbar() {
  return (
    <div className={navStyle.navMain}>
      <div>
        <a href="/">
          <Image className={navStyle.logo} src={logo} alt="not foundd" />
        </a>
      </div>
      <div>
        <a href="/cross-chain" target="_blank">
          <button className={navStyle.launchapp}>LAUNCH APP</button>
        </a>
      </div>
    </div>
  );
}

export default Navbar;
