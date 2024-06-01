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
  faMagnifyingGlass,
  faMagnifyingGlassChart,
  faShare,
  faShuffle,
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
import { useAccount, useChainId, useNetwork, useSwitchChain } from "wagmi";
import { fetchUserDetails, fetchUserLabels } from "@/Helpers/FetchUserLabels";

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
  const [render, setRender] = useState(1);



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
      console.log(total.toFixed(8));
      setTotalAmount(total.toFixed(8));
    } else {
      console.log("first");
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
        await calculateTotalAmount(transactionData);
      }
    };
    calculateAmount();
  }, [transactionData]);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        setIsLoading(true);
        const { allNames, allAddress } = await fetchUserLabels(address);
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
          for (let i = 0; i < ethData.length; i++) {
            const recipientAddress = ethData[i].recipient.toLowerCase();

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
        }
        setIsLoading(false);
      }
    };

    fetchData(address);
  }, [isOpen, selectedToken]);

  useEffect(() => {
    if (address) {
      setRender((prev) => prev + 1);
    }
  }, [address, chainId]);
  return (
    <div className={samechainStyle.maindivofdashboard} key={render}>
      <div>
        <div className={samechainStyle.stickyIcon}>
          <a href="/cross-chain" className={samechainStyle.Instagra}>
          <FontAwesomeIcon icon={faShare} /> <div>Cross chain</div>
          </a>
        </div>
        <div className={samechainStyle.stickyIcon1}>
          <a href="/same-analysis" className={samechainStyle.Instagra}>
            <FontAwesomeIcon icon={faMagnifyingGlassChart} /> <div> Spent Analysis</div>
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
          <h1 className={samechainStyle.headingofsamechain}>Effortless Token Distribution</h1>
          <h3 className={samechainStyle.dashpera}>
            Instant Multi-Account Dispersement – Seamlessly Send Tokens to
            Multiple Accounts in One Click
          </h3>
        </div>
        <div className={samechainStyle.maindivforalloptiondashboard}>
          <div className={samechainStyle.menubardashboard}>
            <button
            
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
      </div>
      <Footer />
    </div>
  );
}

export default Samechaindashboard;
