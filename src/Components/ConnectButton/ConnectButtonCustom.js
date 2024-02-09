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

const ConnectButtonCustom = () => {
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { disconnect } = useDisconnect();
  const modalRef = useRef();

  const handleDisConnect = () => {
    disconnect();
    setAccountModalOpen(false);
  };
  const modelOpen = () => {
    setAccountModalOpen(!isAccountModalOpen);
  };

  const closeModalOnOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setAccountModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeModalOnOutsideClick);
    return () => {
      document.removeEventListener("mousedown", closeModalOnOutsideClick);
    };
  }, []);

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
                    className="connect-wallet"
                    style={{}}
                  >
                    <span>Connect Wallet</span>
                  </button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <div>
                    <SwitchChain />
                  </div>
                  <div>
                    <button
                      onClick={modelOpen}
                      type="button"
                      className={connectStyle.connectaccount}
                    >
                      <span>
                        {account.displayName}
                        <br />
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
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
                              borderRadius: "26px",
                              border: "none",
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
                                Disconnect
                              </span>
                              <Image
                                src={power}
                                style={{
                                  width: "25px",
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
