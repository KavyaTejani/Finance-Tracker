import { useBudget } from "../hooks/useBudget.js";
import { formatINR } from "../utils/currencyFormatter.js";

const STATUS_COLORS = {
  safe:    "#2ecc71",
  warning: "#f5a623",
  danger:  "#e85d5d",
};

export default function BudgetCard() {
  const { spent, remaining, percentage, status, budget } = useBudget();
  const color = STATUS_COLORS[status];

  if (!budget.monthlyBudget) {
    return (
      <div className="card" style={{ textAlign: "center", color: "#666", padding: 24 }}>
        <p style={{ fontSize: 14 }}>No budget set yet.</p>
        <p style={{ fontSize: 12, marginTop: 4 }}>Go to the Budget page to set one.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: "#888" }}>Monthly Budget</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>
          {percentage}% used
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ background: "#2e2e2e", borderRadius: 99, height: 8, overflow: "hidden" }}>
        <div style={{
          width: `${percentage}%`, height: "100%",
          background: color, borderRadius: 99,
          transition: "width 0.4s ease",
        }} />
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
        {[
          { label: "Budget",    value: formatINR(budget.monthlyBudget), color: "#fff" },
          { label: "Spent",     value: formatINR(spent),                color: "#e85d5d" },
          { label: "Remaining", value: formatINR(remaining),            color: color },
        ].map(({ label, value, color: c }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}