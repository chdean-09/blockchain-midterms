import { useEffect } from "react";
import type { TransactionState } from "../types";

interface TransactionStatusProps {
  txState: TransactionState;
  onDismiss: () => void;
}

export function TransactionStatus({ txState, onDismiss }: TransactionStatusProps) {
  useEffect(() => {
    if (txState.status === "success") {
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [txState.status, onDismiss]);

  if (txState.status === "idle") return null;

  return (
    <div className={`toast toast-${txState.status}`}>
      <div className="toast-content">
        {txState.status === "pending" && <span className="toast-spinner" />}
        {txState.status === "success" && <span className="toast-icon">&#10003;</span>}
        {txState.status === "error" && <span className="toast-icon">&#10007;</span>}
        <span className="toast-message">{txState.message}</span>
        {txState.hash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txState.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="toast-link"
          >
            View on Etherscan
          </a>
        )}
      </div>
      {txState.status !== "pending" && (
        <button className="toast-close" onClick={onDismiss}>
          &times;
        </button>
      )}
    </div>
  );
}
