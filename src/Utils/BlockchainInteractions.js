export const smartDisperseInstance = async (chainId) => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      throw new Error("Metamask is not installed, please install!");
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      contracts[chainId]["address"],
      contracts[chainId]["Abi"].abi,
      signer
    );

    return contract;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};

export const LoadToken = async (customTokenAddress, address) => {
  const { ethereum } = window;

  if (ethereum && customTokenAddress !== "") {
    const provider = new ethers.providers.Web3Provider(ethereum);
    await provider.ready; // added beacuse token was not getting loaded for the first time
    const signer = provider.getSigner();

    try {
      const erc20 = new ethers.Contract(
        customTokenAddress,
        ERC20ABI.abi,
        signer
      );

      const name = await erc20.name();

      const symbol = await erc20.symbol();
      const balance = await erc20.balanceOf(address);
      const decimals = await erc20.decimals();
      console.log(symbol, balance);
      return {
        name,
        symbol,
        balance: balance,
        decimal: decimals,
      };
    } catch (error) {
      console.log("loading token error", error.message);
      return null;
    }
  }
};

export const smartDisperseCrossChainInstance = async (chainId) => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      throw new Error("Metamask is not installed, please install!");
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      crossContracts[chainId]["address"],
      crossContracts[chainId]["Abi"].abi,
      signer
    );

    console.log("contract instance", contract);

    return contract;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};

export const approveToken = async (amount, tokenContractAddress, chainId) => {
  const { ethereum } = window; // Grab the global ethereum object so we can interact with it

  // Make sure that the user has MetaMask installed and is connected to our network.
  if (ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        ERC20ABI.abi,
        signer
      );
      const tx = await tokenContract.approve(
        contracts[chainId]["address"],
        amount
      );
      await tx.wait();
      // console.log(`${amount} tokens Approved`);

      return true;
    } catch (error) {
      console.error("Error Approving token:", error);
      return false;
    }
  }
};

export const getEthBalance = async () => {
  const { ethereum } = window;
  if (!ethBalance) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    if (address) {
      let ethBalance = await provider.getBalance(address);
      setEthBalance(ethBalance);
    }
  }
};
