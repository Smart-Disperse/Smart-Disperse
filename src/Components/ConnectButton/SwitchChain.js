"use client";
import React, { useState, useRef, useEffect } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import connectStyle from "../ConnectButton/connect.module.css";

function SwitchChain() {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const buttonRef = useRef(null);

  const handleButtonClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionClick = (networkId) => {
    switchNetwork?.(networkId);
    setDropdownVisible(false);
  };

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
          {chain && chains.some((network) => network.id === chain.id)
            ? ` ${chain.name}`
            : "Wrong Network"}
        </span>
      </button>
      <div
        style={{
          position: "absolute",
          top: "55px",
          right: "0px",
          padding: "30px 0px",
          width: "200px",
        }}
      >
        {dropdownVisible && (
          <div
            className="dropdown"
            style={{
              display: "flex",
              // padding: "10px 0px",
              width: "190px",
              flexDirection: "column",
              borderRadius: "10px",
              border: "none",
              background:
                "linear-gradient(90deg, rgb(97 38 193) 0.06%, rgb(63 47 110) 98.57%)",
            }}
          >
            {chains.map((network) => (
              <button
                key={network.id}
                className={connectStyle.networkoption}
                disabled={isLoading || pendingChainId === network.id}
                onClick={() => handleOptionClick(network.id)}
                style={{
                  borderRadius: "26px",
                  border: "none",
                  background:
                    " linear-gradient(92deg, #1e1e1e 0.87%, #1c1b1b 98.92%)",
                  color: "white",
                  padding: "12px",

                  width: "90%",
                  margin: "5px auto",
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
                    background:
                      "linear-gradient(90deg, #9f53ff 27.06%, #3b7dff 74.14%)",
                    backgroundClip: "text",
                    webkitBackgroundClip: "text",
                    webkitTextFillColor: "transparent",
                    zIndex: "0",
                  }}
                >
                  {network.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div>
          {error.code === "UNSUPPORTED_CHAIN" ? (
            <div>Wrong network. Please select the correct one.</div>
          ) : (
            <div>{error.message}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SwitchChain;
