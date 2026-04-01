import { NavLink } from "react-router-dom";
import { MdReceiptLong, MdBarChart, MdAccountBalanceWallet, MdMenu } from "react-icons/md";
import { useState, useEffect } from "react";

const tabs = [
  { to: "/transactions", icon: <MdReceiptLong size={24} />, label: "Transactions" },
  { to: "/analytics",    icon: <MdBarChart size={24} />,    label: "Analytics" },
  { to: "/budget",       icon: <MdAccountBalanceWallet size={24} />, label: "Budget" },
  { to: "/dashboard",    icon: <MdMenu size={24} />,        label: "Dashboard" },
];

export default function BottomNav() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isDesktop) {
    // Desktop Sidebar Layout
    return (
      <nav style={{
        position: "fixed", top: 0, left: 0,
        width: 240, height: "100vh",
        background: "#1e1e1e", borderRight: "1px solid #333",
        display: "flex", flexDirection: "column",
        padding: "32px 0", zIndex: 50,
      }}>
        <div style={{ padding: "0 24px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
            <MdAccountBalanceWallet size={28} color="#e85d5d" />
            FinanceTracker
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {tabs.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "16px",
              padding: "12px 24px",
              color: isActive ? "#fff" : "#888",
              background: isActive ? "rgba(232, 93, 93, 0.1)" : "transparent",
              borderRight: isActive ? "3px solid #e85d5d" : "3px solid transparent",
              textDecoration: "none", fontSize: "15px", fontWeight: isActive ? "600" : "500",
              transition: "all 0.2s ease",
            })}>
              {({ isActive }) => (
                <>
                  <span style={{ color: isActive ? "#e85d5d" : "#888", display: "flex", alignItems: "center" }}>
                    {icon}
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    );
  }

  // Mobile Bottom Bar Layout
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0,
      width: "100%", background: "#1e1e1e", borderTop: "1px solid #333",
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      height: 72, zIndex: 50, paddingBottom: "env(safe-area-inset-bottom)"
    }}>
      {tabs.map(({ to, icon, label }) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 4,
          color: isActive ? "#e85d5d" : "#666",
          textDecoration: "none", fontSize: 11,
          transition: "color 0.2s",
        })}>
          {icon}
          <span>{label.substring(0, 5) + (label.length > 5 && label !== "Budget" ? "." : "")}</span>
        </NavLink>
      ))}
    </nav>
  );
}