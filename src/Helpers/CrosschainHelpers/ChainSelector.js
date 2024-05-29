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
        receiverAddress: "0x06125C0a106Cd2aBEC11Ca1Dc28804790A91325C",
        iconUrl:
        "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
      },
      baseSepolia: {
        chainSelector: "10344971235874465080",
        tokens: {
          usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
        receiverAddress: "0xc8b9945C14996501212f289f57009e4e73ebD7a5",
        iconUrl:
        "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
      },
      arbSepolia: {
        chainSelector: "3478487238524512106",
        tokens: {
          usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
        receiverAddress: "0x1859E66C6FCF273d7c37A049A79165Ef54F24B95",
        iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmVbtAexzRc2ReSWWyw2Ft7wwkKzsagqnfz3PNfxwM9NMM",
      },
      amoy: {
        chainSelector: "16281711391670634445",
        tokens: {
          usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
        receiverAddress: "0x82ba4A0Eb6c0c706fF0e803207122C7168F34537",
        iconUrl:
        "https://gateway.lighthouse.storage/ipfs/QmUjiVLiprjXMPceS7r51XNGu277meEkhtWhvH59D2XhzR",
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
        receiverAddress: "0x568ABafeCaB14144D63357D694d9c3155F6e8b3b",
        iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmYAbLYRm3DCx261ko8ERjhCgWwf57jAWkxbNcibx8haBi",
      },
      baseSepolia: {
        chainSelector: "10344971235874465080",
        tokens: {
          usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
        },
        receiverAddress: "0xc8b9945C14996501212f289f57009e4e73ebD7a5",
        iconUrl:
        "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
      },
      arbSepolia: {
        chainSelector: "3478487238524512106",
        tokens: {
          usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
        },
        receiverAddress: "0x1859E66C6FCF273d7c37A049A79165Ef54F24B95",
        iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmVbtAexzRc2ReSWWyw2Ft7wwkKzsagqnfz3PNfxwM9NMM",
      },
      amoy: {
        chainSelector: "16281711391670634445",
        tokens: {
          usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
        },
        receiverAddress: "0x82ba4A0Eb6c0c706fF0e803207122C7168F34537",
        iconUrl:
        "https://gateway.lighthouse.storage/ipfs/QmUjiVLiprjXMPceS7r51XNGu277meEkhtWhvH59D2XhzR",
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
        receiverAddress: "0x568ABafeCaB14144D63357D694d9c3155F6e8b3b",
        iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmYAbLYRm3DCx261ko8ERjhCgWwf57jAWkxbNcibx8haBi",
      },
      opSepolia: {
        chainSelector: "5224473277236331295",
        tokens: {
          usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        },
        receiverAddress: "0x06125C0a106Cd2aBEC11Ca1Dc28804790A91325C",
        iconUrl:
        "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",

      },
      arbSepolia: {
        chainSelector: "3478487238524512106",
        tokens: {
          usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        },
        receiverAddress: "0x1859E66C6FCF273d7c37A049A79165Ef54F24B95",
        iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmVbtAexzRc2ReSWWyw2Ft7wwkKzsagqnfz3PNfxwM9NMM",
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
        receiverAddress: "0x568ABafeCaB14144D63357D694d9c3155F6e8b3b",
        iconUrl:
        "https://gateway.lighthouse.storage/ipfs/Qmef99zfw3Wgz6E6c3hN1mypsorGDd4DdcJc6MsvWDdnAD",
      },
      opSepolia: {
        chainSelector: "5224473277236331295",
        tokens: {
          usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
        },
        receiverAddress: "0x06125C0a106Cd2aBEC11Ca1Dc28804790A91325C",
        iconUrl:
        "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
      },
      baseSepolia: {
        chainSelector: "10344971235874465080",
        tokens: {
          usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
        },
        receiverAddress: "0xc8b9945C14996501212f289f57009e4e73ebD7a5",
        iconUrl:
        "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
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
        receiverAddress: "0x568ABafeCaB14144D63357D694d9c3155F6e8b3b",
        iconUrl:
    "https://gateway.lighthouse.storage/ipfs/QmYAbLYRm3DCx261ko8ERjhCgWwf57jAWkxbNcibx8haBi",
      },
      opSepolia: {
        chainSelector: "5224473277236331295",
        tokens: {
          usdc: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
        },
        receiverAddress: "0x06125C0a106Cd2aBEC11Ca1Dc28804790A91325C",
        iconUrl:
        "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
      },
    },
    chainSelector: "16281711391670634445",
  },
};
export default allchains;
