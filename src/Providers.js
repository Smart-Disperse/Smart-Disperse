"use client";
import React, { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
// import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import Navbar from "./Components/Navbar/Navbar";
// import { scrollSepolia } from "wagmi/chains";
const { wallets } = getDefaultWallets();

const modeTestnet = {
  id: 919,
  name: "Mode Testnet",
  network: "Mode",
  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmXwYGzbYduEyX6uwaLRXxJ2YtBqLSzACubqMjqP1PAuSQ",
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
  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmXwYGzbYduEyX6uwaLRXxJ2YtBqLSzACubqMjqP1PAuSQ",
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
const Base = {
  id: 8453,
  name: "Base",
  network: "Base",
  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
  nativeCurrency: {
    decimals: 18,
    name: "Base Mainnet",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://base.llamarpc.com"] },
    default: { http: ["https://base.llamarpc.com"] },
  },
};

const baseSepolia = {
  id: 84532,
  name: "Base Sepolia",
  network: "Base Sepolia",
  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
  nativeCurrency: {
    decimals: 18,
    name: "Base Sepolia",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["wss://base-sepolia-rpc.publicnode.com"] },
    default: { http: ["wss://base-sepolia-rpc.publicnode.com"] },
  },
};
const optimism = {
  id: 10,
  name: "OP Mainnet",
  network: "OP Mainnet",
  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
  nativeCurrency: {
    decimals: 18,
    name: "OP Mainnet",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://optimism.llamarpc.com"] },
    default: { http: ["https://optimism.llamarpc.com"] },
  },
};
const optimismSepolia = {
  id: 11155420,
  name: "OP Sepolia",
  network: "OP Sepolia",
  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
  nativeCurrency: {
    decimals: 18,
    name: "OP Sepolia",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://sepolia.optimism.io"] },
    default: { http: ["https://sepolia.optimism.io"] },
  },
};
const scroll = {
  id: 534352,
  name: "Scroll",
  network: "Scroll",
  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/Qmef99zfw3Wgz6E6c3hN1mypsorGDd4DdcJc6MsvWDdnAD",
  nativeCurrency: {
    decimals: 18,
    name: "Scroll",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://scroll.drpc.org"] },
    default: { http: ["https://scroll.drpc.org"] },
  },
};
const scrollSepolia = {
  id: 534351,
  name: "Scroll Sepolia",
  network: "scrollSepolia",
  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/Qmef99zfw3Wgz6E6c3hN1mypsorGDd4DdcJc6MsvWDdnAD",
  nativeCurrency: {
    decimals: 18,
    name: "Scroll Sepolia",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://scroll-sepolia.blockpi.network/v1/rpc/public"] },
    default: { http: ["https://scroll-sepolia.blockpi.network/v1/rpc/public"] },
  },
};
const sepolia = {
  id: 11155111,
  name: "Sepolia",
  network: "Sepolia",
  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmYAbLYRm3DCx261ko8ERjhCgWwf57jAWkxbNcibx8haBi",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://rpc-sepolia.rockx.com"] },
    default: { http: ["https://rpc-sepolia.rockx.com"] },
  },
};

const arbitrumSepolia = {
  id: 421614,
  name: "Arbitrum Sepolia",
  network: "ArbitrumSepolia",
  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmVbtAexzRc2ReSWWyw2Ft7wwkKzsagqnfz3PNfxwM9NMM",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://arbitrum-sepolia.blockpi.network/v1/rpc/public"],
    },
    default: {
      http: ["https://arbitrum-sepolia.blockpi.network/v1/rpc/public"],
    },
  },
};

const polygonAmoy = {
  id: 80002,
  name: "Polygon Amoy",
  network: "Amoy",
  iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmUjiVLiprjXMPceS7r51XNGu277meEkhtWhvH59D2XhzR",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    public: { http: ["https://rpc-amoy.polygon.technology"] },
    default: { http: ["https://rpc-amoy.polygon.technology"] },
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
    Base,
    optimism,
    arbitrumSepolia,
    polygonAmoy,
  ];
  const config = getDefaultConfig({
    appName: "RainbowKit demo",
    projectId: "f8a6524307e28135845a9fe5811fcaa2",

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
