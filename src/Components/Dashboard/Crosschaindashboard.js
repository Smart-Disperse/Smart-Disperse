"use client";
import React, { useState, useEffect, useRef } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import popup from "../Dashboard/popupTable.module.css";
import Image from "next/image";
import img3 from "../../Assets/img3-bg.webp";
import { Transition } from "react-transition-group";
import dropdown from "../../Assets/down.png";
import img4 from "../../Assets/img4-bg.webp";
import { driver } from "driver.js"; //driver .js is a javascript library used for guiding
import "driver.js/dist/driver.css";
import samechainStyle from "./samechaindashboard.module.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import homeStyle from "@/Components/Homepage/landingpage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
// import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  getERC20Transactions,
  getEthTransactions,
} from "@/Helpers/GetSentTransactions";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import notnx from "../../Assets/nodata.png";
import contracts from "@/Helpers/ContractAddresses";
import CrossChain from "../DashboardComponents/CrossChain/CrossChain";

function Crosschaindashboard() {
  const [activeTab, setActiveTab] = useState("text"); //default tab is textify
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); // State for modal visibility
  const router = useRouter();
  // ...user-analysis
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chainID, setChainid] = useState();
  const [selectedToken, setSelectedToken] = useState("all");
  const [changedata, setEthdata] = useState();
  const inputRef1 = useRef();
  const [totalAmount, setTotalAmount] = useState(0);
  const inputRef3 = useRef();
  const { address } = useAccount(); /*/User's Ethereum Address*/
  const [chainname, setChainname] = useState();
  const [ethTransactions, setEthTransactions] = useState([]);
  const [erc20Transactions, setErc20Transactions] = useState([]);
  const [allnames, setAllNames] = useState([]);
  const [allAddress, setAllAddress] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  useEffect(() => {
    const handleClick = () => {
      if (!isConnected) {
        openConnectModal();
      }
    };
    window.addEventListener("click", handleClick);  
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [isConnected, openConnectModal]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setQuery(value);
  };

  // Modify filterTransactions function to include token name filter
  const filterTransactions = (query) => {
    let filtered = [...ethTransactions, ...erc20Transactions];

    if (query) {
      filtered = filtered.filter((transaction) =>
        transaction.recipient.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedToken !== "all") {
      filtered = filtered.filter(
        (transaction) =>
          transaction.tokenName?.toLowerCase() === selectedToken.toLowerCase()
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleTokenChange = (event) => {
    const selectedToken = event.target.value;
    setSelectedToken(selectedToken);
  };

  // UseEffect to update filtered transactions when selectedToken changes
  useEffect(() => {
    filterTransactions(query);
  }, [query, ethTransactions, erc20Transactions, selectedToken]);
  // useEffect(() => {
  //   console.log("loading");
  //   getchainid();
  // });

  const calculateTotalAmount = () => {
    let total = 0;
    filteredTransactions.forEach((transaction) => {
      total += parseFloat(transaction.value);
    });
    return total.toFixed(2); // Limiting the total to 2 decimal places
  };

  useEffect(() => {
    // Calculate total amount whenever filteredTransactions changes
    const total = calculateTotalAmount();
    console.log("total here:", total);
    setTotalAmount(total);
  }, [filteredTransactions]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "query") {
      setQuery(value);
    } else if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
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
  }, []);

  // const fetchTransactions = async () => {
  //   if (address) {
  //     const ethData = await getEthTransactions(address);
  //     setEthTransactions(ethData);

  //     const erc20Data = await getERC20Transactions(address, "0x254d06f33bDc5b8ee05b2ea472107E300226659A");
  //     setErc20Transactions(erc20Data);
  //   }
  // };

  // CHAIN ID OBJECT

  // Function to get chain name based on chain ID

  // Extract unique token names from ethTransactions and erc20Transactions
  const allTransactions = [...ethTransactions, ...erc20Transactions];
  const uniqueTokenNames = Array.from(
    new Set(allTransactions.map((transaction) => transaction.tokenName))
  );
  useEffect(() => {
    console.log("fetching...");
    const fetchTransactions = async () => {
      if (address) {
        const ethData = await getEthTransactions(address);
        console.log("Eth data", ethData);
        const toaddress = ethData.map((useraddress) => useraddress.recipient);
        console.log("get to address", toaddress);

        for (let i = 0; i < ethData.length; i++) {
          const recipientAddress = ethData[i].recipient;
          const index = allAddress.findIndex(
            (addr) => addr === recipientAddress
          );
          console.log(index, recipientAddress, allAddress);

          if (index !== -1) {
            ethData[i].label = allnames[index];
          }
        }
        setEthTransactions(ethData);
        console.log(ethData);
        fetchUserDetails(toaddress);
        return ethData;
        // const erc20Data = await getERC20Transactions(
        //   address,
        //   "0x17E086dE19524E29a6d286C3b1dF52FA47c90b5B"
        // );
        // setErc20Transactions(erc20Data);
        // setEthdata(erc20Data);
      }
    };

    fetchTransactions();
  }, [address, setEthdata]);

  const fetchUserDetails = async (toaddress) => {
    console.log(address);
    try {
      console.log("entered into try block");
      const result = await fetch(
        `http://localhost:3000/api/all-user-data?address=${address}`
      );
      const response = await result.json();

      console.log("Response from API:", response);
      const alldata = response.result;
      const names = alldata.map((user) => user.name);
      console.log("allnames", names);
      setAllNames(names);
      const alladdress = alldata.map((user) => user.address);
      setAllAddress(alladdress);
      console.log("alladdress", alladdress);
      // for (let i = 0; i < toaddress.length; i++) {
      //   const index = alladdress.findIndex((addr) => addr === toaddress[i]);
      //   if (index !== -1) {
      //     console.log("Matching index:", names[index]);
      //   }
      // }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className={samechainStyle.maindivofdashboard}>
      <div style={{ position: "relative" }}>
        <Image className={samechainStyle.dashbgImg1} src={img3} alt="none" />
        <Image className={samechainStyle.dashbgImg2} src={img4} alt="none" />
      </div>
      <div>
        <button
          onClick={() => router.push("/all-user-lists")}
          title="View your contact"
          className={samechainStyle.displayuserlistbtn}
        >
          <FontAwesomeIcon icon={faUser} />
        </button>
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
            Disperse Your Tokens to CHAINs and Other Networks, Embracing
            Multi-Network Distribution
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
            <CrossChain
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
                backgroundColor: isOpen ? "white" : "white",
                color: isOpen ? "dark" : "custom-light",
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
                  color: "#8f00ff",
                  cursor: "pointer",
                }}
                onClick={() => setIsOpen(!isOpen)}
              >
                <h2
                  style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0 }}
                >
                  History
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
                    style={{ background: "#8f00ff", borderRadius: "5px" }}
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

                border: "1px solid",
                fontSize: "0.875rem",
                borderColor: "white",
                borderRadius: "1rem",
                padding: "1rem 1.25rem",
                backgroundColor: "white",
                color: "custom-light",
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
                  color: "#8f00ff",
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
                    Track Your Transfers Where Every Token's journey is
                    Accounted For !
                  </div>
                  <div className={samechainStyle.popTitle}></div>
                  <div className={popup.total}>
                    <h4>Total Transfered</h4>
                    <p>{totalAmount} ETH</p>
                  </div>

                  {/* <div className={popup.right}>
                    <Link to={"/add/ETH"}>
                      <button className={popup.button}>Create position</button>
                    </Link>
                  </div> */}
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #8f00ff",
                    paddingTop: "10px",
                    width: "90%",
                  }}
                ></div>
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
                    onChange={handleSearchChange}
                    className={samechainStyle.inputSearch}
                  />

                  <input
                    type="text"
                    placeholder="Start Date"
                    ref={inputRef1}
                    onChange={(e) => console.log(e.target.value)}
                    onFocus={() => (inputRef1.current.type = "date")}
                    onBlur={() => (inputRef1.current.type = "text")}
                    className={samechainStyle.inputDate1}
                  />

                  <input
                    type="text"
                    placeholder="End Date"
                    ref={inputRef3}
                    onChange={(e) => console.log(e.target.value)}
                    onFocus={() => (inputRef3.current.type = "date")}
                    onBlur={() => (inputRef3.current.type = "text")}
                    className={samechainStyle.inputDate1}
                  />

                  <select
                    value={selectedToken}
                    onChange={handleTokenChange}
                    className={samechainStyle.dropdown}
                  >
                    <option value="all">All Tokens</option>
                    {uniqueTokenNames.map((tokenName) => (
                      <option key={tokenName} value={tokenName}>
                        {tokenName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={popup.tablediv}>
                  <div className={popup.head}>
                    <table className={popup.table}>
                      <thead>
                        <tr className={popup.row}>
                          <th className={popup.column1}>Recipient Address</th>
                          <th className={popup.column2}>Amount</th>
                          <th className={popup.column3}>Chain</th>
                          <th className={popup.column4}>Token</th>
                          <th className={popup.column5}>Label</th>
                          <th className={popup.column6}>Date</th>
                          <th className={popup.column7}>Transaction Hash</th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Fetching tx data in */}
                  <div className={popup.content}>
                    <table className={popup.table}>
                      <tbody>
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((transaction, index) => (
                            <tr className={popup.row} key={index}>
                              <td
                                className={popup.column1}
                                style={{ color: "#8f00ff", fontWeight: "600" }}
                              >
                                {`${transaction.recipient.substring(
                                  0,
                                  3
                                )}...${transaction.recipient.substring(
                                  transaction.recipient.length - 5
                                )}`}
                                {/* {transaction.recipient} */}
                              </td>
                              <td
                                className={popup.column2}
                                style={{ color: "#8f00ff", fontWeight: "600" }}
                              >
                                {transaction.value}
                              </td>
                              <td
                                className={popup.column3}
                                style={{ color: "#8f00ff", fontWeight: "600" }}
                              >
                                {transaction.chainName}
                              </td>
                              <td
                                className={popup.column4}
                                style={{ color: "#8f00ff", fontWeight: "600" }}
                              >
                                {transaction.tokenName || "ETH"}
                              </td>
                              <td
                                className={popup.column5}
                                style={{ color: "#8f00ff", fontWeight: "600" }}
                              >
                                {transaction.label ? transaction.label : null}
                              </td>
                              <td
                                className={popup.column6}
                                style={{ color: "#8f00ff", fontWeight: "600" }}
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
                                style={{ color: "#8f00ff", fontWeight: "600" }}
                              >
                                {/* {transaction.transactionHash} */}
                                {`${transaction.transactionHash.substring(
                                  0,
                                  3
                                )}...${transaction.transactionHash.substring(
                                  transaction.transactionHash.length - 5
                                )}`}
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
                            <Image
                              src={notnx}
                              alt="none"
                              width={200}
                              height={100}
                            />
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

export default Crosschaindashboard;
