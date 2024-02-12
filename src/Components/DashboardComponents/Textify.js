"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { crossSendInstance } from "@/Helpers/ContractInstance";
import { getTokenBalance } from "@/Helpers/TokenBalance";
import { approveToken } from "@/Helpers/ApproveToken";
import tokensContractAddress from "@/Helpers/GetTokenContractAddress.json";
import DecimalValue from "@/Helpers/DecimalValue.json";
import ERC20 from "@/artifacts/contracts/ERC20.sol/ERC20.json";
// import { useTheme } from "../../../ThemeProvider";
import Modal from "react-modal";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import textiftgif from "@/Assets/TextifyDemo.gif";
import importtoken from "@/Assets/TextifyDemo.gif";
import { isAddress } from "viem";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
// import rettt from "../../../Assets/crypto11.jpeg";
import textStyle from "./textify.module.css";

const useLocalStorage = (key, initialValue = "") => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? storedValue : initialValue;
  });
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

function SameTextlist() {
  // const { toggleDarkMode, themeClass } = useTheme();
  const [inputText, setInputText] = useState("");
  // const [textValue, setTextValue] = useState("");
  const [walletList, setWalletList] = useState([]);
  const { address } = useAccount();
  const [listData, setListData] = useState([]);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [total, setTotal] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [isSendingEth, setIsSendingEth] = useState(false);
  const [isTokenLoaded, setTokenLoaded] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isInputValid, setIsInputValid] = useState(false);
  const [blockExplorerURL, setBlockExplorerURL] = useState("");
  // const { totalEth, totalUsd } = calculateTotal();
  const [showTokenSections, setShowTokenSections] = useState(false);
  const [howModalIsOpen, setHowModalIsOpen] = useState(false);
  // const [customTokenAddress, setCustomTokenAddress] = useLocalStorage(
  //   "customTokenAddress",
  //   ""
  // );
  const [textValue, setTextValue] = useLocalStorage("textValue", "");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // Modal.setAppElement("#root");
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openHowModal = () => {
    setHowModalIsOpen(true);
  };

  const closeHowModal = () => {
    setHowModalIsOpen(false);
  };

  const defaultTokenDetails = {
    name: null,
    symbol: null,
    balance: null,
    decimal: null,
  };
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);
  const [formData, setFormData] = useState();

  // const isValidAddress = (address) => ethers.utils.isAddress(address);
  const isValidAddress = (address) => isAddress(address);
  const getExplorer = async () => {
    const chainId = Number(
      await window.ethereum.request({ method: "eth_chainId" })
    );
    const network = ethers.providers.getNetwork(chainId);

    if (network.chainId == 534351) {
      setBlockExplorerURL("sepolia.scrollscan.dev");
    }
    if (network.chainId == 534352) {
      setBlockExplorerURL("scrollscan.com");
    }
    if (network.chainId == 919) {
      setBlockExplorerURL("sepolia.explorer.mode.network");
    }
    if (network.chainId == 34443) {
      setBlockExplorerURL("explorer.mode.network");
    }
  };

  const isValidValue = (value) => {
    console.log(value);

    try {
      if (value.includes("$")) {
        // Remove the dollar sign before parsing as USD
        value = value.replace("$", "");
        console.log(`${value} USD`);
        return parseFloat(value);
      } else {
        console.log(ethers.utils.parseUnits(value, "ether"));

        if (!/^\d/.test(value)) {
          value = value.slice(1);
        }
        return ethers.utils.parseUnits(value, "ether");
      }
    } catch (err) {
      return false;
    }
  };

  const loadToken = async () => {
    setRemaining(null);
    setTotal(null);
    setListData([]);
    if (customTokenAddress === "") {
      setErrorMessage(`Please Add token Address`);
      setErrorModalIsOpen(true);
      return;
    }
    setTokenDetails(defaultTokenDetails);
    try {
      const { ethereum } = window;
      if (ethereum && customTokenAddress !== "") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        try {
          const erc20 = new ethers.Contract(
            customTokenAddress,
            ERC20.abi,
            signer
          );
          const name = await erc20.name();
          const symbol = await erc20.symbol();
          const balance = await erc20.balanceOf(address);
          const decimals = await erc20.decimals();
          console.log(symbol, balance);
          setTokenDetails({
            name,
            symbol,
            balance: ethers.utils.formatUnits(balance, decimals),
            decimal: decimals,
          });
          setTokenLoaded(true);
          setIsSendingEth(false);
          console.log(tokenDetails);
        } catch (error) {
          console.log("loading token error", error);
          setErrorMessage(`Token not Found`);
          setErrorModalIsOpen(true);

          return;
        }
      }
      // textifytour();
    } catch (error) {
      console.log(error);
    }
  };
  const unloadToken = async () => {
    setTokenDetails(defaultTokenDetails);
    setRemaining(null);
    setTotal(null);
    setTokenLoaded(false);
    setListData([]);
  };

  const getEthBalance = async () => {
    const { ethereum } = window;
    if (!ethBalance) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      let ethBalance = await provider.getBalance(address);
      ethBalance = ethers.utils.formatEther(ethBalance);
      setEthBalance(ethBalance);
    }
    setIsSendingEth(true);
  };
  const tokenBalance = async () => {
    if (
      !ethers.utils
        .parseUnits(tokenDetails.balance, tokenDetails.decimal)
        .gt(total)
    ) {
      setErrorMessage(
        `Token exceeded.You don't have enough Token, your ${
          tokenDetails.symbol
        } balance is ${tokenDetails.balance} ${
          tokenDetails.symbol
        } and your total transfer amount is ${ethers.utils.formatEther(
          total
        )} ${tokenDetails.symbol}`
      );
      setErrorModalIsOpen(true);
      setLoading(false);

      return false;
    } else {
      return true;
    }
  };
  const parseText = async (textValue) => {
    const lines = textValue.split("\n");
    let updatedRecipients = [];

    lines.forEach((line) => {
      const [address, value] = line.split(/[,= \t]+/);
      const validValue = isValidValue(value);

      if (isValidAddress(address) && validValue) {
        const isUsdAmount = /\$$/.test(value.trim());
        updatedRecipients.push({
          address,
          value: ethers.BigNumber.from(validValue),
          isUsdAmount,
        });
      }
    });

    setListData(updatedRecipients);
    console.log(updatedRecipients);

    return;
  };

  const executeTransaction = async () => {
    console.log(listData);
    setLoading(true);

    if (isSendingEth) {
      const { ethereum } = window;

      if (!ethers.utils.parseUnits(ethBalance).gt(total)) {
        setLoading(false);
        setErrorMessage(
          `Eth Limit Exceeded. Your Eth Balance is ${ethBalance}  ETH and you total sending Eth amount is ${ethers.utils.formatEther(
            total
          )} ETH `
        );
        setErrorModalIsOpen(true);
        return;
      } else {
        var recipients = [];
        var values = [];
        for (let i = 0; i < listData.length; i++) {
          recipients.push(listData[i]["address"]);
          values.push(listData[i]["value"]);
        }
        console.log(recipients, values, total);
        try {
          const con = await crossSendInstance();
          const txsendPayment = await con.disperseEther(recipients, values, {
            value: total,
          });

          const receipt = await txsendPayment.wait();
          setLoading(false);
          setErrorMessage(
            <div
              dangerouslySetInnerHTML={{
                __html: `Your Transaction was successful. Visit <a href="https://${blockExplorerURL}/tx/${receipt.transactionHash}" target="_blank">here</a> for details.`,
              }}
            />
          );
          setErrorModalIsOpen(true);
          setListData([]);
          setSuccess(true);
          console.log("Transaction receipt:", receipt);
        } catch (error) {
          setLoading(false);
          setErrorMessage(`Transaction cancelled.`);
          setErrorModalIsOpen(true);
          setSuccess(false);
          console.error("Transaction failed:", error);
        }
      }
    } else {
      var recipients = [];
      var values = [];

      for (let i = 0; i < listData.length; i++) {
        recipients.push(listData[i]["address"]);
        values.push(listData[i]["value"]);
      }
      let userTokenBalance;

      userTokenBalance = await tokenBalance(total);
      if (userTokenBalance) {
        const isTokenApproved = await approveToken(total, customTokenAddress);

        if (isTokenApproved) {
          try {
            const con = await crossSendInstance();
            const txsendPayment = await con.disperseToken(
              customTokenAddress,
              recipients,
              values
            );

            const receipt = await txsendPayment.wait();
            setLoading(false);
            setErrorMessage(
              <div
                dangerouslySetInnerHTML={{
                  __html: `Your Transaction was successful. Visit <a href="https://${blockExplorerURL}/tx/${receipt.transactionHash}" target="_blank">here</a> for details.`,
                }}
              />
            );
            setErrorModalIsOpen(true);
            setListData([]);
            setSuccess(true);
          } catch (e) {
            setLoading(false);
            setErrorMessage("Transaction Rejected");
            setErrorModalIsOpen(true);
            return;
          }
        } else {
          setLoading(false);
          setErrorMessage("Approval Rejected");
          setErrorModalIsOpen(true);
          return;
        }
      }
    }

    console.log("list of data received from the form:", listData);
    if (listData.length === 0) {
      setErrorMessage(`Please enter necessary details`);
      setErrorModalIsOpen(true);
      return;
    }
  };

  useEffect(() => {
    setFormData(parseText(textValue));
    getExplorer();
  }, [textValue, isTokenLoaded]);

  useEffect(() => {
    if (listData.length > 0) {
      let newTotal = listData[0].value;
      console.log(listData);
      for (let i = 1; i < listData.length; i++) {
        console.log(listData[i].value);
        newTotal = newTotal.add(listData[i].value);
        console.log(listData[i].value);
      }
      setTotal(newTotal);
    } else {
      setTotal(null);
    }
  }, [listData, isTokenLoaded]);

  useEffect(() => {
    const isValidRecipient = isValidAddress(recipientAddress);
    const isValidToken = isValidAddress(customTokenAddress);
    setIsInputValid(isValidRecipient && isValidToken);
  }, [recipientAddress, customTokenAddress]);

  useEffect(() => {
    if (isSendingEth) {
      textifytour();
      if (ethBalance && total) {
        const tokenBalance = ethers.utils.parseEther(ethBalance);
        const remaining = tokenBalance.sub(total);
        console.log(remaining);
        setRemaining(ethers.utils.formatEther(remaining));
        // textifytour();
      } else {
        setRemaining(null);
      }
    }
  }, [isTokenLoaded, isSendingEth, total, listData]);

  useEffect(() => {
    if (isTokenLoaded) {
      if (tokenDetails.balance && total) {
        const tokenBalance = ethers.utils.parseUnits(
          tokenDetails.balance,
          tokenDetails.decimal
        );
        const remaining = tokenBalance.sub(total);
        console.log(remaining);
        setRemaining(ethers.utils.formatUnits(remaining, tokenDetails.decimal));
      } else {
        setRemaining(null);
      }
    }
  }, [total]);

  const [ethToUsdExchangeRate, setEthToUsdExchangeRate] = useState(null);
  const [usdTotal, setUsdTotal] = useState(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        const rate = data.ethereum.usd;
        console.log("data here", data);
        setEthToUsdExchangeRate(rate);
        if (total) {
          console.log(data);
          const totalInUsd = ethers.utils.formatEther(total) * rate;
          setUsdTotal(totalInUsd);
        }
        console.log("tk details here", tokenDetails.decimal);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRate();
  }, [total]);

  // useEffect(() => {
  //   const savedTokenAddress = localStorage.getItem("customTokenAddress");
  //   if (savedTokenAddress) {
  //     setCustomTokenAddress(savedTokenAddress);
  //   }
  // }, []);

  // // Save the custom token address to local storage whenever it changes
  // useEffect(() => {
  //   localStorage.setItem("customTokenAddress", customTokenAddress);
  // }, [customTokenAddress]);

  // const hasVisitedthisBefore = document.cookie.includes("visited=true");
  // if (!hasVisitedthisBefore) {
  //   document.cookie = "visited=true; max-age=31536000"; // Max age is set to 1 year in seconds
  const textifytour = () => {
    // Check if the user has a localStorage item indicating they've visited before
    const hasVisitedBefore = localStorage.getItem("visited");

    if (!hasVisitedBefore) {
      // Run the tour only if the user is new
      const newTourDriver = driver({
        showButtons: ["done"],
        overlayColor: "#00000094",
        popoverClass: ` ${textStyle.driverpopover01}`,
        steps: [
          {
            element: "#tt",
            popover: {
              title: "Textify Illustration",
              description:
                "<Image src=${textiftgif} style='height: 202.5px; width: 270px;' />",
              side: "right",
              align: "start",
            },
          },
        ],
      });
      newTourDriver.drive();

      // Set a localStorage item to indicate that the user has visited
      localStorage.setItem("visited", "true");
    }
  };
  const handleImporttokenbuttonClick = () => {
    setIsSendingEth(false);
    setShowTokenSections(!showTokenSections);
  };
  const handleSendEthbuttonClick = () => {
    console.log("send eth button click");
    setTokenLoaded(false);
    getEthBalance();
    setShowTokenSections(false);
  };

  const handleInputTokenAddressChange = (e) => {
    const inputValue = e.target.value;

    const isValidInput = /^[a-zA-Z0-9]+$/.test(inputValue);

    if (isValidInput || inputValue === "") {
      setCustomTokenAddress(inputValue);
    }
  };

  const calculateTotal = () => {
    let totalEth = 0;
    let totalUsd = 0;

    if (listData.length > 0 && typeof ethToUsdExchangeRate === "number") {
      listData.forEach((data) => {
        const ethAmount = data.isUsdAmount
          ? data.value / ethToUsdExchangeRate
          : ethers.utils.formatEther(data.value);

        const usdAmount = data.isUsdAmount
          ? +data.value
          : ethers.utils.formatUnits(data.value, tokenDetails.decimal) *
            ethToUsdExchangeRate;
        totalEth += +ethAmount;
        totalUsd += +usdAmount;
      });
    }

    return { totalEth, totalUsd };
  };
  const { totalEth, totalUsd } = calculateTotal();
  return (
    <div>
      {/* <div className={`div-to-cover-same-text-div ${themeClass}`}> */}
      <div className={textStyle.divtocoversametextdiv}>
        <div className={textStyle.divforwholetoken}>
          <div className={textStyle.titleloadtokensametext}>
            <h2
              style={{
                padding: "10px",
                letterSpacing: "1px",
                fontSize: "20px",
                margin: "0px",
                fontWeight: "700",
              }}
            >
              Select or Import Token you want to Disperse
            </h2>
          </div>
          <div
            id="seend-eth"
            style={{
              padding: "30px 20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={textStyle.sametextmain}
          >
            {/* {isTokenLoaded ? null : ( */}
            <div id="send-eth">
              <button
                id="send-ethh"
                className={textStyle.buttontoaddformdata}
                onClick={handleSendEthbuttonClick}
              >
                Send Eth
              </button>
            </div>
            {/* )} */}
            <div className={textStyle.importtokendiv}>
              {/* {isTokenLoaded ? null : " OR "} */}
              <div style={{ margin: "5px 0px" }}>OR</div>
              {/* OR */}
              <button
                className={textStyle.buttontoaddformdataunload}
                onClick={handleImporttokenbuttonClick}
              >
                Import Token
              </button>
            </div>
          </div>

          {showTokenSections && (
            <div>
              <div
                style={{
                  marginBottom: "10px ",
                }}
                className={textStyle.accountsummarycreatetitle}
              >
                <h2
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    margin: "0px",
                    letterSpacing: "1px",
                    fontWeight: "700",
                  }}
                >
                  Load Your Token
                </h2>
              </div>
              {isTokenLoaded ? null : " "}
              <div style={{ padding: "20px" }}>
                <label style={{ margin: "5px" }}>Enter Token Address: </label>
                <input
                  id="input-token-load"
                  // id="border-green"
                  type="text"
                  // className={`each-input-of-create-list token-input ${themeClass}`}
                  className={`${textStyle["eachinputofcreatelist"]} ${textStyle["tokeninput"]}`}
                  placeholder="Enter token Address"
                  value={customTokenAddress}
                  onChange={(e) => handleInputTokenAddressChange(e)}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #fff",
                    background:
                      "linear-gradient(90deg, rgba(97, 38, 193, 0.58) 0.06%, rgba(63, 47, 110, 0.58) 98.57%)",
                    padding: "10px 20px",
                    margin: "0px 20px",
                    color: "white",
                  }}
                />
                {isTokenLoaded ? (
                  <button
                    id={textStyle.backgroundgreen}
                    // className={`buttontaddformdataunload ${themeClass}`}
                    className={textStyle.buttontaddformdataunload}
                    onClick={() => {
                      unloadToken();
                    }}
                  >
                    Unload Token
                  </button>
                ) : (
                  <button
                    id={textStyle.backgroundgreen}
                    className={textStyle.buttontoaddformdata}
                    onTouchStart={() => {
                      loadToken();
                    }}
                    onClick={() => {
                      loadToken();
                    }}
                  >
                    Load Token
                  </button>
                )}
              </div>
            </div>
          )}
          {isTokenLoaded ? (
            <div>
              <div className={textStyle.accountsummarycreatetitle}>
                <h2
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    margin: "0px",
                    letterSpacing: "1px",
                    fontWeight: "700",
                  }}
                >
                  Token Details
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  border: "1px solid #ddd",
                }}
              >
                <table className={textStyle.tabletextlist}>
                  <thead className={textStyle.tableheadertextlist}>
                    <tr className={textStyle.tableTr}>
                      <th
                        style={{ letterSpacing: "1px" }}
                        className={textStyle.tableTh}
                      >
                        Name
                      </th>
                      <th
                        style={{ letterSpacing: "1px" }}
                        className={textStyle.tableTh}
                      >
                        Symbol
                      </th>
                      <th
                        style={{ letterSpacing: "1px" }}
                        className={textStyle.tableTh}
                      >
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={textStyle.tableTr}>
                      <td
                        style={{ letterSpacing: "1px" }}
                        className={textStyle.tableTd}
                      >
                        {tokenDetails.name}
                      </td>
                      <td
                        style={{ letterSpacing: "1px" }}
                        className={textStyle.tableTd}
                      >
                        {tokenDetails.symbol}
                      </td>
                      <td className={textStyle.tableTd}>
                        {tokenDetails.balance}{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>

        {(isSendingEth || isTokenLoaded) && (
          <div>
            <div id="textify-input" className={textStyle.textlistdiv}>
              <div className={textStyle.titlesametexttextarea}>
                <h2
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    margin: "0px",
                    letterSpacing: "1px",
                    fontWeight: "700",
                  }}
                >
                  Enter Recipients and Amount (enter one address and amount on
                  each line, supports any format)
                </h2>
              </div>
              <div id="tt">
                <textarea
                  spellCheck="false"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "100px",
                    padding: "10px",
                    border: "none",
                    background: "#e6e6fa",
                    color: "black",
                    fontSize: "16px",
                    fontFamily: "Arial, sans-serif",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                  className={textStyle.textareaInput}
                  placeholder="0xe57f4c84539a6414C4Cf48f135210e01c477EFE0=1.41421 
                  0xe57f4c84539a6414C4Cf48f135210e01c477EFE0 1.41421
                  0xe57f4c84539a6414C4Cf48f135210e01c477EFE0,1.41421"
                ></textarea>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "right",
                paddingRight: "25px",
                paddingBottom: "10px",
              }}
            ></div>
          </div>
        )}

        {listData.length > 0 && (isSendingEth || isTokenLoaded) ? (
          // {listData.length > 0 && isSendingEth ? (
          <div>
            <div className={textStyle.tablecontainer}>
              <div
                className={textStyle.titleforlinupsametext}
                style={{ padding: "5px 0px" }}
              >
                <h2
                  style={{
                    padding: "10px",
                    letterSpacing: "1px",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  Your Transaction Lineup
                </h2>
              </div>
              <div className={textStyle.scrollabletablecontainer}>
                <table
                  className={textStyle.tabletextlist}
                  style={{ padding: "30px 20px" }}
                >
                  <thead className={textStyle.tableheadertextlist}>
                    <tr>
                      <th
                        className={textStyle.fontsize12px}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Wallet Address
                      </th>
                      <th
                        className={textStyle.fontsize12px}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Amount(ETH)
                      </th>
                      <th
                        className={textStyle.fontsize12px}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Amount(USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(listData.length > 0) &
                    (typeof ethToUsdExchangeRate === "number")
                      ? listData.map((data, index) => (
                          <tr key={index}>
                            <td
                              id="font-size-10px"
                              style={{ letterSpacing: "1px", padding: "8px" }}
                            >
                              {data.address}
                            </td>
                            <td
                              id="font-size-10px"
                              className={`showtoken-remaining-balance ${
                                remaining < 0
                                  ? "showtoken-remaining-negative"
                                  : ""
                              }`}
                              style={{ padding: "8px" }}
                            >
                              <div
                                id="font-size-10px"
                                // className="font-size-12px"
                                style={{
                                  width: "fit-content",
                                  margin: "0 auto",
                                  background:
                                    "linear-gradient(269deg, #0FF 2.32%, #1BFF76 98.21%)",
                                  color: "black",
                                  borderRadius: "10px",
                                  padding: "10px 10px",
                                  fontSize: "12px",
                                  letterSpacing: "1px",
                                }}
                              >
                                {isTokenLoaded || data.isUsdAmount
                                  ? data.isUsdAmount
                                    ? `${(
                                        data.value / ethToUsdExchangeRate
                                      ).toFixed(9)} ETH`
                                    : `${(+ethers.utils.formatUnits(
                                        data.value,
                                        tokenDetails.decimal
                                      )).toFixed(9)} ${tokenDetails.symbol}`
                                  : `${(+ethers.utils.formatEther(
                                      data.value
                                    )).toFixed(9)} ETH`}
                              </div>
                            </td>
                            <td
                              id="font-size-10px"
                              className={`showtoken-remaining-balance ${
                                remaining < 0
                                  ? "showtoken-remaining-negative"
                                  : ""
                              }`}
                              style={{ padding: "8px" }}
                            >
                              <div
                                id="font-size-10px"
                                // className="font-size-12px"
                                style={{
                                  width: "fit-content",
                                  margin: "0 auto",
                                  // background:
                                  //   "linear-gradient(269deg, #0FF 2.32%, #1BFF76 98.21%)",
                                  background:
                                    "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                                  color: "white",
                                  borderRadius: "10px",
                                  padding: "10px 10px",
                                  fontSize: "12px",
                                  letterSpacing: "1px",
                                }}
                              >
                                {totalUsd
                                  ? data.isUsdAmount
                                    ? `${(+data.value).toFixed(2)} $`
                                    : `${(
                                        +ethers.utils.formatUnits(
                                          data.value,
                                          tokenDetails.decimal
                                        ) * ethToUsdExchangeRate
                                      ).toFixed(2)} $`
                                  : "Loading..."}
                              </div>
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        {listData.length > 0 && isSendingEth ? (
          <div style={{ paddingBottom: "30px" }}>
            <div className={textStyle.titleforaccountsummarytextsame}>
              <h2
                style={{
                  padding: "10px",
                  letterSpacing: "1px",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                Account Summary
              </h2>
            </div>
            <div id={textStyle.tableresponsive}>
              <table
                className={`${textStyle["showtokentablesametext"]} ${textStyle["tabletextlist"]}`}
              >
                <thead className={textStyle.tableheadertextlist}>
                  <tr style={{ width: "100%", margin: "0 auto" }}>
                    <th className={textStyle.accountsummaryth}>
                      Total Amount(ETH)
                    </th>
                    <th className={textStyle.accountsummaryth}>
                      Total Amount(USD)
                    </th>
                    <th className={textStyle.accountsummaryth}>Your Balance</th>
                    <th className={textStyle.accountsummaryth}>
                      Remaining Balance
                    </th>
                  </tr>
                </thead>
                {/* <div>
          <p>Total Amount (ETH):
          </p>
          <p>Total Amount (USD): {totalUsd.toFixed(2)} $</p>
        </div> */}
                <tbody>
                  <tr>
                    <td id={textStyle.fontsize10px}>
                      <div id="font-size-10px" className={textStyle.textAccSum}>
                        {/* {total && ethToUsdExchangeRate && (
                          <div id="font-size-10px">
                            {`${(+ethers.utils.formatEther(total)).toFixed(
                              9
                            )} ETH `}
                            {/* <span style={{ color: "red", fontWeight: "500" }}>
                              {`( ${
                                usdTotal
                                  ? usdTotal.toFixed(2)
                                  : "Calculating..."
                              } USD )`}
                            </span> */}
                        {/* </div> */}
                        {/* )}{" "} */}
                        {/* {totalEth.toFixed(9)} ETH */}
                        {totalEth.toFixed(9)} ETH
                      </div>
                    </td>
                    <td id={textStyle.fontsize10px}>
                      {" "}
                      <div
                        id={textStyle.fontsize10px}
                        // className="font-size-12px"
                        style={{
                          width: "fit-content",
                          margin: "0 auto",
                          // background:
                          //   "linear-gradient(269deg, #0FF 2.32%, #1BFF76 98.21%)",
                          background:
                            "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                          color: "white",
                          borderRadius: "10px",
                          padding: "10px 10px",
                          fontSize: "12px",
                          letterSpacing: "1px",
                        }}
                      >
                        {totalUsd ? `${totalUsd.toFixed(2)} $` : "Loading..."}
                      </div>
                    </td>
                    <td id={textStyle.fontsize10px}>
                      <div
                        id="font-size-10px"
                        style={{
                          width: "fit-content",
                          margin: "0 auto",
                          color: "white",
                          borderRadius: "10px",
                          // fontSize: "17px",
                          // fontWeight: "700",
                          letterSpacing: "1px",
                        }}
                      >
                        {/* {`${ethBalance} ETH`}{" "} */}
                        {`${(+ethBalance).toFixed(9)} ETH `}
                      </div>
                    </td>
                    <td
                      id={textStyle.fontsize10px}
                      className={`showtoken-remaining-balance ${
                        remaining < 0 ? "showtoken-remaining-negative" : ""
                      }`}
                    >
                      <div
                        id={textStyle.fontsize10px}
                        // className="font-size-12px"
                        style={{
                          width: "fit-content",
                          margin: "0 auto",
                          background:
                            remaining < 0
                              ? "red"
                              : "linear-gradient(269deg, #0FF 2.32%, #1BFF76 98.21%)",
                          color: remaining < 0 ? "white" : "black",
                          borderRadius: "10px",
                          padding: "10px 10px",
                          fontSize: "12px",
                        }}
                      >
                        {remaining === null
                          ? null
                          : `${(+remaining).toFixed(9)} ETH`}{" "}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
        <div>
          {listData.length > 0 && isTokenLoaded ? (
            <div>
              <div className={textStyle.accountsummarycreatetitle}>
                <h2
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    margin: "0px",
                    letterSpacing: "1px",
                    fontWeight: "700",
                  }}
                >
                  Account Summary
                </h2>
              </div>
              <div id={textStyle.tableresponsive}>
                <table
                  className={`${textStyle["showtokentable"]} ${textStyle["tabletextlist"]}`}
                >
                  <thead className={textStyle.tableheadertextlist}>
                    <tr>
                      <th style={{ letterSpacing: "1px", padding: "8px" }}>
                        Total Amount(ETH)
                      </th>
                      <th style={{ letterSpacing: "1px", padding: "8px" }}>
                        Total Amount(USD)
                      </th>
                      <th style={{ letterSpacing: "1px", padding: "8px" }}>
                        Remaining Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        id="font-size-10px"
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        {total && ethToUsdExchangeRate && (
                          <>
                            <div className={textStyle.textAccSum}>
                              {totalEth.toFixed(9)} ETH
                              {/* {totalEth.toFixed(9)} ETH */}
                            </div>

                            {/* <span style={{ color: "red", fontWeight: "500" }}>
                              {`( ${
                                usdTotal
                                  ? usdTotal.toFixed(2)
                                  : "Calculating..."
                              } USD )`}
                            </span> */}
                          </>
                        )}
                      </td>
                      <td id="font-size-10px" style={{ letterSpacing: "1px" }}>
                        {total && ethToUsdExchangeRate && (
                          <>
                            {/* {`${ethers.utils.formatEther(total)} ETH `} */}
                            <div
                              className={textStyle.fontsize12px}
                              style={{
                                width: "fit-content",
                                margin: "0 auto",
                                // background:
                                //   "linear-gradient(269deg, #0FF 2.32%, #1BFF76 98.21%)",
                                background:
                                  "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                                color: "white",
                                borderRadius: "10px",
                                padding: "10px 10px",
                                fontSize: "12px",
                                letterSpacing: "1px",
                              }}
                            >
                              {totalUsd
                                ? `${totalUsd.toFixed(2)} $`
                                : "Loading..."}
                            </div>
                          </>
                        )}
                      </td>

                      <td
                        id="font-size-10px"
                        className={`showtoken-remaining-balance ${
                          remaining < 0 ? "showtoken-remaining-negative" : ""
                        }`}
                        style={{ letterSpacing: "1px" }}
                      >
                        <div
                          className={textStyle.fontsize12px}
                          style={{
                            width: "fit-content",
                            margin: "0 auto",
                            background:
                              remaining < 0
                                ? "red"
                                : "linear-gradient(269deg, #0FF 2.32%, #1BFF76 98.21%)",
                            color: remaining < 0 ? "white" : "black",
                            padding: "10px 10px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            letterSpacing: "1px",
                          }}
                        >
                          {remaining === null
                            ? null
                            : `${(+remaining).toFixed(9)} ${
                                tokenDetails.symbol
                              }`}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          <div>
            {/* {listData.length > 0 ? ( */}
            {listData.length > 0 && (isSendingEth || isTokenLoaded) ? (
              <button
                id={textStyle.greenbackground}
                className={textStyle.sendbutton}
                onClick={() => {
                  executeTransaction();
                }}
                disabled={loading}
              >
                {loading ? (
                  <div className={textStyle.loader}></div>
                ) : (
                  "Begin Payment"
                )}
              </button>
            ) : null}
          </div>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              transform: "translate(-50%, -50%)",
              borderRadius: "15px",
              background: "black",
              color: "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2>Textify Illustration</h2>
          </div>
          <Image
            src={textiftgif}
            alt="GIF"
            style={{ maxWidth: "100%", borderRadius: "8px 8px 0 0" }}
          />

          <div>
            <div>
              <h3 style={{ margin: "5px 0px" }}>Quick Guide</h3>
            </div>
            <ul>
              {/* <li>Input Ethereum addresses and amounts line by line.</li>
              <li>
                Use formats: `address=amount`, `address,amount`, or `address
                amount`.
              </li> */}
              <li>Example:</li>
              <ul>
                <li>
                  <code>0x7D96c55A7b510e523812f67b4D49d514B8cE9040 1.5</code>
                </li>
                <li>
                  <code>0x7D96c55A7b510e523812f67b4D49d514B8cE9040=1.5</code>
                </li>
                <li>
                  <code>0x7D96c55A7b510e523812f67b4D49d514B8cE9040,1.5</code>
                </li>
              </ul>
            </ul>

            {/* Add the rest of your documentation here */}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              style={{
                padding: "5px 15px",
                fontSize: "20px",
                borderRadius: "5px",
                border: "1px solid white",
                background: "black",
                color: "white",
              }}
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={howModalIsOpen}
          onRequestClose={closeHowModal}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              transform: "translate(-50%, -50%)",
              borderRadius: "15px",
              background: "black",
              color: "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2>Import Token Illustration</h2>
          </div>
          <img
            src={importtoken}
            alt="GIF"
            style={{
              maxWidth: "100%",
              borderRadius: "8px 8px 0 0",
              margin: "10px",
            }}
          />

          <div>
            <div>
              {/* <h3 style={{ margin: "5px 0px" }}>Quick Guide</h3> */}
            </div>
            {/* <ul> */}
            {/* <li>Input Ethereum addresses and amounts line by line.</li>
              <li>
                Use formats: `address=amount`, `address,amount`, or `address
                amount`.
              </li> */}
            {/* <li>Example:</li>
              <ul>
                <li>
                  <code>0x7D96c55A7b510e523812f67b4D49d514B8cE9040 1.5</code>
                </li>
                <li>
                  <code>0x7D96c55A7b510e523812f67b4D49d514B8cE9040=1.5</code>
                </li>
                <li>
                  <code>0x7D96c55A7b510e523812f67b4D49d514B8cE9040,1.5</code>
                </li>
              </ul>
            </ul> */}

            {/* Add the rest of your documentation here */}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              style={{
                padding: "5px 15px",
                fontSize: "20px",
                borderRadius: "5px",
                border: "1px solid white",
                background: "black",
                color: "white",
              }}
              onClick={closeHowModal}
            >
              Close
            </button>
          </div>
        </Modal>
        <Modal
          className={textStyle.popupforpayment}
          isOpen={errorModalIsOpen}
          onRequestClose={() => setErrorModalIsOpen(false)}
          contentLabel="Error Modal"
        >
          {errorMessage ? (
            <>
              <h2>{success ? "Congratulations!!" : "Error"}</h2>
              <p>{errorMessage}</p>
              <div className={textStyle.divtocenter}>
                <button onClick={() => setErrorModalIsOpen(false)}>
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>Notice</h2>
              <p>{alertMessage}</p>
              <div className={textStyle.divtocenter}>
                <button onClick={() => setErrorModalIsOpen(false)}>
                  Close
                </button>
              </div>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default SameTextlist;
