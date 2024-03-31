import { getChain } from "@/Helpers/GetChain";
import contracts from "@/Helpers/ContractAddresses";
import { CovalentClient } from "@covalenthq/client-sdk";

export const ApiServices = async (userAddress) => {
  console.log("entered into api function");

  try {
    const chainId = await getChain();
    var chainName = contracts[chainId]["chainName"];
    // console.log("get chain", chainId);
    const client = new CovalentClient("cqt_rQrQ3jX3Q8QqkPMMDJhWWbyRXB6R"); // API KEY
    console.log(chainId, chainName, userAddress);
    var token;

    try {
      const response =
        await client.BalanceService.getTokenBalancesForWalletAddress(
          chainName,
          userAddress
        );
      token = response.data;
      console.log(token, "details");

      const tokenAddr = token.items.map((entry) => entry.contract_address);
      const balances = token.items.map((entry) => ({
        symbol: entry.contract_ticker_symbol,
        balance: ethers.utils.formatEther(entry.balance),
      }));
    } catch (error) {
      console.log("error in covalent API");
    }

    console.log(balances);

    return tokenAddr;
  } catch (error) {
    console.log("Error fetching chain Info", error);
  }
};
