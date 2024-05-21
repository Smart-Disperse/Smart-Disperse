import SmartDisperseCrossChain from "@/artifacts/crosschain/SmartDisperseCrossChain.json";

const crossContracts = {
  11155111: {
    address: "0x17711e4Dd37b4680FEEd3Bb85A6520A285E51192",
    description: "SMART_DISPERSE_ADDRESS_TEST_ETHEREUM_SEPOLIA",
    "block-explorer": "sepolia.etherscan.io",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "sepolia",
  },
  11155420: {
    address: "0x510D3ed32DEDe97Bca3391154EfFf15c058170f1",
    description: "SMART_DISPERSE_ADDRESS_TEST_OP_SEPOLIA",
    "block-explorer": "optimism-sepolia.blockscout.com",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "Optimism Sepolia",
    chainName: "opSepolia",
  },
  84532: {
    address: "0x92e96bf48ed9364284556b6400c3e6367c50ac33",  
    description: "SMART_DISPERSE_ADDRESS_TEST_BASE_SEPOLIA",
    "block-explorer": "base-sepolia.blockscout.com",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "Base Sepolia",
    chainName: "baseSepolia",
  },
  421614: {
    address: "0x07C918C364d175629410DA3df7de4637eA0bc851",
    description: "SMART_DISPERSE_ADDRESS_TEST_ARBITRUM_SEPOLIA",
    "block-explorer": "https://sepolia.arbiscan.io",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "Arbitrum Sepolia",
    chainName: "arbSepolia",
  },
  80002: {
    address: "0xc3A8870A459a7a8160611B126750C5F50C38997C",
    description: "SMART_DISPERSE_ADDRESS_TEST_POLYGON_AMOY",
    "block-explorer": "https://amoy.polygonscan.com",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "Polygon Amoy",
    chainName: "amoy",
  },
};

export default crossContracts;
