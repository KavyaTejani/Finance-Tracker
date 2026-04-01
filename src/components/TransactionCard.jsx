import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { MdEdit, MdDelete, MdRepeat } from "react-icons/md";
import { toast } from "react-toastify";
import { useFinance } from "../context/FinanceContext.jsx";
import { CATEGORIES } from "../constants/categories.js";
import { formatINR } from "../utils/currencyFormatter.js";

export default function TransactionCard({ transaction }) {
  const { deleteTransaction } = useFinance();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const category = CATEGORIES.find((c) => c.name === transaction.category);
  const isExpense = transaction.type === "expense";

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    deleteTransaction(transaction.id);
    toast.success("Transaction deleted");
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0", borderBottom: "1px solid #2a2a2a",
    }}>
      {/* Category emoji */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${category?.color}22`,
        display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 20, flexShrink: 0,
      }}>
        {category?.emoji || "📦"}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: "#fff", 
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {transaction.title}
          </span>
          {transaction.recurring && (
            <MdRepeat size={13} color="#888" title="Recurring" />
          )}
        </div>
        <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
          {transaction.category}
          {transaction.notes && ` · ${transaction.notes}`}
        </div>
      </div>

      {/* Amount */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{
          fontWeight: 700, fontSize: 15,
          color: isExpense ? "#e85d5d" : "#4a90d9",
        }}>
          {isExpense ? "- " : "+ "}{formatINR(transaction.amount)}
        </div>
        <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
          {format(parseISO(transaction.date), "hh:mm a")}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
        <button onClick={() => navigate(`/transactions/edit/${transaction.id}`)}
          style={{ background: "none", border: "none", cursor: "pointer",
            color: "#555", padding: 4, borderRadius: 4 }}>
          <MdEdit size={16} />
        </button>
        <button onClick={handleDelete}
          style={{ background: "none", border: "none", cursor: "pointer",
            color: confirmDelete ? "#e85d5d" : "#555", padding: 4, borderRadius: 4,
            transition: "color 0.2s" }}>
          <MdDelete size={16} />
        </button>
      </div>
    </div>
  );
}