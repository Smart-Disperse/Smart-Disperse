import { ethers } from "ethers";
import contracts from "@/Helpers/ContractAddresses.js";

export const smartDisperseInstance = async (chainId) => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      throw new Error("Metamask is not installed, please install!");
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      contracts[chainId]["address"],
      contracts[chainId]["Abi"].abi,
      signer
    );

    // console.log(contract);
    return contract;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};
