"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import navStyle from "../Navbar/navbar.module.css";
import smartlogo from "../../Assets/logo.png";
import ConnectButtonCustom from "../ConnectButton/ConnectButtonCustom";
import Image from "next/image";
import { useTheme } from "next-themes";
import Cookies from "universal-cookie";
import { useAccount, useChainId } from "wagmi";
import { usePathname } from "next/navigation";
import { createSign } from "@/Utils/UserSignatureAPIAuthentication";

function Navbar() {
  const { isConnected, address } = useAccount();
  const { theme, setTheme } = useTheme();
  const cookie = new Cookies();
  const [isMainnet, setIsMainnet] = useState(true);
  const path = usePathname();
  const chainId = useChainId();

  const isHome = path === "/";

  const handelMainnet = () => {
    setIsMainnet(!isMainnet);
    cookie.set("isMainnet", !isMainnet);
  };

  useEffect(() => {
    const getIsMainnetFromCookies = () => {
      const isMainnetCookie = cookie.get("isMainnet");

      if (isMainnetCookie !== undefined) {
        setIsMainnet(isMainnetCookie);
      }
    };

    getIsMainnetFromCookies();

    // Clean up function to avoid memory leaks
    return () => {};
  }, []);

  useEffect(() => {
    if (isConnected && !isHome) {
      const jwtToken = cookie.get("jwt_token");

      if (jwtToken === undefined || jwtToken === null) {
        createSign(address);
      }
    }
  }, [isConnected]);

  return (
    <div className={navStyle.navbarMain}>
      <div className={navStyle.divtoflexlogoconnectwallet}>
        <div>
          <Link href="/">
            <Image
              className={navStyle.smartlogportal}
              src={smartlogo}
              alt="not foundd"
            />
          </Link>
        </div>
        {isHome ? (
          <></>
        ) : (
          <div className={navStyle.connectwalletbuttondiv}>
            {isConnected && (
              <label className={navStyle.toggle}>
                <input
                  type="checkbox"
                  onChange={handelMainnet}
                  checked={isMainnet}
                />
                <span className={navStyle.slider}></span>
                <span
                  className={navStyle.labels}
                  data-on="Mainnet"
                  data-off="TestNet"
                ></span>
              </label>
            )}
            <ConnectButtonCustom isMainnet={isMainnet} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
