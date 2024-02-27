import { useEffect } from "react";

function useChainChangeReload() {
  useEffect(() => {
    const handleChainChange = () => {
      location.reload(true);
    };

    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChange);
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.off("chainChanged", handleChainChange);
      }
    };
  }, []);
}

export default useChainChangeReload;
