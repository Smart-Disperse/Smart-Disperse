import React from "react";
import Textify from "../Type/Textify";
import Listify from "../Type/Listify";
import Uploadify from "../Type/Uploadify";
import { useState, useEffect } from "react";
import textStyle from "../Type/textify.module.css";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExecuteToken from "../Execute/CrossChainTransfer";
import { LoadToken } from "@/Helpers/LoadToken.js";
import {
  faCircleExclamation,
  faTrashAlt,
  faExclamationTriangle,
  faTriangleExclamation,
  faCopy,
  faGasPump,
} from "@fortawesome/free-solid-svg-icons";
import homeStyle from "@/Components/Homepage/landingpage.module.css";
import Modal from "react-modal";
import warning from "@/Assets/warning.webp";
import Image from "next/image";
import oopsimage from "@/Assets/oops.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserLabels } from "@/Helpers/FetchUserLabels";
import CrossChainTransfer from "../Execute/CrossChainTransfer";
import loaderimg from "@/Assets/loader.gif";
import loadjson from "@/Assets/tokenload.json";
import allchains from "@/Helpers/CrosschainHelpers/ChainSelector";
import { useChainId } from "wagmi";

function SendToken({
  activeTab,
  listData,
  setListData,
  tokenAddress,
  setChainSelector,
  chainSelector,
  setReceivingChainAddress,
  destinationchainName,
  receivingChainAddress,
}) {
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [errormsg, setErrormsg] = useState("");
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); // State for modal visibility
  const [nameErrorModalIsOpen, setNameErrorModalIsOpen] = useState(false);
  const [ethToUsdExchangeRate, setEthToUsdExchangeRate] =
    useState(null); /*/USD/ETH exchange rate */
  const [totalERC20, setTotalERC20] =
    useState(null); /* Total ERC20 tokens in wallet */
  const [remaining, setRemaining] = useState(null); // store remaining amount after deducting already sent value
  const [ERC20Balance, setERC20Balance] =
    useState(null); /* User's ERC20 token balance */
  const { address } = useAccount(); /*/User's Ethereum Address*/
  const [loading, setLoading] =
    useState(false); /* Loading indicator for sending transaction */
  const [customTokenAddress, setCustomTokenAddress] =
    useState(""); /* Custom token address input field state */
  const [isTokenLoaded, setTokenLoaded] =
    useState(
      false
    ); /* Flag to check if the user has loaded their ERC20 Tokens */
  const [Istokenloading, setIstokenloading] = useState(false);
  const { tkloadimg } = loadjson;
  const [showestimatedgasprice, setshowestimatedgasprice] = useState("");
