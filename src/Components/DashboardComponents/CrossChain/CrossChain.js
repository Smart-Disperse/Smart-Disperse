import React, { useState, useEffect } from "react";
import "driver.js/dist/driver.css";
import textStyle from "./Type/textify.module.css";
import SendToken from "./Send/SendToken";
import allchains from "@/Helpers/CrosschainHelpers/ChainSelector";
import { useAccount, useChainId } from "wagmi";
import connectStyle from "@/Components/ConnectButton/connect.module.css";
import CustomDropdown from "./Type/CustomDropDown";

function CrossChain({ activeTab }) {
  const [listData, setListData] = useState([]);
  const { address } = useAccount();
  const [connectedChain, setConnectedChain] = useState(null);
  const [destinationChainsOptions, setDestinationChainsOptions] = useState([]);
  const [selectedDestinationChain, setSelectedDestinationChain] =
    useState(null);
  const [tokenOptions, setTokenOptions] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const chainId = useChainId();

  const getChainsForDropDown = () => {
    try {
      const chainDetails = allchains[chainId];
      if (!chainDetails) {
        throw new Error(`Chain details for chainId ${chainId} are undefined.`);
      }

      console.log(chainDetails);
      const options = Object.entries(chainDetails.destinationChains).map(
        ([name, details]) => ({
          name,
          iconUrl: details.iconUrl,
        })
      );
      setDestinationChainsOptions(options);
    } catch (error) {
      console.error(error.message);
      setDestinationChainsOptions([]);
    }
  };

  useEffect(() => {
    getChainsForDropDown();
  }, [address, chainId]);

  const handleDestinationChainChange = (selectedChain) => {
    console.log(selectedChain);
    setTokenAddress("");
    setSelectedToken(null);
    const selectedChainName = selectedChain.name;
    const chainDetails = allchains[chainId];
    const selectedChainDetails =
      chainDetails.destinationChains[selectedChainName];

    setSelectedDestinationChain(selectedChain);

    console.log(selectedChainDetails);

    if (selectedChainDetails) {
      setErrorMessage("");
      const tokenOptions = Object.entries(selectedChainDetails.tokens).map(
        ([key, value]) => ({
          name: key,
          address: value,
          iconUrl:
            "https://s2.coinmarketcap.com/static/img/coins/200x200/3408.png",
        })
      );

      setTokenOptions(tokenOptions);
    } else {
      setTokenOptions([]);
    }
  };

  const handleDestinationTokenChange = (selectedToken) => {
    if (!selectedDestinationChain) {
      setErrorMessage("Please select a destination chain first.");
    } else {
      setSelectedToken(selectedToken);
      setTokenAddress(selectedToken.address);
      setErrorMessage(""); // Clear error message when a token is selected
    }
 
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
                fontWeight: "300",
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
              <CustomDropdown
              className={textStyle.dropdownbtn}
                options={destinationChainsOptions}
                onSelect={handleDestinationChainChange}
                selectedValue={selectedDestinationChain}
                placeholder="Select destination chain"
              />
            </div>

            <div className={textStyle.importtokendiv}>
              <div style={{ margin: "10px 10px" }}>⇨</div>
              {/* Dropdown of tokens */}
              <CustomDropdown
                options={tokenOptions}
                onSelect={handleDestinationTokenChange}
                selectedValue={selectedToken}
                placeholder="Select token"
              />
            </div>
            {errorMessage && (
  <div className={textStyle.errorMessage}>
    {errorMessage}
  </div>
)}

          </div>

          <SendToken
            activeTab={activeTab}
            listData={listData}
            setListData={setListData}
            tokenAddress={tokenAddress}
            selectedDestinationChain={selectedDestinationChain}
          />
        </div>
      </div>
    </>
  );
}

export default CrossChain;
