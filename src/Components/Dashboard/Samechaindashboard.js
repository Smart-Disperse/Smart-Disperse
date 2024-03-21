"use client";
import React, { useState, useEffect, useRef } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import popup from "../Dashboard/popupTable.module.css";
import data from "../Dashboard/data.json";
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
import SameChain from "../DashboardComponents/SameChain/SameChain";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import {
  getERC20Transactions,
  getEthTransactions,
} from "@/Helpers/GetSentTransactions";
import { useAccount } from "wagmi";
import { ethers} from "ethers";

function Samechaindashboard() {
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
  const inputRef3 = useRef();
  const { address } = useAccount(); /*/User's Ethereum Address*/
  const [chainname, setChainname] = useState();
  
  const getchainid = async () => {
    console.log("Getting chain ID");
    try {
      const chain = Number(
        await window.ethereum.request({ method: "eth_chainId" })
      );
      const network = ethers.providers.getNetwork(chain);
      const chainid = network.chainId.toString();
      console.log("Chain ID:", chainid);
      
      const chains = {
        919: "Mode Testnet ",
        534351: "Scroll Sepolia",
        34443: "Mode Mainnet",
        534352: "Scroll Mainnet"
      };
  
      // Check if the chain ID matches any of the predefined chains
      if (chains.hasOwnProperty(chainid)) {
        const chainName = chains[chainid];
        console.log("Chain Name:", chainName);
        setChainname(chainName);
      } else {
        console.log("Chain ID not recognized");
      }
  
      // Assuming setChainid is a function to update the state of the chain ID
      setChainid(chainid);
  
      return chainid;
    } catch (error) {
      console.error("Error occurred while fetching chain ID:", error);
      throw error;
    }
  };
  
  useEffect(() => {
    console.log("loading")
    getchainid();
  })


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

  const handleTokenChange = (event) => {
    setSelectedToken(event.target.value);
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
  

  const [ethTransactions, setEthTransactions] = useState([]);
  const [erc20Transactions, setErc20Transactions] = useState([]);

  
  useEffect(() => {
    const fetchTransactions = async () => {
      if (address) {
        const ethData = await getEthTransactions(address);
        setEthTransactions(ethData);
        
        const erc20Data = await getERC20Transactions(address, "0x17E086dE19524E29a6d286C3b1dF52FA47c90b5B");
        setErc20Transactions(erc20Data);
        setEthdata(erc20Data);
      }
    };
  
    fetchTransactions();
  }, [address,setEthdata]);

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
              // closeErrorModal={closeErrorModal}
              // errorModalIsOpen={errorModalIsOpen}
            />
          </div>
        </div>
      </div>
      {/* <div className={samechainStyle.HistoryMain}>
        <div className={samechainStyle.HistorySubDiv1}>
          <div className={samechainStyle.hsBtnmain}>
            <h2>History</h2>
            <button className={samechainStyle.dropdownBtn} onClick={toggleOpen}>
              <Image src={dropdown} alt="dropdown" />
            </button>
            {popupOpen && (
              <div className={samechainStyle.HistorySubDiv2}>
                <div className={samechainStyle.hsBtnmain}>
                  <h2>History</h2>
                  <button
                    className={samechainStyle.dropdownBtn}
                    onClick={toggleOpen}
                  >
                    <Image src={dropdown} alt="dropdown" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Transition in={!isOpen} timeout={1500}>
          {(state) => (
            <div
              style={{
                ...fadeStyles[state],
                width: "520px",
                height: "calc(-4rem + 100px)",
                border: "1px solid",
                fontSize: "0.875rem",
                borderColor: isOpen ? "white" : "white",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
                padding: "1rem 1.25rem",
                backgroundColor: isOpen ? "white" : "white",
                color: isOpen ? "dark" : "custom-light",
                overflow: "hidden",
                position: "relative",

                bottom: "-95px",
                top: "unset",
              }}
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
                width: "100%",
                height: "675px",
                maxWidth: "1300px",
                minWidth: "900px",
                maxHeight: "100vh",
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
              className={samechainStyle.MainPopup}
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
                    <h4>Total Transfferred</h4>
                    <p>$7,403,262.61</p>
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
                    className={samechainStyle.inputSearch}
                  />

                  <div>
                    <input
                      type="text"
                      placeholder="Start Date"
                      ref={inputRef1}
                      onChange={(e) => console.log(e.target.value)}
                      onFocus={() => (inputRef1.current.type = "date")}
                      onBlur={() => (inputRef1.current.type = "text")}
                      className={samechainStyle.inputDate1}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="End Date"
                      ref={inputRef3}
                      onChange={(e) => console.log(e.target.value)}
                      onFocus={() => (inputRef3.current.type = "date")}
                      onBlur={() => (inputRef3.current.type = "text")}
                      className={samechainStyle.inputDate1}
                    />
                  </div>
                  <select
                    value={selectedToken}
                    onChange={handleTokenChange}
                    className={samechainStyle.dropdown}
                  >
                    <option value="all">Select</option>
                    <option value="token1">Token 1</option>
                    <option value="token2">Token 2</option>
                    <option value="token3">Token 3</option>
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
                          <th className={popup.column4}>Token Name</th>
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
                        {[...(ethTransactions || []), ...(erc20Transactions || [])].map((transaction, index) => (
                          <tr className={popup.row} key={index}>
                            <td className={popup.column1} style={{ color: "#8f00ff", fontWeight: "600" }}>
                              {transaction.recipient}
                            </td>
                            <td className={popup.column2} style={{ color: "#8f00ff", fontWeight: "600" }}>
                              {transaction.value}
                            </td>
                            <td className={popup.column3} style={{ color: "#8f00ff", fontWeight: "600" }}>
                              {/* {transaction.chainName || "ETH"} */}
                              {chainname}
                            </td>
                            <td className={popup.column4} style={{ color: "#8f00ff", fontWeight: "600" }}>
                              {transaction.tokenName || "ETH"}
                            </td>
                            <td className={popup.column5} style={{ color: "#8f00ff", fontWeight: "600" }}>
                              Pending
                              {/* Label information */}
                            </td>
                            <td className={popup.column6} style={{ color: "#8f00ff", fontWeight: "600" }}>
                              {transaction.blockTimestamp}
                            </td>
                            <td className={popup.column7} style={{ color: "#8f00ff", fontWeight: "600" }}>
                              {transaction.transactionHash}
                            </td>
                          </tr>
                        ))}
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

export default Samechaindashboard;
