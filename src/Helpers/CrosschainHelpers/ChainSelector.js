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
        receiverAddress: "0xc1527e883791043996cC445a1f0A004Ab9F6B48a",
      },
      baseSepolia: {
        chainSelector: "10344971235874465080",
        tokens: {
          usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
        receiverAddress: "0x31CB776486812C8d24cF04e6A124f263e9CCA4e0",
      },
      arbSepolia: {
        chainSelector: "3478487238524512106",
        tokens: {
          usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
        receiverAddress: "0x1859E66C6FCF273d7c37A049A79165Ef54F24B95",
      },
      amoy: {
        chainSelector: "16281711391670634445",
        tokens: {
          usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
        receiverAddress: "0x82ba4A0Eb6c0c706fF0e803207122C7168F34537",
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
        receiverAddress: "0x147914414C2F1dbAA3EAe6E16F0423d2A8b2E6Bb",
      },
      baseSepolia: {
        chainSelector: "10344971235874465080",
        tokens: {
          usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
        },
        receiverAddress: "0x31CB776486812C8d24cF04e6A124f263e9CCA4e0",
      },
      arbSepolia: {
        chainSelector: "3478487238524512106",
        tokens: {
          usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
        },
        receiverAddress: "0x1859E66C6FCF273d7c37A049A79165Ef54F24B95",
      },
      amoy: {
        chainSelector: "16281711391670634445",
        tokens: {
          usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
        },
        receiverAddress: "0x82ba4A0Eb6c0c706fF0e803207122C7168F34537",
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
        receiverAddress: "0x147914414C2F1dbAA3EAe6E16F0423d2A8b2E6Bb",
      },
      opSepolia: {
        chainSelector: "5224473277236331295",
        tokens: {
          usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        },
        receiverAddress: "0xc1527e883791043996cC445a1f0A004Ab9F6B48a",
      },
      arbSepolia: {
        chainSelector: "3478487238524512106",
        tokens: {
          usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        },
        receiverAddress: "0x1859E66C6FCF273d7c37A049A79165Ef54F24B95",
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
        receiverAddress: "0x147914414C2F1dbAA3EAe6E16F0423d2A8b2E6Bb",
      },
      opSepolia: {
        chainSelector: "5224473277236331295",
        tokens: {
          usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
        },
        receiverAddress: "0xc1527e883791043996cC445a1f0A004Ab9F6B48a",
      },
      baseSepolia: {
        chainSelector: "10344971235874465080",
        tokens: {
          usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
        },
        receiverAddress: "0x31CB776486812C8d24cF04e6A124f263e9CCA4e0",
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
        receiverAddress: "0x147914414C2F1dbAA3EAe6E16F0423d2A8b2E6Bb",
      },
      opSepolia: {
        chainSelector: "5224473277236331295",
        tokens: {
          usdc: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
        },
        receiverAddress: "0xc1527e883791043996cC445a1f0A004Ab9F6B48a",
      },
    },
    chainSelector: "16281711391670634445",
  },
};
export default allchains;
