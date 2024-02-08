import { ethers } from "ethers";
import ERC20ABI from "../artifacts/contracts/ERC20.sol/ERC20.json";

// export const aUSDC_token_address_scroll =
//   "0x254d06f33bDc5b8ee05b2ea472107E300226659A";

export const getTokenBalance = async (address, tokenContractAddress) => {
  const { ethereum } = window;
  if (ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        ERC20ABI.abi,
        provider
      );
      const balance = await tokenContract.balanceOf(address);
      return balance;
    } catch (error) {
      console.error("Error Fetching Token Balance:", error);
    }
  }
};
