import { CATEGORIES, SORT_OPTIONS } from "../constants/categories.js";

export default function Filters({ filters, onChange }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  const selectStyle = {
    background: "#2e2e2e", border: "1px solid #333",
    borderRadius: 8, padding: "8px 10px",
    color: "#fff", fontSize: 13, outline: "none",
    cursor: "pointer", flex: 1,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Row 1: Category + Type */}
      <div style={{ display: "flex", gap: 8 }}>
        <select value={filters.category} onChange={(e) => update("category", e.target.value)}
          style={selectStyle}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
          ))}
        </select>

        <select value={filters.type} onChange={(e) => update("type", e.target.value)}
          style={selectStyle}>
          <option value="">All types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {/* Row 2: Sort */}
      <select value={filters.sortBy} onChange={(e) => update("sortBy", e.target.value)}
        style={{ ...selectStyle, flex: "unset", width: "100%" }}>
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Row 3: Date range */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="date" value={filters.startDate}
          onChange={(e) => update("startDate", e.target.value)}
          className="input" style={{ flex: 1, fontSize: 13, padding: "8px 10px" }} />
        <span style={{ color: "#555", fontSize: 13 }}>to</span>
        <input type="date" value={filters.endDate}
          onChange={(e) => update("endDate", e.target.value)}
          className="input" style={{ flex: 1, fontSize: 13, padding: "8px 10px" }} />
      </div>

      {/* Clear filters */}
      {(filters.category || filters.type || filters.startDate || filters.endDate) && (
        <button onClick={() => onChange({ category: "", type: "", sortBy: "date-desc", startDate: "", endDate: "" })}
          style={{ background: "none", border: "1px solid #333", borderRadius: 8,
            color: "#e85d5d", fontSize: 13, padding: "7px 0", cursor: "pointer" }}>
          Clear filters
        </button>
      )}
    </div>
  );
}