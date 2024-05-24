import { ethers } from "ethers";
import crossContracts from "./Contractaddresses";


export const smartDisperseCrossChainInstance = async (chainId) => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      throw new Error("Metamask is not installed, please install!");
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      crossContracts[chainId]["address"],
      crossContracts[chainId]["Abi"].abi,
      signer
    );

    console.log("contract instance", contract);

    return contract;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};
