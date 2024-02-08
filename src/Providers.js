"use client";
import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai, scroll, scrollSepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
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
const { chains, publicClient } = configureChains(
  [modeMainnet, modeTestnet, scroll, scrollSepolia],
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
// const root = ReactDOM.createRoot(document.getElementById("root"));

export function Providers({ children }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
