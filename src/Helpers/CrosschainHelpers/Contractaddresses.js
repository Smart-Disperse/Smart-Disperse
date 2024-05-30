import SmartDisperseCrossChain from "@/artifacts/crosschain/MultipleDestinationABI.json";

const crossContracts = {
  11155111: {
    address: "0x568ABafeCaB14144D63357D694d9c3155F6e8b3b",
    description: "SMART_DISPERSE_ADDRESS_TEST_ETHEREUM_SEPOLIA",
    "block-explorer": "sepolia.etherscan.io",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "sepolia",
    APIURL: "https://api.studio.thegraph.com/query/76606/sepolia-multiplechain/version/latest"
  },
  11155420: {
    address: "0x06125C0a106Cd2aBEC11Ca1Dc28804790A91325C",
    description: "SMART_DISPERSE_ADDRESS_TEST_OP_SEPOLIA",
    "block-explorer": "optimism-sepolia.blockscout.com",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "Optimism Sepolia",
    chainName: "opSepolia",
    APIURL : "https://api.studio.thegraph.com/query/76606/opsepolia-multichain/version/latest"
  },
  84532: {
    address: "0xc8b9945C14996501212f289f57009e4e73ebD7a5",  
    description: "SMART_DISPERSE_ADDRESS_TEST_BASE_SEPOLIA",
    "block-explorer": "base-sepolia.blockscout.com",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "Base Sepolia",
    chainName: "baseSepolia",
    APIURL : "https://api.studio.thegraph.com/query/76606/basesepolia-multichain/version/latest"
  },
  421614: {
    address: "0x49Ecf740b68473191569a2308Bf34a3F56CE5923",
    description: "SMART_DISPERSE_ADDRESS_TEST_ARBITRUM_SEPOLIA",
    "block-explorer": "https://sepolia.arbiscan.io",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "Arbitrum Sepolia",
    chainName: "arbSepolia",
    APIURL : "https://api.studio.thegraph.com/query/76606/arbsepolia-multichain/version/latest"
  },
  80002: {
    address: "0xB886ec515BB2BEf33508561804C144BA785b876c",
    description: "SMART_DISPERSE_ADDRESS_TEST_POLYGON_AMOY",
    "block-explorer": "https://amoy.polygonscan.com",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "Polygon Amoy",
    chainName: "amoy",
    APIURL : "https://api.studio.thegraph.com/query/76606/amoy-multichain/version/latest"
  },
};

export default crossContracts;
