import { ethers } from "ethers";
import ERC20ABI from "@/artifacts/contracts/ERC20.sol/ERC20.json";
import contracts from "@/Helpers/ContractAddresses.js";

export const approveToken = async (amount, tokenContractAddress, chainId) => {
  const { ethereum } = window; // Grab the global ethereum object so we can interact with it

  // Make sure that the user has MetaMask installed and is connected to our network.
  if (ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        ERC20ABI.abi,
        signer
      );
      const tx = await tokenContract.approve(
        contracts[chainId]["address"],
        amount
      );
      await tx.wait();
      // console.log(`${amount} tokens Approved`);

      return true;
    } catch (error) {
      console.error("Error Approving token:", error);
      return false;
    }
  }
};
