"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import navStyle from "../Navbar/navbar.module.css";
import smartlogo from "../../Assets/logo.png";
import ConnectButtonCustom from "../ConnectButton/ConnectButtonCustom";
import Image from "next/image";
import { useTheme } from "next-themes";
import Cookies from "universal-cookie";
import { useAccount } from "wagmi";
import { usePathname } from "next/navigation";
import { createSign } from "@/Utils/UserSignatureAPIAuthentication";

function Navbar() {
  const { isConnected, address } = useAccount();
  const { theme, setTheme } = useTheme();
  const cookie = new Cookies();
  const [isMainnet, setIsMainnet] = useState(true);
  const path = usePathname();

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
            {theme === "light" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => setTheme("dark")}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="moon"
                width="50px"
                id={navStyle.changeMode}
              >
                {/* Dark mode moon SVG path */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                onClick={() => setTheme("light")}
                strokeWidth="1.5"
                stroke="currentColor"
                className="sun "
                id={navStyle.changeMode}
              >
                {/* Light mode sun SVG path */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
