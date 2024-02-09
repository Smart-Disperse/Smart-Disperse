import React, { useState, useEffect } from "react";
import { crossSendInstance } from "@/Helpers/ContractInstance";
import { getDestChainAddress } from "@/Helpers/DestChainAddresses";
import { getTokenBalance } from "@/Helpers/TokenBalance";
import { getGasFees } from "@/Helpers/getGasEstimation";
import { approveToken } from "@/Helpers/ApproveToken";
import DecimalValue from "@/Helpers/DecimalValue.json";
import tokensContractAddress from "@/Helpers/GetTokenContractAddress.json";
import ERC20 from "@/artifacts/contracts/ERC20.sol/ERC20.json";
// import { useTheme } from "@/ThemeProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useAccount, useSigner } from "wagmi";
import Modal from "react-modal";
import { ethers } from "ethers";

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

function SameCsvList() {
  // const { toggleDarkMode, themeClass } = useTheme();
  const [csvData, setCsvData] = useState([]);
  const { address, isConnected } = useAccount();
  const [listData, setListData] = useState([]);
  const [isCsvDataEmpty, setIsCsvDataEmpty] = useState(true);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [total, setTotal] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenSymbolFinal, setTokenSymbol] = useState("ETH");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isTokenLoaded, setTokenLoaded] = useState(false);
  const [blockExplorerURL, setBlockExplorerURL] = useState("");
  const [chainName, setChainName] = useState("");
  const [ethToUsdExchangeRate, setEthToUsdExchangeRate] = useState(null);
  const [usdTotal, setUsdTotal] = useState(null);
  const [showTokenSections, setShowTokenSections] = useState(false);
  const [sendEthClicked, setSendEthClicked] = useState(false);
  // const [customTokenAddress, setCustomTokenAddress] = useLocalStorage(
  //   "customTokenAddress",
  //   ""
  // );

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
  const parseCSV = (content) => {
    const rows = content.split("\n");
    if (rows.length < 2) {
      alert("Invalid CSV format. Please check the CSV file.");
      return [];
    }

    const headers = rows[0].split(",").map((header) => header.trim());

    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(",").map((item) => item.trim());

      if (row.length === headers.length) {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        data.push(rowData);
      }
    }

    return data;
  };

  const handleDeleteRow = (index) => {
    const updatedList = [...listData];
    updatedList.splice(index, 1);
    setListData(updatedList);
  };
  const handleUpdateRow = (index, updatedRecord) => {
    const updatedList = [...listData]; // Create a copy of the CSV data
    updatedList[index] = updatedRecord;
    console.log("hey");
    setListData(updatedList);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    console.log(name, value);
    const updatedRecord = { ...listData[index] };
    updatedRecord[name] = value; // Update the specific field in the record
    handleUpdateRow(index, updatedRecord); // Update the record in the listData at the specified index
  };

  const validateData = () => {
    for (let i = 0; i < listData.length; i++) {
      const tokenAmountError = isValidValue(listData[i].tokenAmount);
      const addressError = isValidAddress(listData[i].receiverAddress);
      const chainName = listData[i].chainName;

      if (!tokenAmountError || !addressError) {
        setErrorMessage(`Invalid data at Line ${i + 1}`);
        setErrorModalIsOpen(true);
        return false; // Validation failed
      }
    }

    return true; // All validations passed
  };

  const isValidAddress = (address) => ethers.utils.isAddress(address);

  const isValidValue = (value) => {
    // console.log(value);
    if (isTokenLoaded) {
      try {
        // console.log(ethers.utils.parseUnits(value, tokenDetails.decimal));
        return ethers.utils.parseUnits(value, tokenDetails.decimal);
      } catch (err) {
        return false;
      }
    } else {
      try {
        if (ethers.utils.parseUnits(value, "ether") <= 0) {
          return false;
        }
        // console.log(ethers.utils.parseUnits(value, "ether"));
        return ethers.utils.parseUnits(value, "ether");
      } catch (err) {
        return false;
      }
    }
  };

  const [ethBalance, setEthBalance] = useState(null);
  const [isSendingEth, setIsSendingEth] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const content = e.target.result;
        console.log(content);
        try {
          const parsedData = parseCSV(content);

          if (parsedData) {
            setCsvData(parsedData);
            setIsCsvDataEmpty(parsedData.length === 0);
            console.log(parsedData);
            const listData = [];
            for (let i = 0; i < parsedData.length; i++) {
              listData.push({
                receiverAddress: parsedData[i]["Receiver Address"],
                tokenAmount: parsedData[i]["Token Amount"],
              });
            }
            console.log(listData);
            setListData(listData);
            console.log("list data is set");
          } else {
            console.error("Parsed data is empty.");
          }
        } catch (error) {
          console.error("Error parsing CSV data:", error);
        }
      };

      reader.readAsText(file);
    }
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
  };

  // Main function to do the Contract Call
  const executeTransaction = async () => {
    console.log(listData);
    setLoading(true);
    if (!validateData()) {
      setLoading(false);
      return; // If validation failed, don't execute the transaction
    }
    if (isSendingEth) {
      const { ethereum } = window;
      console.log(ethBalance, total);
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
          console.log(listData[i]["tokenAmount"]);
          values.push(isValidValue(listData[i]["tokenAmount"]));
        }
        console.log(recipients, values, total);
        try {
          console.log(recipients);
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
      console.log("first");
      var recipients = [];
      var values = [];
      console.log(listData);
      for (let i = 0; i < listData.length; i++) {
        recipients.push(listData[i]["receiverAddress"]);
        values.push(isValidValue(listData[i]["tokenAmount"]));
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
            console.log("error", e);
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
      let newTotal = ethers.BigNumber.from(0);

      // console.log(newTotal);
      for (let i = 0; i < listData.length; i++) {
        if (isValidValue(listData[i].tokenAmount)) {
          newTotal = newTotal.add(isValidValue(listData[i].tokenAmount));
          // console.log(listData[i].tokenAmount);
        }
      }
      setTotal(newTotal);
    } else {
      setTotal(null);
    }
    getExplorer();
  }, [listData, isSendingEth]);

  useEffect(() => {
    if (isSendingEth) {
      if (ethBalance && total) {
        const tokenBalance = ethers.utils.parseEther(ethBalance);
        const remaining = tokenBalance.sub(total);
        // console.log(remaining);
        setRemaining(ethers.utils.formatEther(remaining));
      } else {
        setRemaining(null);
      }
    }
  }, [total, isSendingEth]);
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
  }, [total, isSendingEth]);

  useEffect(() => {
    const getConnectedChain = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const network = await provider.getNetwork();

          console.log("Detected Chain ID:", network.chainId);

          // Convert chain ID to integer if it's a string
          const networkId = parseInt(network.chainId, 10);

          const chainNames = {
            34443: "Mode Mainnet",
            919: "Mode Testnet",
            534352: "Scroll",
            534351: "Scroll Sepolia",
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

  // useEffect(() => {
  //   const fetchExchangeRate = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  //       );
  //       const data = await response.json();
  //       const rate = data.ethereum.usd;
  //       setEthToUsdExchangeRate(rate);
  //       console.log("data here", data);
  //       console.log("rate here", rate);
  //       setTokenDetails({
  //         name: data.name,
  //         symbol: data.symbol,
  //         balance: data.balance,
  //         decimal: data.decimal,
  //       });

  //       console.log("data decimal", data.decimal);

  //       // If you have the 'total' value available, you can calculate the equivalent USD value
  //       if (total) {
  //         const totalInUsd = ethers.utils.formatEther(total) * rate;
  //         setUsdTotal(totalInUsd);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching exchange rate:", error);
  //     }
  //   };

  //   fetchExchangeRate();
  // }, [total]);

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
          console.log(data);
          const totalInUsd = ethers.utils.formatEther(total) * rate;
          setUsdTotal(totalInUsd);
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRate();
  }, [total]);

  const handleInputTokenAddressChange = (e) => {
    const inputValue = e.target.value;

    const isValidInput = /^[a-zA-Z0-9]+$/.test(inputValue);

    if (isValidInput || inputValue === "") {
      setCustomTokenAddress(inputValue);
    }
  };

  return (
    <div>
      {/* <div className={`main-div-for-upload-csv-file ${themeClass}`}> */}
      <div className={`main-div-for-upload-csv-file`}>
        <div className="Whole-div-for-same-csv">
          {/* token section starts here */}
          <div className="token-div-same-csv">
            <div className="title-load-token-same-csv">
              <h2
                style={{
                  fontWeight: "700",
                  padding: "10px",
                  fontSize: "20px",
                  margin: "0px",
                  letterSpacing: "1px",
                  fontWeight: "700",
                }}
                className="sametext-main"
              >
                Select or Import Token you want to Disperse
              </h2>
            </div>
            <div style={{ padding: "30px 20px" }} className="sametext-main">
              {/* {isTokenLoaded ? null : ( */}
              <div>
                <button
                  id=""
                  className="button-to-add-form-data"
                  onClick={handleSendEthbuttonClick}
                >
                  Send Eth
                </button>
                {/* {sendEthClicked && <p>Sending ETH</p>} */}
              </div>
              {/* )} */}
              <div className="import-token-div">
                <div>OR</div>
                {/* {isTokenLoaded ? null : "OR  "} */}
                <button
                  className="button-to-add-form-data-unload"
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
                  className="account-summary-create-title"
                >
                  <h2
                    style={{
                      padding: "10px",
                      fontSize: "20px",
                      fontWeight: "700",
                      margin: "0px",
                      letterSpacing: "1px",
                    }}
                  >
                    Load Your Token
                  </h2>
                </div>
                <div style={{ padding: "20px" }}>
                  <label style={{ margin: "5px" }}>Enter Token Address: </label>
                  <input
                    id="input-token-load"
                    // id="border-purple"
                    type="text"
                    // className={`each-input-of-create-list ${themeClass}`}
                    className={`each-input-of-create-list`}
                    placeholder="Enter token Address"
                    value={customTokenAddress}
                    onChange={(e) => handleInputTokenAddressChange(e)}
                  />
                  {isTokenLoaded ? (
                    <button
                      // id="background-green"
                      className="button-to-add-form-data-unload "
                      onClick={() => {
                        unloadToken();
                      }}
                    >
                      Unload Token
                    </button>
                  ) : (
                    <button
                      // id="background-purple"
                      className="button-to-add-form-data"
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
          </div>
          {isTokenLoaded ? (
            <div>
              <div className="account-summary-create-title">
                <h2
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    margin: "0px",
                    fontWeight: "700",
                  }}
                >
                  Token Details
                </h2>
              </div>
              <table style={{ margin: "10px 0px" }} className="table-text-list">
                <thead className="table-header-text-list">
                  <tr>
                    <th style={{ letterSpacing: "1px" }}>Name</th>
                    <th style={{ letterSpacing: "1px" }}>Symbol</th>
                    <th style={{ letterSpacing: "1px" }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{tokenDetails.name}</td>
                    <td>{tokenDetails.symbol}</td>
                    <td>{tokenDetails.balance}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
          {(isSendingEth || isTokenLoaded) && (
            <div>
              <div className="title-for-upload-file-csv-same">
                <h2
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    margin: "0px",
                    fontWeight: "700",
                    letterSpacing: "1px",
                  }}
                  className="sametext-main "
                >
                  Upload your Csv file which contains recipient Address and
                  Token Amount or Download Sample CSV file
                </h2>
              </div>
              <div className="upload-or-download">
                <div className="input-div-for-csv">
                  {/* <label>Upload File</label> &nbsp; &nbsp; */}
                  <input
                    className=""
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </div>

                <div>
                  <a
                    href="/Book2.csv"
                    download="Book2.csv"
                    className="download-btn"
                  >
                    <button>Download sample CSV file</button>
                  </a>
                </div>
              </div>
            </div>
          )}
          {/* {listData.length > 0 && (isSendingEth || isTokenLoaded) ? ( */}

          {listData.length > 0 && (isSendingEth || isTokenLoaded) ? (
            <div className="display-csvfile-here">
              <div className="title-tnx-line-same-csv">
                <h2
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    margin: "0px",
                    fontWeight: "700",
                    letterSpacing: "1px",
                  }}
                  className="sametext-main "
                >
                  Transaction Lineup & Edit your Transactions here
                </h2>
              </div>
              <div className="table-wrapper">
                <table style={{ margin: "20px 0px" }}>
                  <thead
                    id="table-header-csv-same"
                    className="table-header-text-list"
                  >
                    <tr>
                      <th
                        className="account-summary-th"
                        style={{ letterSpacing: "1px" }}
                      >
                        Receiver address
                      </th>
                      <th
                        className="account-summary-th"
                        style={{ letterSpacing: "1px" }}
                      >
                        {" "}
                        Amount(ETH)
                      </th>
                      <th
                        className="account-summary-th"
                        style={{ letterSpacing: "1px" }}
                      >
                        {" "}
                        Symbol
                      </th>
                      <th
                        className="account-summary-th"
                        style={{ letterSpacing: "1px" }}
                      >
                        Chain Name
                      </th>
                      <th
                        className="account-summary-th"
                        style={{ letterSpacing: "1px" }}
                      >
                        Amount (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listData.map((data, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            id="font-size-10px"
                            className={`each-input-of-create-list ${
                              isValidAddress(data.receiverAddress)
                                ? ""
                                : "input-error"
                              // } ${themeClass}`}
                            }`}
                            type="text"
                            name="receiverAddress"
                            value={data.receiverAddress}
                            placeholder="Enter Receiver Address"
                            onChange={(e) => handleInputChange(e, index)}
                            style={{ margin: "0px 10px" }}
                          />
                        </td>
                        <td>
                          <input
                            id="font-size-10px"
                            className={`each-input-of-create-list ${
                              isValidValue(data.tokenAmount)
                                ? ""
                                : "input-error"
                              // } ${themeClass}`}
                            }`}
                            type="number"
                            name="tokenAmount"
                            value={data.tokenAmount}
                            placeholder="Enter Token Amount"
                            onChange={(e) => handleInputChange(e, index)}
                            style={{ margin: "0px 10px" }}
                          />
                        </td>
                        <td id="font-size-10px">
                          {isTokenLoaded ? tokenDetails.symbol : "ETH"}
                        </td>
                        <td>
                          <input
                            id="font-size-10px"
                            // className={`each-input-of-create-list ${themeClass}`}
                            className={`each-input-of-create-list`}
                            type="text"
                            name="chainName"
                            value={chainName}
                            placeholder={chainName}
                            readOnly
                            style={{ margin: "0px 10px" }}
                          />
                        </td>
                        <td>
                          <div
                            id="font-size-10px"
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
                                  data.tokenAmount * ethToUsdExchangeRate
                                ).toFixed(2)
                              : "Loading..."}
                          </div>
                        </td>

                        <td>
                          <button
                            className="delete-button"
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
                  <div className="account-summary-create-title">
                    <h2
                      style={{
                        padding: "10px",
                        fontSize: "20px",
                        margin: "0px",
                        fontWeight: "700",
                        letterSpacing: "1px",
                      }}
                      className="sametext-main "
                    >
                      Account Summary
                    </h2>
                  </div>
                  <div id="table-responsive">
                    <table className="showtoken-table table-text-list">
                      <thead className="table-header-text-list">
                        <tr>
                          <th style={{ letterSpacing: "1px" }}>
                            Total Amount (ETH)
                          </th>
                          <th style={{ letterSpacing: "1px" }}>
                            Total Amount(USD)
                          </th>
                          <th style={{ letterSpacing: "1px" }}>Your Balance</th>
                          <th style={{ letterSpacing: "1px" }}>
                            Remaining Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {total && ethToUsdExchangeRate && (
                              <>
                                <div
                                  id="font-size-10px"
                                  className="font-size-12px"
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
                                    transform: "translate(-50%, -50%)",
                                    animation:
                                      "zoomAnimation 1s infinite alternate",
                                  }}
                                >
                                  {`${ethers.utils.formatEther(total)} ETH `}
                                </div>
                                {/* <span
                                  style={{ color: "red", fontWeight: "500" }}
                                >
                                  {`( ${
                                    usdTotal
                                      ? usdTotal.toFixed(2)
                                      : "Calculating..."
                                  } USD )`}
                                </span> */}
                              </>
                            )}
                          </td>
                          <td>
                            {total && ethToUsdExchangeRate && (
                              <>
                                <div
                                  id="font-size-10px"
                                  className="font-size-12px"
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
                                  {/* {`${ethers.utils.formatEther(total)} ETH `} */}

                                  {`${
                                    usdTotal
                                      ? usdTotal.toFixed(2)
                                      : "Calculating..."
                                  } $ `}
                                </div>
                              </>
                            )}
                          </td>
                          <td id="font-size-10px">{`${(+ethBalance).toFixed(
                            9
                          )} ETH`}</td>
                          <td
                            className={`showtoken-remaining-balance ${
                              remaining < 0
                                ? "showtoken-remaining-negative"
                                : ""
                            }`}
                          >
                            <div
                              id="font-size-10px"
                              className="font-size-12px"
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
                  <div className="account-summary-create-title">
                    <h2
                      style={{
                        padding: "10px",
                        fontSize: "20px",
                        fontWeight: "700",
                        margin: "0px",
                        letterSpacing: "1px",
                      }}
                      className="sametext-main "
                    >
                      Account Summary
                    </h2>
                  </div>
                  <div id="table-responsive">
                    <table className="showtoken-table table-text-list">
                      <thead className="table-header-text-list">
                        <tr>
                          <th style={{ letterSpacing: "1px" }}>
                            Total Amount(ETH)
                          </th>
                          <th style={{ letterSpacing: "1px" }}>
                            Total Amount(USD)
                          </th>
                          <th style={{ letterSpacing: "1px" }}>
                            Remaining Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {total && ethToUsdExchangeRate && (
                              <>
                                <div
                                  id="font-size-10px"
                                  className="font-size-12px"
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
                                    transform: "translate(-50%, -50%)",
                                    animation:
                                      "zoomAnimation 1s infinite alternate",
                                  }}
                                >
                                  {`${ethers.utils.formatEther(total)} ETH `}
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
                          <td>
                            {total && ethToUsdExchangeRate && (
                              <>
                                {/* {`${ethers.utils.formatEther(total)} ETH `} */}
                                <div
                                  id="font-size-10px"
                                  className="font-size-12px"
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
                                    usdTotal
                                      ? usdTotal.toFixed(2)
                                      : "Calculating..."
                                  } $ `}
                                </div>
                              </>
                            )}
                          </td>
                          <td
                            className={`showtoken-remaining-balance ${
                              remaining < 0
                                ? "showtoken-remaining-negative"
                                : ""
                            }`}
                          >
                            <div
                              id="font-size-10px"
                              className="font-size-12px"
                              style={{
                                width: "fit-content",
                                margin: "0 auto",
                                background:
                                  remaining < 0
                                    ? "red"
                                    : "linear-gradient(269deg, #0FF 2.32%, #1BFF76 98.21%)",
                                color: remaining < 0 ? "white" : "black", // Change font color to red if remaining is less than 0
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
              {isCsvDataEmpty ? null : (
                <button
                  className="send-button"
                  onClick={() => {
                    executeTransaction();
                  }}
                  disabled={loading}
                >
                  {loading ? <div className="loader"></div> : "Begin Payment"}
                </button>
              )}
            </div>
          ) : null}

          <Modal
            className="popup-for-payment"
            isOpen={errorModalIsOpen}
            onRequestClose={() => setErrorModalIsOpen(false)}
            contentLabel="Error Modal"
          >
            {errorMessage ? (
              <>
                <h2>{isSuccess ? "Congratulations!!" : "Error"}</h2>
                <p>{errorMessage}</p>
                <div className="div-to-center">
                  <button onClick={() => setErrorModalIsOpen(false)}>
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>Notice</h2>
                <p>{alertMessage}</p>
                <div className="div-to-center">
                  <button onClick={() => setErrorModalIsOpen(false)}>
                    Close
                  </button>
                </div>
              </>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default SameCsvList;
