"use client";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { ethers } from "ethers";
import "driver.js/dist/driver.css";
import textStyle from "./textify.module.css";
import SendEth from "../../Components/DashboardComponents/SendEth";

/*
Funtion :Storing value for more personalization
*/
const useLocalStorage = (key, initialValue = "") => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? storedValue : initialValue;
  });
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

/*
Main Component : the prop is use to get which of the three from textify, listify or uplaodify should ne loaded
It will be handled further by sendEth or sendToken component
*/
function SameChain({ activeTab }) {
  const [isSendingEth, setIsSendingEth] = useState(false);
  const [isSendingToken, setIsSendingToken] = useState(false);
  const [textValue, setTextValue] = useLocalStorage("textValue", "");
  const [listData, setListData] = useState([]);

  /*
  UseEffect :For updating user Input in the textbox for adding  Recipient address and value
  */

  useEffect(() => {
    console.log(textValue);
    parseText(textValue);
  }, [textValue]);

  /*
  Funtion : for parsing and validation the value received from user Input and store
  it in our desired format for Showing in Transaction Lineup
  */
  const parseText = async (textValue) => {
    const lines = textValue.split("\n").filter((line) => line.trim() !== "");

    let updatedRecipients = [];
    lines.forEach((line) => {
      const [address, value] = line.split(/[,= \t]+/);
      console.log(typeof value);
      const validValue = isValidValue(value);

      if (isValidAddress(address) && validValue) {
        updatedRecipients.push({
          address,
          value: validValue,
        });
      }
    });

    setListData(updatedRecipients);
    console.log(updatedRecipients);
  };

  /*
  Funtion : for checking if the value is in correct format and 
  can be added to the listData for transaction lineup
  */
  const isValidValue = (value) => {
    try {
      // regex to check if the value starts from digits 0-9
      if (!/^\d/.test(value)) {
        value = value.slice(1);
      }
      return ethers.utils.parseUnits(value, "ether");
    } catch (err) {
      // console.log(err);
      return false;
    }
  };

  /*
  Funtion : for checking if it is an EOA address
  */
  const isValidAddress = (address) => ethers.utils.isAddress(address);

  /*
  Funtion : To load SendEth component
  */
  const handleSendEthbuttonClick = () => {
    setIsSendingEth(true);
    setIsSendingToken(false);
  };

  /*
  Funtion : To load SendToken component
  */

  const handleImporttokenbuttonClick = () => {
    setIsSendingToken(true);
    setIsSendingEth(false);
  };

  return (
    <>
      <div className={textStyle.divtocoversametextdiv}>
        <div className={textStyle.divforwholetoken}>
          <div className={textStyle.titleloadtokensametext}>
            <h2
              style={{
                padding: "10px",
                letterSpacing: "1px",
                fontSize: "20px",
                margin: "0px",
                fontWeight: "700",
              }}
            >
              Select or Import Token you want to Disperse
            </h2>
          </div>
          <div
            id="seend-eth"
            style={{
              padding: "30px 20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={textStyle.sametextmain}
          >
            <div id="send-eth" className={textStyle.sendethdiv}>
              <button
                id={isSendingEth ? textStyle.truee : textStyle.falsee}
                className={textStyle.buttontoaddformdata}
                onClick={handleSendEthbuttonClick}
              >
                Send Eth
              </button>
            </div>

            <div className={textStyle.importtokendiv}>
              <div style={{ margin: "10px 0px" }}>OR</div>

              <button
                style={{
                  backgroundColor: isSendingEth ? "" : "white",
                  color: isSendingEth ? "" : "#924afc",
                }}
                className={textStyle.buttontoaddformdataunload}
                onClick={handleImporttokenbuttonClick}
              >
                Import Token
              </button>
            </div>
          </div>

          {isSendingEth ? (
            <SendEth
              activeTab={activeTab}
              setTextValue={setTextValue}
              textValue={textValue}
              listData={listData}
            />
          ) : null}

          {isSendingToken ? (
            <SendEth
              activeTab={activeTab}
              setTextValue={setTextValue}
              textValue={textValue}
              listData={listData}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default SameChain;
