// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
contract SmartDisperseCrossChain is CCIPReceiver, OwnerIsCreator {
    using SafeERC20 for IERC20;
    // Custom errors to provide more descriptive revert messages.
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance to cover the fees.
    error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
    error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.
    error DestinationChainNotAllowed(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.
    error SourceChainNotAllowed(uint64 sourceChainSelector); // Used when the source chain has not been allowlisted by the contract owner.
    error SenderNotAllowed(address sender); // Used when the sender has not been allowlisted by the contract owner.
    error InvalidReceiverAddress(); // Used when the receiver address is 0.
    // Event emitted when a message is sent to another chain.
    event MessageSent(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        PaymentData _paymentData, // The text being sent.
        address token, // The token address that was transferred.
        uint256 tokenAmount, // The token amount that was transferred.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the message.
    );
    // Event emitted when a message is received from another chain.
    event MessageReceived(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed sourceChainSelector, // The chain selector of the source chain.
        address sender, // The address of the sender from the source chain.
        bytes _paymentData, // The text that was received.
        address token, // The token address that was transferred.
        uint256 tokenAmount // The token amount that was transferred.
    );
    // Event emitted when Tokens are disperse on Receiver chain to the Recipients
    event ERC20TokenDispersed(
        address sender,
        IERC20 token,
        address[] recipients,
        uint256[] amounts
    );
    bytes32 private s_lastReceivedMessageId;
    address private s_lastReceivedTokenAddress;
    uint256 private s_lastReceivedTokenAmount;
    string private s_lastReceivedText;
    
    mapping(uint64 => bool) public allowlistedDestinationChains;
    mapping(uint64 => bool) public allowlistedSourceChains;
    mapping(address => bool) public allowlistedSenders;
    IERC20 private s_linkToken;
    // struct of Payment Data
    struct PaymentData {
        address[] recipients;
        uint256[] amounts;
    }
    
    constructor(address _router, address _link) CCIPReceiver(_router) {
        s_linkToken = IERC20(_link);
    }
    modifier onlyAllowlistedDestinationChain(uint64 _destinationChainSelector) {
        if (!allowlistedDestinationChains[_destinationChainSelector])
            revert DestinationChainNotAllowed(_destinationChainSelector);
        _;
    }
    modifier validateReceiver(address _receiver) {
        if (_receiver == address(0)) revert InvalidReceiverAddress();
        _;
    }
    modifier onlyAllowlisted(uint64 _sourceChainSelector, address _sender) {
        if (!allowlistedSourceChains[_sourceChainSelector])
            revert SourceChainNotAllowed(_sourceChainSelector);
        if (!allowlistedSenders[_sender]) revert SenderNotAllowed(_sender);
        _;
    }
    function allowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedDestinationChains[_destinationChainSelector] = allowed;
    }
    function allowlistSourceChain(
        uint64 _sourceChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedSourceChains[_sourceChainSelector] = allowed;
    }
    function allowlistSender(address _sender, bool allowed) external onlyOwner {
        allowlistedSenders[_sender] = allowed;
    }
    function getEstimatedFees(
        uint64 _destinationChainSelector,
        address _receiver,
        address[] memory _paymentRecipients,
        uint256[] memory _paymentAmounts,
        address _token,
        uint256 _amount
    )
        external
        view
        onlyAllowlistedDestinationChain(_destinationChainSelector)
        validateReceiver(_receiver)
        returns (uint256)
    {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        // address(0) means fees are paid in native gas
        PaymentData memory _paymentData = PaymentData(_paymentRecipients, _paymentAmounts);
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _paymentData,
            _token,
            _amount,
            address(0)
        );
        // Initialize a router client instance to interact with cross-chain router
        IRouterClient router = IRouterClient(this.getRouter());
        // Get the fee required to send the CCIP message
        uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);
        
        return fees;
    }
    function sendMessagePayLINK(
        uint64 _destinationChainSelector,
        address _receiver,
        address[] memory _paymentReceivers,
        uint256[] memory _paymentAmounts,
        address _token,
        uint256 _amount
    )   payable 
        external
        onlyAllowlistedDestinationChain(_destinationChainSelector)
        validateReceiver(_receiver)
        returns (bytes32 messageId)
    {
        require(IERC20(_token).transferFrom(msg.sender, address(this), _amount));
        PaymentData memory _paymentData = PaymentData(_paymentReceivers, _paymentAmounts);
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        // address(linkToken) means fees are paid in LINK
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _paymentData,
            _token,
            _amount,
            address(s_linkToken)
        );
        // Initialize a router client instance to interact with cross-chain router
        IRouterClient router = IRouterClient(this.getRouter());
        // Get the fee required to send the CCIP message
        uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);
        if (fees > s_linkToken.balanceOf(address(msg.sender)))
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);
        require(s_linkToken.transferFrom(msg.sender, address(this), fees));
        // approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
        s_linkToken.approve(address(router), fees);
        // approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
        IERC20(_token).approve(address(router), _amount);
        // Send the message through the router and store the returned message ID
        messageId = router.ccipSend(_destinationChainSelector, evm2AnyMessage);
        // Emit an event with message details
        emit MessageSent(
            messageId,
            _destinationChainSelector,
            _receiver,
            _paymentData,
            _token,
            _amount,
            address(s_linkToken),
            fees
        );
        // Return the message ID
        return messageId;
    }
    function sendMessagePayNative(
        uint64 _destinationChainSelector,
        address _receiver,
        address[] memory _paymentRecipients,
        uint256[] memory _paymentAmounts,
        address _token,
        uint256 _amount
    )
        external
        payable 
        onlyAllowlistedDestinationChain(_destinationChainSelector)
        validateReceiver(_receiver)
        returns (bytes32 messageId)
    {
        require(IERC20(_token).transferFrom(msg.sender, address(this), _amount));
        
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        // address(0) means fees are paid in native gas
        PaymentData memory _paymentData = PaymentData(_paymentRecipients, _paymentAmounts);
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _paymentData,
            _token,
            _amount,
            address(0)
        );
        // Initialize a router client instance to interact with cross-chain router
        IRouterClient router = IRouterClient(this.getRouter());
        // Get the fee required to send the CCIP message
        uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);
        if (fees > msg.value)
            revert NotEnoughBalance(address(this).balance, fees);
        // approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
        IERC20(_token).approve(address(router), _amount);
        // Send the message through the router and store the returned message ID
        messageId = router.ccipSend{value: fees}(
            _destinationChainSelector,
            evm2AnyMessage
        );
        // Transferring remaining fees back to the User account
        int256 remainingFees = int256(msg.value) - int256(fees);
        if(remainingFees > 0){
            payable (msg.sender).transfer(uint256(remainingFees));
        }
        // Emit an event with message details
        emit MessageSent(
            messageId,
            _destinationChainSelector,
            _receiver,
            _paymentData,
            _token,
            _amount,
            address(0),
            fees
        );
        return messageId;
    }
    function _buildCCIPMessage(
        address _receiver,
        PaymentData memory _paymentData,
        address _token,
        uint256 _amount,
        address _feeTokenAddress
    ) private pure returns (Client.EVM2AnyMessage memory) {
        // Set the token amounts
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });
        
        // build the Message
        bytes memory payload = abi.encode(_paymentData);
        
        return Client.EVM2AnyMessage({
                receiver: abi.encode(_receiver), 
                data: payload, 
                tokenAmounts: tokenAmounts, 
                extraArgs: Client._argsToBytes(
                    // Additional arguments, setting gas limit
                    Client.EVMExtraArgsV1({gasLimit: 500_000})
                ),
                feeToken: _feeTokenAddress
            });
    }
    /********************************** RECEIVER CONTRACT FUNCTIONS **********************************************/
    
    function getLastReceivedMessageDetails()
        public
        view
        returns (
            bytes32 messageId,
            string memory text,
            address tokenAddress,
            uint256 tokenAmount
        )
    {
        return (
            s_lastReceivedMessageId,
            s_lastReceivedText,
            s_lastReceivedTokenAddress,
            s_lastReceivedTokenAmount
        );
    }
    function _disperse(address _tokenAddress, address[] memory _recipients, uint256[] memory _amounts) internal {
        IERC20 _token = IERC20(_tokenAddress);
        for (uint256 i = 0; i < _recipients.length; i++) {
            require(_token.transfer(_recipients[i], _amounts[i]));
        }
         emit ERC20TokenDispersed(address(this),_token,_recipients,_amounts);
    }
    /// handle a received message
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    )
        internal
        override
        onlyAllowlisted(
            any2EvmMessage.sourceChainSelector,
            abi.decode(any2EvmMessage.sender, (address))
        ) // Make sure source chain and sender are allowlisted
    {
        s_lastReceivedMessageId = any2EvmMessage.messageId; // fetch the messageId
        // Convert the bytes back into the PaymentData struct
        PaymentData memory receivedPaymentData = abi.decode(any2EvmMessage.data, (PaymentData));
        s_lastReceivedTokenAddress = any2EvmMessage.destTokenAmounts[0].token;
        s_lastReceivedTokenAmount = any2EvmMessage.destTokenAmounts[0].amount;
        // Call Disperse function to disperse the token on Destination Chain
        _disperse(s_lastReceivedTokenAddress, receivedPaymentData.recipients, receivedPaymentData.amounts);
        emit MessageReceived(
            any2EvmMessage.messageId,
            any2EvmMessage.sourceChainSelector, // fetch the source chain identifier (aka selector)
            abi.decode(any2EvmMessage.sender, (address)), // abi-decoding of the sender address,
            abi.decode(any2EvmMessage.data, (bytes)),
            any2EvmMessage.destTokenAmounts[0].token,
            any2EvmMessage.destTokenAmounts[0].amount
        );
    }
    receive() external payable {}
    /********************************* WITHDRAW FUNCTIONS ************************************************/
    function withdraw(address _beneficiary) public onlyOwner {
        uint256 amount = address(this).balance;
        if (amount == 0) revert NothingToWithdraw();
        (bool sent, ) = _beneficiary.call{value: amount}("");
        if (!sent) revert FailedToWithdrawEth(msg.sender, _beneficiary, amount);
    }
    
    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = IERC20(_token).balanceOf(address(this));
        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();
        IERC20(_token).safeTransfer(_beneficiary, amount);
    }
}
