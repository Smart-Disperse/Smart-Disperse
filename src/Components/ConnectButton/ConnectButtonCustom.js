"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useRef, useEffect } from "react";
import SwitchChain from "../ConnectButton/SwitchChain";
import { useDisconnect } from "wagmi";
import connectStyle from "../ConnectButton/connect.module.css";
import Image from "next/image";
import Cookies from "universal-cookie";
import metamask from "../../Assets/metamask.svg";
import { Tooltip, Button } from "@nextui-org/react";
import {
  faArrowRightFromBracket,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";

const ConnectButtonCustom = ({ isMainnet }) => {
  const colors = [
    "default",
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
    "foreground",
  ];
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
    cookie.set("jwt_token", null);
    setAccountModalOpen(false);
  };

  // Close the modal when clicking outside it (if not in mobile view)
  const modelOpen = () => {
    setAccountModalOpen(!isAccountModalOpen);
  };
  const handleHoverConnectChain = () => {
    setAccountModalOpen(false);
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
    console.log("textt");
    toast.success("Copying to clipboard!");
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
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
        {
          console.log("connected", connected);
        }
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
                    Connect Wallet
                  </button>
                );
              }

              return (
                <div
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                  className={connectStyle.CMain}
                >
                  <SwitchChain
                    isMainnet={isMainnet}
                    closeAccountModal={handleHoverConnectChain}
                  />

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
                        <button className={connectStyle.disconnectBtn}>
                          <Image
                            src={metamask}
                            style={{
                              width: "20px",
                              margin: "0px 10px",
                              height: "auto",
                            }}
                          ></Image>
                          <span
                            style={{
                              fontSize: "16px",
                              color: "white",
                              position: "relative",
                            }}
                          >{`${account.address.slice(
                            0,
                            7
                          )}...${account.address.slice(-4)}`}</span>

                          <Tooltip
                            content="Copy"
                            className={connectStyle.tooltip}
                          >
                            <FontAwesomeIcon
                              icon={faCopy}
                              onClick={() => copyToClipboard(account.address)}
                              className={connectStyle.iconCopy}
                              color="white"
                            />
                          </Tooltip>
                          <Tooltip
                            content="LogOut"
                            className={connectStyle.tooltip}
                          >
                            <FontAwesomeIcon
                              icon={faArrowRightFromBracket}
                              onClick={handleDisConnect}
                              color="white"
                              className={connectStyle.iconCopy}
                            />
                          </Tooltip>
                        </button>

                        <div className={connectStyle.EthBalance}>
                          <button type="button">
                            {account.displayBalance
                              ? "(" + account.displayBalance + ")"
                              : "Loading..."}
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
