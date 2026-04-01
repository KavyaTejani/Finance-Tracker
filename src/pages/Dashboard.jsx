import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext.jsx";
import { useTransactions } from "../hooks/useTransactions.js";
import BudgetCard from "../components/BudgetCard.jsx";
import PieChart from "../components/Charts/PieChart.jsx";
import BarChart from "../components/Charts/BarChart.jsx";
import LineChart from "../components/Charts/LineChart.jsx";
import TransactionCard from "../components/TransactionCard.jsx";
import { formatINR } from "../utils/currencyFormatter.js";
import { CATEGORIES } from "../constants/categories.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const { transactions } = useFinance();
  const { monthlyTotals } = useTransactions();

  const recent = transactions.slice(0, 5);

  const topCategory = (() => {
    const totals = {};
    transactions.filter((t) => t.type === "expense").forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    const top = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    if (!top) return null;
    const cat = CATEGORIES.find((c) => c.name === top[0]);
    return { name: top[0], amount: top[1], emoji: cat?.emoji };
  })();

  return (
    <motion.div className="page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}>

      {/* Header */}
      <div style={{ padding: "20px 0 12px", display: "flex",
        justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 12, color: "#666" }}>Overview</p>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h1>
        </div>
        {topCategory && (
          <div style={{ background: "#242424", borderRadius: 10,
            padding: "6px 12px", border: "1px solid #333", textAlign: "right" }}>
            <p style={{ fontSize: 10, color: "#666" }}>Top spend</p>
            <p style={{ fontSize: 13, fontWeight: 600 }}>
              {topCategory.emoji} {topCategory.name}
            </p>
          </div>
        )}
      </div>

      {/* KPI cards */}
      <div className="desktop-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Income",   value: monthlyTotals.income,   color: "#4a90d9" },
          { label: "Expenses", value: monthlyTotals.expenses,  color: "#e85d5d" },
          { label: "Net",      value: monthlyTotals.net,       color: monthlyTotals.net >= 0 ? "#2ecc71" : "#e85d5d" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: "center", padding: "14px 8px" }}>
            <p style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color }}>{formatINR(value)}</p>
          </div>
        ))}
      </div>

      <div className="desktop-grid">
        {/* Budget card */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle title="Budget" action="Set budget" onAction={() => navigate("/budget")} />
          <BudgetCard />
        </div>

        {/* Recent transactions */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle title="Recent" action="See all"
            onAction={() => navigate("/transactions")} />
          <div className="card" style={{ height: "calc(100% - 34px)" }}>
            {recent.length === 0
              ? <EmptyState message="No transactions yet" sub="Tap + to add your first one" />
              : recent.map((t) => <TransactionCard key={t.id} transaction={t} />)
            }
          </div>
        </div>
      </div>

      <div className="desktop-grid">
        {/* Pie chart */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle title="Spending by category" />
          <div className="card">
            <PieChart transactions={transactions} />
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle title="Income vs Expenses" />
          <div className="card">
            <BarChart transactions={transactions} />
          </div>
        </div>
      </div>

      {/* Line chart */}
      <div className="desktop-full-width" style={{ marginBottom: 20 }}>
        <SectionTitle title="Spending trend" />
        <div className="card">
          <LineChart transactions={transactions} />
        </div>
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => navigate("/transactions/new")}>+</button>
    </motion.div>
  );
}

function SectionTitle({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between",
      alignItems: "center", marginBottom: 10 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h2>
      {action && (
        <button onClick={onAction} style={{ background: "none", border: "none",
          color: "#e85d5d", fontSize: 13, cursor: "pointer" }}>
          {action}
        </button>
      )}
    </div>
  );
}

function EmptyState({ message, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 0", color: "#555" }}>
      <p style={{ fontSize: 14, marginBottom: 4 }}>{message}</p>
      {sub && <p style={{ fontSize: 12 }}>{sub}</p>}
    </div>
  );
}