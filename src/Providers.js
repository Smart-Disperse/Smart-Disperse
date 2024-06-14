"use client";
import React, { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
// import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import Navbar from "./Components/Navbar/Navbar";
import { usePathname } from "next/navigation";
import { color } from "framer-motion";
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
  dropdownchainName: "baseSepolia",
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
  dropdownchainName: "opSepolia",
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
  dropdownchainName: "sepolia",
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
  dropdownchainName: "arbSepolia",
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
  dropdownchainName: "amoy",
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
  const path = usePathname();
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
    autoConnect: true,
    chains: chains,
    ssr: true,
  });
  const queryClient = new QueryClient();
  const isHome = path === "/";

  const myCustomTheme = {
    blurs: {
      modalOverlay: " blur(10px)",
    },
    colors: {
      accentColor: "white",
      accentColorForeground: "black",
      actionButtonBorder: "rgba(255, 255, 255, 0.04)",
      actionButtonBorderMobile: " rgba(255, 255, 255, 0.08)",
      actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.08)",
      closeButton: "rgba(224, 232, 255, 0.6)",
      closeButtonBackground: " rgba(255, 255, 255, 0.08)",
      connectButtonBackground: "#1A1B1F",
      connectButtonBackgroundError: "#FF494A",
      connectButtonInnerBackground:
        "linear-gradient(126deg, rgba(0, 0, 0, 0) 9.49%, rgba(120, 120, 120, 0.2) 71.04%), #1A1B1F",
      connectButtonText: "#FFF",
      connectButtonTextError: "#FFF",
      connectionIndicator: "#30E000",
      downloadBottomCardBackground:
        "linear-gradient(126deg, rgba(0, 0, 0, 0) 9.49%, rgba(120, 120, 120, 0.2) 71.04%), #1A1B1F",
      downloadTopCardBackground:
        "linear-gradient(126deg, rgba(120, 120, 120, 0.2) 9.49%, rgba(0, 0, 0, 0) 71.04%), #1A1B1F",
      error: "#FF494A",
      generalBorder: "rgba(255, 255, 255, 0.08)",
      generalBorderDim: "rgba(255, 255, 255, 0.04)",
      menuItemBackground: "rgba(224, 232, 255, 0.1)",
      modalBackdrop: "rgba(0, 0, 0, 0.5)",
      modalBackground:
        "linear-gradient(94.24deg, rgba(146, 114, 247, 0.07) 2.41%, rgba(159, 83, 255, 0.07) 98.65%)",
      modalBorder: "#00FFFF",
      modalText: "#FFF",
      modalTextDim: "rgba(224, 232, 255, 0.3)",
      modalTextSecondary: "rgba(255, 255, 255, 0.6)",
      profileAction: "rgba(224, 232, 255, 0.1)",
      profileActionHover: "rgba(224, 232, 255, 0.2)",
      profileForeground: "rgba(224, 232, 255, 0.05)",
      selectedOptionBorder: "rgba(224, 232, 255, 0.1)",
      standby: "#FFD641",
    },
    fonts: {
      body: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
    },
    radii: {
      actionButton: "4px",
      connectButton: "4px",
      menuButton: "4px",
      modal: "8px",
      modalMobile: "8px",
    },
    shadows: {
      connectButton: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
      profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.04)",
      selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.24)",
      selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.24)",
      walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.16)",
    },
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={myCustomTheme}>
          <>
            {!isHome ? <Navbar /> : null}
            {children}
          </>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
