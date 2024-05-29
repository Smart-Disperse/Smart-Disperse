import React, { useState, useEffect } from "react";
import "driver.js/dist/driver.css";
import textStyle from "./Type/textify.module.css";
// import SendEth from "./Send/SendEth";
import SendToken from "./Send/SendToken";
import { getChain } from "@/Helpers/GetChain";
import { useAccount } from "wagmi";
import crossContracts from "@/Helpers/CrosschainHelpers/Contractaddresses";
import allchains from "@/Helpers/CrosschainHelpers/ChainSelector";
import { useChainId } from "wagmi";
import connectStyle from "@/Components/ConnectButton/connect.module.css";

function CrossChain({ activeTab }) {
  // const [isSendingEth, setIsSendingEth] = useState(true);
  // const [isSendingToken, setIsSendingToken] = useState(false);
  const [listData, setListData] = useState([]);
  const { address } = useAccount();
  const [connectedChain, setConnectedChain] = useState(null);
  const [destinationChainsOptions, setDestinationChainsOptions] = useState([]);
  const [selectedDestinationChain, setSelectedDestinationChain] =
    useState(null);
  const [tokenOptions, setTokenOptions] = useState([]);
  const [SelectedToken, setSelectedToken] = useState(null);
  const [chainSelector, setChainSelector] = useState([]);
  const [receivingChainAddress, setReceivingChainAddress] = useState([]);
  const [tokenAddress, setTokenAddress] = useState("");
  const [destinationchainName, setdestinationchainName] = useState("");
  const chainId = useChainId();

  const getChainsForDropDown = () => {
    try {
      const chainDetails = allchains[chainId];
      if (!chainDetails) {
        throw new Error(`Chain details for chainId ${chainId} are undefined.`);
      }

      console.log(chainDetails);
      const options = Object.entries(chainDetails.destinationChains).map(
        ([name,details]) => (
          <option key={name} value={name}>
            {console.log(details.iconUrl)}
            <div>

            <img
            src={details.iconUrl}
            alt={name}
            className={connectStyle.logo}
            />
            {name}
            </div>
          </option>
        )
      );
      setDestinationChainsOptions(options);
    } catch (error) {
      console.error(error.message);
      setDestinationChainsOptions([
        <option key="connect" value="">
          Connect to network
        </option>,
      ]);
    }
  };

  useEffect(() => {
    getChainsForDropDown();
  }, [address, chainId]);

  const handleDestinationChainChange = (e) => {
    setTokenAddress("");
    setSelectedToken("");
    const selectedChainName = e.target.value;
    console.log(selectedChainName);
    setdestinationchainName(selectedChainName);
    console.log(destinationchainName);
    const chainDetails = allchains[chainId];
    const selectedChain = chainDetails.destinationChains[selectedChainName];
    console.log(selectedChain);
    setSelectedDestinationChain(selectedChainName);
    if (selectedChain) {
      const tokenOptions = Object.entries(selectedChain.tokens).map(
        ([key, value]) => (
          <option key={value} value={value}>
            {key}
          </option>
        )
      );
      console.log(tokenOptions);
      const chainSelectorArray = Array.isArray(selectedChain.chainSelector)
        ? selectedChain.chainSelector
        : [selectedChain.chainSelector];
      console.log("array of chainselector", chainSelectorArray);
      // setChainSelector(chainSelectorArray);
      const ReceiverAddressArray = Array.isArray(selectedChain.receiverAddress)
        ? selectedChain.receiverAddress
        : [selectedChain.receiverAddress];
      console.log("array of ReceiverAddress", ReceiverAddressArray);
      // setReceivingChainAddress(ReceiverAddressArray);
      setTokenOptions(tokenOptions);
    } else {
      setTokenOptions([]);
    }
  };

  const handleDestinationTokenChnage = (e) => {
    const selectedToken = e.target.value;
    console.log(selectedToken);
    console.log(typeof selectedToken);
    const selectedKey = e.target.selectedOptions[0].getAttribute("data-key");
    setSelectedToken(selectedKey);
    setTokenAddress(selectedToken);
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
                fontWeight: "200",
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
              {/* Dropdown of chains */}
              <select
                id={textStyle.blockchainChains}
                onChange={handleDestinationChainChange}
                value={selectedDestinationChain}
              >
                <option value="">Select destination chain</option>
                {destinationChainsOptions}
              </select>
            </div>

            <div className={textStyle.importtokendiv}>
              <div style={{ margin: "10px 10px" }}>⇨</div>
              {/* Dropdown of tokens */}
              <select
                id={textStyle.blockchainChains}
                onChange={handleDestinationTokenChnage}
                value={SelectedToken}
              >
                <option value="">Select token</option>
                {tokenOptions}
              </select>
            </div>
          </div>

          <SendToken
            activeTab={activeTab}
            listData={listData}
            setListData={setListData}
            tokenAddress={tokenAddress}
            destinationchainName={destinationchainName}
            chainSelector={chainSelector}
            receivingChainAddress={receivingChainAddress}
            setReceivingChainAddress={setReceivingChainAddress}
            setChainSelector={setChainSelector}
          />
        </div>
      </div>
    </>
  );
}

export default CrossChain;
