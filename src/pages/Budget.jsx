import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useBudget } from "../hooks/useBudget.js";
import { formatINR } from "../utils/currencyFormatter.js";

const STATUS_COLORS = { safe: "#2ecc71", warning: "#f5a623", danger: "#e85d5d" };

export default function Budget() {
  const { spent, remaining, percentage, status, byCategory, budget, setBudget } = useBudget();
  const [input, setInput] = useState(budget.monthlyBudget || "");
  const color = STATUS_COLORS[status];

  function handleSave() {
    const val = parseFloat(input);
    if (!val || val <= 0) { toast.error("Enter a valid budget"); return; }
    setBudget(val);
    toast.success("Budget updated!");
  }

  return (
    <motion.div className="page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}>

      <h1 style={{ fontSize: 22, fontWeight: 700, padding: "20px 0 16px" }}>Budget</h1>

      {/* Set budget */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>Monthly budget (₹)</p>
        <div style={{ display: "flex", gap: 10 }}>
          <input type="number" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 50000" className="input" style={{ flex: 1 }} />
          <button onClick={handleSave} style={{
            background: "#e85d5d", border: "none", borderRadius: 8,
            color: "#fff", fontWeight: 700, fontSize: 14,
            padding: "0 20px", cursor: "pointer",
          }}>
            Save
          </button>
        </div>
      </div>

      {budget.monthlyBudget > 0 && (
        <>
          {/* Overview card */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 15, fontWeight: 700 }}>This month</p>
              <span style={{ fontSize: 13, fontWeight: 700, color,
                background: `${color}22`, padding: "4px 10px", borderRadius: 99 }}>
                {percentage}% used
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ background: "#2e2e2e", borderRadius: 99,
              height: 12, overflow: "hidden", marginBottom: 16 }}>
              <div style={{
                width: `${percentage}%`, height: "100%",
                background: color, borderRadius: 99,
                transition: "width 0.5s ease",
              }} />
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { label: "Budget",    value: formatINR(budget.monthlyBudget), color: "#fff" },
                { label: "Spent",     value: formatINR(spent),                color: "#e85d5d" },
                { label: "Remaining", value: formatINR(remaining),            color },
              ].map(({ label, value, color: c }) => (
                <div key={label} style={{ textAlign: "center", background: "#2e2e2e",
                  borderRadius: 10, padding: "12px 8px" }}>
                  <p style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: c }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Status message */}
            {status === "danger" && (
              <div style={{ marginTop: 14, background: "#e85d5d22", border: "1px solid #e85d5d44",
                borderRadius: 8, padding: "10px 14px" }}>
                <p style={{ fontSize: 13, color: "#e85d5d" }}>
                  ⚠️ You have exceeded 90% of your budget!
                </p>
              </div>
            )}
            {status === "warning" && (
              <div style={{ marginTop: 14, background: "#f5a62322", border: "1px solid #f5a62344",
                borderRadius: 8, padding: "10px 14px" }}>
                <p style={{ fontSize: 13, color: "#f5a623" }}>
                  ⚡ You are nearing your budget limit.
                </p>
              </div>
            )}
          </div>

          {/* Category breakdown */}
          {byCategory.length > 0 && (
            <div className="card">
              <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
                By category
              </p>
              {byCategory.map((cat) => {
                const pct = budget.monthlyBudget > 0
                  ? Math.min(100, Math.round((cat.total / budget.monthlyBudget) * 100))
                  : 0;
                return (
                  <div key={cat.name} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 13 }}>{cat.emoji} {cat.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: cat.color }}>
                        {formatINR(cat.total)}
                        <span style={{ fontSize: 11, color: "#666", marginLeft: 4 }}>
                          ({pct}%)
                        </span>
                      </span>
                    </div>
                    <div style={{ background: "#2e2e2e", borderRadius: 99,
                      height: 6, overflow: "hidden" }}>
                      <div style={{
                        width: `${pct}%`, height: "100%",
                        background: cat.color, borderRadius: 99,
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}