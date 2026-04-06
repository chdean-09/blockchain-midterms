export function parseContractError(error: unknown): string {
  const err = error as { code?: string; reason?: string; message?: string };

  if (err.code === "ACTION_REJECTED") {
    return "Transaction rejected by user.";
  }

  if (err.code === "INSUFFICIENT_FUNDS") {
    return "Insufficient funds for this transaction.";
  }

  if (err.reason) {
    return err.reason;
  }

  if (err.code === "NETWORK_ERROR") {
    return "Network error. Please check your connection.";
  }

  return err.message || "An unknown error occurred.";
}
