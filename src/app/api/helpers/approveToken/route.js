import { ethers } from "ethers";
import ERC20ABI from "@/artifacts/contracts/ERC20.sol/ERC20.json";
import ContractAddress from "@/Helpers/ContractAddresses.json";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { amount, tokenContractAddress } = await request.json();

  try {
    // const chain = Number(
    //   await window.ethereum.request({ method: "eth_chainId" })
    // );
    let chain = 919;
    const network = ethers.providers.getNetwork(chain);
    const chainid = network.chainId.toString();
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        ERC20ABI.abi,
        signer
      );

      const tx = await tokenContract.approve(
        ContractAddress[chainid]["address"],
        amount
      );
      await tx.wait();
      console.log(`${amount} tokens Approved`);
      return NextResponse.json({ value: "Approved" }, { status: 200 });
    } else {
      throw new Error("Ethereum provider not available");
    }
  } catch (error) {
    console.error("Error Approving token:", error);
    return NextResponse.json({ value: "Failed" }, { status: 500 });
  }
}
