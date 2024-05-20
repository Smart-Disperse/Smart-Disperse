import { ethers } from "ethers";
import ERC20ABI from "@/artifacts/contracts/ERC20.sol/ERC20.json";
import crossContracts from "./Contractaddresses";

export const approveToken = async (amount, tokenContractAddress, chainId) => {
  console.log("cross approve")
  const { ethereum } = window; 
  console.log("1")
  if (ethereum) {
    console.log("2")
    try {
    console.log("3")

        console.log(crossContracts[chainId]["address"]);
        console.log("approving....")
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress()
console.log(address);
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        ERC20ABI.abi,
        signer
      );
      const currentAllowance = await tokenContract.allowance(address , crossContracts[chainId]["address"]);

      if(currentAllowance >= amount){
        return true;
      }
      const tx = await tokenContract.approve(
        crossContracts[chainId]["address"],
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
