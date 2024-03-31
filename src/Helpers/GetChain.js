import { ethers } from "ethers";

export const getChain = async () => {
  try {
    const chain = Number(
      await window.ethereum.request({ method: "eth_chainId" })
    );
    const network = ethers.providers.getNetwork(chain);
    const chainid = network.chainId.toString();
    return chainid;
  } catch (error) {
    console.error("Error occurred while fetching chainId:", error);
    throw error;
  }
};
