import React, { useState, useRef, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import connectStyle from "../ConnectButton/connect.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

function SwitchChain({ isMainnet, closeAccountModal }) {
  // useChainChangeReload(); // Call this hook on every render to ensure the page reloads when chain changes
  const { chain } = useAccount();
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
        onMouseEnter={closeAccountModal}
        onClick={handleButtonClick}
      >
        {chain && displayChains?.some((network) => network.id === chain.id) ? (
          <>
            <img
              src={chain.iconUrl}
              alt={`${chain.name} icon`}
              className={connectStyle.logo}
            />
          </>
        ) : (
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className={connectStyle.iconStyle}
          />
        )}
      </button>

      <div className={connectStyle.ChainDropdownMain}>
        {dropdownVisible && (
          <div className={connectStyle.dropdown} style={{}}>
            {displayChains.map((network) => (
              <button
                key={network.id}
                className={connectStyle.networkoption}
                disabled={isLoading || pendingChainId === network.id}
                onClick={() => handleOptionClick(network.id)}
                style={{}}
              >
                <div className={connectStyle.icon2}>
                  {network.iconUrl && (
                    <img
                      src={network.iconUrl}
                      alt={network.name}
                      style={{
                        width: "20px", // Adjust the width according to your design
                        marginRight: "10px",
                        background: "white",
                        borderRadius: "50%", // Make the icon round if needed
                      }}
                    />
                  )}

                  <div className={connectStyle.netName}>{network.name}</div>
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
