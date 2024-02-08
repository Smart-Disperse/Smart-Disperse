import axios from "axios";
import ContractAddress from "../Helpers/ContractAddresses.json";
import { ethers } from "ethers";

export const getSentTransaction = async (address) => {
  return new Promise(async (resolve, reject) => {
    // Define the parameters
    var sourceContractAddress = null;
    const chainId = Number(
      await window.ethereum.request({ method: "eth_chainId" })
    );
    const network = ethers.providers.getNetwork(chainId);
    if (network.chainId == 534351) {
      sourceContractAddress = ContractAddress["CROSS_SENDER_ADDRESS_TEST"];
    } else if (network.chainId == 534352) {
      sourceContractAddress = ContractAddress["CROSS_SENDER_ADDRESS_MAIN"];
    }
    const parameters = {
      method: "searchGMP",
      size: 20,
      senderAddress: address,
      sourceContractAddress: sourceContractAddress,
    };

    // Define the API endpoint
    const apiUrl = "https://testnet.api.gmp.axelarscan.io";

    try {
      // Make the POST request
      const response = await axios.post(apiUrl, parameters);

      // Handle the response data here
      const gasFees = response.data; // Assuming the response contains gas fee data

      resolve(gasFees);
    } catch (error) {
      // Handle any errors
      console.error("Error:", error);
      reject(error);
    }
  });
};
