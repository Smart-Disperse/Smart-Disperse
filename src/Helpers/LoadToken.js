import { ethers } from "ethers";
import ERC20ABI from "@/artifacts/contracts/ERC20.sol/ERC20.json";

export const LoadToken = async (customTokenAddress, address) => {
  const { ethereum } = window;

  if (ethereum && customTokenAddress !== "") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const erc20 = new ethers.Contract(
        customTokenAddress,
        ERC20ABI.abi,
        signer
      );
      const name = await erc20.name();
      const symbol = await erc20.symbol();
      const balance = await erc20.balanceOf(address);
      const decimals = await erc20.decimals();
      // console.log(symbol, balance);
      return {
        name,
        symbol,
        balance: balance,
        decimal: decimals,
      };
    } catch (error) {
      console.log("loading token error", error.message);
      return null;
    }
  }
};

export const LoadTokenForAnalysis = async (customTokenAddress) => {
  const { ethereum } = window;

  if (ethereum && customTokenAddress !== "") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const erc20 = new ethers.Contract(
        customTokenAddress,
        ERC20ABI.abi,
        signer
      );
      const name = await erc20.name();
      const symbol = await erc20.symbol();
      const decimals = await erc20.decimals();
      // console.log(symbol, balance);
      return {
        name,
        symbol,
        decimal: decimals,
      };
    } catch (error) {
      console.log("loading token error", error.message);
      return null;
    }
  }
};
