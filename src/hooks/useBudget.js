import { useMemo } from "react";
import { useFinance } from "../context/FinanceContext.jsx";
import { parseISO, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import { CATEGORIES } from "../constants/categories.js";

export function useBudget() {
  const { transactions, budget, setBudget } = useFinance();

  const { spent, remaining, percentage, status, byCategory } = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const thisMonthExpenses = transactions.filter(
      (t) => t.type === "expense" && isWithinInterval(parseISO(t.date), { start, end })
    );

    const spent = thisMonthExpenses.reduce((s, t) => s + t.amount, 0);
    const remaining = Math.max(0, budget.monthlyBudget - spent);
    const percentage = budget.monthlyBudget > 0
      ? Math.min(100, Math.round((spent / budget.monthlyBudget) * 100))
      : 0;

    const status = percentage >= 90 ? "danger" : percentage >= 70 ? "warning" : "safe";

    // Spending per category
    const byCategory = CATEGORIES.map((cat) => {
      const total = thisMonthExpenses
        .filter((t) => t.category === cat.name)
        .reduce((s, t) => s + t.amount, 0);
      return { ...cat, total };
    }).filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);

    return { spent, remaining, percentage, status, byCategory };
  }, [transactions, budget]);

  return { spent, remaining, percentage, status, byCategory, budget, setBudget };
}