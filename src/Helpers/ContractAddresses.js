import smartDisperseABI from "@/artifacts/contracts/SmartDisperse.sol/SmartDisperse.json";
import crossSendABI from "@/artifacts/contracts/CrossSender.sol/CrossSender.json";

const contracts = {
  919: {
    address: "0x7F72a40ECc94C3D1f5561492186A9EEA9c11C967",
    description: "SMART_DISPERSE_ADDRESS_TEST_MODE",
    "block-explorer": "sepolia.explorer.mode.network",
    Abi: smartDisperseABI,
  },
  34443: {
    address: "0xB6B3c210d51B26f990168fEd5dff970E169d34C1",
    description: "SMART_DISPERSE_ADDRESS_MAIN_MODE",
    "block-explorer": "explorer.mode.network",
    Abi: smartDisperseABI,
  },
  534351: {
    address: "0xC67241F4c2e62Ef01DAE09404B31470F97390694",
    description: "SMART_DISPERSE_ADDRESS_TEST_SCROLL",
    "block-explorer": "sepolia.scrollscan.dev",
    Abi: crossSendABI,
  },
  534352: {
    address: "0xB6B3c210d51B26f990168fEd5dff970E169d34C1",
    description: "SMART_DISPERSE_ADDRESS_MAIN_SCROLL",
    "block-explorer": "scrollscan.com",
    Abi: crossSendABI,
  },
};

export default contracts;
