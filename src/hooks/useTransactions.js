import { useMemo } from "react";
import { useFinance } from "../context/FinanceContext.jsx";
import { parseISO, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";

export function useTransactions({ search = "", category = "", type = "", sortBy = "date-desc", dateRange = null } = {}) {
  const { transactions, addTransaction, deleteTransaction, updateTransaction } = useFinance();

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.notes || "").toLowerCase().includes(q)
      );
    }

    if (category) result = result.filter((t) => t.category === category);
    if (type) result = result.filter((t) => t.type === type);

    if (dateRange?.start && dateRange?.end) {
      result = result.filter((t) =>
        isWithinInterval(parseISO(t.date), { start: dateRange.start, end: dateRange.end })
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":   return new Date(a.date) - new Date(b.date);
        case "date-desc":  return new Date(b.date) - new Date(a.date);
        case "amount-asc": return a.amount - b.amount;
        case "amount-desc":return b.amount - a.amount;
        case "category-asc": return a.category.localeCompare(b.category);
        default:           return new Date(b.date) - new Date(a.date);
      }
    });

    return result;
  }, [transactions, search, category, type, sortBy, dateRange]);

  // Group transactions by date string (for Daily view)
  const groupedByDate = useMemo(() => {
    return filtered.reduce((acc, t) => {
      const day = t.date.slice(0, 10);
      if (!acc[day]) acc[day] = [];
      acc[day].push(t);
      return acc;
    }, {});
  }, [filtered]);

  // Current month totals
  const monthlyTotals = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const thisMonth = transactions.filter((t) =>
      isWithinInterval(parseISO(t.date), { start, end })
    );
    const income = thisMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = thisMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expenses, net: income - expenses };
  }, [transactions]);

  return {
    transactions: filtered,
    groupedByDate,
    monthlyTotals,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
}