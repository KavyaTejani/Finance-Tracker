import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CATEGORIES } from "../../constants/categories";
import { formatINR } from "../../utils/currencyFormatter";

export default function PieChart({ transactions }) {
  const data = CATEGORIES.map((cat) => ({
    name: cat.name,
    value: transactions
      .filter((t) => t.type === "expense" && t.category === cat.name)
      .reduce((s, t) => s + t.amount, 0),
    color: cat.color,
    emoji: cat.emoji,
  })).filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#555", padding: 40, fontSize: 14 }}>
        No expense data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsPie>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
          paddingAngle={3} dataKey="value">
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatINR(value)}
          contentStyle={{ background: "#242424", border: "1px solid #333",
            borderRadius: 8, color: "#fff" }}
        />
        <Legend
          formatter={(value, entry) => (
            <span style={{ color: "#ccc", fontSize: 12 }}>
              {entry.payload.emoji} {value}
            </span>
          )}
        />
      </RechartsPie>
    </ResponsiveContainer>
  );
}