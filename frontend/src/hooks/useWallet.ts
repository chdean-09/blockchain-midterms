import { useState, useCallback, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { CHAIN_ID, SEPOLIA_CHAIN_ID_HEX } from "../config";

interface WalletState {
  address: string | null;
  provider: BrowserProvider | null;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    provider: null,
    isCorrectNetwork: false,
    isConnecting: false,
  });

  const checkNetwork = useCallback(async (provider: BrowserProvider) => {
    const network = await provider.getNetwork();
    return Number(network.chainId) === CHAIN_ID;
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this dApp.");
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true }));

    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const isCorrectNetwork = await checkNetwork(provider);

      setState({ address, provider, isCorrectNetwork, isConnecting: false });
    } catch {
      setState((prev) => ({ ...prev, isConnecting: false }));
    }
  }, [checkNetwork]);

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });
    } catch (err) {
      console.error("Failed to switch network:", err);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        setState({ address: null, provider: null, isCorrectNetwork: false, isConnecting: false });
      } else {
        const provider = new BrowserProvider(window.ethereum!);
        checkNetwork(provider).then((isCorrectNetwork) => {
          setState({ address: accounts[0], provider, isCorrectNetwork, isConnecting: false });
        });
      }
    };

    const handleChainChanged = () => {
      if (state.address) {
        const provider = new BrowserProvider(window.ethereum!);
        checkNetwork(provider).then((isCorrectNetwork) => {
          setState((prev) => ({ ...prev, provider, isCorrectNetwork }));
        });
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [state.address, checkNetwork]);

  return {
    address: state.address,
    provider: state.provider,
    isCorrectNetwork: state.isCorrectNetwork,
    isConnecting: state.isConnecting,
    connect,
    switchNetwork,
  };
}
