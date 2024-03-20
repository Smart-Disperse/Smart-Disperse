import axios from "axios";
import ContractAddress from "./ContractAddresses.js";
import { ethers } from "ethers";
import { createClient, cacheExchange, fetchExchange } from "@urql/core";

export const getEthTransactions = async (address) => {
  console.log(address);
  const APIURL =
    "https://api.studio.thegraph.com/query/67916/smartdisperse-scroll-sepolia/version/latest";

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
  console.log(data.data);
  const transactions = data.data.etherDisperseds.map((transaction) => ({
    sender: transaction._sender,
    recipients: transaction._recipients,
    transactionHash: transaction.transactionHash,
    value: transaction._values,
    blockTimestamp: transaction.blockTimestamp,
  }));

  console.log(transactions);
};

export const getERC20Transactions = async (address, tokenAddress) => {
  console.log(address);
  const APIURL =
    "https://api.studio.thegraph.com/query/67916/smartdisperse-scroll-sepolia/version/latest";

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
  console.log(data);
};
