import { ethers } from "ethers";
import ERC20ABI from "@/artifacts/contracts/ERC20.sol/ERC20.json";
import contracts from "@/Helpers/ContractAddresses.js";
import { getChain } from "@/Helpers/GetChain";

export const approveToken = async (amount, tokenContractAddress) => {
  const chainId = await getChain();
  const { ethereum } = window;
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
      console.log(`${amount} tokens Approved`);

      return true;
    } catch (error) {
      console.error("Error Approving token:", error);
      return false;
    }
  }
};
