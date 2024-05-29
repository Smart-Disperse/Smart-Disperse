import SmartDisperseCrossChain from "@/artifacts/crosschain/MultipleDestinationABI.json";

const crossContracts = {
  11155111: {
    address: "0x147914414C2F1dbAA3EAe6E16F0423d2A8b2E6Bb",
    description: "SMART_DISPERSE_ADDRESS_TEST_ETHEREUM_SEPOLIA",
    "block-explorer": "sepolia.etherscan.io",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "sepolia",
  },
  11155420: {
    address: "0xc1527e883791043996cC445a1f0A004Ab9F6B48a",
    description: "SMART_DISPERSE_ADDRESS_TEST_OP_SEPOLIA",
    "block-explorer": "optimism-sepolia.blockscout.com",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "Optimism Sepolia",
    chainName: "opSepolia",
  },
  84532: {
    address: "0x31CB776486812C8d24cF04e6A124f263e9CCA4e0",  
    description: "SMART_DISPERSE_ADDRESS_TEST_BASE_SEPOLIA",
    "block-explorer": "base-sepolia.blockscout.com",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "Base Sepolia",
    chainName: "baseSepolia",
  },
  421614: {
    address: "0x1859E66C6FCF273d7c37A049A79165Ef54F24B95",
    description: "SMART_DISPERSE_ADDRESS_TEST_ARBITRUM_SEPOLIA",
    "block-explorer": "https://sepolia.arbiscan.io",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "Arbitrum Sepolia",
    chainName: "arbSepolia",
  },
  80002: {
    address: "0x82ba4A0Eb6c0c706fF0e803207122C7168F34537",
    description: "SMART_DISPERSE_ADDRESS_TEST_POLYGON_AMOY",
    "block-explorer": "https://amoy.polygonscan.com",
    Abi: SmartDisperseCrossChain,
    chainDisplayName: "Polygon Amoy",
    chainName: "amoy",
  },
};

export default crossContracts;
