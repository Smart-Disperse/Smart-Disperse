export const getDestChainAddress = async (chainName) => {
  switch (chainName) {
    case "ethereum-2":
      return "0xC4C295D556C88A61dD1dB2a58143BB416bFaA530";
      break;
    case "Polygon":
      return "0x5B799DC7CA6171880dA7F7dD90A2c8b15e5335d6";
      break;
    case "Avalanche":
      return "0x13c76F0Ac8Ae7bAdf383A4f94099acdc1021cBE2";
      break;
    case "Moonbeam":
      return "0xd38875CCD7a985f64a6d9Ad8fE45a2f0dEB2ae7e";
      break;
    case "arbitrum":
      return "0x05c106CaD72b04c09F228286fEd949eC6f9539a7";
      break;
    case "celo":
      return "0x05c106CaD72b04c09F228286fEd949eC6f9539a7";
      break;
  }
};
