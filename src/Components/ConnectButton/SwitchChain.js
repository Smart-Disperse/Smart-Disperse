import React, { useState, useRef, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import connectStyle from "../ConnectButton/connect.module.css";
import useChainChangeReload from "./useChainChangeReload";
import Modal from "react-modal";
import warning from "@/Assets/warning.webp";
import Image from "next/image";
import textStyle from "@/Components/DashboardComponents/SameChain/Type/textify.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faL } from "@fortawesome/free-solid-svg-icons";

function SwitchChain({ isMainnet }) {
  // useChainChangeReload(); // Call this hook on every render to ensure the page reloads when chain changes
  const { chain } = useAccount();
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); // State for modal visibility

  const { chains, error, isLoading, pendingChainId, switchChain } =
    useSwitchChain();

  const mainnetChains = [34443, 534352, 8453, 10];

  const displayChains = isMainnet
    ? chains.filter((chain) => mainnetChains.includes(chain.id))
    : chains.filter((chain) => !mainnetChains.includes(chain.id));

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const buttonRef = useRef(null);

  const handleButtonClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionClick = (networkId) => {
    switchChain({ chainId: networkId });
    setDropdownVisible(false);
  };

  useEffect(() => {
    if (error && error.code !== "UNSUPPORTED_CHAIN") {
      toast.error("Failed to change Network: User rejected the Request");
    }
  }, [error]);

  return (
    <div
      className={connectStyle.switchchaincontainer}
      onMouseEnter={() => setDropdownVisible(true)}
      onMouseLeave={() => setDropdownVisible(false)}
    >
      <button
        ref={buttonRef}
        className={connectStyle.connectchain}
        type="button"
        onClick={handleButtonClick}
      >
        <span>
          {chain && displayChains?.some((network) => network.id === chain.id)
            ? ` ${chain.name}`
            : "Wrong Network"}
        </span>
      </button>
      <div className={connectStyle.ChainDropdownMain}>
        {dropdownVisible && (
          <div
            className="dropdown"
            style={{
              display: "flex",
              padding: "10px 5px",
              width: "190px",
              flexDirection: "column",
              borderRadius: "10px",
              background:
                "linear-gradient(92deg, #1e1e1e 0.87%, #1c1b1b 98.92%)",
            }}
          >
            {displayChains.map((network) => (
              <button
                key={network.id}
                className={connectStyle.networkoption}
                disabled={isLoading || pendingChainId === network.id}
                onClick={() => handleOptionClick(network.id)}
                style={{
                  border: "1px solid #ab00ff",
                  background: "none",
                  color: "white",
                  cursor: "pointer",
                  padding: "12px",
                  borderRadius: "20px",
                  margin: "5px auto",
                  width: "90%",
                }}
              >
                {network.hasIcon && network.iconUrl && (
                  <img
                    src={network.iconUrl}
                    alt={network.name}
                    style={{
                      width: "20px", // Adjust the width according to your design
                      marginRight: "8px", // Add some spacing between the icon and text
                      background: network.iconBackground || "transparent",
                      borderRadius: "50%", // Make the icon round if needed
                    }}
                  />
                )}

                <span
                  style={{
                    content: "",
                    top: "50%",
                    left: " 50%",
                    fontSize: "15px",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                  }}
                >
                  {network.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default SwitchChain;
