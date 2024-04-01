import { ethers } from "ethers";
import { createClient, cacheExchange, fetchExchange } from "@urql/core";
import { LoadTokenForAnalysis } from "@/Helpers/LoadToken.js";
import { useEffect, useState } from "react";

import contracts from "./ContractAddresses";

// import { CovalentClient } from "@covalenthq/client-sdk";

// const ApiServices = async () => {
//     const client = new CovalentClient("cqt_rQrQ3jX3Q8QqkPMMDJhWWbyRXB6R");
//     const resp = await client.BalanceService.getTokenBalancesForWalletAddress("scroll-sepolia-testnet","0x2131A6c0b66bE63E38558dC5fbe4C0ab65b9906e");
//     console.log("COVALENT API DATA:" , resp.data);
// }

export const getEthTransactions = async (address, chainId) => {
  if (chainId in contracts) {
    const chainAPIurl = contracts[chainId].APIURL;
    const chainname = contracts[chainId].chainDisplayName;

    const APIURL = chainAPIurl;

    const EthQuery = `
      query MyQuery {
        etherDisperseds(where: {_sender: "${address}"}) {
          _recipients
          _sender
          _values
          blockTimestamp
          transactionHash
        }
      }
    `;

    if (APIURL) {
      const client = createClient({
        url: APIURL,
        exchanges: [cacheExchange, fetchExchange],
      });

      const data = await client.query(EthQuery).toPromise();

      if (data.data !== undefined) {
        const transactions = data.data.etherDisperseds.map((transaction) => ({
          sender: transaction._sender,
          recipients: transaction._recipients,
          transactionHash: transaction.transactionHash,
          value: transaction._values,
          blockTimestamp: transaction.blockTimestamp,
        }));

        const transformedData = [];

        transactions.forEach((item) => {
          item.recipients.forEach((recipient, index) => {
            const valueInEth = ethers.utils.formatEther(item.value[index]);

            const timestamp = new Date(item.blockTimestamp * 1000); // Convert to milliseconds
            const gmtTime = timestamp.toGMTString();
            transformedData.push({
              sender: item.sender,
              recipient: recipient,
              chainName: chainname,
              value: valueInEth,
              transactionHash: item.transactionHash,
              blockTimestamp: gmtTime,
            });
          });
        });

        // also return TotalEth
        // console.log("Eth transfer data:", transformedData);
        console.log(transformedData);
        return transformedData;
      }
    } else {
      console.log("Api URL not found");
    }
  } else {
    console.log("chainId not found in contracts");
    // Handle this case, maybe return an error or some default value
    return [];
  }
};

export const getERC20Transactions = async (address, tokenAddress, chainId) => {
  var chainAPIurl;
  try {
    if (chainId in contracts) {
      const chainname = contracts[chainId].chainDisplayName;
      console.log(chainname);
      chainAPIurl = contracts[chainId].APIURL;
      // console.log(chainAPIurl);
      // return chainAPIurl;

      const tokenDetails = await LoadTokenForAnalysis(tokenAddress);
      // console.log("tokenaddr  ",tokenAddress);

      // console.log("symbol", tokenDetails.symbol);
      // console.log(address);
      const APIURL = chainAPIurl;
      const tokensQuery = `
    query MyQuery {
      erc20TokenDisperseds(where: {_sender: "${address}", _token: "${tokenAddress}"}) {
        _recipients
        _sender
        _token
        _values
        blockTimestamp
        transactionHash
      }
    }
    `;

      const client = createClient({
        url: APIURL,
        exchanges: [cacheExchange, fetchExchange],
      });

      const data = await client.query(tokensQuery).toPromise();
      // console.log("api data", data);
      const transactions = data.data.erc20TokenDisperseds.map(
        (transaction) => ({
          sender: transaction._sender,
          recipients: transaction._recipients,
          transactionHash: transaction.transactionHash,
          value: transaction._values,
          blockTimestamp: transaction.blockTimestamp,
        })
      );
      console.log("txs", transactions);

      const transformedData = [];

      transactions.forEach((item) => {
        item.recipients.forEach((recipient, index) => {
          const valueInERC20 = ethers.utils.formatUnits(
            item.value[index],
            tokenDetails.decimal
          );

          const timestamp = new Date(item.blockTimestamp * 1000); // Convert to milliseconds
          const gmtTime = timestamp.toGMTString();
          transformedData.push({
            sender: item.sender,
            recipient: recipient,
            value: valueInERC20,
            transactionHash: item.transactionHash,
            chainName: chainname,
            blockTimestamp: gmtTime,
            tokenName: tokenDetails.symbol,
          });
          console.log("ERC20 transfer data:", transformedData);
        });
      });

      // also return TotalERC20
      return transformedData;
    }
    // return {transformedData};
  } catch (error) {
    console.log(error);
  }
};

export const getERC20Tokens = async (address, chainId) => {
  try {
    const APIURL = contracts[chainId].APIURL;
    const tokensQuery = `
    query MyQuery {
      erc20TokenDisperseds(where: {_sender: "${address}"}) {
        _token
      }
    }
    `;

    const client = createClient({
      url: APIURL,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client.query(tokensQuery).toPromise();
    console.log("api data", data);
    const transactions = data.data.erc20TokenDisperseds.map((transaction) => ({
      tokens: transaction._token,
    }));

    // Extract distinct token addresses using Set
    const distinctTokenAddresses = [
      ...new Set(transactions.map((transaction) => transaction.tokens)),
    ];
    console.log(distinctTokenAddresses);

    let tokenDetails = [];
    for (let tokenAddress of distinctTokenAddresses) {
      const { symbol } = await LoadTokenForAnalysis(tokenAddress);
      tokenDetails.push({
        tokenAddress,
        symbol,
      });
    }
    return tokenDetails;

    // return {transformedData};
  } catch (error) {
    console.log(error);
  }
};
