"use client";
import React, { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import {
  scroll,
  scrollSepolia,
  sepolia,
  optimismSepolia,
  baseSepolia,
  base,
  optimism,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import Navbar from "./Components/Navbar/Navbar";
const { wallets } = getDefaultWallets();

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
  const chains = [
    modeMainnet,
    scroll,
    modeTestnet,
    scrollSepolia,
    sepolia,
    optimismSepolia,
    baseSepolia,
    base,
    optimism,
  ];
  const config = getDefaultConfig({
    appName: "RainbowKit demo",
    projectId: "f8a6524307e28135845a9fe5811fcaa2",
    wallets: [
      {
        groupName: "Other",
        wallets: [metaMaskWallet],
      },
    ],
    chains: chains,
    ssr: true,
  });
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <>
            <Navbar />
            {children}
          </>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
