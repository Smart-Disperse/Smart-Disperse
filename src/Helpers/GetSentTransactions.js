import { ethers } from "ethers";
import { createClient, cacheExchange, fetchExchange } from "@urql/core";
import { LoadTokenForAnalysis } from "@/Helpers/LoadToken.js";
import { useEffect, useState } from "react";
import { getChain } from "./GetChain";
import contracts from "./ContractAddresses";

export const getEthTransactions = async (address) => {
  console.log("calling getEthTransactions with address ");
  const Chain = await getChain(address);
  console.log(Chain);
  if (Chain in contracts) {
    console.log(contracts[Chain].address);
    const chainAPIurl = contracts[Chain].APIURL;
    const chainname = contracts[Chain].name;
    console.log(chainname);
    console.log(chainAPIurl);

    const APIURL = chainAPIurl;
    console.log("ethq");
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

    const client = createClient({
      url: APIURL,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client.query(EthQuery).toPromise();
    console.log("1");
    console.log(data.data);
    const transactions = data.data.etherDisperseds.map((transaction) => ({
      sender: transaction._sender,
      recipients: transaction._recipients,
      transactionHash: transaction.transactionHash,
      value: transaction._values,
      blockTimestamp: transaction.blockTimestamp,
    }));

    const transformedData = [];
    let totalEth = 0;
    transactions.forEach((item) => {
      item.recipients.forEach((recipient, index) => {
        const valueInEth = ethers.utils.formatEther(item.value[index]);
        totalEth += parseFloat(valueInEth);
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
    console.log("Eth transfer data:", transformedData);
    return transformedData;
  } else {
    console.log("Chain not found in contracts");
    // Handle this case, maybe return an error or some default value
    return [];
  }
};

export const getERC20Transactions = async (address, tokenAddress) => {
  console.log("calling  getEthTransactions with address ");
  const Chain = await getChain(address);
  console.log(Chain);
  if (Chain in contracts) {
    console.log(contracts[Chain]);
    const chainAPIurl = contracts[Chain].APIURL;
    console.log(chainAPIurl);
    return chainAPIurl;
  }
  try {
    const tokenDetails = await LoadTokenForAnalysis(tokenAddress);
    console.log("tokenaddr  ", tokenAddress);

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
    console.log("api data", data);
    const transactions = data.data.erc20TokenDisperseds.map((transaction) => ({
      sender: transaction._sender,
      recipients: transaction._recipients,
      transactionHash: transaction.transactionHash,
      value: transaction._values,
      blockTimestamp: transaction.blockTimestamp,
    }));
    console.log("txs", transactions);

    const transformedData = [];
    let totalERC20 = 0;
    transactions.forEach((item) => {
      item.recipients.forEach((recipient, index) => {
        const valueInERC20 = ethers.utils.formatUnits(
          item.value[index],
          tokenDetails.decimal
        );
        totalERC20 += parseFloat(valueInERC20);
        const timestamp = new Date(item.blockTimestamp * 1000); // Convert to milliseconds
        const gmtTime = timestamp.toGMTString();
        transformedData.push({
          sender: item.sender,
          recipient: recipient,
          value: valueInERC20,
          transactionHash: item.transactionHash,
          // chainName: chainname,
          blockTimestamp: gmtTime,
          tokenName: tokenDetails.symbol,
        });
      });
    });

    // also return TotalERC20
    console.log("ERC20 transfer data:", transformedData);
    return transformedData;

    // return {transformedData};
  } catch (error) {
    console.log(error);
  }
};
