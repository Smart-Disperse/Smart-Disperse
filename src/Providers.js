"use client";
import React, { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  polygon,
  polygonMumbai,
  scroll,
  scrollSepolia,
  sepolia,
  optimismSepolia,
  baseSepolia,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Navbar from "./Components/Navbar/Navbar";

import Cookies from "universal-cookie";
const modeTestnet = {
  id: 919,
  name: "Mode Testnet",
  network: "Mode",
  nativeCurrency: {
    decimals: 18,
    name: "Mode Testnet",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://sepolia.mode.network/"] },
    default: { http: ["https://sepolia.mode.network/"] },
  },
};

const modeMainnet = {
  id: 34443,
  name: "Mode Mainnet",
  network: "Mode",
  nativeCurrency: {
    decimals: 18,
    name: "Mode Mainnet",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://mainnet.mode.network/"] },
    default: { http: ["https://mainnet.mode.network/"] },
  },
};

// const root = ReactDOM.createRoot(document.getElementById("root"));

export function Providers({ children }) {
  const cookie = new Cookies();
  const [mounted, setMounted] = React.useState(false);
  const [isMainnet, setIsMainnet] = React.useState(true);

  const { chains, publicClient } = configureChains(
    isMainnet
      ? [modeMainnet, scroll]
      : [modeTestnet, scrollSepolia, sepolia, optimismSepolia, baseSepolia],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    projectId: "YOUR_PROJECT_ID",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  React.useEffect(() => setMounted(true), []);

  useEffect(() => {
    // Function to retrieve the value of isMainnet from cookies when the component mounts
    const getIsMainnetFromCookies = () => {
      const isMainnetCookie = cookie.get("isMainnet");
      if (isMainnetCookie !== undefined) {
        // If the cookie exists, set the value of isMainnet accordingly
        setIsMainnet(isMainnetCookie === "true");
      }
    };

    // Call the function when the component mounts
    getIsMainnetFromCookies();

    // Clean up function to avoid memory leaks
    return () => {};
  }, []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {mounted && (
          <>
            <Navbar setIsMainnet={setIsMainnet} isMainnet={isMainnet} />
            {children}
          </>
        )}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
