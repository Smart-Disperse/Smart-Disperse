import { ethers } from "ethers";
import { LoadTokenForAnalysis } from "../LoadToken";
import crossContracts from "./Contractaddresses"
import { createClient, cacheExchange, fetchExchange } from "@urql/core";

export const getCrossChainTransactions = async (address, chainId) => {
    try {
        if(chainId in crossContracts){
            const APIURL = crossContracts[chainId].APIURL;
            const chainname = crossContracts[chainId].chainDisplayName;
            
            const crossQuery = `
                query MyQuery {
                    messageSents(where: {msgSender: "${address}"}) {
                        msgSender
                        destinationChainSelector
                        token
                        tokenAmount
                        _paymentData_paymentReceivers
                        _paymentData_amounts
                        fees
                        messageId
                        transactionHash
                        blockTimestamp
                    }
                }
            `;
            
            const client = createClient({
                url: APIURL,
                exchanges: [cacheExchange, fetchExchange],
            })
            
            const data = await client.query(crossQuery).toPromise();
        
            // Fetching Data from the API response
            if(data.data !== undefined) {
                const transactions = data.data.messageSents.map((transaction) => ({
                    sender: transaction.msgSender,
                    destinationChainSelector: transaction.destinationChainSelector,
                    tokenAddress: transaction.token,
                    tokenAmount: transaction.tokenAmount,
                    recipients: transaction._paymentData_paymentReceivers,
                    amounts: transaction._paymentData_amounts,
                    fees: transaction.fees,
                    msgId: transaction.messageId,
                    transactionHash: transaction.transactionHash,
                    blockTimestamp: transaction.blockTimestamp,
                }));

                const transformedData = [];

                transactions.forEach(async (item) => {

                    // For Fetching Decimals of ERC20 Token
                    // const tokenDecimals = (await LoadTokenForAnalysis(item.tokenAddress)).decimal;
                    // console.log(tokenDecimals);

                    const recipientsData = item.recipients.map((recipient, index) => ({
                            recipient: recipient,
                            amount: item.amounts[index],
                        }));
                    const timestamp = new Date(item.blockTimestamp * 1000);
                    const gmtTime = timestamp.toGMTString();
                    transformedData.push({
                        sender: item.sender,
                        destinationChainSelector: item.destinationChainSelector,
                        tokenAddress: item.tokenAddress,
                        tokenAmount: item.tokenAmount,
                        recipientsData: recipientsData,
                        fees: item.fees,
                        transactionHash: item.transactionHash,
                        blockTimestamp: gmtTime,
                    });
                });
    
                return transformedData;
            }
        }
    } 
    catch(error){
        console.log("Error fetching Cross-Chain Transaction... ", error);
        return [];
    }
}