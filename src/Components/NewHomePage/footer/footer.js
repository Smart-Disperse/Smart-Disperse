import React from "react";
import discord from "../assests/discord.png";
import telegram from "../assests/telegram.png";
import twitter from "../assests/twitter.png";
import mirror from "../assests/mirror.svg";
import footer from "./footer.module.css";
import Image from "next/image";

function Footer() {
  const currentYear = new Date().getFullYear(); // Get the Current Year
  return (
    <div className={footer.footerouterdiv}>
      <p className={footer.footercopyrightText} style={{ margin: "0px" }}>
        Copyright © {currentYear} Smart-Disperse | All rights reserved
      </p>
      <div
        className={footer.footercopyright}
        style={{
          display: "flex",

          margin: "10px 30px",
          justifyContent: "space-evenly",
          alignItems: "stretch",
        }}
      >
        <a href="https://discord.gg/W3asyJh7mC" target="blank">
          <Image src={discord} className={footer.footericon} alt=""></Image>
        </a>
        <a href="https://t.me/smartdisperse" target="blank">
          <Image src={telegram} className={footer.footericon} alt=""></Image>
        </a>
        <a href="https://x.com/smart_disperse?s=21" target="blank">
          <Image src={twitter} className={footer.footericon} alt=""></Image>
        </a>
        <Image
          id={footer}
          src={mirror}
          className={footer.footericon}
          alt=""
        ></Image>
      </div>
    </div>
  );
}

export default Footer;
