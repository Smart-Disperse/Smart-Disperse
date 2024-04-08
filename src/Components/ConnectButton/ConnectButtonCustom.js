"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useRef, useEffect } from "react";
import SwitchChain from "../ConnectButton/SwitchChain";
import { useDisconnect } from "wagmi";
import power from "../../Assets/power.png";
import copy from "../../Assets/copy.png";
import check from "../../Assets/check.png";
import connectStyle from "../ConnectButton/connect.module.css";
import Image from "next/image";
import Cookies from "universal-cookie";

const ConnectButtonCustom = ({ isMainnet }) => {
  const [isAccountModalOpen, setAccountModalOpen] = useState(false); // Modal for account info
  const [isCopied, setIsCopied] =
    useState(
      false
    ); /*/* Indicates if the address has been copied to clipboard */
  const { disconnect } = useDisconnect(); // Disconnect button functionality
  const modalRef = useRef(); /*/ Reference to the HTML element of the modal */
  const cookie = new Cookies();

  const handleDisConnect = () => {
    // Function that handles the click on the disconnect button
    disconnect();
    console.log("destroying jwt");
    cookie.set("jwt_token", null);
    setAccountModalOpen(false);
  };

  // Close the modal when clicking outside it (if not in mobile view)
  const modelOpen = () => {
    setAccountModalOpen(!isAccountModalOpen);
  };

  // Add an event listener to close the modal when clicking outside it
  const closeModalOnOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setAccountModalOpen(false);
    }
  };

  // When the component mounts, add the event listener
  useEffect(() => {
    document.addEventListener("mousedown", closeModalOnOutsideClick);
    return () => {
      document.removeEventListener("mousedown", closeModalOnOutsideClick);
    };
  }, []);

  /** Copy functionnality */
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000); // Reset the copy status after 2 seconds
      },
      (err) => {
        console.error("Unable to copy to clipboard:", err);
      }
    );
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className={connectStyle.connectwallet}
                    style={{}}
                  >
                    <span>Connect Wallet</span>
                  </button>
                );
              }
              console.log(account ? account : null);
              return (
                <div
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                  className={connectStyle.CMain}
                >
                  <div>
                    <SwitchChain isMainnet={isMainnet} />
                  </div>

                  <button
                    onClick={modelOpen}
                    type="button"
                    className={connectStyle.connectaccount}
                  >
                    <span>
                      {account.displayName}
                      <br />
                      {account.displayBalance
                        ? account.displayBalance
                        : "Loading..."}
                    </span>
                  </button>

                  {isAccountModalOpen && (
                    <div
                      className={connectStyle.disconnectmain}
                      ref={modalRef}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={connectStyle.disconnect}>
                        <button
                          style={{
                            borderRadius: "20px",
                            border: " 0.5px solid #5fffbc",
                            background:
                              " linear-gradient(92deg, #1e1e1e 0.87%, #1c1b1b 98.92%)",
                            color: "white",
                            padding: "12px",
                            width: "90%",
                            margin: "5px auto",
                          }}
                          onClick={() => copyToClipboard(account.address)}
                        >
                          <span
                            style={{
                              content: "",
                              top: "-4px",
                              left: " 0",
                              fontSize: "15px",
                              transform: "translate(-50%, -50%)",
                              color: "white",
                              position: "relative",
                            }}
                          >{`${account.address.slice(
                            0,
                            7
                          )}...${account.address.slice(-4)}`}</span>

                          {isCopied ? (
                            <Image
                              src={check}
                              alt="Check Icon"
                              style={{
                                width: "20px",
                                margin: "0px 10px",
                                cursor: "pointer",
                              }}
                            />
                          ) : (
                            <Image
                              src={copy}
                              alt="Copy Icon"
                              onClick={() => copyToClipboard(account.address)}
                              style={{
                                width: "20px",
                                margin: "0px 10px",
                                cursor: "pointer",
                                height: "auto",
                              }}
                            />
                          )}
                        </button>

                        <div>
                          <button
                            onClick={handleDisConnect}
                            style={{
                              borderRadius: "20px",
                              border: " 0.5px solid #5fffbc",
                              background:
                                " linear-gradient(92deg, #1e1e1e 0.87%, #1c1b1b 98.92%)",
                              color: "white",
                              padding: "12px",
                              width: "90%",
                              margin: "5px auto",
                            }}
                          >
                            <span
                              style={{
                                content: "",
                                top: "-4px",
                                left: " 0",
                                fontSize: "15px",
                                transform: "translate(-50%, -50%)",
                                color: "white",

                                position: "relative",
                              }}
                            >
                              Disconnect
                            </span>
                            <Image
                              src={power}
                              style={{
                                width: "20px",
                                margin: "0px 10px",
                                height: "auto",
                              }}
                            ></Image>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
export default ConnectButtonCustom;
