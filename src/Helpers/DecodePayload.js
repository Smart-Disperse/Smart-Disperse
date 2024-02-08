import { ethers } from "ethers";

export const decode = (payload) => {
  return new Promise((resolve, reject) => {
    try {
      const PaymentDataStruct = [
        { name: "receivers", type: "address[]" },
        { name: "amounts", type: "uint256[]" },
      ];
      const decodedData = ethers.utils.defaultAbiCoder.decode(
        PaymentDataStruct,
        payload
      );
      console.log(decodedData);
      resolve(decodedData);
    } catch (error) {
      reject(error);
    }
  });
};
