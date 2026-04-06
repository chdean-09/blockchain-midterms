interface ConnectWalletProps {
  address: string | null;
  isConnecting: boolean;
  onConnect: () => void;
}

export function ConnectWallet({ address, isConnecting, onConnect }: ConnectWalletProps) {
  if (address) {
    return (
      <div className="wallet-info">
        <span className="wallet-dot" />
        <span className="wallet-address">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <button className="connect-btn" onClick={onConnect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
