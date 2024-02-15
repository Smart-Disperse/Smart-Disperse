"use client";
import React, { useState, useEffect } from "react";
import { crossSendInstance } from "@/Helpers/ContractInstance";
import { getTokenBalance } from "@/Helpers/TokenBalance";
import { approveToken } from "@/Helpers/ApproveToken";
import tokensContractAddress from "@/Helpers/GetTokenContractAddress.json";
import DecimalValue from "@/Helpers/DecimalValue.json";
import ERC20 from "@/artifacts/contracts/ERC20.sol/ERC20.json";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { CovalentClient } from "@covalenthq/client-sdk";
import listStyle from "@/Components/DashboardComponents/listify.module.css";
import { lightTheme } from "@rainbow-me/rainbowkit";

function SameCreateList() {
  // const { toggleDarkMode, themeClass } = useTheme();
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
  const [isSendingEth, setIsSendingEth] = useState(true);
  const [isTokenLoaded, setTokenLoaded] = useState(false);
  const [blockExplorerURL, setBlockExplorerURL] = useState("");
  const [createlist, setcreatelist] = useState();
  const [chainName, setChainName] = useState("");
  const [showTokenSections, setShowTokenSections] = useState(false);
  const [sendEthClicked, setSendEthClicked] = useState(false);
  const [getUserAddress, SetUserAddress] = useState(null);
  const [tokenData, setTokenData] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);

  // const [custoomTokenAddress, setCustoomTokenAddress] = useLocalStorage(
  //   "customTokenAddress",
  //   ""
  // );
  useEffect(() => {
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
  }, []);
  const [formData, setFormData] = useState({
    receiverAddress: "",
    tokenAmount: "",
    chainName: "Scroll",
  });

  const defaultTokenDetails = {
    name: null,
    symbol: null,
    balance: null,
    decimal: null,
  };
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

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
  const loadToken = async () => {
    setRemaining(null);
    setTotal(null);
    setListData([]);
    setIsSendingEth(false);
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
          console.log(tokenDetails);
        } catch (error) {
          console.log("loading token error", error);
          setErrorMessage(`Token not Found`);
          setErrorModalIsOpen(true);
          return;
        }
      }
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
    setSendEthClicked(true);
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

      return false;
    } else {
      return true;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Regular expression to allow numeric and decimal values
    const validInputRegex = /^\d*\.?\d*$/;

    // Check if the input value matches the allowed pattern
    if (validInputRegex.test(value)) {
      // Update the state with the valid input
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleReceiverAddressChange = (event) => {
    setFormData({
      ...formData,
      receiverAddress: event.target.value,
    });
    // Add any other logic you want to perform for receiverAddress input
  };

  const isValidAddress = (address) => ethers.utils.isAddress(address);

  const isValidValue = (value) => {
    console.log(value);
    if (isTokenLoaded) {
      try {
        console.log(ethers.utils.parseUnits(value, tokenDetails.decimal));
        return ethers.utils.parseUnits(value, tokenDetails.decimal);
      } catch (err) {
        return false;
      }
    } else {
      try {
        if (ethers.utils.parseUnits(value, "ether") <= 0) {
          return false;
        }
        console.log(ethers.utils.parseUnits(value, "ether"));
        return ethers.utils.parseUnits(value, "ether");
      } catch (err) {
        return false;
      }
    }
  };

  const validateFormData = async () => {
    var address = formData.receiverAddress;
    var amount = formData.tokenAmount;
    if (!/^\d/.test(amount)) {
      amount = amount.slice(1);
    }
    console.log(isValidValue(amount));
    console.log(isValidAddress(address));
    if (!isValidValue(amount) && !isValidAddress(address)) {
      setErrorMessage("Incorrect details");
      setErrorModalIsOpen(true);
      return false;
    }

    if (!isValidValue(amount)) {
      setErrorMessage("Invalid token Value");
      setErrorModalIsOpen(true);
      return false;
    }
    if (!isValidAddress(address)) {
      setErrorMessage("Invalid recipient Address");
      setErrorModalIsOpen(true);
      return false;
    }
    var amountnew = isValidValue(amount);
    formData.tokenAmount = amountnew;
    return true;
  };

  const handleAddClick = async () => {
    const isvalid = await validateFormData();

    if (isvalid) {
      setListData([...listData, formData]);
      setFormData({
        receiverAddress: "",
        tokenAmount: "",
        chainName: formData.chainName,
      });
      localStorage.removeItem("receiverAddress");
      localStorage.removeItem("tokenAmount");
    }
  };

  const handleDeleteRow = (index) => {
    const updatedList = [...listData];
    updatedList.splice(index, 1);
    setListData(updatedList);
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
          recipients.push(listData[i]["receiverAddress"]);
          values.push(listData[i]["tokenAmount"]);
        }

        try {
          const con = await crossSendInstance();
          console.log(recipients, values, total);

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
        recipients.push(listData[i]["receiverAddress"]);
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
    if (listData.length > 0) {
      let newTotal = listData[0].tokenAmount;
      for (let i = 1; i < listData.length; i++) {
        newTotal = newTotal.add(listData[i].tokenAmount);
        console.log(listData[i].tokenAmount);
      }
      setTotal(newTotal);
    } else {
      setTotal(null);
    }
    getExplorer();
  }, [listData]);

  useEffect(() => {
    if (isSendingEth) {
      if (ethBalance && total) {
        const tokenBalance = ethers.utils.parseEther(ethBalance);
        const remaining = tokenBalance.sub(total);
        console.log(remaining);
        setRemaining(ethers.utils.formatEther(remaining));
      } else {
        setRemaining(null);
      }
    }
  }, [total, listData, ethBalance]);

  const [ethToUsdExchangeRate, setEthToUsdExchangeRate] = useState(null);
  const [usdTotal, setUsdTotal] = useState(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.coinbase.com/v2/exchange-rates?currency=ETH&rates=USD"
        );
        const data = await response.json();
        const rate = data.data.rates.USD;
        setEthToUsdExchangeRate(rate);

        if (total) {
          const totalInUsd = ethers.utils.formatEther(total) * rate;
          setUsdTotal(totalInUsd);
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, [total]);

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
  }, [total, listData]);

  useEffect(() => {
    const getConnectedChain = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const connectedAddress = await signer.getAddress();
          // console.log("address", connectedAddress);
          SetUserAddress(connectedAddress);
          const network = await provider.getNetwork();

          console.log("Detected Chain :", network);
          console.log("Detected Chain ID:", network.chainId);

          const networkId = parseInt(network.chainId, 10);

          const chainNames = {
            34443: "Mode Mainnet",
            919: "mode-testnet",
            534352: "Scroll",
            // 534351: "Scroll Sepolia",
            534351: "scroll-sepolia-testnet",
          };

          const detectedChainName = chainNames[networkId] || "Unknown Chain";
          console.log("Detected Chain Name:", detectedChainName);
          setChainName(detectedChainName);
        } else {
          console.log("No Wallet Connected");
          setChainName("No Wallet Connected");
        }
      } catch (error) {
        console.error("Error getting connected chain:", error);
        setChainName("Error Fetching Chain");
      }
    };

    getConnectedChain();

    // Listen for changes in the connected network
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        getConnectedChain();
      });
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

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

  const getUserToken = async () => {
    try {
      const client = new CovalentClient("cqt_rQkMGxfMKthKtcrPHrHj6PwkBPrH");
      const resp = await client.BalanceService.getTokenBalancesForWalletAddress(
        chainName,
        address
      );

      const tokenArray = resp.data.items;
      setTokenData(tokenArray);
    } catch (error) {
      console.error("Error fetching user token:", error);
    }
  };

  useEffect(() => {
    if (isSendingEth) {
      getEthBalance();
    }
  });

  useEffect(() => {
    const getUserToken = async () => {
      try {
        const client = new CovalentClient("cqt_rQkMGxfMKthKtcrPHrHj6PwkBPrH");
        const resp =
          await client.BalanceService.getTokenBalancesForWalletAddress(
            chainName,
            address
          );

        const tokenArray = resp.data.items;
        setTokenData(tokenArray);
      } catch (error) {
        console.error("Error fetching user token:", error);
      }
    };

    getUserToken();
  }, [chainName, address]);

  useEffect(() => {
    const savedReceiverAddress = localStorage.getItem("receiverAddress") || "";
    const savedTokenAmount = localStorage.getItem("tokenAmount") || "";

    // Update the form data with the saved values
    setFormData({
      receiverAddress: savedReceiverAddress,
      tokenAmount: savedTokenAmount,
    });
  }, []);

  const handleTokenChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedToken(tokenData[selectedIndex]);
  };

  return (
    // <div className={`main-div-same-create-list ${themeClass}`}>
    <div className={listStyle.maindivsamecreatelist}>
      {/* <button onClick={getConnectedChain}>check here</button> */}
      {/* <p>1. Select Tokens to disperse</p> */}
      <div className={listStyle.selectloadtokentitle}>
        <h2
          style={{
            padding: "10px",
            fontSize: "20px",
            margin: "0px",
            letterSpacing: "1px",
            fontWeight: "700",
          }}
          className={listStyle.sametextmain}
        >
          Select or Import Token you want to Disperse
        </h2>
      </div>
      {/* <button onClick={getUserToken}>get token</button>
      <div>
        <h1>Token Balances</h1>
        <label htmlFor="tokenDropdown">Select a Token:</label>
        <select id="tokenDropdown" onChange={handleTokenChange}>
          <option value="">Select a token</option>
          {tokenData.map((token, index) => (
            <option key={index} value={index}>
              {`${token.contract_display_name} - ${token.balance}`}
            </option>
          ))}
        </select>

        {selectedToken && (
          <div>
            <p>Token Name: {selectedToken.contract_display_name}</p>
            <p>Token Balance: {selectedToken.balance}</p>
          </div>
        )}
      </div> */}
      <div className={listStyle.divtokeninputs}>
        {/* {isTokenLoaded ? null : ( */}
        <div className={listStyle.sendbuttindiv}>
          <button
            style={{
              backgroundColor: isSendingEth ? "white" : "",
              color: isSendingEth ? "#924afc" : "",
            }}
            id=""
            className={listStyle.buttontoaddformdata}
            onClick={handleSendEthbuttonClick}
          >
            Send Eth
          </button>
          {/* {sendEthClicked && <p>Sending ETH</p>} */}
        </div>
        {/* )} */}
        <div className={listStyle.importtokendiv}>
          <div className={listStyle.orrr}>OR</div>
          {/* {isTokenLoaded ? null : "OR  "} */}
          <button
            style={{
              backgroundColor: isSendingEth ? "" : "white",
              color: isSendingEth ? "" : "#924afc",
            }}
            className={listStyle.buttontoaddformdataunload}
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
            className={listStyle.accountsummarycreatetitle}
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
          <div
            className={listStyle.entertokenaddress}
            style={{ padding: "20px" }}
          >
            <label style={{ margin: "5px" }}>Enter Token Address: </label>
            <input
              id={listStyle.inputtokenload}
              type="text"
              // className={`each-input-of-create-list token-input ${themeClass}`}
              className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
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
                id={listStyle.backgroundgreen}
                className={listStyle.buttontoaddformdataunload}
                onClick={() => {
                  unloadToken();
                }}
              >
                Unload Token
              </button>
            ) : (
              <button
                className={listStyle.buttontoaddformdata}
                id={listStyle.backgroundgreen}
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
      {/* </div> */}
      {isTokenLoaded ? (
        <div>
          <div className={listStyle.accountsummarycreatetitle}>
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
          <table
            style={{
              margin: "10px 0px",
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead className={listStyle.tableheadertextlist}>
              <tr>
                <th style={{ letterSpacing: "1px", padding: "8px" }}>Name</th>
                <th style={{ letterSpacing: "1px", padding: "8px" }}>Symbol</th>
                <th style={{ letterSpacing: "1px", padding: "8px" }}>
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{ letterSpacing: "1px", padding: "8px" }}
                  className={listStyle.tableTd}
                >
                  {tokenDetails.name}
                </td>
                <td
                  style={{ letterSpacing: "1px", padding: "8px" }}
                  className={listStyle.tableTd}
                >
                  {tokenDetails.symbol}
                </td>
                <td
                  style={{ letterSpacing: "1px", padding: "8px" }}
                  className={listStyle.tableTd}
                >
                  {tokenDetails.balance}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
      {(isSendingEth || isTokenLoaded) && (
        <div className={listStyle.divinsamecreatelisttokenload}>
          <div className={listStyle.enteraddressdivtitle}>
            <h2
              style={{
                fontWeight: "700",
                padding: "10px",
                fontSize: "20px",
                margin: "0px",
                letterSpacing: "1px",
                fontWeight: "700",
              }}
              className={listStyle.enteraddressdivtitleh2}
            >
              Enter the Recipient Address and Token Amount{" "}
            </h2>
          </div>
          <div style={{ padding: "30px 20px" }}>
            <div className={listStyle.inputflexlist}>
              <label className={listStyle.enteraddressdivtitlelabel}>
                Enter Receiver Address:{" "}
              </label>
              <input
                // id="blue-div"
                // className={`each-input-of-create-list token-input ${themeClass}`}
                className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
                type="text"
                name="receiverAddress"
                value={formData.receiverAddress}
                placeholder="0x9b4716573622751e7F6a56da251D054b6BBa4B00"
                onChange={handleReceiverAddressChange}
              />
            </div>
            <div className={listStyle.inputflexlist}>
              <label>Enter Token Amount: </label>
              <input
                // style={{ color: "black" }}
                // className={`each-input-of-create-list token-input ${themeClass}`}
                className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
                type="text"
                name="tokenAmount"
                value={formData.tokenAmount}
                placeholder="0.50"
                onChange={handleInputChange}
              />
            </div>

            <div className={listStyle.inputflexlist}>
              <label>Chain Name: </label>

              <input
                id="blue-div"
                // className={`each-input-of-create-list token-input ${themeClass}`}
                className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
                type="text"
                name="chainName"
                value={chainName}
                placeholder={chainName}
                readOnly
              />
            </div>
            <div className={listStyle.inputflexlist}>
              <lable
                className={listStyle.inputflexlistlabel}
                style={{ width: "25%" }}
              ></lable>
              <button
                id={listStyle.addtolistbuttonid}
                className={`${listStyle["buttontoaddformdata"]} ${listStyle["maddtolist"]}}`}
                onClick={handleAddClick}
                style={{ width: "45%" }}
              >
                Add to List
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <div
        className={`user-form-for-list ${
          errorModalIsOpen ? "blurred-background" : ""
        }`}
      > */}

      {/* {listData.length > 0 && isSendingEth ? ( */}
      {/* {(listData.length > 0 && isSendingEth) || isTokenLoaded ? ( */}

      {/* <div className="div-to-add-the-tx"> */}
      {listData.length > 0 ? (
        <div>
          <div className={listStyle.viewaddressdivtitle}>
            <h2
              style={{
                padding: "10px",
                fontSize: "20px",
                margin: "0px",
                letterSpacing: "1px",
                fontWeight: "700",
              }}
              className={listStyle.viewaddressdivtitleh2}
            >
              Your Transaction Lineup
            </h2>
          </div>
          <div className={listStyle.scrollabletablecontainer}>
            <table className={listStyle.tabletextlist}>
              <thead className={listStyle.tableheadertextlist}>
                <tr>
                  <th
                    className={listStyle.accountsummartth}
                    style={{ letterSpacing: "1px", padding: "8px" }}
                  >
                    Receiver Address
                  </th>
                  <th
                    className={listStyle.accountsummartth}
                    style={{ letterSpacing: "1px", padding: "8px" }}
                  >
                    Chain Name
                  </th>
                  <th
                    className={listStyle.accountsummartth}
                    style={{ letterSpacing: "1px", padding: "8px" }}
                  >
                    Token Symbol
                  </th>
                  <th
                    className={listStyle.accountsummartth}
                    style={{ letterSpacing: "1px", padding: "8px" }}
                  >
                    Amount(ETH)
                  </th>
                  <th
                    className={listStyle.accountsummartth}
                    style={{ letterSpacing: "1px", padding: "8px" }}
                  >
                    Amount (USD)
                  </th>
                </tr>
              </thead>
              <tbody>
                {listData.map((data, index) => (
                  <tr key={index}>
                    <td
                      id={listStyle.fontsize10px}
                      style={{ letterSpacing: "1px", padding: "8px" }}
                    >
                      {`${data.receiverAddress.slice(
                        0,
                        4
                      )}...${data.receiverAddress.slice(-3)}`}
                    </td>

                    <td style={{ letterSpacing: "1px", padding: "8px" }}>
                      <div
                        id={listStyle.fontsize10px}
                        style={{
                          width: "fit-content",
                          margin: "0 auto",
                          color: "white",
                          borderRadius: "10px",
                          letterSpacing: "1px",
                        }}
                      >
                        {isTokenLoaded ? tokenDetails.symbol : "ETH"}
                      </div>
                    </td>
                    <td style={{ letterSpacing: "1px", padding: "8px" }}>
                      <div
                        id={listStyle.fontsize10px}
                        style={{
                          width: "fit-content",
                          margin: "0 auto",
                          borderColor: "white",
                          borderRadius: "10px",
                          padding: "10px 10px",
                          letterSpacing: "1px",
                        }}
                      >
                        {chainName}
                      </div>
                    </td>
                    <td style={{ letterSpacing: "1px", padding: "8px" }}>
                      <div
                        id={listStyle.fontsize10px}
                        style={{
                          width: "70px",
                          margin: "0 auto",
                          color: "white",
                          borderRadius: "10px",
                          letterSpacing: "1px",
                        }}
                      >
                        {console.log(
                          "tk deciamls",
                          ethers.utils.formatEther(data.tokenAmount)
                        )}
                        {isTokenLoaded
                          ? (+ethers.utils.formatUnits(
                              data.tokenAmount,
                              tokenDetails.decimal
                            )).toFixed(9)
                          : (+ethers.utils.formatEther(
                              data.tokenAmount
                            )).toFixed(9)}
                      </div>
                    </td>
                    <td style={{ letterSpacing: "1px", padding: "8px" }}>
                      <div
                        id={listStyle.fontsize10px}
                        style={{
                          width: "fit-content",
                          margin: "0 auto",
                          background:
                            "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                          color: "white",
                          borderRadius: "10px",
                          padding: "10px 10px",
                          fontSize: "12px",
                          letterSpacing: "1px",
                        }}
                      >
                        {ethToUsdExchangeRate
                          ? (
                              parseFloat(
                                ethers.utils.formatUnits(
                                  data.tokenAmount,
                                  tokenDetails.decimal
                                )
                              ) * ethToUsdExchangeRate
                            ).toFixed(2)
                          : "Loading..."}
                      </div>
                    </td>
                    <td style={{ letterSpacing: "1px", padding: "8px" }}>
                      <button
                        className={listStyle.deletebutton}
                        onClick={() => handleDeleteRow(index)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {listData.length > 0 && isSendingEth ? (
            <div>
              <div className={listStyle.accountsummarycreatetitle}>
                <h2
                  className={listStyle.accountsummaryh2}
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
              <div id={listStyle.tableresponsive}>
                <table className={listStyle.showtokentable}>
                  <thead className={listStyle.tableheadertextlist}>
                    <tr>
                      <th
                        className={listStyle.accountsummartth}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Total Amount(ETH)
                      </th>
                      <th
                        className={listStyle.accountsummartth}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Total Amount(USD)
                      </th>
                      <th
                        className={listStyle.accountsummartth}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Your Balance
                      </th>
                      <th
                        className={listStyle.accountsummartth}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Remaining Balance
                      </th>
                    </tr>
                  </thead>{" "}
                  <tbody>
                    <tr>
                      <td style={{ letterSpacing: "1px", padding: "8px" }}>
                        <div
                          id={listStyle.fontsize10px}
                          className={`${listStyle["listAccSum"]} ${listStyle["fontsize12px"]}`}
                        >
                          {total && ethToUsdExchangeRate && (
                            <>
                              {`${ethers.utils.formatEther(total)} ETH `}
                              {/* <span style={{ color: "red", fontWeight: "500" }}>
                                {`( ${
                                  usdTotal
                                    ? usdTotal.toFixed(2)
                                    : "Calculating..."
                                } USD )`}
                              </span> */}
                            </>
                          )}
                        </div>
                      </td>
                      <td style={{ letterSpacing: "1px", padding: "8px" }}>
                        <div
                          id={listStyle.fontsize10px}
                          className={listStyle.fontsize12px}
                          style={{
                            width: "fit-content",
                            margin: "0 auto",
                            background:
                              "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                            color: "white",
                            borderRadius: "10px",
                            padding: "10px 10px",
                            fontSize: "12px",
                            letterSpacing: "1px",
                          }}
                        >
                          {total && ethToUsdExchangeRate && (
                            <>
                              {/* {`${ethers.utils.formatEther(total)} ETH `} */}
                              <span
                                id={listStyle.fontsize10px}
                                style={{ fontWeight: "500" }}
                              >
                                {` ${
                                  usdTotal ? usdTotal.toFixed(2) : "Loading..."
                                } $ `}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td style={{ letterSpacing: "1px", padding: "8px" }}>
                        <div
                          id={listStyle.fontsize10px}
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
                          {`${(+ethBalance).toFixed(9)} ETH`}
                        </div>
                      </td>

                      <td
                        className={`showtokenremainingbalance ${
                          remaining < 0 ? "showtokenremainingnegative" : ""
                        }`}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        <div
                          id={listStyle.fontsize10px}
                          className={listStyle.fontsize12px}
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
                            letterSpacing: "1px",
                          }}
                        >
                          {remaining === null
                            ? null
                            : `${(+remaining).toFixed(9)} ETH`}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          {listData.length > 0 && isTokenLoaded ? (
            <div>
              <div className={listStyle.accountsummarycreatetitle}>
                <h2
                  className={listStyle.accountsummaryh2}
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    margin: "0px",
                    fontWeight: "700",
                    letterSpacing: "1px",
                  }}
                >
                  Account Summary
                </h2>
              </div>
              <div id={listStyle.tableresponsive}>
                <table className={listStyle.showtokentable}>
                  <thead className={listStyle.tableheadertextlist}>
                    <tr>
                      <th
                        className={listStyle.tableheadertextlist}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Total Amount(ETH)
                      </th>
                      <th
                        className={listStyle.accountsummaryth}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Total Amount(USD)
                      </th>
                      <th
                        className={listStyle.accountsummaryth}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Remaining Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ letterSpacing: "1px", padding: "8px" }}>
                        {total && ethToUsdExchangeRate && (
                          <>
                            <div
                              id={listStyle.fontsize10px}
                              className={`${listStyle["listAccSum"]} ${listStyle["fontsize12px"]}`}
                            >
                              {`${ethers.utils.formatEther(total)} ETH `}
                            </div>
                            {/* <span style={{ color: "red", fontWeight: "500" }}>
                            {`( ${
                              usdTotal ? usdTotal.toFixed(2) : "Calculating..."
                            } $ )`}
                          </span> */}
                          </>
                        )}
                      </td>
                      <td style={{ letterSpacing: "1px", padding: "8px" }}>
                        {total && ethToUsdExchangeRate && (
                          <>
                            {/* {`${ethers.utils.formatEther(total)} ETH `} */}
                            <div
                              id={listStyle.fontsize10px}
                              className={listStyle.fontsize12px}
                              style={{
                                width: "fit-content",
                                margin: "0 auto",
                                background:
                                  "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                                color: "white",
                                borderRadius: "10px",
                                padding: "10px 10px",
                                fontSize: "12px",
                                letterSpacing: "1px",
                              }}
                            >
                              {` ${
                                usdTotal ? usdTotal.toFixed(2) : "Loading..."
                              } $ `}
                            </div>
                          </>
                        )}
                      </td>
                      <td
                        className={`showtoken-remaining-balance ${
                          remaining < 0 ? "showtoken-remaining-negative" : ""
                        }`}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        <div
                          id={listStyle.fontsize10px}
                          className={listStyle.fontsize12px}
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
            <button
              className={listStyle.sendbutton}
              onClick={() => {
                executeTransaction();
              }}
              disabled={loading}
            >
              {loading ? (
                <div className={listStyle.loader}></div>
              ) : (
                "Begin Payment"
              )}
            </button>
          </div>
        </div>
      ) : null}
      {/* </div> */}
      <Modal
        className={listStyle.popupforpayment}
        isOpen={errorModalIsOpen}
        onRequestClose={() => setErrorModalIsOpen(false)}
        contentLabel="Error Modal"
      >
        {errorMessage ? (
          <>
            <h2>{success ? "Congratulations!!" : "Error"}</h2>
            <p>{errorMessage}</p>
            <div className={listStyle.divtocenter}>
              <button onClick={() => setErrorModalIsOpen(false)}>Close</button>
            </div>
          </>
        ) : (
          <>
            <h2>Notice</h2>
            <p>{alertMessage}</p>
            <div className={listStyle.divtocenter}>
              <button onClick={() => setErrorModalIsOpen(false)}>Close</button>
            </div>
          </>
        )}
      </Modal>
      {/* </div> */}
    </div>
  );
}

export default SameCreateList;
