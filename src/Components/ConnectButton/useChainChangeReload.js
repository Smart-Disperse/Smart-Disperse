import { useEffect } from "react";

function useChainChangeReload() {
  useEffect(() => {
    const handleChainChange = () => {
      location.reload(true);
    };

    const handleAccountsChanged = () => {
      location.reload(true);
    };

    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChange);
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.off("chainChanged", handleChainChange);
        window.ethereum.off("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);
}

export default useChainChangeReload;
