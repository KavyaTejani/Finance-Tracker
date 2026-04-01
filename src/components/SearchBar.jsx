import { MdSearch, MdClose } from "react-icons/md";

export default function SearchBar({ value, onChange }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <MdSearch size={18} style={{
        position: "absolute", left: 12, top: "50%",
        transform: "translateY(-50%)", color: "#666",
      }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search transactions..."
        className="input"
        style={{ paddingLeft: 38, paddingRight: value ? 36 : 14 }}
      />
      {value && (
        <button onClick={() => onChange("")} style={{
          position: "absolute", right: 10, top: "50%",
          transform: "translateY(-50%)", background: "none",
          border: "none", cursor: "pointer", color: "#666",
          display: "flex", alignItems: "center",
        }}>
          <MdClose size={16} />
        </button>
      )}
    </div>
  );
}