const [RecipientAddressarray, setRecipientaddressarray] = useState([])
const [RecipientAmountarray, setRecipientamountarray] = useState([])
  const defaultTokenDetails = {
    name: null,
    symbol: null,
    balance: null,
    decimal: null,
  };
  const [labels, setLabels] = useState([]);
  const [allNames, setAllNames] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [allAddresses, setAllAddresses] = useState([]);
  const [tokenDetails, setTokenDetails] =
    useState(defaultTokenDetails); /*Details of the selected token to be sent*/
  const chainId = useChainId();
  const [destinationFinalChainsOptions, setDestinationFinalChainsOptions] =
    useState([]);
  const [selectedDestinationfinalChains, setSelectedDestinationfinalChains] =
    useState(Array(listData.length).fill(destinationchainName));
  const [finalchainSelectors, setFinalchainSelectors] = useState(
    Array(listData.length).fill("")
  );
  const [uniqueReceiverAddresses, setUniqueReceiverAddresses] = useState([]);

  const renderComponent = (tab) => {
    switch (tab) {
      case "text":
        return (
          <Textify
            listData={listData}
            setListData={setListData}
            tokenDecimal={tokenDetails.decimal}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
      case "list":
        return (
          <Listify
            listData={listData}
            setListData={setListData}
            tokenDecimal={tokenDetails.decimal}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
      case "csv":
        return (
          <Uploadify
            listData={listData}
            setListData={setListData}
            tokenDecimal={tokenDetails.decimal}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
      default:
        return (
          <Textify
            listData={listData}
            setListData={setListData}
            tokenDecimal={tokenDetails.decimal}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
    }
  };

  /*
  For fetching the Exchnage rate of ETH to USD to display value in USD
  */
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
        );
        const data = await response.json();
        const rate = data.USD;
        // console.log(typeof data.USD);

        // console.log("data here", data.USD);
        setEthToUsdExchangeRate(rate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRate();
    // const interval = setInterval(fetchExchangeRate, 10000); // Call fetchExchangeRate every 2 seconds

    // Clean up the interval when the component unmounts
    // return () => clearInterval(interval);
  }, [listData]);

  // Function to delete row in table
  const handleDeleteRow = (index) => {
    const updatedList = [...listData];
    updatedList.splice(index, 1);
    setListData(updatedList);
  };

  // Function to load token details
  const loadTokenDetails = async (_tokenAddress) => {
    setIstokenloading(true);
    setTokenLoaded(false);
    setRemaining(null);
    setTotalERC20(null);
    setListData([]);
    console.log(_tokenAddress);

    setTokenDetails(defaultTokenDetails);
    console.log(address);
    const tokenDetails = await LoadToken(_tokenAddress, address);
    console.log(tokenDetails);
    setIstokenloading(false);
    if (tokenDetails) {
      setTokenDetails(tokenDetails);
      setERC20Balance(tokenDetails.balance);
      setTokenLoaded(true);
    } else {
      toast.error("Token details not found");
      throw new Error("Token details not found"); // Throw error if token details are not found
    }
  };

  useEffect(() => {
    const loadSelectedToken = async () => {
      if (tokenAddress) {
        if (tokenAddress === "") {
          setTokenLoaded(false);
        } else {
          await loadTokenDetails(tokenAddress);
        }
      } else {
        setTokenLoaded(false);
      }
    };
    loadSelectedToken();
  }, [tokenAddress]);

  // Function to close the error modal
  const closeErrorModal = () => {
    // console.log("clicked");
    setErrorModalIsOpen(false);
    setErrorMessage("");
    // console.log("modal open");
  };

  // Function to unload token details
  const unloadToken = async () => {
    setTokenDetails(defaultTokenDetails);
    setRemaining(null);
    setTotalERC20(null);
    setTokenLoaded(false);
    setListData([]);
  };

  const onAddLabel = async (index, recipientAddress) => {
    const userData = {
      userid: address,
      name: labels[index],
      address: recipientAddress.toLowerCase(),
    };
    console.log(userData);
    try {
      console.log("entered into try block");
      let result = await fetch(`api/all-user-data?address=${address}`, {
        method: "POST",
        body: JSON.stringify(userData),
      });

      console.log(result);
      result = await result.json();
      console.log("Result after submission:", result);

      if (typeof result.error === "string") {
        setNameErrorModalIsOpen(true);
        toast.warn("Name Already Exist! Please Enter Unique Name.");
        setErrormsg(result.error);
      } else {
        if (result.success) {
          alert("Added to MongoDB");
          toast.success("Label Added successfully");
        }
      }
    } catch (error) {
      setNameErrorModalIsOpen(true);
      setErrormsg("Some Internal Error Occured");
      console.error("Error:", error);
    }

    const { names, addresses } = await fetchUserLabels();
    console.log(names, addresses);

    const updatedListData = await listData.map((item) => {
      if (
        (item.label === undefined || item.label === "") &&
        addresses.includes(item.address)
      ) {
        const index = addresses.indexOf(item.address);
        console.log(index);
        item.label = names[index];
      }
      return item;
    });

    console.log(updatedListData);
    await setListData(updatedListData);
  };

  /*
  For Calculating the total amount of sending ETH
  */

  useEffect(() => {
    const calculateTotal = () => {
      let totalERC20 = ethers.BigNumber.from(0);
      if (listData.length > 0) {
        listData.forEach((data) => {
          console.log(data);
          totalERC20 = totalERC20.add(data.value);
        });
      }
      console.log(totalERC20);

      setTotalERC20(totalERC20);
    };

    calculateTotal();
  }, [listData]); // Execute when listData changes

  useEffect(() => {
    calculateRemaining();
  }, [totalERC20]);

  const calculateRemaining = () => {
    if (ERC20Balance && totalERC20) {
      const remaining = ERC20Balance.sub(totalERC20);
      setRemaining(remaining);
    } else {
      setRemaining(null);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const { allNames, allAddress } = await fetchUserLabels(address);
      setAllNames(allNames);
      setAllAddresses(allAddress);
      setLabels([]);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (address) {
      fetchUserDetails();
    }
  }, [address]);

  const setLabelValues = (index, name) => {
    const updatedLabels = [...labels]; // Create a copy of the labels array
    updatedLabels[index] = name; // Update the value at the specified index
    console.log(updatedLabels);
    setLabels(updatedLabels);
  };
  useEffect(() => {
    calculateRemaining();
  }, []); // Execute once on component mount

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000); // Reset the copy status after 2 seconds
        toast.success("Token Address Copied Successfully!");
      },
      (err) => {
        console.error("Unable to copy to clipboard:", err);
      }
    );
  };

  // ------------------- Chain Drop down code ------------------------
  const getChainsForFinalDropDown = () => {
    try {
      const chainDetails = allchains[chainId];
      if (!chainDetails) {
        throw new Error(`Chain details for chainId ${chainId} are undefined.`);
      }
  
      console.log(chainDetails);
      const options = Object.entries(chainDetails.destinationChains).map(
        ([name]) => (
          <option key={name} value={name}>
            {name}
          </option>
        )
      );
      setDestinationFinalChainsOptions(options);
    } catch (error) {
      console.error(error.message);
      setDestinationFinalChainsOptions([]); // Optionally clear the options or set to default
    }
  };
  

  useEffect(() => {
    getChainsForFinalDropDown();
  }, [address,chainId]);

  const handleDestinationFinalChainChange = (index) => (e) => {
    const selectedChainName = e.target.value;
    console.log(`Selected chain name: ${selectedChainName}`);
    const newSelectedChains = [...selectedDestinationfinalChains];
    newSelectedChains[index] = selectedChainName;
    setSelectedDestinationfinalChains(newSelectedChains);
    const chainDetails = allchains[chainId];
    const selectedChain = chainDetails.destinationChains[selectedChainName];
    const finalchainSelector = selectedChain.chainSelector;
    const newFinalchainSelectors = [...finalchainSelectors];
    newFinalchainSelectors[index] = finalchainSelector;
    setFinalchainSelectors(newFinalchainSelectors);
    console.log(newFinalchainSelectors);
    const uniqueFinalchainSelectors = [...new Set(newFinalchainSelectors)];
    console.log("Unique Final Chain Selectors:", uniqueFinalchainSelectors);
    setChainSelector(uniqueFinalchainSelectors)
    printGroupedAddressesAndAmounts(newSelectedChains);
    const receiverAddresses = newSelectedChains.map(chainName => {
      return chainDetails.destinationChains[chainName]?.receiverAddress || "Address not found";
  });
  const uniqueReceiverAddresses = [...new Set(receiverAddresses)];
  console.log("Unique Receiver Addresses:", uniqueReceiverAddresses);
  setReceivingChainAddress(uniqueReceiverAddresses)
  };

  const printGroupedAddressesAndAmounts = (chainNames) => {
    const addressGroups = {};
    const amountGroups = {};
    listData.forEach((data, index) => {
      const chainName = chainNames[index];
      if (!addressGroups[chainName]) {
        addressGroups[chainName] = [];
        amountGroups[chainName] = [];
      }
      addressGroups[chainName].push(data.address);
      amountGroups[chainName].push(data.value);
    });
    const addressArray = Object.values(addressGroups);
    const amountArray = Object.values(amountGroups);
    console.log("Grouped Addresses Array:", addressArray);
    setRecipientaddressarray(addressArray)
    console.log("Grouped Amounts Array:", amountArray);
    setRecipientamountarray(amountArray)
  };

  useEffect(() => {
    printGroupedAddressesAndAmounts(selectedDestinationfinalChains);
  }, [listData, destinationchainName]);


  
  return (
    <>
      <>
        {Istokenloading ? (
          <div>
            <Image src={loaderimg} alt="none" width={150} height={100} />
          </div>
        ) : (
          <div>
            {isTokenLoaded ? (
              <div>
                <div className={textStyle.accountsummarycreatetitle}>
                  <h2
                    style={{
                      padding: "10px",
                      fontSize: "20px",
                      margin: "0px",
                      letterSpacing: "1px",
                      fontWeight: "100",
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
                    margin: "10px",
                    border: "1px solid #8D37FB",
                    borderRadius: "20px",
                    overflow: "hidden",
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
                          Address
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
                        <td
                          style={{ letterSpacing: "1px" }}
                          className={textStyle.tableTd}
                        >
                          {`${tokenAddress.slice(0, 7)}...${tokenAddress.slice(
                            -4
                          )}`}{" "}
                          <FontAwesomeIcon
                            className={textStyle.copyicon}
                            onClick={() => copyToClipboard(tokenAddress)}
                            icon={faCopy}
                          />
                        </td>
                        <td className={textStyle.tableTd}>
                          {ethers.utils.formatUnits(
                            tokenDetails.balance,
                            tokenDetails.decimal
                          )}{" "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* </div> */}
              </div>
            ) : null}
          </div>
        )}

        {isTokenLoaded ? renderComponent(activeTab) : null}

        {listData.length > 0 ? (
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
                        Receiver Address
                      </th>
                      <th
                        className={textStyle.fontsize12px}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Label
                      </th>
                      <th
                        className={textStyle.fontsize12px}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Amount({tokenDetails.symbol})
                      </th>
                      <th
                        className={textStyle.fontsize12px}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Destination Chain
                      </th>
                      {/* <th
                      className={textStyle.fontsize12px}
                      style={{ letterSpacing: "1px", padding: "8px" }}
                    >
                      Amount(USD)
                    </th> */}
                      <th
                        className={textStyle.fontsize12px}
                        style={{ letterSpacing: "1px", padding: "8px" }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listData.length > 0
                      ? listData.map((data, index) => (
                          <tr key={index}>
                            <td
                              id={textStyle.fontsize10px}
                              style={{ letterSpacing: "1px", padding: "8px" }}
                            >
                              {`${data.address.slice(
                                0,
                                7
                              )}...${data.address.slice(-4)}`}
                            </td>
                            <td
                              id={textStyle.fontsize10px}
                              style={{ letterSpacing: "1px", padding: "8px" }}
                            >
                              {data.label ? (
                                data.label
                              ) : (
                                <>
                                  <input
                                    type="text"
                                    value={labels[index] ? labels[index] : ""}
                                    style={{
                                      borderRadius: "8px",
                                      padding: "10px",
                                      color: "white",
                                      border: "1px solid #8D37FB",
                                      background: "transparent",
                                    }}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (
                                        inputValue === "" &&
                                        e.key !== "Enter"
                                      ) {
                                        setErrorMessage("Enter Label");
                                      } else {
                                        setErrorMessage(
                                          "Press Enter to submit label"
                                        );
                                      }

                                      const regex = /^[a-zA-Z]*$/;

                                      if (
                                        regex.test(inputValue) &&
                                        inputValue.length <= 10
                                      ) {
                                        setLabelValues(index, inputValue);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        onAddLabel(index, data.address);
                                      }
                                    }}
                                  />
                                  {errorMessage && (
                                    <p
                                      style={{
                                        color: "red",
                                        margin: "0px",
                                        fontSize: "13px",
                                      }}
                                    >
                                      {errorMessage}
                                    </p>
                                  )}
                                </>
                              )}
                            </td>
                            <td
                              id={textStyle.fontsize10px}
                              style={{ padding: "8px" }}
                            >
                              <div
                                id={textStyle.fontsize10px}
                                style={{
                                  width: "fit-content",
                                  margin: "0 auto",
                                  background: "transparent",
                                  color: "#00FBFB",
                                  borderRadius: "10px",
                                  padding: "10px 10px",
                                  border: "1px solid #00FBFB",
                                  fontSize: "12px",
                                  letterSpacing: "1px",
                                }}
                              >
                                {(+ethers.utils.formatUnits(
                                  data.value,
                                  tokenDetails.decimal
                                )).toFixed(4)}{" "}
                                {tokenDetails.symbol}
                              </div>
                            </td>
                            <td
                              id={textStyle.fontsize10px}
                              style={{ padding: "8px" }}
                            >
                              <select
                                id={textStyle.blockchainChains}
                                onChange={handleDestinationFinalChainChange(
                                  index
                                )}
                                value={selectedDestinationfinalChains[index]}
                              >
                                <option value="">
                                  Select destination chain
                                </option>
                                {destinationFinalChainsOptions}
                              </select>
                            </td>
                            <td
                              style={{ letterSpacing: "1px", padding: "8px" }}
                            >
                              <button
                                className={textStyle.deletebutton}
                                onClick={() => handleDeleteRow(index)}
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </button>
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
        {listData.length > 0 ? (
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
                      Total Amount({tokenDetails.symbol})
                    </th>
                    <th className={textStyle.accountsummaryth}>
                      Estimated Gas Price <FontAwesomeIcon icon={faGasPump} />
                    </th>
                    <th className={textStyle.accountsummaryth}>Your Balance</th>
                    <th className={textStyle.accountsummaryth}>
                      Remaining Balance
                    </th>
                  </tr>
                </thead>
                <tbody className={textStyle.tbodytextifyaccsum}>
                  <tr>
                    <td id={textStyle.fontsize10px}>
                      <div id="font-size-10px" className={textStyle.textAccSum}>
                        {totalERC20
                          ? (+ethers.utils.formatUnits(
                              totalERC20,
                              tokenDetails.decimal
                            )).toFixed(4)
                          : null}{" "}
                      </div>
                    </td>
                    <td id={textStyle.fontsize10px}>
                      {" "}
                      <div
                        id={textStyle.fontsize10px}
                        style={{
                          width: "fit-content",
                          margin: "0 auto",
                          color: "white",
                          borderRadius: "10px",
                          padding: "10px 10px",
                          fontSize: "12px",
                          letterSpacing: "1px",
                        }}
                      >
                        {showestimatedgasprice
                          ? (+ethers.utils.formatEther(
                              showestimatedgasprice
                            )).toFixed(6)
                          : null}
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

                          letterSpacing: "1px",
                        }}
                      >
                        {ERC20Balance
                          ? (+ethers.utils.formatUnits(
                              ERC20Balance,
                              tokenDetails.decimal
                            )).toFixed(4) +
                            " " +
                            tokenDetails.symbol
                          : null}
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
                          border:
                            remaining < 0
                              ? "1px solid red"
                              : "1px solid  #00FBFB",
                          color: remaining < 0 ? "red" : "#00FBFB",
                          borderRadius: "10px",
                          padding: "10px 10px",
                          fontSize: "12px",
                        }}
                      >
                        {remaining === null
                          ? null
                          : (+ethers.utils.formatUnits(
                              remaining,
                              tokenDetails.decimal
                            )).toFixed(4) +
                            " " +
                            tokenDetails.symbol}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
        <div>
          {listData.length > 0 ? (
            <CrossChainTransfer
              listData={listData}
              setListData={setListData}
              ERC20Balance={ERC20Balance}
              totalERC20={totalERC20}
              loading={loading}
              setLoading={setLoading}
              tokenDetails={tokenDetails}
              setshowestimatedgasprice={setshowestimatedgasprice}
              tokenAddress={tokenAddress}
              RecipientAddressarray={RecipientAddressarray}
              chainSelector={chainSelector}
              receivingChainAddress={receivingChainAddress}
              RecipientAmountarray={RecipientAmountarray}
            />
          ) : null}
        </div>
      </>
      <>
        <Modal
          id={textStyle.popupwarning}
          className={textStyle.popupforpayment}
          isOpen={nameErrorModalIsOpen}
          onRequestClose={() => setNameErrorModalIsOpen(false)}
          contentLabel="Error Modal"
        >
          <Image src={warning} alt="none" width={100} height={100} />
          <h2>Warning!</h2>
          <p>{errormsg}</p>
          <p>Please try different name</p>
          <button onClick={() => setNameErrorModalIsOpen(false)}>Close</button>
        </Modal>
        <Modal
          className={textStyle.popupforpayment}
          isOpen={errorModalIsOpen}
          onRequestClose={() => setErrorModalIsOpen(false)}
          contentLabel="Error Modal"
        >
          <>
            <h2>Oops...</h2>
            <p>Something went Wrong,</p>
            <div>
              {/* <Image src={oopsimage} alt="not found" /> */}
              <Image
                height={150}
                width={150}
                src={oopsimage.src}
                alt="not found"
              />
            </div>
            {/* <p>{errorMessage}</p> */}
            <p className={textStyle.errormessagep}>{errorMessage}</p>

            <div className={textStyle.divtocenter}>
              <button onClick={closeErrorModal}>Close</button>
            </div>
          </>
        </Modal>
      </>
    </>
  );
}

export default SendToken;
