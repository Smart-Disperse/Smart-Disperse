"use-client";
import React from "react";
import discord from "../../Assets/discord.png";
import telegram from "../../Assets/telegram.png";
import twitter from "../../Assets/twitter.png";
import mirror from "../../Assets/mirror.svg";
import "../Footer/footer.css";
import Image from "next/image";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div
      className="footerouterdiv"
      style={{
        display: "flex",
        justifyContent: " space-between",
        margin: " 0px 50px",
        textAlign: "center",
        color: "white",
        padding: "20px 0px",
        fontSize: " 15px",
        marginTop: "auto",
      }}
    >
      <p className="footercopyright" style={{ margin: "0px" }}>
        Copyright © {currentYear} Smart-Disperse | All rights reserved
      </p>
      <div
        className="footericonmain"
        style={{
          display: "flex",
          width: "10%",
          margin: "0px 30px",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <a href="https://discord.gg/W3asyJh7mC" target="blank">
          <Image src={discord} className="footericon"></Image>
        </a>
        <a href="https://t.me/smartdisperse" target="blank">
          <Image src={telegram} className="footericon"></Image>
        </a>

        <a href="https://x.com/smart_disperse?s=21" target="blank">
          <Image src={twitter} className="footericon"></Image>
        </a>

        <Image src={mirror} className="footericon"></Image>
      </div>
    </div>
  );
}

export default Footer;
