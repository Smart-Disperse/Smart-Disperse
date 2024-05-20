import React, { useState, useEffect } from "react";
import "driver.js/dist/driver.css";
import textStyle from "./Type/textify.module.css";
// import SendEth from "./Send/SendEth";
import SendToken from "./Send/SendToken";
import { getChain } from "@/Helpers/GetChain";
import { useAccount } from "wagmi";

function CrossChain({ activeTab }) {
  // const [isSendingEth, setIsSendingEth] = useState(true);
  // const [isSendingToken, setIsSendingToken] = useState(false);
  const [listData, setListData] = useState([]);
  const { address } = useAccount();
  const [connectedChain, setConnectedChain] = useState(null);
  const [destinationChainsOptions, setDestinationChainsOptions] = useState([]);
  const [selectedDestinationChain, setSelectedDestinationChain] = useState(null);
  const [tokenOptions, setTokenOptions] = useState([]);
  const [SelectedTokenUSDC, setSelectedTokenUSDC] = useState('');
  const [Chainselector, setChainSelector] = useState('')

  const allchains = [
    {
      chainName: "sepolia",
      chainSelector: "16015286601757825753",
      destinationChains: ["opSepolia", "baseSepolia", "arbSepolia", "amoy"],
      tokens: {
        usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      },
    },
    {
      chainName: "opsepolia",
      chainSelector: "5224473277236331295",
      destinationChains: ["sepolia", "baseSepolia", "arbSepolia", "amoy"],
      tokens: {
        usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
      },
    },
    {
      chainName: "basesepolia",
      chainSelector: "10344971235874465080",
      destinationChains: ["sepolia", "opSepolia", "arbSepolia"],
      tokens: {
        usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      },
    },
    {
      chainName: "arbitrumsepolia",
      chainSelector: "3478487238524512106",
      destinationChains: ["sepolia", "opSepolia", "baseSepolia"],
      tokens: {
        usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
      },
    },
    {
      chainName: "amoy",
      chainSelector: "16281711391670634445",
      destinationChains: ["sepolia", "opSepolia"],
      tokens: {
        usdc: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
      },
    },
  ];
  
  useEffect(() => {
    const fetchChain = async () => {
      console.log("Getting chain...");
      const currentChainId = await getChain(); 
      console.log("Current chain ID:", currentChainId);

      const networkObj = {
        "11155111": "sepolia",
        "11155420": "opsepolia",
        "84532": "basesepolia",
        "421614": "arbitrumsepolia",
        "80002": "amoy",
      };
      const currentChainName = networkObj[currentChainId];
      const connectedChain = currentChainName ? currentChainName : null;

      console.log("Current chain name:", connectedChain);

      if (connectedChain) {
        setConnectedChain(connectedChain);
        const connectedChainInfo = allchains.find(
          (chain) => chain.chainName === connectedChain
        );
        console.log("Connected chain info:", connectedChainInfo);
        console.log("chain Selector:",connectedChainInfo.chainSelector)
        setChainSelector(connectedChainInfo.chainSelector);
        if (connectedChainInfo) {
          const options = connectedChainInfo.destinationChains.map((chain) => (
            <option key={chain} value={chain}>
              {chain}
            </option>
          ));
          setDestinationChainsOptions(options);
        }
      }
    };

    fetchChain();
  }, [address]);

  const handleSendEthbuttonClick = () => {
    setIsSendingEth(true);
    setIsSendingToken(false);
  };

  const handleImporttokenbuttonClick = () => {
    // console.log("import token");
    setIsSendingToken(true);
    setListData([]);
    setIsSendingEth(false);
  };

  const handleDestinationChainChange = (e) => {
    const selectedChain = e.target.value;
    setSelectedDestinationChain(selectedChain);
  console.log(selectedChain);
    // Find the selected destination chain and get its tokens
    const connectedChainInfo = allchains.find(
      (chain) => chain.chainName === connectedChain
    );
    console.log(connectedChainInfo);
  
    if (connectedChainInfo) {
      const tokens = connectedChainInfo.tokens;
      console.log(tokens.usdc)
      setSelectedTokenUSDC(tokens.usdc)
      if (tokens) {
        const tokenOptions = Object.entries(tokens).map(([key, value]) => (
          <option key={value} value={value}>
            {key}
          </option>
        ));
        console.log(tokenOptions)
        setTokenOptions(tokenOptions);
      } else {
        setTokenOptions([]);
      }
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
              <select id={textStyle.blockchainChains}>
                <option value="">Select token</option>
                {tokenOptions}
              </select>
            </div>
          </div>

          {/* {isSendingEth ? (
            <SendEth
              activeTab={activeTab}
              listData={listData}
              setListData={setListData}
              selectedDestinationChain={selectedDestinationChain}
            />
          ) : null} */}

          {/* {isSendingToken ? ( */}
            <SendToken
              activeTab={activeTab}
              listData={listData}
              setListData={setListData}
              destinationChainsOptions={destinationChainsOptions}
              SelectedTokenUSDC={SelectedTokenUSDC}
              selectedDestinationChain={selectedDestinationChain}
              Chainselector={Chainselector}
            />
          {/* ) : null} */}
        </div>
      </div>
    </>
  );
}

export default CrossChain;
