import axios from "axios";

export const getGasFees = async (destinationChain, tokenSymbol) => {
  return new Promise(async (resolve, reject) => {
    // Define the parameters
    const parameters = {
      method: "estimateGasFee",
      sourceChain: "scroll",
      destinationChain: destinationChain,
      gasLimit: "700000",
      gasMultiplier: "1.1",
      minGasPrice: "0",
      sourceTokenSymbol: tokenSymbol,
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
