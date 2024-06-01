import React, { useState, useRef, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import connectStyle from "../ConnectButton/connect.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faL, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

function SwitchChain({ isMainnet, closeAccountModal }) {
  // useChainChangeReload(); // Call this hook on every render to ensure the page reloads when chain changes
  const { chain } = useAccount();
  const path = usePathname();

  const [isMounted, setIsMounted] = useState(false);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); // State for modal visibility

  const { chains, error, isLoading, pendingChainId, switchChain } =
    useSwitchChain();

  const mainnetChains = [34443, 534352, 8453, 10];

  const isCrosschainPage = path === "/cross-chain";

  const isSamePage = path === "/same-chain";

  const crossChainAvailableChains = [11155111, 11155420, 84532, 421614, 80002];

  const sameCahinAvailableChains = [
    11155111, 534351, 11155420, 919, 84532, 10, 8453, 534352, 34443,
  ];

  let displayChains = isMainnet
    ? chains.filter((chain) => mainnetChains.includes(chain.id))
    : chains.filter((chain) => !mainnetChains.includes(chain.id));

  if (isCrosschainPage) {
    displayChains = displayChains.filter((chain) =>
      crossChainAvailableChains.includes(chain.id)
    );
  }
  if (isSamePage) {
    displayChains = displayChains.filter((chain) =>
      sameCahinAvailableChains.includes(chain.id)
    );
  }

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const buttonRef = useRef(null);
  useEffect(() => {
    setIsMounted(true); // This ensures the component is mounted before using the router
  }, []);

  const handleButtonClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionClick = async (networkId) => {
    if (isMounted) {
      switchChain({ chainId: networkId });
      setDropdownVisible(false);
    }
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
            <span className={connectStyle.chainName}>{chain.name}</span>
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
            {isMainnet && displayChains.length === 0 && isCrosschainPage ? (
              <>
                <button className={connectStyle.networkoption}>
                  <div className={connectStyle.icon2}>
                    <div className={connectStyle.netName}>
                      Mainnet will be available soon
                    </div>
                  </div>
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default SwitchChain;
