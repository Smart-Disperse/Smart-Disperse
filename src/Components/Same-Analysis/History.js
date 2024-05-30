"use client";
import React, { useState, useEffect, useRef } from "react";
import histroyStyle from "./history.module.css";
import {
  faArrowDown,
  faArrowUp,
  faCopy,
  faMagnifyingGlass,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchUserLabels } from "@/Helpers/FetchUserLabels";
import {
  getERC20Tokens,
  getERC20Transactions,
  getEthTransactions,
} from "@/Helpers/GetSentTransactions";
import { useAccount, useChainId } from "wagmi";
import popup from "@/Components/Dashboard/popupTable.module.css";

function History() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [render, setRender] = useState(1);
  const [selectedToken, setSelectedToken] = useState("Eth");
  const [tokenListOfUser, setTokenListOfUser] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataNotFound, setDataNotFound] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortingByAmount, setSortingByAmount] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedAddressIndex, setIsCopiedAddressIndex] = useState(false);
  const [isCopiedHash, setIsCopiedHash] = useState(false);
  const [sortingByLabel, setSortingByLabel] = useState(false);
  const [sortingByDate, setSortingByDate] = useState(false);
  const [isCopiedAddressIndexHash, setIsCopiedAddressIndexHash] =
    useState(false);
  const [transactions, setTransactions] = useState(filteredTransactions);
  const [explorerUrl, setExplorerUrl] = useState("Eth");
  const inputRef1 = useRef();
  const [totalAmount, setTotalAmount] = useState(0);
  const inputRef3 = useRef();

  // State for selected token and dates
  // const [selectedToken, setSelectedToken] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    console.log("fetchinggg");
    const fetchData = async () => {
      // setIsLoading(true);
      try {
        const { allNames, allAddress } = await fetchUserLabels(address);
        console.log("all names", allNames);
        var ethData = [];
        if (selectedToken === "Eth") {
          console.log(address, chainId);
          ethData = await getEthTransactions(address, chainId);
          console.log(ethData);
          // ethData = ethData.filter(
          //   (transaction) => transaction.tokenName == null
          // );
        } else {
          ethData = await getERC20Transactions(address, selectedToken, chainId);
          console.log(ethData);
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
          console.log(ethData);
          setTransactionData(ethData);
          setFilteredTransactions(ethData);
          const userTokens = await getERC20Tokens(address, chainId);
          console.log("usertokens", userTokens);
          setTokenListOfUser(userTokens);
          setIsLoading(false);
          setDataNotFound(false);
        } else {
          setDataNotFound(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData(address);
  }, [address, selectedToken]);

  useEffect(() => {
    if (address) {
      setRender((prev) => prev + 1);
    }
  }, [address, chainId]);

  return (
    <div className={histroyStyle.maindivofhisotry}>
      <div className={histroyStyle.searchtablediv}>
        <div className={histroyStyle.searchdiv}>
          <input
            placeholder="Search by address or hash"
            className={histroyStyle.searchinputbox}
          />
          <button className={histroyStyle.searchbtn}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={histroyStyle.searchicon}
            />
          </button>
        </div>
        <div className={histroyStyle.maintablediv}>
          <div className={histroyStyle.tablediv1}>
            <div className={histroyStyle.headingdiv}>Latest Transactions</div>
            <div className={histroyStyle.filterdiv}>
              <div className={histroyStyle.labeldate}>
    Start date:
              <input
                type="date"
                className={histroyStyle.dateInput}
                value={startDate}
                onChange={handleStartDateChange}
                placeholder="Start Date"
                />
                </div>
              <div className={histroyStyle.labeldate}>
                End date:
              <input
                type="date"
                className={histroyStyle.dateInput}
                value={endDate}
                onChange={handleEndDateChange}
              />
              </div>
              <select
                value={selectedToken}
                onChange={handleTokenChange}
                className={histroyStyle.dropdown}
              >
                {/* DROP DOWN FOR SHOWING TOKENS */}
                <option value="Select" className={histroyStyle.chainOptions}>
                  Select
                </option>
                <option value="Eth" className={histroyStyle.chainOptions}>
                  ETH
                </option>

                {tokenListOfUser.length > 0
                  ? tokenListOfUser.map((token, index) => (
                      <option
                        key={index}
                        value={token.tokenAddress}
                        className={histroyStyle.chainOptions}
                      >
                        {token.symbol}
                      </option>
                    ))
                  : null}
              </select>
            </div>
          </div>
          <div className={histroyStyle.tableandheadingdiv}>
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
                              color: "black",
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
                              color: "black",
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
                              color: "black",
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
                              color: "black",
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
                              color: "black",
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
                              color: "black",
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
                  Fetching transaction History...
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
                                color: "#FFFFFF",
                                fontWeight: "600",
                              }}
                            >
                              {`${transaction.recipient.substring(
                                0,
                                3
                              )}...${transaction.recipient.substring(
                                transaction.recipient.length - 5
                              )}`}
                              {isCopied && isCopiedAddressIndex === index ? (
                                <FontAwesomeIcon
                                  icon={faCircleCheck}
                                  size="sm"
                                  alt="Check Icon"
                                  style={{
                                    margin: "0px 10px",
                                    cursor: "pointer",
                                    color: "#ffffff",
                                  }}
                                />
                              ) : (
                                <FontAwesomeIcon
                                  icon={faCopy}
                                  size="sm"
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
                                color: "#FFFFFF",
                                fontWeight: "600",
                              }}
                            >
                              {`${transaction.value.substring(
                                0,
                                3
                              )}...${transaction.value.substring(
                                transaction.value.length - 5
                              )}`}
                            </td>
                            <td
                              className={popup.column3}
                              style={{
                                color: "#FFFFFF",
                                fontWeight: "600",
                              }}
                            >
                              {transaction.chainName}
                            </td>
                            <td
                              className={popup.column4}
                              style={{
                                color: "#FFFFFF",
                                fontWeight: "600",
                              }}
                            >
                              {transaction.tokenName || "ETH"}
                            </td>
                            <td
                              className={popup.column5}
                              style={{
                                color: "#FFFFFF",
                                fontWeight: "600",
                              }}
                            >
                              {transaction.label ? transaction.label : "---"}
                            </td>
                            <td
                              className={popup.column6}
                              style={{
                                color: "#FFFFFF",
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
                                color: "#FFFFFF",
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
                                    color: "#FFFFFF",
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

                                    color: "#ffffff",
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
                            <td colSpan="7" className={popup.Nodata}>
                              No transactions found.
                            </td>
                          </tr>
                        </div>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : dataNotFound ? (
                <div className={popup.Nodata}>No transactions found.</div>
              ) : (
                <div className={popup.Nodata}>No data found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
