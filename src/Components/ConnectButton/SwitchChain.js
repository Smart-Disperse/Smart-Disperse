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
import {alertlogo} from "../../Assets/alert.png"

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
       <div className={connectStyle.icon}>
  {chain && displayChains?.some((network) => network.id === chain.id)
    ? (
      <>
        <img src={chain.iconUrl} alt={`${chain.name} icon`} style={{background:"white", width:"20px",borderRadius:"10px"}}/>
       
      </>
    )
    : <img src="https://gateway.lighthouse.storage/ipfs/QmbgFguL3LUNj3AvEqSqXU85TdJi24v1ccsoT18uFAxpZR" style={{width:"20px"}}/>}
</div>

       
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
                  border: "1px solid #5FFFBC",
                  background: "none",
                  color: "white",
                  cursor: "pointer",
                  padding: "12px",
                  borderRadius: "20px",
                  margin: "5px auto",
                  width: "90%",
                
                }}
              >
              <div className={connectStyle.icon2}>
              {network.iconUrl && (
                  <img
                    src={network.iconUrl}
                    alt={network.name}
                    style={{
                      width: "20px", // Adjust the width according to your design
                   marginRight:"10px",
                      background: 'white',
                      borderRadius: "50%", // Make the icon round if needed
                    }}
                  />
                )}

                <div
                  style={{
                    content: "",
                    top: "50%",
                    left: " 50%",
                    fontSize: "15px",
                    color: "white",
                  }}
                >
                  {network.name}
                </div>
              </div>
              
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
