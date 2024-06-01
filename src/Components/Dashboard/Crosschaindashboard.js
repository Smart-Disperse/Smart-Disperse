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
import { faShare, faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import {
  getERC20Transactions,
  getEthTransactions,
} from "@/Helpers/GetSentTransactions";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import notnx from "../../Assets/nodata.png";
import contracts from "@/Helpers/ContractAddresses";
import CrossChain from "../DashboardComponents/CrossChain/CrossChain";
import {
  faArrowDown,
  faArrowUp,
  faCircleCheck,
  faMagnifyingGlass,
  faMagnifyingGlassChart,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";

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

  // const handleSearchChange = (event) => {
  //   const { value } = event.target;
  //   setQuery(value);
  // };

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
      const result = await fetch(`api/all-user-data?address=${address}`);
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
      <div>
        <div className={samechainStyle.stickyIcon}>
          <a href="/same-chain" className={samechainStyle.Instagra}>
            <FontAwesomeIcon icon={faShare} />{" "}
            <div> &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp; Same Chain</div>
          </a>
        </div>
        <div className={samechainStyle.stickyIcon1}>
          <a href="/cross-analysis" className={samechainStyle.Instagra}>
            <FontAwesomeIcon icon={faMagnifyingGlassChart} />{" "}
            <div> Spent Analysis</div>
          </a>
        </div>
        <div className={samechainStyle.stickyIcon2}>
          <a href="/all-user-lists" className={samechainStyle.Instagram}>
            <FontAwesomeIcon icon={faUser} /> <div>Manage Labels</div>
          </a>
        </div>
      </div>
      <div
        className={`${samechainStyle["samedashmainm"]} ${
          errorModalIsOpen ? `${homeStyle["blurbackground"]}` : ""
        }`}
      >
        <div className={samechainStyle.titledivdashboard}>
          <div className={samechainStyle.imagesinthis}></div>
          <h1 className={samechainStyle.headingofsamechain}>
            Effortless Token Distribution
          </h1>
          <h3 className={samechainStyle.dashpera}>
            Disperse Your Tokens to chains and Other Networks, Embracing
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
      ></div>
      <Footer />
    </div>
  );
}

export default Crosschaindashboard;
