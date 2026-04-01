import { BarChart as RechartsBar, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { format, parseISO, startOfMonth } from "date-fns";
import { formatINR } from "../../utils/currencyFormatter";

export default function BarChart({ transactions }) {
  // Build last 6 months of income vs expense
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return startOfMonth(d);
  });

  const data = months.map((monthStart) => {
    const label = format(monthStart, "MMM");
    const monthStr = format(monthStart, "yyyy-MM");
    const monthTxns = transactions.filter((t) => t.date.startsWith(monthStr));
    return {
      month: label,
      Income:  monthTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      Expense: monthTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <RechartsBar data={data} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
        <Tooltip
          formatter={(value) => formatINR(value)}
          contentStyle={{ background: "#242424", border: "1px solid #333",
            borderRadius: 8, color: "#fff" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#888" }} />
        <Bar dataKey="Income"  fill="#4a90d9" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Expense" fill="#e85d5d" radius={[4, 4, 0, 0]} />
      </RechartsBar>
    </ResponsiveContainer>
  );
}