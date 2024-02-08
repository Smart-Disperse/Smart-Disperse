import { ethers } from "ethers";
import smartDisperseABI from "../artifacts/contracts/SmartDisperse.sol/SmartDisperse.json";
import crossSendABI from "../artifacts/contracts/CrossSender.sol/CrossSender.json";
import ContractAddress from "../Helpers/ContractAddresses.json";

export const crossSendInstance = async () => {
  const chainId = Number(
    await window.ethereum.request({ method: "eth_chainId" })
  );
  const network = ethers.providers.getNetwork(chainId);

  console.log(network.chainId);
  if (network.chainId == 919) {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      if (!provider) {
        console.log("Metamask is not installed, please install!");
      }
      const con = new ethers.Contract(
        ContractAddress["CROSS_SENDER_ADDRESS_TEST_MODE"],
        smartDisperseABI.abi,
        signer
      );
      console.log(con);
      return con;
    } else {
      console.log("error");
    }
  } else if (network.chainId == 34443) {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      if (!provider) {
        console.log("Metamask is not installed, please install!");
      }
      const con = new ethers.Contract(
        ContractAddress["CROSS_SENDER_ADDRESS_MAIN_MODE"],
        smartDisperseABI.abi,
        signer
      );
      console.log(con);
      return con;
    } else {
      console.log("error");
    }
  } else if (network.chainId == 534351) {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      if (!provider) {
        console.log("Metamask is not installed, please install!");
      }
      const con = new ethers.Contract(
        ContractAddress["CROSS_SENDER_ADDRESS_TEST_SCROLL"],
        crossSendABI.abi,
        signer
      );
      console.log(con);
      return con;
    } else {
      console.log("error");
    }
  } else if (network.chainId == 534352) {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      if (!provider) {
        console.log("Metamask is not installed, please install!");
      }
      const con = new ethers.Contract(
        ContractAddress["CROSS_SENDER_ADDRESS_MAIN_SCROLL"],
        crossSendABI.abi,
        signer
      );
      console.log(con);
      return con;
    } else {
      console.log("error");
    }
  } else {
    console.log("please select proper chain");
  }
};
