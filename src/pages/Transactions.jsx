import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { MdFilterList, MdClose } from "react-icons/md";
import { useTransactions } from "../hooks/useTransactions.js";
import { useDebounce } from "../hooks/useDebounce.js";
import SearchBar from "../components/SearchBar.jsx";
import Filters from "../components/Filters.jsx";
import TransactionCard from "../components/TransactionCard.jsx";
import { formatINR } from "../utils/currencyFormatter.js";

const DEFAULT_FILTERS = {
  category: "", type: "", sortBy: "date-desc", startDate: "", endDate: "",
};

export default function Transactions() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(search, 300);

  const dateRange = filters.startDate && filters.endDate
    ? { start: new Date(filters.startDate), end: new Date(filters.endDate) }
    : null;

  const { transactions, groupedByDate, monthlyTotals } = useTransactions({
    search: debouncedSearch,
    category: filters.category,
    type: filters.type,
    sortBy: filters.sortBy,
    dateRange,
  });

  const hasActiveFilters = filters.category || filters.type ||
    filters.startDate || filters.endDate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}>

      {/* Summary bar */}
      <div className="summary-bar">
        <div>
          <div className="label">Income</div>
          <div className="value income">{formatINR(monthlyTotals.income)}</div>
        </div>
        <div>
          <div className="label">Expenses</div>
          <div className="value expense">{formatINR(monthlyTotals.expenses)}</div>
        </div>
        <div>
          <div className="label">Total</div>
          <div className="value net"
            style={{ color: monthlyTotals.net >= 0 ? "#4a90d9" : "#e85d5d" }}>
            {formatINR(monthlyTotals.net)}
          </div>
        </div>
      </div>

      <div className="page" style={{ paddingTop: 16 }}>
        {/* Search + filter toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <button onClick={() => setShowFilters((v) => !v)}
            style={{
              background: hasActiveFilters ? "#e85d5d22" : "#2e2e2e",
              border: `1px solid ${hasActiveFilters ? "#e85d5d" : "#333"}`,
              borderRadius: 8, padding: "0 12px", cursor: "pointer",
              color: hasActiveFilters ? "#e85d5d" : "#888",
              display: "flex", alignItems: "center", gap: 4,
            }}>
            {showFilters ? <MdClose size={18} /> : <MdFilterList size={18} />}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: 16 }}>
            <Filters filters={filters} onChange={setFilters} />
          </motion.div>
        )}

        {/* Results count */}
        {(debouncedSearch || hasActiveFilters) && (
          <p style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
            {transactions.length} result{transactions.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Transaction groups */}
        {transactions.length === 0 ? (
          <EmptyState search={debouncedSearch} />
        ) : (
          Object.entries(groupedByDate)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, txns]) => {
              const dayTotal = txns
                .filter((t) => t.type === "expense")
                .reduce((s, t) => s + t.amount, 0);
              return (
                <div key={date}>
                  <div className="section-header">
                    <span className="date-label">
                      {format(parseISO(date), "EEE, dd MMM yyyy")}
                    </span>
                    <span className="day-total">
                      {dayTotal > 0 ? `- ${formatINR(dayTotal)}` : ""}
                    </span>
                  </div>
                  <div className="card" style={{ padding: "0 14px" }}>
                    {txns.map((t) => (
                      <TransactionCard key={t.id} transaction={t} />
                    ))}
                  </div>
                </div>
              );
            })
        )}
      </div>

      <button className="fab" onClick={() => navigate("/transactions/new")}>+</button>
    </motion.div>
  );
}

function EmptyState({ search }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "#555" }}>
      <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
      <p style={{ fontSize: 15, color: "#888" }}>
        {search ? `No results for "${search}"` : "No transactions yet"}
      </p>
      <p style={{ fontSize: 13, marginTop: 6 }}>
        {search ? "Try a different search" : "Tap + to add your first one"}
      </p>
    </div>
  );
}