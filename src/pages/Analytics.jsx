import { useState } from "react";
import { motion } from "framer-motion";
import { useFinance } from "../context/FinanceContext.jsx";
import { useTransactions } from "../hooks/useTransactions.js";
import PieChart from "../components/Charts/PieChart.jsx";
import BarChart from "../components/Charts/BarChart.jsx";
import LineChart from "../components/Charts/LineChart.jsx";
import { formatINR } from "../utils/currencyFormatter.js";
import { CATEGORIES } from "../constants/categories.js";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";

export default function Analytics() {
  const [view, setView] = useState("monthly");
  const { transactions } = useFinance();

  const now = new Date();
  const range = view === "monthly"
    ? { start: startOfMonth(now), end: endOfMonth(now) }
    : { start: startOfWeek(now), end: endOfWeek(now) };

  const filtered = transactions.filter((t) =>
    isWithinInterval(parseISO(t.date), range)
  );

  const income   = filtered.filter((t) => t.type === "income").reduce((s, t)  => s + t.amount, 0);
  const expenses = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const net      = income - expenses;

  // Category breakdown
  const byCategory = CATEGORIES.map((cat) => ({
    ...cat,
    total: filtered
      .filter((t) => t.type === "expense" && t.category === cat.name)
      .reduce((s, t) => s + t.amount, 0),
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  const topCat = byCategory[0];

  return (
    <motion.div className="page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}>

      {/* Header + toggle */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", padding: "20px 0 16px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Analytics</h1>
        <div style={{ background: "#2e2e2e", borderRadius: 8,
          padding: 4, display: "flex", gap: 4 }}>
          {["weekly", "monthly"].map((v) => (
            <button key={v} onClick={() => setView(v)}
              style={{
                padding: "6px 14px", borderRadius: 6, border: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: view === v ? "#e85d5d" : "transparent",
                color: view === v ? "#fff" : "#666",
                transition: "all 0.2s",
              }}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10, marginBottom: 20 }}>
        {[
          { label: "Income",   value: income,   color: "#4a90d9" },
          { label: "Expenses", value: expenses,  color: "#e85d5d" },
          { label: "Net",      value: net,       color: net >= 0 ? "#2ecc71" : "#e85d5d" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: "center", padding: "14px 8px" }}>
            <p style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color }}>{formatINR(value)}</p>
          </div>
        ))}
      </div>

      {/* Top category */}
      {topCat && (
        <div className="card" style={{ marginBottom: 16, display: "flex",
          justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, color: "#666" }}>Top spending category</p>
            <p style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
              {topCat.emoji} {topCat.name}
            </p>
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, color: topCat.color }}>
            {formatINR(topCat.total)}
          </p>
        </div>
      )}

      {/* Pie chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
          Spending by category
        </p>
        <PieChart transactions={filtered} />
      </div>

      {/* Bar chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
          Income vs Expenses (6 months)
        </p>
        <BarChart transactions={transactions} />
      </div>

      {/* Line chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
          Spending trend (6 months)
        </p>
        <LineChart transactions={transactions} />
      </div>

      {/* Category table */}
      {byCategory.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
            Category breakdown
          </p>
          {byCategory.map((cat, i) => (
            <div key={cat.name} style={{
              display: "flex", alignItems: "center", gap: 12,
              paddingBottom: i < byCategory.length - 1 ? 12 : 0,
              marginBottom: i < byCategory.length - 1 ? 12 : 0,
              borderBottom: i < byCategory.length - 1 ? "1px solid #2a2a2a" : "none",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8,
                background: `${cat.color}22`, display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {cat.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between",
                  marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{cat.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>
                    {formatINR(cat.total)}
                  </span>
                </div>
                <div style={{ background: "#2e2e2e", borderRadius: 99,
                  height: 5, overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.round((cat.total / expenses) * 100)}%`,
                    height: "100%", background: cat.color, borderRadius: 99,
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}