import crossContracts from "./Contractaddresses"

export const getCrossChainTransactions = async (address, chainId) => {
    if(chainId in crossContracts){
        const APIURL = contracts[chainId].APIURL;
        const chainname = contract[chainId].chainDisplayName;
        
        const crossQuery = `
            query MyQuery {
                messageSents(where: {msgSender: "${address}"}) {
                    msgSender
                    destinationChainSelector
                    token
                    tokenAmount
                    _paymentData_paymentReceivers
                    _paymentData_amounts
                    feeToken
                    fees
                    messageId
                    transactionHash
                    blockTimestamp
                }
            }
        `;

        
    }
}