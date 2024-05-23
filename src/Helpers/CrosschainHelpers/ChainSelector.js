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
    logourl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ3SURBVHgB7ZtbbFRVFEDXFKalxPAIIj4Qi6WlBWsADRHrI4jYaOq7Ej4wFfRDA0L9gCCJj0RCQ/THWOtHQ3x8qFEjaExMEZPSpoEaSRXBKpVAIq9WEa1PQjv13Bwm597O3G4+zjA/eyWTnH3PmZnMunfvfc9MJjE8tmQYJZYClFFRQQIqSEAFCaggARUkoIIEVJCAChJQQQIqSEAFCaggARUkoIIEVJCAChJQQQIqSEAFCaggARUkoIIEVJCAChJQQQJjuRiMHwe33gRLquHqK8yBBLR3wc52OHw0/nnzq2DTajtOBb+Qp9zckIl7j8CXndBhXms4N7+gJ3L623yBEbH+SfuYOCH7mk93wVMbof905ty6VfDKc4gcPQZPrIfde/FN7lJs2qWwYxts3hAvJ+C+O6HtQ3Mtj8mcqyzjgiiZDh+3wMJ5+CY3gooKoWkz3L3YHQvSacVa8yFqoWYFbG91c2Uz4dk1ma9TUerGPT/BLQ+ZVH0YbjOPJcvh1W0utSZcAo0b8U1uatDqenigxsXN70DDi9E68fV+uGwKVN9o47UmnRqbYfCcjRMmPStmufU/Hoau7uj7BHVs5gxzFS618aIFMK4I/juLL/xfQWNMqqx5zMVBfVj3QmYRHfgTWne7eJJJw9IZLp5TDlMmu/jb78nKwV43TiahuBif+Be0cpnpVFe6eGtz/NrjJ6PxnFDNWXBddK7rG7IyN/Scc+bqGxjAJ/4F3bvUjYeG4O2P4tcWFo6Ik248skB3ZOlQ9XUuvQL2mhQcSuET/zWoMlQ39vfYsxpHUIPCnPrVja+vcON//jUyltk0TaWs2PvvgjtudmuCucbX8Y1fQQUFtuWm6f9t9PXlpdE4fNN47TVuPN7UlaaXiOWsKcpPPw9ftOMbv4KCDhJ0nzRnfo9fGxTzqtku/vkEHDtfk4rNnXdZCSKDg/DBZ/DyG3DgELnAr6DgTAYplTxfS0a7/a+53aRRpYt3dbjxohuia1veg86v7DhhrtJBU9tO9pkUNp3tjN+iPBK/goICGVwJ6fQI16ORNDzuxoHILU0uXjg/urblXeg+QD7w38V27HTjeXPhkdrofNKck62bYHGowL72pr1fSlNV7sZ//W2LfZ7wv1m96nJztj+HyZNsHHSg9z8xH/IHc2wi1N1j7l1Ctaf7oN1+hOnc7vZVe/aZrUUd+cJ/mz9+CjZssV2nqMh2oFXLs69tbYNHGzKPV4Va/KEj5JPcbFbfMrvz6gdh33fZ54NtQ/0zULvSFNk/onOzSmwXS9PTSz5J5Py/GtPNF2Szzf3OVHNT2Ndv2/Evp+PXT5tqv1hL07YHTvSRLxL6Z5bR0e+kBVSQgAoSUEECKkhABQmoIAEVJKCCBFSQgAoSUEECKkhABQmoIAEVJKCCBFSQgAoSUEECKkhABQmoIAEVJKCCBFSQwP/r3fNwstl7WwAAAABJRU5ErkJggg==",
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
  },
};
export default allchains;
