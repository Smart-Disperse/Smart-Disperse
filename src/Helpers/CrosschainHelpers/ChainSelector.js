// all chains
const allchains = {
  11155111: {
    chainName: "sepolia",
    destinationChains: {
      opSepolia: {
        chainSelector: "5224473277236331295",
        tokens: {
          usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
        receiverAddress: "0x510D3ed32DEDe97Bca3391154EfFf15c058170f1",
      },
      baseSepolia: {
        chainSelector: "10344971235874465080",
        tokens: {
          usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
        receiverAddress: "0x92E96BF48ed9364284556B6400c3E6367c50aC33",
      },
      arbSepolia: {
        chainSelector: "3478487238524512106",
        tokens: {
          usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
        receiverAddress: "0x07C918C364d175629410DA3df7de4637eA0bc851",
      },
      amoy: {
        chainSelector: "16281711391670634445",
        tokens: {
          usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
        receiverAddress: "0xc3A8870A459a7a8160611B126750C5F50C38997C",
      },
    },
    chainSelector: "16015286601757825753",
  },

  11155420: {
    chainName: "opSepolia",
    destinationChains: {
      sepolia: {
        chainSelector: "16015286601757825753",
        tokens: {
          usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
        },
        receiverAddress: "0x17711e4Dd37b4680FEEd3Bb85A6520A285E51192",
      },
      baseSepolia: {
        chainSelector: "10344971235874465080",
        tokens: {
          usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
        },
        receiverAddress: "0x92E96BF48ed9364284556B6400c3E6367c50aC33",
      },
      arbSepolia: {
        chainSelector: "3478487238524512106",
        tokens: {
          usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
        },
        receiverAddress: "0x07C918C364d175629410DA3df7de4637eA0bc851",
      },
      amoy: {
        chainSelector: "16281711391670634445",
        tokens: {
          usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
        },
        receiverAddress: "0xc3A8870A459a7a8160611B126750C5F50C38997C",
      },
    },
    chainSelector: "5224473277236331295",
  },

  84532: {
    chainName: "baseSepolia",
    destinationChains: {
      sepolia: {
        chainSelector: "16015286601757825753",
        tokens: {
          usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        },
        receiverAddress: "0x17711e4Dd37b4680FEEd3Bb85A6520A285E51192",
      },
      opSepolia: {
        chainSelector: "5224473277236331295",
        tokens: {
          usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        },
        receiverAddress: "0x510D3ed32DEDe97Bca3391154EfFf15c058170f1",
      },
      arbSepolia: {
        chainSelector: "3478487238524512106",
        tokens: {
          usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        },
        receiverAddress: "0x07C918C364d175629410DA3df7de4637eA0bc851",
      },
    },
logourl:"",
chainSelector: "10344971235874465080",
  },

  421614: {
    chainName: "arbSepolia",
    destinationChains: {
      sepolia: {
        chainSelector: "16015286601757825753",
        tokens: {
          usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
        },
        receiverAddress: "0x17711e4Dd37b4680FEEd3Bb85A6520A285E51192",
      },
      opSepolia: {
        chainSelector: "5224473277236331295",
        tokens: {
          usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
        },
        receiverAddress: "0x510D3ed32DEDe97Bca3391154EfFf15c058170f1",
      },
      baseSepolia: {
        chainSelector: "10344971235874465080",
        tokens: {
          usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
        },
        receiverAddress: "0x92E96BF48ed9364284556B6400c3E6367c50aC33",
      },
    },
    chainSelector: "3478487238524512106",
  },

  80002: {
    chainName: "amoy",
    destinationChains: {
      sepolia: {
        chainSelector: "16015286601757825753",
        tokens: {
          usdc: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
        },
        receiverAddress: "0x17711e4Dd37b4680FEEd3Bb85A6520A285E51192",
      },
      opSepolia: {
        chainSelector: "5224473277236331295",
        tokens: {
          usdc: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
        },
        receiverAddress: "0x510D3ed32DEDe97Bca3391154EfFf15c058170f1",
      },
    },
    chainSelector: "16281711391670634445",
  },
};
export default allchains;
