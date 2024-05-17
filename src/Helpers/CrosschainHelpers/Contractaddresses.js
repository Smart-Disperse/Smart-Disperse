import SmartDisperseCrossChain from "@/artifacts/crosschain/SmartDisperseCrossChain.json";

const crossContracts = {
    11155111: {
      address: "0x2455CB6746709da7dAb064e7302EfEcF86705077",
      description: "SMART_DISPERSE_ADDRESS_TEST_ETHEREUM_SEPOLIA",
      "block-explorer": "sepolia.etherscan.io",
      Abi: SmartDisperseCrossChain,
      chainDisplayName: "Sepolia-Testnet",
    },
    11155420: {
        address: "0x74bEDd44a248ef781A57c6e8e962BbF70B331E8f",
        description: "SMART_DISPERSE_ADDRESS_TEST_OP_SEPOLIA",
        "block-explorer": "optimism-sepolia.blockscout.com",
        Abi: SmartDisperseCrossChain,
        chainDisplayName: "Optimism Sepolia",
        chainName: "optimism-sepolia",
      },
      84532: {
        address: "0x9A3130d9eb4b736991F1302Dd73ab313CF276AFc",
        description: "SMART_DISPERSE_ADDRESS_TEST_BASE_SEPOLIA",
        "block-explorer": "base-sepolia.blockscout.com",
        Abi: SmartDisperseCrossChain,
        chainDisplayName: "Base Sepolia",
        chainName: "base-sepolia-testnet",
      },
      421614: {
        address: "0xac4926089be8B37fF774F25A907015FB65Ad61B2",
        description: "SMART_DISPERSE_ADDRESS_TEST_ARBITRUM_SEPOLIA",
        "block-explorer": "https://sepolia.arbiscan.io",
        Abi: SmartDisperseCrossChain,
        chainDisplayName: "Arbitrum Sepolia",
        chainName: "arbitrum-sepolia-testnet",
      },
      80002: {
        address: "0xac4926089be8B37fF774F25A907015FB65Ad61B2",
        description: "SMART_DISPERSE_ADDRESS_TEST_POLYGON_AMOY",
        "block-explorer": "https://amoy.polygonscan.com",
        Abi: SmartDisperseCrossChain,
        chainDisplayName: "Polygon Amoy",
        chainName: "polygon-amoy-testnet",
      },
}

export default crossContracts;