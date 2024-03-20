import { ethers } from "ethers";
import { createClient, cacheExchange, fetchExchange } from "@urql/core";
import { LoadTokenForAnalysis } from "@/Helpers/LoadToken.js";

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
        value: valueInEth,
        transactionHash: item.transactionHash,
        blockTimestamp: gmtTime,
      });
    });
  });

  console.log(transformedData);
  console.log(totalEth);
};

export const getERC20Transactions = async (address, tokenAddress) => {
  try {
    const tokenDetails = await LoadTokenForAnalysis(tokenAddress);
    console.log(tokenDetails);
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
    const transactions = data.data.erc20TokenDisperseds.map((transaction) => ({
      sender: transaction._sender,
      recipients: transaction._recipients,
      transactionHash: transaction.transactionHash,
      value: transaction._values,
      blockTimestamp: transaction.blockTimestamp,
    }));
    console.log(transactions);

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
          blockTimestamp: gmtTime,
          tokenName: tokenDetails.symbol,
        });
      });
    });

    console.log(transformedData, totalERC20);
  } catch (error) {
    console.log(error);
  }
};
