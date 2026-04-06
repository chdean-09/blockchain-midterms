import type { ReactNode } from "react";

interface NetworkGuardProps {
  isConnected: boolean;
  isCorrectNetwork: boolean;
  onSwitch: () => void;
  children: ReactNode;
}

export function NetworkGuard({
  isConnected,
  isCorrectNetwork,
  onSwitch,
  children,
}: NetworkGuardProps) {
  if (isConnected && !isCorrectNetwork) {
    return (
      <div className="network-guard">
        <div className="network-guard-content">
          <h2>Wrong Network</h2>
          <p>Please switch to the Sepolia testnet to use TipPost.</p>
          <button className="switch-btn" onClick={onSwitch}>
            Switch to Sepolia
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
