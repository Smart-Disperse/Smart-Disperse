"use-client";
import React from "react";
import discord from "../../Assets/discord.png";
import telegram from "../../Assets/telegram.png";
import twitter from "../../Assets/twitter.png";
import mirror from "../../Assets/mirror.svg";
import footerStyle from "../Footer/footer.module.css";
import Image from "next/image";

function Footer() {
  const currentYear = new Date().getFullYear(); // Get the Current Year
  return (
    <div className={footerStyle.footerouterdiv}>
      <p className={footerStyle.footercopyrightText} style={{ margin: "0px" }}>
        Copyright © {currentYear} Smart-Disperse | All rights reserved
      </p>
      <div
        className={footerStyle.footercopyright}
        style={{
          display: "flex",

          margin: "10px 30px",
          justifyContent: "space-evenly",
          alignItems: "stretch",
        }}
      >
        <a href="https://discord.gg/W3asyJh7mC" target="blank">
          <Image
            src={discord}
            className={footerStyle.footericon}
            alt=""
          ></Image>
        </a>
        <a href="https://t.me/smartdisperse" target="blank">
          <Image
            src={telegram}
            className={footerStyle.footericon}
            alt=""
          ></Image>
        </a>
        <a href="https://x.com/smart_disperse?s=21" target="blank">
          <Image
            src={twitter}
            className={footerStyle.footericon}
            alt=""
          ></Image>
        </a>
        <Image
          id={footerStyle.mirroricon}
          src={mirror}
          className={footerStyle.footericon}
          alt=""
        ></Image>
      </div>
    </div>
  );
}

export default Footer;
