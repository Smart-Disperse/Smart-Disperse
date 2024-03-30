"use client";
import React, { useState, useEffect } from "react";
import "driver.js/dist/driver.css";
import textStyle from "./Type/textify.module.css";
import SendEth from "./Send/SendEth";
import SendToken from "./Send/SendToken";

/*
Main Component : the prop is use to get which of the three from textify, listify or uplaodify should ne loaded
It will be handled further by sendEth or sendToken component
*/
function CrossChain({ activeTab }) {
  const [isSendingEth, setIsSendingEth] = useState(true);
  const [isSendingToken, setIsSendingToken] = useState(false);
  const [listData, setListData] = useState([]);

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
    // console.log("import token");
    setIsSendingToken(true);
    setListData([]);
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
              Choose Your Token, Define Your Destination
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
              <select id={textStyle.blockchainChains}>
                <option value="bitcoin">Select Token</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="ethereum">Ethereum</option>
                <option value="binance-smart-chain">Binance Smart Chain</option>
                <option value="solana">Solana</option>
                <option value="cardano">Cardano</option>
                <option value="ripple">Ripple</option>
                <option value="polkadot">Polkadot</option>
                <option value="tezos">Tezos</option>
                <option value="tron">Tron</option>
                <option value="eos">EOS</option>
              </select>
            </div>

            <div className={textStyle.importtokendiv}>
              <div style={{ margin: "10px 10px" }}>⇨</div>

              <select id={textStyle.blockchainChains}>
                <option value="bitcoin">Select Chain</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="ethereum">Ethereum</option>
                <option value="binance-smart-chain">Binance Smart Chain</option>
                <option value="solana">Solana</option>
                <option value="cardano">Cardano</option>
                <option value="ripple">Ripple</option>
                <option value="polkadot">Polkadot</option>
                <option value="tezos">Tezos</option>
                <option value="tron">Tron</option>
                <option value="eos">EOS</option>
              </select>
            </div>
          </div>

          {isSendingEth ? (
            <SendEth
              activeTab={activeTab}
              listData={listData}
              setListData={setListData}
            />
          ) : null}

          {isSendingToken ? (
            <SendToken
              activeTab={activeTab}
              listData={listData}
              setListData={setListData}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default CrossChain;
