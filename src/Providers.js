"use client";
import React, { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import Navbar from "./Components/Navbar/Navbar";
const { wallets } = getDefaultWallets();

const modeTestnet = {
  id: 919,
  name: "Mode Testnet",
  network: "Mode",
  iconUrl:"https://gateway.lighthouse.storage/ipfs/QmXwYGzbYduEyX6uwaLRXxJ2YtBqLSzACubqMjqP1PAuSQ",
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
  iconUrl:"https://gateway.lighthouse.storage/ipfs/QmXwYGzbYduEyX6uwaLRXxJ2YtBqLSzACubqMjqP1PAuSQ",
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
id:8453,
name: "Base",
network: "Base",
iconUrl:"https://gateway.lighthouse.storage/ipfs/QmXwYGzbYduEyX6uwaLRXxJ2YtBqLSzACubqMjqP1PAuSQ",
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
  id:84532,
  name: "baseSepolia",
  network: "baseSepolia",
  iconUrl:"https://gateway.lighthouse.storage/ipfs/QmXwYGzbYduEyX6uwaLRXxJ2YtBqLSzACubqMjqP1PAuSQ",
  nativeCurrency: {
    decimals: 18,
    name: "Base Sepolia Testnet",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["wss://base-sepolia-rpc.publicnode.com"] },
    default: { http: ["wss://base-sepolia-rpc.publicnode.com"] },
  },
  };
  const optimism= {
    id:10,
    name: "OP Mainnet",
    network: "OP Mainnet",
    iconUrl:"https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
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
    const optimismSepolia= {
      id:11155420,
      name: "OP Sepolia",
      network: "OP Sepolia",
      iconUrl:"https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
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
      const scroll= {
        id:534352 ,
        name: "Scroll",
        network: "Scroll",
        iconUrl:"https://gateway.lighthouse.storage/ipfs/Qmef99zfw3Wgz6E6c3hN1mypsorGDd4DdcJc6MsvWDdnAD",
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
        const scrollSepolia= {
          id:534351,
          name: "scrollSepolia",
          network: "scrollSepolia",
          iconUrl:"https://gateway.lighthouse.storage/ipfs/Qmef99zfw3Wgz6E6c3hN1mypsorGDd4DdcJc6MsvWDdnAD",
          nativeCurrency: {
            decimals: 18,
            name: "scrollSepolia",
            symbol: "ETH",
          },
          rpcUrls: {
            public: { http: ["https://rpc.ankr.com/scroll_sepolia_testnet"] },
            default: { http: ["https://rpc.ankr.com/scroll_sepolia_testnet"] },
          },
          };
          const sepolia= {
            id:11155111 ,
            name: "sepolia",
            network: "sepolia",
            iconUrl:"https://gateway.lighthouse.storage/ipfs/QmXwYGzbYduEyX6uwaLRXxJ2YtBqLSzACubqMjqP1PAuSQ",
            nativeCurrency: {
              decimals: 18,
              name: "sepolia",
              symbol: "ETH",
            },
            rpcUrls: {
              public: { http: ["https://rpc-sepolia.rockx.com"] },
              default: { http: ["https://rpc-sepolia.rockx.com"] },
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
    optimism,
    Base
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
