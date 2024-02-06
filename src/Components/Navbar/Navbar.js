"use-client";
import React from "react";
import Image from "next/image";
import logoimg from "../../Assets/logo.png";
import "../Navbar/navbar.css";

export default function Navbar() {
  return (
    <div>
      <div className="mainnavbardiv">
        <div className="logodivnavbar">
          <Image className="logonavbar" src={logoimg} alt="not found" />
        </div>
        <div className="connectbuttondivnavbar">
          <button>Connect Wallet</button>
        </div>
      </div>
    </div>
  );
}
