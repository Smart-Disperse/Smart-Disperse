"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import navStyle from "../NewHomePage/navbar/navbar.module.css";
import smartlogo from "../../Assets/logo.png";
import ConnectButtonCustom from "../ConnectButton/ConnectButtonCustom";
import Image from "next/image";
import { useTheme } from "next-themes";
import Cookies from "universal-cookie";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { usePathname } from "next/navigation";
import { createSign } from "@/Utils/UserSignatureAPIAuthentication";

function Navbar() {
  const { isConnected, address } = useAccount();
  const { theme, setTheme } = useTheme();
  const cookie = new Cookies();
  const [isMainnet, setIsMainnet] = useState(true);
  const { signMessageAsync } = useSignMessage();

  const path = usePathname();
  const chainId = useChainId();

  const isHome = path === "/";
  const isMilestone = path === "/milestone";

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
    const handleAuth = async () => {
      if (address && !isHome) {
        const jwtToken = cookie.get("jwt_token");

        if (jwtToken === undefined || jwtToken === null) {
          const message =
            "Sign this message to add labels to the address for easier access. This signature is for security purposes, ensuring that your labels are securely linked to your address and not accessible by others.";
          const signature = await signMessageAsync({ message });
          createSign(address, signature, message);
        }
      }
    };

    if (isConnected) {
      handleAuth();
    }
  }, [isConnected]);

  return (
    <div className={navStyle.navMainDash}>
      <div className={navStyle.navFixed2}>
        <div className={navStyle.navSub}>
          <Link href="/">
            <Image className={navStyle.logo} src={smartlogo} alt="not foundd" />
          </Link>

          {isHome || isMilestone ? (
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
    </div>
  );
}

export default Navbar;
