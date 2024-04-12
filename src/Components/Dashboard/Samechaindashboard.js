"use client";
import React, { useState, useEffect, useRef } from "react";
import popup from "../Dashboard/popupTable.module.css";
import Image from "next/image";
import img3 from "../../Assets/img3-bg.webp";
import { Transition } from "react-transition-group";
import dropdown from "../../Assets/down.png";
import img4 from "../../Assets/img4-bg.webp";
import { driver } from "driver.js"; //driver .js is a javascript library used for guiding
import "driver.js/dist/driver.css";
import samechainStyle from "./samechaindashboard.module.css";
import Footer from "../Footer/Footer";
import homeStyle from "@/Components/Homepage/landingpage.module.css";
import {
  faArrowDown,
  faArrowUp,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import SameChain from "../DashboardComponents/SameChain/SameChain";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import contracts from "@/Helpers/ContractAddresses.js";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  getERC20Transactions,
  getEthTransactions,
  getERC20Tokens,
} from "@/Helpers/GetSentTransactions";
import { useAccount, useChainId, useNetwork } from "wagmi";
import {circle} from "@/Assets/circlesbg.svg";

function Samechaindashboard() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };
  //test
  const [activeTab, setActiveTab] = useState("text"); //default tab is textify
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); // State for modal visibility
  const router = useRouter();
  // ...user-analysis
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedToken, setSelectedToken] = useState("Eth");
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState("ETH");
  const [explorerUrl, setExplorerUrl] = useState("Eth");
  const inputRef1 = useRef();
  const [totalAmount, setTotalAmount] = useState(0);
  const inputRef3 = useRef();
  
  const { address } = useAccount(); /*/User's Ethereum Address*/
  const [tokenListOfUser, setTokenListOfUser] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedAddressIndex, setIsCopiedAddressIndex] = useState(false);
  const [isCopiedHash, setIsCopiedHash] = useState(false);
  const [explorelink, serexplorelink] = useState();
  const [transactionhash, settransactionhash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortingByAmount, setSortingByAmount] = useState(false);
  const [sortingByLabel, setSortingByLabel] = useState(false);
  const [sortingByDate, setSortingByDate] = useState(false);
  const [dataNotFound, setDataNotFound] = useState(false);
  const [isCopiedAddressIndexHash, setIsCopiedAddressIndexHash] =
    useState(false);
  const chainId = useChainId();
  const [transactions, setTransactions] = useState(filteredTransactions);


  // useEffect(() => {
  //   const handleClick = () => {
  //     if (!isConnected) {
  //       openConnectModal();
  //     }
  //   };
  //   window.addEventListener("click", handleClick);  
  //   return () => {
  //     window.removeEventListener("click", handleClick);
  //   };
  // }, [isConnected, openConnectModal]);
  
  // /............sorting label function ............./
  const sortLabels = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      if (!a.label || !b.label) {
        return 0;
      }
      return a.label.localeCompare(b.label);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByLabel(true);
  };
  const dortLabels = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      if (!a.label || !b.label) {
        return 0;
      }
      return b.label.localeCompare(a.label);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByLabel(false);
  };
  // /............sorting amount function ............./
  const sortAmount = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      return parseFloat(b.value) - parseFloat(a.value);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByAmount(true);
  };

  const dortAmount = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      return parseFloat(a.value) - parseFloat(b.value);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByAmount(false);
  };

  // /............sorting amount function ............./
  const sortDate = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      return new Date(b.blockTimestamp) - new Date(a.blockTimestamp);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByDate(true);
  };
  const dortDate = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      return new Date(a.blockTimestamp) - new Date(b.blockTimestamp);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByDate(false);
  };

  const copyToClipboard = (text, index) => {
    setIsCopiedAddressIndex(index);
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
  const copyToClipboardHash = (text, index) => {
    setIsCopiedAddressIndexHash(index);
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopiedHash(true);
        setTimeout(() => {
          setIsCopiedHash(false);
        }, 2000); // Reset the copy status after 2 seconds
      },
      (err) => {
        console.error("Unable to copy to clipboard:", err);
      }
    );
  };

  const fadeStyles = {
    entering: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  };

  const slideStyles = {
    entered: { transition: "all 0.3s ease", transform: "translateY(0px)" },
    entering: { transform: "translateY(1000px)" },
    exiting: {
      transition: "all 0.3s ease",
      transform: "translateY(1000px)",
    },
  };

  /******************************Driver.JS Code Starts Here******************************* */
  //Function to start the tour
  useEffect(() => {
    const hasVisitedBefore = document.cookie.includes("visited=true"); //Checks if user has visited the page
    if (!hasVisitedBefore) {
      document.cookie = "visited=true; max-age=31536000"; // Max age is set to 1 year in seconds
      const driverObj = driver({
        overlayColor: "#00000094",
        popoverClass: ` ${samechainStyle.driverpopover01}`,
        showProgress: true,
        steps: [
          {
            element: "#text",
            popover: {
              title: "Textify",
              description:
                "Effortlessly input recipient addresses and amounts in one line with Textify, whether through copy-paste or direct entry",
              side: "right",
              align: "start",
            },
          },
          {
            element: "#list",
            popover: {
              title: "Listify",
              description:
                "Effortlessly send funds: Use Listify to fill out recipient addresses and amounts in a simple form",
              side: "right",
              align: "start",
            },
          },
          {
            element: "#csv",
            popover: {
              title: "Uploadify",
              description:
                "Effortless data management: Use Uploadify to seamlessly upload CSV files with recipient addresses and amounts for convenient editing on our platform",
              side: "right",
              align: "start",
            },
          },
        ],
      });
      driverObj.drive();
    }

    const getExplorer = async () => {
      setExplorerUrl(contracts[chainId]["block-explorer"]);
    };
    getExplorer();
  }, []);

  /******************************User Analysis code Starts Here******************************* */

  // Function to handle changes in both address and label search inputs
  const handleSearchChange = (event) => {
    const { value } = event.target;
    handleSearch(value);
  };

  // Event handler for changing start date
  const handleStartDateChange = (event) => {
    const newStartDate = event.target.value;
    setStartDate(newStartDate);
  };

  // Event handler for changing end date
  const handleEndDateChange = (event) => {
    const newEndDate = event.target.value;
    setEndDate(newEndDate);
  };

  const handleTokenChange = async (event) => {
    const selectedToken = event.target.value;
    setIsLoading(true); // Set loading state to true
    try {
      const selectedTokenObject = tokenListOfUser.find(
        (token) => token.tokenAddress === selectedToken
      );
      setSelectedToken(selectedToken);
      setSelectedTokenSymbol(
        selectedTokenObject ? selectedTokenObject.symbol : "ETH"
      );
    } catch (error) {
      console.error("Error fetching token data:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
  const handleSearch = (searchQuery) => {
    var filtered = transactionData;
    filtered = transactionData.filter(
      (transaction) =>
        transaction.recipient
          .toLowerCase()
          .indexOf(searchQuery.toLowerCase()) !== -1 ||
        (transaction.label &&
          transaction.label.toLowerCase().indexOf(searchQuery.toLowerCase()) !==
            -1) ||
        transaction.transactionHash
          .toLowerCase()
          .indexOf(searchQuery.toLowerCase()) !== -1
    );

    setFilteredTransactions(filtered);
    calculateTotalAmount(filtered);
  };

  const calculateTotalAmount = async (transactions) => {
    if (transactions) {
        let total = 0;
        transactions.forEach((transaction) => {
            total += parseFloat(transaction.value);
        });
        setTotalAmount(total.toFixed(8));
    } else {
        setTotalAmount(0); 
    }
};

  
  useEffect(() => {
    // Recalculate total amount whenever filtered transactions change
    calculateTotalAmount(filteredTransactions);
}, [filteredTransactions]);

  useEffect(() => {
    let filtered = transactionData;
    if (startDate && endDate) {
      // Filter by date range
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.blockTimestamp);
        const nextDayEndDate = new Date(endDate);
        nextDayEndDate.setDate(nextDayEndDate.getDate() + 1); // Increment endDate by 1 day
        return (
          transactionDate >= new Date(startDate) &&
          transactionDate < nextDayEndDate // Adjusted comparison to include endDate
        );
      });
    }
    setFilteredTransactions(filtered);
  }, [startDate, endDate]);

  const fetchUserDetails = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/all-user-data?address=${address}`
      );
      const response = await result.json();
      const alldata = response.result;
      const allNames = alldata.map((user) => user.name);
      const allAddress = alldata.map((user) => user.address);
      return { allNames, allAddress };
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const calculateAmount = async () => {
      if (transactionData) {
        const total = await calculateTotalAmount();
        setTotalAmount(total);
      }
    };
    calculateAmount();
  }, [transactionData]);



  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        setIsLoading(true);
        const { allNames, allAddress } = await fetchUserDetails();
        var ethData = [];
        if (selectedToken === "Eth") {
          ethData = await getEthTransactions(address, chainId);
          // ethData = ethData.filter(
          //   (transaction) => transaction.tokenName == null
          // );
        } else {
          ethData = await getERC20Transactions(address, selectedToken, chainId);
        }
        if (ethData && ethData.length > 0) {
          console.log(ethData);
          for (let i = 0; i < ethData.length; i++) {
            const recipientAddress = ethData[i].recipient.toLowerCase();
            console.log(allNames, allAddress);
            const index = allAddress.findIndex(
              (addr) => addr === recipientAddress
            );
            if (index !== -1) {
              ethData[i].label = allNames[index];
            }
          }

          setTransactionData(ethData);
          setFilteredTransactions(ethData);
          const userTokens = await getERC20Tokens(address, chainId);
          setTokenListOfUser(userTokens);
          setIsLoading(false);
          setDataNotFound(false);
        } else {
          setDataNotFound(true); 
          console.log("Eth data is empty");
        }
        setIsLoading(false)
      }
    };

    fetchData(address);
  }, [isOpen, selectedToken]);
  return (
    <div className={samechainStyle.maindivofdashboard}>
      {/* <div style={{ position: "relative" }}>
        <Image className={samechainStyle.dashbgImg1} src={img3} alt="none" />
        <Image className={samechainStyle.dashbgImg2} src={img4} alt="none" />
      </div> */}
      {/* <div>
        <Image src={circle} alt="none"/>
      </div> */}
      <div>
        <div className={samechainStyle.stickyIcon}>
          <a href="/all-user-lists" className={samechainStyle.Instagram}>
            <FontAwesomeIcon icon={faUser} /> <div>Manage Labels</div>
          </a>
        </div>
      </div>
      {/* <div className={samechainStyle.samedashmainm}> */}
      <div
        className={`${samechainStyle["samedashmainm"]} ${
          errorModalIsOpen ? `${homeStyle["blurbackground"]}` : ""
        }`}
      >
        <div className={samechainStyle.titledivdashboard}>
          <div className={samechainStyle.imagesinthis}></div>
          <h1>Effortless Token Distribution</h1>
          <h3 className={samechainStyle.dashpera}>
            Instant Multi-Account Dispersement – Seamlessly Send Tokens to
            Multiple Accounts in One Click
          </h3>
        </div>
        <div className={samechainStyle.maindivforalloptiondashboard}>
          <div className={samechainStyle.menubardashboard}>
            <button
              id="text"
              className={activeTab === "text" ? `${samechainStyle.active}` : ""}
              onClick={() => setActiveTab("text")}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-custom-class="color-tooltip"
            >
              Textify
            </button>
            <button
              id="list"
              className={activeTab === "list" ? `${samechainStyle.active}` : ""}
              onClick={() => setActiveTab("list")}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-custom-class="color-tooltip"
            >
              Listify
            </button>
            <button
              id="csv"
              className={activeTab === "csv" ? `${samechainStyle.active}` : ""}
              onClick={() => setActiveTab("csv")}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-custom-class="color-tooltip"
            >
              Uploadify
            </button>
          </div>
        </div>
        <div className={samechainStyle.divtocenterthecomponentrender}>
          <div className={samechainStyle.componentcontainerdashboard}>
            <SameChain
              activeTab={activeTab}
              setErrorModalIsOpen={setErrorModalIsOpen}
              errorModalIsOpen={errorModalIsOpen}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Transition in={!isOpen} timeout={1500}>
          {(state) => (
            <div
              className={popup.HistoryMain1}
              style={{
                ...fadeStyles[state],

                borderColor: isOpen ? "white" : "white",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
                padding: "1rem 1.25rem",
                backgroundColor: isOpen ? "white" : "#ab00ff",
                color: isOpen ? "ab00ff" : "white",
                overflow: "hidden",
                position: "relative",

                top: "unset",
              }}
            >
              <div
                className={popup.openHistory}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                  marginTop: "0.5rem",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => setIsOpen(!isOpen)}
              >
                <h2
                  style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0 }}
                >
                  Analyse Spents
                </h2>
                <button
                  aria-label="toggle history"
                  style={{
                    right: 0,
                    position: "absolute",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                >
                  <Image
                    src={dropdown}
                    alt="dropdown"
                    style={{
                      // background: "#8f00ff",
                      borderRadius: "5px",
                      transform: "rotate(180deg)",
                    }}
                  />
                </button>
              </div>
            </div>
          )}
        </Transition>
        <Transition
          in={isOpen}
          timeout={{ appear: 0, exit: 500 }}
          unmountOnExit
        >
          {(state) => (
            <div
              ref={dropdownRef}
              style={{
                ...slideStyles[state],

                border:"none",
                // border: "1px solid",
                fontSize: "0.875rem",
                // borderColor: "white",
                borderRadius: "1rem",
                padding: "1rem 1.25rem",
                // backgroundColor: "white",
                // color: "white",
                overflow: "hidden",
                position: "fixed",
                top: 150,
                left: "auto",
                zIndex: 40,
              }}
              className={popup.MainPopup}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                  marginTop: "0.5rem",
                  // color: "#8f00ff",
                }}
              >
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="toggle history"
                  style={{
                    right: 0,
                    position: "absolute",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                >
                  <Image
                    src={dropdown}
                    alt="dropdown"
                    style={{ background: "#8f00ff", borderRadius: "5px" }}
                  />
                </button>
              </div>
              {/* <div className={samechainStyle.popTitle}>
                Track Your Transfers
              </div>
              <div className={samechainStyle.popTitle}>
                Where Every Token's journey is Accounted For !
              </div>
              <div
                style={{
                  borderBottom: "1px solid #8f00ff",
                  paddingTop: "10px",
                }}
              ></div>
              <div className={samechainStyle.searchBar}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={handleChange}
                  className={samechainStyle.inputSearch}
                />
                <div style={{ color: "#8f00ff" }}>
                  Total Transferred:<span>2.25 ETH</span>
                </div>
              </div> */}
              <div className={popup.poolList}>
                <div className={popup.upperPart}>
                  <div className={samechainStyle.popTitle}>
                    Track your Native and ERC-20 token transfers with precision!
                  </div>
                  <div className={samechainStyle.popTitle}></div>
                  <div className={popup.total}>
                    <h4>Total Transfered</h4>
                    {isLoading ? (
                      <p>Loading... </p>
                    ) : (
                      <p>
                        {totalAmount} {selectedTokenSymbol}
                      </p>
                    )}
                  </div>

                  {/* <div className={popup.right}>
                    <Link to={"/add/ETH"}>
                      <button className={popup.button}>Create position</button>
                    </Link>
                  </div> */}
                </div>
                <div
                  style={{
                    borderBottom: "1px solid rgb(141 133 147)",
                    paddingTop: "10px",
                    width: "90%",
                  }}
                ></div>
                <div
                  style={{
                    borderBottom: "1px solid rgb(141 133 147)",
                    paddingTop: "10px",
                  }}
                ></div>
                <div className={samechainStyle.searchBar}>
                  <input
                    type="text"
                    name="query"
                    placeholder="Search..."
                    value={searchQuery.query}
                    onChange={handleSearchChange}
                    className={samechainStyle.inputSearch}
                  />
                  <div className={samechainStyle.width100}>
                    <lable style={{ padding: "0px 10px" }}>Start Date</lable>
                    <input
                      type="date"
                      placeholder="Start Date"
                      ref={inputRef1}
                      onChange={handleStartDateChange}
                      className={samechainStyle.inputDate1}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className={samechainStyle.width100}>
                    <lable style={{ padding: "0px 10px" }}>End Date</lable>
                    <input
                      type="date"
                      placeholder="End Date"
                      ref={inputRef3}
                      onChange={handleEndDateChange}
                      className={samechainStyle.inputDate1}
                      min={
                        startDate
                          ? startDate
                          : new Date().toISOString().split("T")[0]
                      } // Set min attribute to the selected start date if available, otherwise set it to today's date
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className={samechainStyle.chainSelect}>
                    <select
                      value={selectedToken}
                      onChange={handleTokenChange}
                      className={samechainStyle.dropdown}
                    >
                      {/* DROP DOWN FOR SHOWING TOKENS */}

                      <option
                        value="Eth"
                        className={samechainStyle.chainOptions}
                      >
                        ETH
                      </option>
                      {tokenListOfUser.length > 0
                        ? tokenListOfUser.map((token, index) => (
                            <option
                              key={index}
                              value={token.tokenAddress}
                              className={samechainStyle.chainOptions}
                            >
                              {token.symbol}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                </div>

                <div className={popup.tablediv}>
                  <div className={popup.head}>
                    <table className={popup.table}>
                      <thead>
                        <tr className={popup.row}>
                          <th className={popup.column1}>Recipient Address</th>
                          <th className={popup.column2}>
                            Amount
                            {sortingByAmount ? (
                              <button
                                className={popup.btnhoverpointer}
                                style={{
                                  background: "transparent",
                                  color: "white",
                                  border: "none",
                                }}
                                onClick={dortAmount}
                              >
                                <FontAwesomeIcon icon={faArrowUp} />
                              </button>
                            ) : (
                              <button
                                className={popup.btnhoverpointer}
                                style={{
                                  background: "transparent",
                                  color: "white",
                                  border: "none",
                                }}
                                onClick={sortAmount}
                              >
                                <FontAwesomeIcon icon={faArrowDown} />
                              </button>
                            )}
                          </th>

                          <th className={popup.column3}>Chain</th>
                          <th className={popup.column4}>Token</th>
                          <th className={popup.column5}>
                            Label
                            {sortingByLabel ? (
                              <button
                                className={popup.btnhoverpointer}
                                style={{
                                  background: "transparent",
                                  color: "white",
                                  border: "none",
                                }}
                                onClick={dortLabels}
                              >
                                <FontAwesomeIcon icon={faArrowUp} />
                              </button>
                            ) : (
                              <button
                                className={popup.btnhoverpointer}
                                style={{
                                  background: "transparent",
                                  color: "white",
                                  border: "none",
                                }}
                                onClick={sortLabels}
                              >
                                <FontAwesomeIcon icon={faArrowDown} />
                              </button>
                            )}
                          </th>

                          <th className={popup.column6}>
                            Date
                            {sortingByDate ? (
                              <button
                                className={popup.btnhoverpointer}
                                style={{
                                  background: "transparent",
                                  color: "white",
                                  border: "none",
                                }}
                                onClick={dortDate}
                              >
                                <FontAwesomeIcon icon={faArrowUp} />
                              </button>
                            ) : (
                              <button
                                className={popup.btnhoverpointer}
                                style={{
                                  background: "transparent",
                                  color: "white",
                                  border: "none",
                                }}
                                onClick={sortDate}
                              >
                                <FontAwesomeIcon icon={faArrowDown} />
                              </button>
                            )}
                          </th>

                          <th className={popup.column7}>Transaction Hash</th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Fetching tx data in */}
                  {isLoading ? (
                  
                    <div style={{ position: "relative", top: "100px" }}>
                      Fetching  transaction History...
                    </div>
                  ) : filteredTransactions.length > 0 ? (
                    <div className={popup.content}>
                      <table className={popup.table}>
                        <tbody>
                          {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction, index) => (
                              <tr className={popup.row} key={index}>
                                <td
                                  className={popup.column1}
                                  style={{
                                    color: "#8f00ff",
                                    fontWeight: "600",
                                  }}
                                >
                                  {`${transaction.recipient.substring(
                                    0,
                                    3
                                  )}...${transaction.recipient.substring(
                                    transaction.recipient.length - 5
                                  )}`}
                                  {isCopied &&
                                  isCopiedAddressIndex === index ? (
                                    <FontAwesomeIcon
                                      icon={faCircleCheck}
                                      size="sm"
                                      alt="Check Icon"
                                      style={{
                                        margin: "0px 10px",
                                        cursor: "pointer",
                                        color: "#9657eb",
                                      }}
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      icon={faCopy}
                                      size="2xs"
                                      alt="Copy Icon"
                                      onClick={() =>
                                        copyToClipboard(
                                          transaction.recipient,
                                          index
                                        )
                                      }
                                      className={popup.copyIcon}
                                    />
                                  )}
                                </td>
                                <td
                                  className={popup.column2}
                                  style={{
                                    color: "#8f00ff",
                                    fontWeight: "600",
                                  }}
                                >
                                  {transaction.value}
                                </td>
                                <td
                                  className={popup.column3}
                                  style={{
                                    color: "#8f00ff",
                                    fontWeight: "600",
                                  }}
                                >
                                  {transaction.chainName}
                                </td>
                                <td
                                  className={popup.column4}
                                  style={{
                                    color: "#8f00ff",
                                    fontWeight: "600",
                                  }}
                                >
                                  {transaction.tokenName || "ETH"}
                                </td>
                                <td
                                  className={popup.column5}
                                  style={{
                                    color: "#8f00ff",
                                    fontWeight: "600",
                                  }}
                                >
                                  {transaction.label
                                    ? transaction.label
                                    : "---"}
                                </td>
                                <td
                                  className={popup.column6}
                                  style={{
                                    color: "#8f00ff",
                                    fontWeight: "600",
                                  }}
                                >
                                  {new Date(
                                    transaction.blockTimestamp
                                  ).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </td>
                                <td
                                  className={popup.column7}
                                  style={{
                                    color: "#8f00ff",
                                    fontWeight: "600",
                                  }}
                                >
                                  {/* {transaction.transactionHash} */}
                                  {transaction.transactionHash && (
                                    <a
                                      href={`https://${explorerUrl}/tx/${transaction.transactionHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color: "#8f00ff",
                                        textDecoration: "none",
                                      }}
                                    >
                                      {`${transaction.transactionHash.substring(
                                        0,
                                        3
                                      )}...${transaction.transactionHash.substring(
                                        transaction.transactionHash.length - 5
                                      )}`}
                                    </a>
                                  )}

                                  {isCopiedHash &&
                                  isCopiedAddressIndexHash === index ? (
                                    <FontAwesomeIcon
                                      icon={faCircleCheck}
                                      size="sm"
                                      alt="Check Icon"
                                      style={{
                                        margin: "0px 10px",
                                        cursor: "pointer",

                                        color: "#9657eb",
                                      }}
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      icon={faCopy}
                                      size="2xs"
                                      alt="Copy Icon"
                                      onClick={() =>
                                        copyToClipboardHash(
                                          transaction.transactionHash,
                                          index
                                        )
                                      }
                                      className={popup.copyIcon}
                                    />
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                              }}
                            >
                              <tr>
                                <td
                                  colSpan="7"
                                  style={{
                                    textAlign: "center",
                                    fontSize: "12px",
                                  }}
                                >
                                  No transactions found.
                                </td>
                              </tr>
                            </div>
                          )}
                        </tbody>
                      </table>
                    </div>
                    ) : dataNotFound ? (
                      <div style={{ textAlign: "center", marginTop: "20px" }}>
                          No transactions found.
                      </div>
                  ) : (
                    <div>No data found</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Transition>
      </div>
      <Footer />
    </div>
  );
}

export default Samechaindashboard;
