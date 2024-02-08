    //SPDX-License-Identifier: MIT
    /**
     * @title CrossSender
     * @dev This contract facilitates cross-chain token and transfers using Axelar Network and token tranferf for same chain.
     */
    pragma solidity ^0.8.4;
    import {IERC20} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol";
    import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
    import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

    /**
     * @dev CrossSender contract for cross-chain transfers.
     */
    contract CrossSender {
        IAxelarGateway gateway;
        IAxelarGasService gasService;
        
    /**
     * @dev Constructor to initialize the Axelar Gateway and Gas Service contracts.
     * @param _gateway Address of the Axelar Gateway contract.
     * @param _gasReceiver Address of the Axelar Gas Service contract.
     */
        constructor(address _gateway, address _gasReceiver) {
            gateway = IAxelarGateway(_gateway);
            gasService = IAxelarGasService(_gasReceiver);
        }
    /**
     * @dev Disperse ether among multiple recipients.
     * @param recipients Array of recipient addresses.
     * @param values Array of corresponding ether values to be transferred.
     */
    function disperseEther(address payable[] memory recipients, uint256[] memory values) external payable {
        for (uint256 i = 0; i < recipients.length; i++)
            recipients[i].transfer(values[i]);
        uint256 balance = address(this).balance;
        if (balance > 0)
            payable(msg.sender).transfer(balance);
    }
    /**
     * @dev Disperse ERC-20 tokens among multiple recipients.
     * @param token ERC-20 token contract address Instance.
     * @param recipients Array of recipient addresses.
     * @param values Array of corresponding token values to be transferred.
     */
    function disperseToken(IERC20 token, address[] memory recipients, uint256[] memory values) external {
        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++)
            total += values[i];
        require(token.transferFrom(msg.sender, address(this), total));
        for (uint256 i = 0; i < recipients.length; i++)
            require(token.transfer(recipients[i], values[i]));
    }

    /**
     * @dev Disperse ERC-20 tokens direct among multiple recipients in a single transaction.
     * @param token ERC-20 token contract address Instance.
     * @param recipients Array of recipient addresses.
     * @param values Array of corresponding token values to be transferred.
     */

    function disperseTokenSimple(IERC20 token, address[] memory recipients, uint256[] memory values) external {
        for (uint256 i = 0; i < recipients.length; i++)
            require(token.transferFrom(msg.sender, recipients[i], values[i]));
    }

    /**
     * @dev Data structure to represent payment information.
     */
        struct PaymentData {

            address[] receivers;
            uint256[] amounts;
            string destChain;
            string detContractAddress;
            string tokenSymbol;
            uint256 gasFees;
            uint256 totalAmount;
        }

    /**
     * @dev Send cross-chain payments using Axelar Gateway and Gas Service.
     * @param _paymentData Array of PaymentData structs containing payment information.
     */
        function sendPayment(PaymentData[] memory _paymentData) external payable {
                uint256 paymentLength = _paymentData.length;
                for(uint256 i=0;i<paymentLength;i++){
            
                    address tokenAddress = gateway.tokenAddresses(_paymentData[i].tokenSymbol);
                    IERC20(tokenAddress).transferFrom(msg.sender, address(this), _paymentData[i].totalAmount);
                    IERC20(tokenAddress).approve(address(gateway), _paymentData[i].totalAmount);
                    bytes memory payload = abi.encode(_paymentData[i].receivers,_paymentData[i].amounts);

                    if (msg.value> 0) {
                    /**
                     * @dev Pay native gas fees for cross-chain contract call with token.
                     */
                        gasService.payNativeGasForContractCallWithToken{value: _paymentData[i].gasFees}(
                            address(this),
                            _paymentData[i].destChain,
                            _paymentData[i].detContractAddress,
                            payload,
                            _paymentData[i].tokenSymbol,
                             _paymentData[i].totalAmount,
                            msg.sender
                        );
                    }
                    /**
                     * @dev Call remote contract on another chain using Axelar Gateway.
                     */
                    gateway.callContractWithToken(
                        _paymentData[i].destChain,
                        _paymentData[i].detContractAddress,
                        payload,
                        _paymentData[i].tokenSymbol,
                         _paymentData[i].totalAmount
                        );
                
                }           
        }
    }
