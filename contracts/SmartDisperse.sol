// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
contract FinalMultipleDestinations is CCIPReceiver, OwnerIsCreator {
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
        address msgSender,
        bytes32 messageId, // The unique ID of the CCIP message.
        uint64 destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        SinglePaymentData _paymentData, // The text being sent.
        address token, // The token address that was transferred.
        uint256 tokenAmount, // The token amount that was transferred.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the message.
    );
    // Event emitted when a message is received from another chain.
    event MessageReceived(
        bytes32 messageId, // The unique ID of the CCIP message.
        uint64 sourceChainSelector, // The chain selector of the source chain.
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
    address public Weth;
    
    mapping(uint64 => bool) public allowlistedDestinationChains;
    mapping(uint64 => bool) public allowlistedSourceChains;
    mapping(address => bool) public allowlistedSenders;
    struct PaymentData {
        address[][] paymentReceivers;
        uint256[][] amounts;
    }
    struct SinglePaymentData {
        address[] paymentReceivers;
        uint256[] amounts;
    }
    IERC20 private s_linkToken;
    constructor(
        address _router,
        address _link,
        address _wethAddress
    ) CCIPReceiver(_router) {
        s_linkToken = IERC20(_link);
        Weth = _wethAddress;
    }
    modifier onlyAllowlistedDestinationChain(uint64[] memory _destinationChainSelectorList) {
        for(uint i = 0 ; i < _destinationChainSelectorList.length ; i++)
        if (!allowlistedDestinationChains[_destinationChainSelectorList[i]])
            revert DestinationChainNotAllowed(_destinationChainSelectorList[i]);
        _;
    }
    modifier validateReceiver(address[] memory _receiver) {
        for(uint i = 0 ; i < _receiver.length ; i++){
            if (_receiver[i] == address(0)) revert InvalidReceiverAddress();
        }
        _;
    }
    modifier onlyAllowlisted(uint64 _sourceChainSelector, address _sender) {
        if (!allowlistedSourceChains[_sourceChainSelector])
            revert SourceChainNotAllowed(_sourceChainSelector);
        if (!allowlistedSenders[_sender]) revert SenderNotAllowed(_sender);
        _;
    }
    function allowlistDestinationChain(
        uint64[] memory _destinationChainSelectorList,
        bool allowed
    ) external onlyOwner {
        for(uint i = 0 ; i < _destinationChainSelectorList.length ; i++){
            allowlistedDestinationChains[_destinationChainSelectorList[i]] = allowed;
        }
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
        uint64[] memory _destinationChainSelector,
        address[] memory _receiver,
        PaymentData memory _paymentData,
        address _token
    )
        external
        view
        onlyAllowlistedDestinationChain(_destinationChainSelector)
        validateReceiver(_receiver)
        returns (uint256 totalFees)
    {
        totalFees = 0;
        for(uint i = 0 ; i < _destinationChainSelector.length ; i++)
        {
            SinglePaymentData memory _singlePaymentData = SinglePaymentData(_paymentData.paymentReceivers[i], _paymentData.amounts[i]);
            
            uint256 amount = calculateAmount(_singlePaymentData.amounts);
            Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
                _receiver[i],
                _singlePaymentData,
                _token,
                amount,
                address(0)
            );
            // Initialize a router client instance to interact with cross-chain router
            IRouterClient router = IRouterClient(this.getRouter());
            // Get the fee required to send the CCIP message
            totalFees +=  router.getFee(_destinationChainSelector[i], evm2AnyMessage);
        }
        return totalFees;
    }
    function sendMessagePayLINK(
        uint64[] memory _destinationChainSelector,
        address[] memory _receiver,
        PaymentData memory _paymentData,
        address _token
    )   payable 
        external
        onlyAllowlistedDestinationChain(_destinationChainSelector)
        validateReceiver(_receiver)
    {
       
        for(uint i = 0 ; i < _destinationChainSelector.length ; i++)
        {
            SinglePaymentData memory _singlePaymentData = SinglePaymentData(_paymentData.paymentReceivers[i], _paymentData.amounts[i]);
            uint256 amount = calculateAmount(_singlePaymentData.amounts);
            if(_token == Weth) {
                (bool success, ) = Weth.call{value: amount}(
                    abi.encodeWithSignature("deposit()")
                );
                require(success, "WETH deposit failed");
                if (success) {
                    IERC20(_token).transferFrom(msg.sender, address(this), amount);
                }
            }
            else {
                require(IERC20(_token).transferFrom(msg.sender, address(this), amount));
            }
            // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
            // address(linkToken) means fees are paid in LINK
            Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
                _receiver[i],
                _singlePaymentData,
                _token,
                amount,
                address(s_linkToken)
            );
            // Initialize a router client instance to interact with cross-chain router
            IRouterClient router = IRouterClient(this.getRouter());
            /*** TO DO: HANDLE FEES REVERTS WITH ACCURATE CALCULATIONS    ****/
            // Get the fee required to send the CCIP message
            uint256 fees = router.getFee(_destinationChainSelector[i], evm2AnyMessage);
            if (fees > s_linkToken.balanceOf(address(msg.sender)))
                revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);
            // approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
            require(s_linkToken.transferFrom(msg.sender, address(this), fees));
            s_linkToken.approve(address(router), fees);
            // approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
            IERC20(_token).approve(address(router), amount);
            // Send the message through the router and store the returned message ID
            bytes32 messageId = router.ccipSend(_destinationChainSelector[i], evm2AnyMessage);
            // Emit an event with message details
            emit MessageSent(
                msg.sender,
                messageId,
                _destinationChainSelector[i],
                _receiver[i],
                _singlePaymentData,
                _token,
                amount,
                address(s_linkToken),
                fees
            );
        }
        // Return the message ID
    }
    function sendMessagePayNative(
        uint64[] memory _destinationChainSelector,
        address[] memory _receiver,
        PaymentData memory _paymentData,
        address _token
    )
        external
        payable 
        onlyAllowlistedDestinationChain(_destinationChainSelector)
        validateReceiver(_receiver)
    {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        // address(0) means fees are paid in native gas
        for(uint i = 0 ; i < _destinationChainSelector.length ; i++)
        {
            SinglePaymentData memory _singlePaymentData = SinglePaymentData(_paymentData.paymentReceivers[i], _paymentData.amounts[i]);
            
            uint256 amount = calculateAmount(_singlePaymentData.amounts);
            if(_token == Weth) {
                (bool success, ) = Weth.call{value: amount}(
                    abi.encodeWithSignature("deposit()")
                );
                require(success, "WETH deposit failed");
                if (success) {
                    IERC20(_token).transferFrom(msg.sender, address(this), amount);
                }
            }
            else {
                require(IERC20(_token).transferFrom(msg.sender, address(this), amount));
            }
            Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
                _receiver[i],
                _singlePaymentData,
                _token,
                amount,
                address(0)
            );
            // Initialize a router client instance to interact with cross-chain router
            IRouterClient router = IRouterClient(this.getRouter());
            /*** TO DO: HANDLE FEES REVERTS WITH ACCURATE CALCULATIONS    ****/
            // Get the fee required to send the CCIP message
            uint256 fees = router.getFee(_destinationChainSelector[i], evm2AnyMessage);
            if (fees > msg.value)
                revert NotEnoughBalance(address(this).balance, fees);
            // approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
            IERC20(_token).approve(address(router), amount);
            /******** TO DO : HANLDE FEES REVERT AND ALSO PAYING BACK REMAINING FEES TO THE MSG.SENDER    *******/
            // Send the message through the router and store the returned message ID
            bytes32 messageId = router.ccipSend{ value: fees }(
                _destinationChainSelector[i], evm2AnyMessage
            );
            // Emit an event with message details
            emit MessageSent(
                msg.sender,
                messageId,
                _destinationChainSelector[i],
                _receiver[i],
                _singlePaymentData,
                _token,
                amount,
                address(0),
                fees
            );
        }
    }
    function _buildCCIPMessage(
        address _receiver,
        SinglePaymentData memory _paymentData,
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
                    Client.EVMExtraArgsV1({gasLimit: 200_000})
                ),
                feeToken: _feeTokenAddress
            });
    }
    // CALCULATING THE AMOUNT OF TOKEN TO BE SEND TO THE PARTICUALR DESTINATION CHAIN
    function calculateAmount(uint256[] memory amount) pure internal returns(uint256){
        uint256 res =  0 ;
        for(uint i=0; i < amount.length; i++)
            res += amount[i];
        return res;
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
        SinglePaymentData memory receivedPaymentData = abi.decode(any2EvmMessage.data, (SinglePaymentData));
        s_lastReceivedTokenAddress = any2EvmMessage.destTokenAmounts[0].token;
        s_lastReceivedTokenAmount = any2EvmMessage.destTokenAmounts[0].amount;
        // Call Disperse function to disperse the token on Destination Chain
        _disperse(s_lastReceivedTokenAddress, receivedPaymentData.paymentReceivers, receivedPaymentData.amounts);
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