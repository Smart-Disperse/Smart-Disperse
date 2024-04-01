import smartDisperseABI from "@/artifacts/contracts/SmartDisperse.sol/SmartDisperse.json";
import smartDisperseNew from "@/artifacts/contracts/CrossSender.sol/CrossSender.json";

const contracts = {
  919: {
    address: "0x7F72a40ECc94C3D1f5561492186A9EEA9c11C967",
    description: "SMART_DISPERSE_ADDRESS_TEST_MODE",
    "block-explorer": "sepolia.explorer.mode.network",
    Abi: smartDisperseABI,
    chainDisplayName: "Mode Testnet",
  },
  84532: {
    address: "0x05c106CaD72b04c09F228286fEd949eC6f9539a7",
    description: "SMART_DISPERSE_ADDRESS_TEST_BASE_SEPOLIA",
    "block-explorer": "base-sepolia.blockscout.com",
    Abi: smartDisperseNew,
    chainDisplayName: "Base Sepolia",
    APIURL:
      "https://api.studio.thegraph.com/query/67931/base-sepolia-subgraph/version/latest",
    chainName: "base-sepolia-testnet",
  },
  11155420: {
    address: "0x05c106CaD72b04c09F228286fEd949eC6f9539a7",
    description: "SMART_DISPERSE_ADDRESS_TEST_OP_SEPOLIA",
    "block-explorer": "optimism-sepolia.blockscout.com",
    Abi: smartDisperseNew,
    chainDisplayName: "Optimism Sepolia",
    APIURL:
      "https://api.studio.thegraph.com/query/67931/op-sepolia-subgraph/version/latest",
    chainName: "optimism-sepolia",
  },
  534351: {
    address: "0x6840cE9FD1eae47a94cF0d0f8571D048D9281c81",
    description: "SMART_DISPERSE_ADDRESS_TEST_SCROLL_SEPOLIA",
    "block-explorer": "sepolia.scrollscan.dev",
    Abi: smartDisperseNew,
    chainDisplayName: "Scroll Sepolia",
    APIURL:
      "https://api.studio.thegraph.com/query/67916/smartdisperse-scroll-sepolia/version/latest",
    chainName: "scroll-sepolia-testnet",
  },
  11155111: {
    address: "0xfaa54D2c30D57d2d72c71201d288Ed6E4Ed86622",
    description: "SMART_DISPERSE_ADDRESS_TEST_ETHEREUM_SEPOLIA",
    "block-explorer": "sepolia.etherscan.io",
    Abi: smartDisperseNew,
    chainDisplayName: "Ethereum Sepolia",
    APIURL:
      "https://api.studio.thegraph.com/query/67931/ethereum-sepolia-subgraph/version/latest",
    chainName: "eth-sepolia",
  },
  34443: {
    address: "0xB6B3c210d51B26f990168fEd5dff970E169d34C1",
    description: "SMART_DISPERSE_ADDRESS_MAIN_MODE",
    "block-explorer": "explorer.mode.network",
    Abi: smartDisperseABI,
    chainDisplayName: "Mode Mainnet",
  },

  534352: {
    address: "0xB6B3c210d51B26f990168fEd5dff970E169d34C1",
    description: "SMART_DISPERSE_ADDRESS_MAIN_SCROLL",
    "block-explorer": "scrollscan.com",
    Abi: smartDisperseNew,
    chainDisplayName: "Scroll Mainnet",
    chainName: "scroll-mainnet",
  },
  8453: {
    address: "0x8142e9CeACD37Bfa1B87E524D034e80D26CA8409",
    description: "SMART_DISPERSE_ADDRESS_MAIN_BASE",
    "block-explorer": "basescan.org",
    Abi: smartDisperseNew,
    chainDisplayName: "Base Mainnet",
    chainName: "base-mainnet",
  },
  10 : {
    address: "0x8142e9CeACD37Bfa1B87E524D034e80D26CA8409",
    description: "SMART_DISPERSE_ADDRESS_MAIN_OPTIMISM",
    "block-explorer": "optimistic.etherscan.io",
    Abi: smartDisperseNew,
    chainDisplayName: "Optimism Mainnet",
    chainName: "optimism-mainnet",
  }
};

export default contracts;
