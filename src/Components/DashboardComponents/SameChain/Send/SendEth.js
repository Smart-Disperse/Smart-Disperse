import React from "react";
import Textify from "../Type/Textify";
import Listify from "../Type/Listify";
import Uploadify from "../Type/Uploadify";
import { useState, useEffect } from "react";
import textStyle from "../Type/textify.module.css";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import ExecuteEth from "../Execute/ExecuteEth";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { isContractAddress } from "@/Helpers/ValidateInput.js";
import Modal from "react-modal";
import warning from "@/Assets/warning.webp";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserLabels } from "@/Helpers/FetchUserLabels";

function SendEth({ activeTab, listData, setListData }) {
  const [ethToUsdExchangeRate, setEthToUsdExchangeRate] = useState(null); //store ETH to USD exchange rate
  const [totalEth, setTotalEth] = useState(null); // store total amount of Ether in the transaction
  const [remaining, setRemaining] = useState(null); // store remaining amount after deducting already sent value
  const [ethBalance, setEthBalance] = useState(null); // store user's Ether balance
  const { address } = useAccount(); /*/gather account data for current user */
  const [addressLabelMap, setAddressLabelMap] = useState([]);
  const [labels, setLabels] = useState([]);
  const [allNames, setAllNames] = useState([]);
  const [allAddresses, setAllAddresses] = useState([]);
  const [errormsg, setErrormsg] = useState("");
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [suffecientBalance, setSuffecientBalance] = useState(true);
  const renderComponent = (tab) => {
    switch (tab) {
      case "text":
        return (
          <Textify
            listData={listData}
            setListData={setListData}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
      case "list":
        return (
          <Listify
            listData={listData}
            setListData={setListData}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
      case "csv":
        return (
          <Uploadify
            listData={listData}
            setListData={setListData}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
      default:
        return (
          <Textify
            listData={listData}
            setListData={setListData}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
    }
  };

  // For fetching the Exchange rate of ETH to USD to display value in USD
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
        );
        const data = await response.json();
        const rate = data.USD;

        setEthToUsdExchangeRate(rate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRate();
  }, [listData]);

  /* For getting the user Balance
   */
  const getEthBalance = async () => {
    const { ethereum } = window;
    if (!ethBalance) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      if (address) {
        let ethBalance = await provider.getBalance(address);
        setEthBalance(ethBalance);
      }
    }
  };

  
  const handleDeleteRow = (index) => {
    const updatedList = [...listData];
    updatedList.splice(index, 1);
    setListData(updatedList);
    toast.success("Transaction Deleted Successfully");
  };

  /*
  For Calculating the total amount of sending ETH
  */
  useEffect(() => {
    const calculateTotal = () => {
      let totalEth = ethers.BigNumber.from(0);
      if (listData.length > 0) {
        listData.forEach((data) => {
          totalEth = totalEth.add(data.value);
        });
      }

      setTotalEth(totalEth);
    };

    calculateTotal();
  }, [listData]);

  /* for getting values on render */
  useEffect(() => {
    // console.log(listData);
    getEthBalance();
  });

  useEffect(() => {
    calculateRemaining();
  }, [totalEth]);

  const calculateRemaining = () => {
    if (ethBalance && totalEth) {
      const remaining = ethBalance.sub(totalEth);
      setRemaining(ethers.utils.formatEther(remaining));
      if (remaining < 0) {
        setSuffecientBalance(false);
      } else {
        setSuffecientBalance(true);
      }
    } else {
      setRemaining(null);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const { allNames, allAddress } = await fetchUserLabels(address);
      console.log(allAddress);
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
    // console.log(updatedLabels);
    setLabels(updatedLabels);
  };

  const handleAddressChange = (e, index) => {
    const newAddress = e.target.value;
    const updatedListData = [...listData];
    updatedListData[index].address = newAddress;
  
    const existingEntry = addressLabelMap.find(entry => entry.address.toLowerCase() === newAddress.toLowerCase());
    if (existingEntry) {
      updatedListData[index].label = existingEntry.label;
    } else {
      updatedListData[index].label = "";
    }
  
    setListData(updatedListData);
    console.log("Updated List Data:", updatedListData);
  };
  

  const onAddLabel = async (index, recipientAddress) => {
    const userData = {
      userid: address,
      name: labels[index],
      address: recipientAddress.toLowerCase(),
    };
  
    try {
      let result = await fetch(`api/all-user-data?address=${address}`, {
        method: "POST",
        body: JSON.stringify(userData),
      });
  
      result = await result.json();
      if (typeof result.error === "string") {
        setErrorModalIsOpen(true);
        toast.warn("Name Already Exist! Please Enter Unique Name.");
        setErrormsg(result.error);
      } else {
        if (result.message === "Success") {
          toast.success("Label Added successfully");
        }
      }
    } catch (error) {
      setErrormsg("Some Internal Error Occured");
      console.error("Error:", error);
    }
  
    const newEntry = {
      address: recipientAddress.toLowerCase(),
      label: labels[index],
    };
  
    setAddressLabelMap(prevMap => {
      const existingIndex = prevMap.findIndex(entry => entry.address === newEntry.address);
      if (existingIndex !== -1) {
        const updatedMap = [...prevMap];
        updatedMap[existingIndex] = newEntry;
        return updatedMap;
      } else {
        return [...prevMap, newEntry];
      }
    });
  
    const { allNames, allAddress } = await fetchUserLabels(address);
  
    const updatedListData = await listData.map((item) => {
      if (
        (item.label === undefined || item.label === "") &&
        allAddress.includes(item.address.toLowerCase())
      ) {
        const index = allAddress.indexOf(item.address.toLowerCase());
        item.label = allNames[index];
      }
      return item;
    });
  
    await fetchUserDetails();
    await setListData(updatedListData);
  
    // Log the updated address-label mapping
    console.log("Address-Label Mapping:", addressLabelMap);
  };
  
  
  useEffect(() => {
    calculateRemaining();
  });

  return (
    <>
      {address ? (
        <>
          {renderComponent(activeTab)}
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
                      fontWeight: "300",
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
                      <tr className={textStyle.tableTr}>
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
                          Amount(ETH)
                        </th>
                        <th
                          className={textStyle.fontsize12px}
                          style={{ letterSpacing: "1px", padding: "8px" }}
                        >
                          Amount(USD)
                        </th>
                        
                        {/* <th
                      className={textStyle.fontsize12px}
                      style={{ letterSpacing: "1px", padding: "8px" }}
                    >
                      Warnings
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
                            <tr
                              className={textStyle.tableTr}
                              style={{ borderBottom: "1px solid #ffffff61" }}
                              key={index}
                            >
                              <td
                                id={textStyle.fontsize10px}
                                style={{ letterSpacing: "1px", padding: "8px" }}
                              >
                                {/* {data.address.toUpperCase()} */}
                                {data.address.substr(0, 3)}...
                                {data.address.substr(-5)}
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
                                            "Press Enter to submit"
                                          );
                                        }

                                        // Regular expression to allow only alphanumeric characters without spaces
                                        const regex = /^[a-zA-Z0-9]*$/;

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
                                          setErrorMessage("");
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
                                    border: "1px solid #00FBFB",
                                    borderRadius: "10px",
                                    padding: "10px 10px",
                                    fontSize: "12px",
                                    letterSpacing: "1px",
                                  }}
                                >
                                  {`${(+ethers.utils.formatEther(
                                    data.value
                                  )).toFixed(9)} ETH`}
                                </div>
                              </td>
                              <td
                                id="font-size-10px"
                                style={{ padding: "8px" }}
                              >
                                <div
                                  id="font-size-10px"
                                  style={{
                                    width: "fit-content",
                                    margin: "0 auto",
                                    background: "transparent",
                                    color: "#19F26F",
                                    border: "1px solid #19F26F",
                                    borderRadius: "10px",
                                    padding: "10px 10px",
                                    fontSize: "12px",
                                    letterSpacing: "1px",
                                  }}
                                >
                                  {`${(
                                    ethers.utils.formatUnits(data.value, 18) *
                                    ethToUsdExchangeRate
                                  ).toFixed(2)} $`}
                                </div>
                              </td>

                              {/* <td style={{ letterSpacing: "1px", padding: "8px" }}>
                            <span
                              className={textStyle.warningIcon}
                              title="This is a contract address"
                            >
                              {data.isContract ? (
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                              ) : null}
                            </span>
                          </td> */}

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

              <div style={{ paddingBottom: "30px" }}>
                <div className={textStyle.titleforaccountsummarytextsame}>
                  <h2
                    style={{
                      padding: "10px",
                      letterSpacing: "1px",
                      fontSize: "20px",
                      fontWeight: "300",
                    }}
                  >
                    Account Summary
                  </h2>
                </div>
                <div id={textStyle.tableresponsive}>
                  <div
                    style={{
                      borderRadius: "20px",
                      border: "1px solid #8D37FB",
                    }}
                  >
                    <table
                      className={`${textStyle["showtokentablesametext"]} ${textStyle["tabletextlist"]}`}
                    >
                      <thead className={textStyle.tableheadertextlist}>
                        <tr
                          style={{
                            width: "100%",
                            margin: "0 auto",
                            borderRadius: "20px",
                          }}
                        >
                          <th className={textStyle.accountsummaryth}>
                            Total Amount(ETH)
                          </th>
                          <th className={textStyle.accountsummaryth}>
                            Total Amount(USD)
                          </th>
                          <th className={textStyle.accountsummaryth}>
                            Your Balance
                          </th>
                          <th className={textStyle.accountsummaryth}>
                            Remaining Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className={textStyle.tbodytextifyaccsum}>
                        <tr style={{ borderBottom: "1px solid #ffffff61" }}>
                          <td id={textStyle.fontsize10px}>
                            <div
                              id="font-size-10px"
                              className={textStyle.textAccSum}
                              style={{
                                width: "fit-content",
                                margin: "0 auto",
                                background: "transparent",
                                color: "#00FBFB",
                                border: "1px solid #00FBFB",
                                borderRadius: "10px",
                                padding: "10px 10px",
                                fontSize: "12px",
                                letterSpacing: "1px",
                              }}
                            >
                              {totalEth
                                ? `${(+ethers.utils.formatEther(
                                    totalEth
                                  )).toFixed(9)} ETH`
                                : null}
                            </div>
                          </td>
                          <td id={textStyle.fontsize10px}>
                            {" "}
                            <div
                              id={textStyle.fontsize10px}
                              style={{
                                width: "fit-content",
                                margin: "0 auto",
                                background: "transparent",
                                color: "#19F26F",
                                border: "1px solid #19F26F",
                                borderRadius: "10px",
                                padding: "10px 10px",
                                fontSize: "12px",
                                letterSpacing: "1px",
                              }}
                            >
                              {totalEth
                                ? `${(
                                    ethers.utils.formatUnits(totalEth, 18) *
                                    ethToUsdExchangeRate
                                  ).toFixed(2)} $`
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
                              {ethBalance
                                ? `${(+ethers.utils.formatEther(
                                    ethBalance
                                  )).toFixed(9)} ETH`
                                : null}
                            </div>
                          </td>
                          <td
                            id={textStyle.fontsize10px}
                            className={`showtoken-remaining-balance ${
                              remaining < 0
                                ? "showtoken-remaining-negative"
                                : ""
                            }`}
                          >
                            <div
                              id={textStyle.fontsize10px}
                              // className="font-size-12px"
                              style={{
                                width: "fit-content",
                                margin: "0 auto",
                                background:
                                  remaining < 0 ? "transparent" : "transparent",
                                color: remaining < 0 ? "red" : "#19F26F",
                                borderRadius: "10px",
                                padding: "10px 10px",
                                fontSize: "12px",
                                border:
                                  remaining < 0
                                    ? "1px solid red"
                                    : "1px solid #19F26F",
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
                <Modal
                  id={textStyle.popupwarning}
                  className={textStyle.popupforpayment}
                  isOpen={errorModalIsOpen}
                  onRequestClose={() => setErrorModalIsOpen(false)}
                  contentLabel="Error Modal"
                >
                  <Image src={warning} alt="none" width={100} height={100} />
                  <h2>Warning!</h2>
                  <p>{errormsg}</p>
                  <p>Please try different name</p>
                  <button onClick={() => setErrorModalIsOpen(false)}>
                    Close
                  </button>
                </Modal>
              </div>

              <div>
                <ExecuteEth
                  listData={listData}
                  setListData={setListData}
                  ethBalance={ethBalance}
                  totalEth={totalEth}
                  suffecientBalance={suffecientBalance}
                />
              </div>
            </div>
          ) : null}
        </>
      ) : (
        "Please Connect your Wallet to Proceed"
      )}
    </>
  );
}

export default SendEth;
