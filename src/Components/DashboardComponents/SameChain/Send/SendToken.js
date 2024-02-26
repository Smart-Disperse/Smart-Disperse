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
import ExecuteToken from "../Execute/ExecuteToken";
import { LoadToken } from "@/Helpers/LoadToken.js";

function SendToken({ activeTab, listData, setListData }) {
  const [ethToUsdExchangeRate, setEthToUsdExchangeRate] = useState(null);
  const [totalERC20, setTotalERC20] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [ERC20Balance, setERC20Balance] = useState(null);
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [isTokenLoaded, setTokenLoaded] = useState(false);
  const defaultTokenDetails = {
    name: null,
    symbol: null,
    balance: null,
    decimal: null,
  };
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  const renderComponent = (tab) => {
    switch (tab) {
      case "text":
        return (
          <Textify
            listData={listData}
            setListData={setListData}
            tokenDecimal={tokenDetails.decimal}
          />
        );
      case "list":
        return (
          <Listify
            listData={listData}
            setListData={setListData}
            tokenDecimal={tokenDetails.decimal}
          />
        );
      case "csv":
        return (
          <Uploadify
            listData={listData}
            setListData={setListData}
            tokenDecimal={tokenDetails.decimal}
          />
        );
      default:
        return <Textify listData={listData} setListData={setListData} />;
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
        console.log(typeof data.USD);

        console.log("data here", data.USD);
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

  const handleDeleteRow = (index) => {
    const updatedList = [...listData];
    updatedList.splice(index, 1);
    setListData(updatedList);
  };

  const loadToken = async () => {
    setRemaining(null);
    setTotalERC20(null);
    setListData([]);
    if (customTokenAddress === "") {
      //   setErrorMessage(`Please Add token Address`);
      //   setErrorModalIsOpen(true);
      return;
    }

    setTokenDetails(defaultTokenDetails);

    try {
      const tokenDetails = await LoadToken(customTokenAddress, address);
      console.log(tokenDetails);
      if (tokenDetails) {
        setTokenDetails(tokenDetails);
        setERC20Balance(tokenDetails.balance);

        setTokenLoaded(true);
      }

      // textifytour();
    } catch (error) {
      console.log(error);
    }
  };

  const unloadToken = async () => {
    setTokenDetails(defaultTokenDetails);
    setRemaining(null);
    setTotalERC20(null);
    setTokenLoaded(false);
    setListData([]);
  };

  const handleInputTokenAddressChange = (e) => {
    const inputValue = e.target.value;

    const isValidInput = /^[a-zA-Z0-9]+$/.test(inputValue);

    if (isValidInput || inputValue === "") {
      setCustomTokenAddress(inputValue);
    }
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
  }, [listData]);

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

  useEffect(() => {
    calculateRemaining();
  }, []);

  return (
    <>
      {isTokenLoaded ? (
        <div>
          <div className={textStyle.accountsummarycreatetitle}>
            <h2
              style={{
                padding: "10px",
                fontSize: "20px",
                margin: "0px",
                letterSpacing: "1px",
                fontWeight: "700",
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
              padding: "10px",
              border: "1px solid #ddd",
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
        </div>
      ) : null}
      {isTokenLoaded ? renderComponent(activeTab) : null}

      <div>
        <div
          style={{
            marginBottom: "10px ",
          }}
          className={textStyle.accountsummarycreatetitle}
        >
          <h2
            style={{
              padding: "10px",
              fontSize: "20px",
              margin: "0px",
              letterSpacing: "1px",
              fontWeight: "700",
            }}
          >
            Load Your Token
          </h2>
        </div>

        <div
          className={textStyle.entertokenaddress}
          style={{ padding: "20px" }}
        >
          <label style={{ margin: "5px" }}>Enter Token Address: </label>
          <input
            id="input-token-load"
            type="text"
            className={`${textStyle["eachinputofcreatelist"]} ${textStyle["tokeninput"]}`}
            placeholder="Enter token Address"
            value={customTokenAddress}
            onChange={(e) => handleInputTokenAddressChange(e)}
            style={{
              borderRadius: "5px",
              border: "1px solid #fff",
              background:
                "linear-gradient(90deg, rgba(97, 38, 193, 0.58) 0.06%, rgba(63, 47, 110, 0.58) 98.57%)",
              padding: "10px 20px",
              margin: "0px 20px",
              color: "white",
            }}
          />
          {isTokenLoaded ? (
            <button
              id={textStyle.backgroundgreen}
              className={textStyle.buttontaddformdataunload}
              onClick={() => {
                unloadToken();
              }}
            >
              Unload Token
            </button>
          ) : (
            <button
              id={textStyle.backgroundgreen}
              className={textStyle.buttontoaddformdata}
              onTouchStart={() => {
                loadToken();
              }}
              onClick={() => {
                loadToken();
              }}
            >
              Load Token
            </button>
          )}
        </div>
      </div>

      {isTokenLoaded && listData.length > 0 ? (
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
                      Amount({tokenDetails.symbol})
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
                            {data.address}
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
                              {(+ethers.utils.formatUnits(
                                data.value,
                                tokenDetails.decimal
                              )).toFixed(4)}{" "}
                              {tokenDetails.symbol}
                            </div>
                          </td>
                          {/* <td id="font-size-10px" style={{ padding: "8px" }}>
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
                    Total Amount({tokenDetails.symbol})
                  </th>
                  {/* <th className={textStyle.accountsummaryth}>
                    Total Amount(USD)
                  </th> */}
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
                  {/* <td id={textStyle.fontsize10px}>
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
                      {totalERC20
                        ? `${(
                            ethers.utils.formatUnits(totalERC20, 18) *
                            ethToUsdExchangeRate
                          ).toFixed(2)} $`
                        : null}
                    </div>
                  </td> */}
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
          <ExecuteToken
            listData={listData}
            setListData={setListData}
            ERC20Balance={ERC20Balance}
            totalERC20={totalERC20}
            loading={loading}
            setLoading={setLoading}
            tokenDetails={tokenDetails}
            customTokenAddress={customTokenAddress}
          />
        ) : null}
      </div>
    </>
  );
}

export default SendToken;
