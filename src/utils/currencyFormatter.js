export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatAmount(amount, type) {
  const formatted = formatINR(Math.abs(amount));
  return type === "expense" ? `- ${formatted}` : `+ ${formatted}`;
}