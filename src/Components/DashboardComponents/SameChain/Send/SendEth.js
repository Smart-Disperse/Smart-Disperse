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

function SendEth({ activeTab, listData, setListData }) {
  const [ethToUsdExchangeRate, setEthToUsdExchangeRate] = useState(null); //store ETH to USD exchange rate
  const [totalEth, setTotalEth] = useState(null); // store total amount of Ether in the transaction
  const [remaining, setRemaining] = useState(null); // store remaining amount after deducting already sent value
  const [ethBalance, setEthBalance] = useState(null); // store user's Ether balance
  const { address } = useAccount(); /*/gather account data for current user */
  const [loading, setLoading] = useState(false); //indicate whether a request is being processed or not
  const [labels, setLabels] = useState([]);

  const renderComponent = (tab) => {
    switch (tab) {
      case "text":
        return <Textify listData={listData} setListData={setListData} />;
      case "list":
        return <Listify listData={listData} setListData={setListData} />;
      case "csv":
        return <Uploadify listData={listData} setListData={setListData} />;
      default:
        return <Textify listData={listData} setListData={setListData} />;
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

  /* For getting the user Balance
   */
  const getEthBalance = async () => {
    const { ethereum } = window;
    if (!ethBalance) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      let ethBalance = await provider.getBalance(address);
      setEthBalance(ethBalance);
    }
  };

  const handleDeleteRow = (index) => {
    const updatedList = [...listData];
    updatedList.splice(index, 1);
    setListData(updatedList);
  };

  /*
  For Calculating the total amount of sending ETH
  */
  useEffect(() => {
    const calculateTotal = () => {
      let totalEth = ethers.BigNumber.from(0);
      if (listData.length > 0) {
        listData.forEach((data) => {
          // console.log(data);
          totalEth = totalEth.add(data.value);
        });
      }
      // console.log(totalEth);

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
    } else {
      setRemaining(null);
    }
  };

  useEffect(() => {
    calculateRemaining();
  });

  return (
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
                        <tr key={index}>
                          <td
                            id={textStyle.fontsize10px}
                            style={{ letterSpacing: "1px", padding: "8px" }}
                          >
                            {data.address}
                          </td>
                          <td
                            id={textStyle.fontsize10px}
                            style={{ letterSpacing: "1px", padding: "8px" }}
                          >
                            {data.label ? data.label : "----"}
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
                                background:
                                  "linear-gradient(269deg, #0FF 2.32%, #1BFF76 98.21%)",
                                color: "black",
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
                          <td id="font-size-10px" style={{ padding: "8px" }}>
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

                          <td style={{ letterSpacing: "1px", padding: "8px" }}>
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
                    Total Amount(ETH)
                  </th>
                  <th className={textStyle.accountsummaryth}>
                    Total Amount(USD)
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
                      {totalEth
                        ? `${(+ethers.utils.formatEther(totalEth)).toFixed(
                            9
                          )} ETH`
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

                        background:
                          "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                        color: "white",
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
                        ? `${(+ethers.utils.formatEther(ethBalance)).toFixed(
                            9
                          )} ETH`
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
                        background:
                          remaining < 0
                            ? "red"
                            : "linear-gradient(269deg, #0FF 2.32%, #1BFF76 98.21%)",
                        color: remaining < 0 ? "white" : "black",
                        borderRadius: "10px",
                        padding: "10px 10px",
                        fontSize: "12px",
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
      ) : null}
      <div>
        {listData.length > 0 ? (
          <ExecuteEth
            listData={listData}
            setListData={setListData}
            ethBalance={ethBalance}
            totalEth={totalEth}
            loading={loading}
            setLoading={setLoading}
          />
        ) : null}
      </div>
    </>
  );
}

export default SendEth;
