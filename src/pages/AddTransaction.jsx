import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { MdArrowBack } from "react-icons/md";
import { useFinance } from "../context/FinanceContext.jsx";
import { CATEGORIES } from "../constants/categories.js";

const schema = yup.object({
  type:      yup.string().oneOf(["expense", "income"]).required(),
  title:     yup.string().required("Title is required").min(2, "Too short"),
  amount:    yup.number().typeError("Enter a valid amount")
               .positive("Must be positive").required("Amount is required"),
  category:  yup.string().required("Pick a category"),
  date:      yup.string().required("Date is required"),
  notes:     yup.string(),
  recurring: yup.boolean(),
});

export default function AddTransaction() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { transactions, addTransaction, updateTransaction } = useFinance();

  const existing = id ? transactions.find((t) => t.id === id) : null;
  const isEdit = Boolean(existing);

  const { register, handleSubmit, watch, setValue,
    formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type:      existing?.type      || "expense",
      title:     existing?.title     || "",
      amount:    existing?.amount    || "",
      category:  existing?.category  || "",
      date:      existing?.date
                   ? format(new Date(existing.date), "yyyy-MM-dd")
                   : format(new Date(), "yyyy-MM-dd"),
      notes:     existing?.notes     || "",
      recurring: existing?.recurring || false,
    },
  });

  const selectedType = watch("type");

  function onSubmit(data) {
    const payload = {
      ...data,
      amount: parseFloat(data.amount),
      date:   new Date(data.date).toISOString(),
    };

    if (isEdit) {
      updateTransaction({ ...existing, ...payload });
      toast.success("Transaction updated");
    } else {
      addTransaction(payload);
      toast.success("Transaction added");
    }
    navigate("/transactions");
  }

  const inputStyle = {
    width: "100%", background: "#2e2e2e", border: "1px solid #333",
    borderRadius: 8, padding: "13px 14px", color: "#fff",
    fontSize: 15, outline: "none",
  };

  const labelStyle = { fontSize: 13, color: "#888", marginBottom: 6, display: "block" };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12,
        padding: "16px 16px 8px", borderBottom: "1px solid #2a2a2a" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none",
          border: "none", color: "#888", cursor: "pointer", display: "flex" }}>
          <MdArrowBack size={22} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>
          {isEdit ? "Edit Transaction" : "Add Transaction"}
        </h1>
      </div>

      <div className="page" style={{ paddingTop: 20 }}>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Type toggle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 8, marginBottom: 20, background: "#2e2e2e",
            borderRadius: 10, padding: 4 }}>
            {["expense", "income"].map((t) => (
              <button key={t} type="button"
                onClick={() => setValue("type", t)}
                style={{
                  padding: "10px 0", borderRadius: 8, border: "none",
                  cursor: "pointer", fontWeight: 600, fontSize: 14,
                  transition: "all 0.2s",
                  background: selectedType === t
                    ? (t === "expense" ? "#e85d5d" : "#4a90d9")
                    : "transparent",
                  color: selectedType === t ? "#fff" : "#666",
                }}>
                {t === "expense" ? "Expense" : "Income"}
              </button>
            ))}
          </div>

          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Title</label>
            <input {...register("title")} placeholder="e.g. Lunch at canteen"
              style={inputStyle} />
            {errors.title && <p className="error-text">{errors.title.message}</p>}
          </div>

          {/* Amount */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Amount (₹)</label>
            <input {...register("amount")} type="number" step="0.01"
              placeholder="0.00" style={inputStyle} />
            {errors.amount && <p className="error-text">{errors.amount.message}</p>}
          </div>

          {/* Category */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Category</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {CATEGORIES.map((cat) => {
                const selected = watch("category") === cat.name;
                return (
                  <button key={cat.name} type="button"
                    onClick={() => setValue("category", cat.name)}
                    style={{
                      padding: "10px 4px", borderRadius: 10, border: "1px solid",
                      borderColor: selected ? cat.color : "#333",
                      background: selected ? `${cat.color}22` : "#2e2e2e",
                      cursor: "pointer", textAlign: "center",
                      transition: "all 0.15s",
                    }}>
                    <div style={{ fontSize: 20 }}>{cat.emoji}</div>
                    <div style={{ fontSize: 10, color: selected ? cat.color : "#666",
                      marginTop: 4, fontWeight: selected ? 600 : 400 }}>
                      {cat.name}
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.category && <p className="error-text">{errors.category.message}</p>}
          </div>

          {/* Date */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Date</label>
            <input {...register("date")} type="date" style={inputStyle} />
            {errors.date && <p className="error-text">{errors.date.message}</p>}
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Notes (optional)</label>
            <textarea {...register("notes")} placeholder="Add a note..."
              rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {/* Recurring toggle */}
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 28,
            background: "#2e2e2e", borderRadius: 10, padding: "14px 16px" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Recurring</p>
              <p style={{ fontSize: 12, color: "#666" }}>
                e.g. rent, subscriptions, EMIs
              </p>
            </div>
            <label style={{ position: "relative", width: 44, height: 24, cursor: "pointer" }}>
              <input {...register("recurring")} type="checkbox"
                style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: "absolute", inset: 0, borderRadius: 99,
                background: watch("recurring") ? "#e85d5d" : "#444",
                transition: "background 0.2s",
              }} />
              <span style={{
                position: "absolute", top: 3,
                left: watch("recurring") ? 23 : 3,
                width: 18, height: 18, borderRadius: "50%",
                background: "#fff", transition: "left 0.2s",
              }} />
            </label>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isSubmitting}
            style={{
              width: "100%", padding: "15px 0", borderRadius: 12, border: "none",
              background: selectedType === "expense" ? "#e85d5d" : "#4a90d9",
              color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
              opacity: isSubmitting ? 0.7 : 1, transition: "opacity 0.2s",
            }}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Transaction" : "Add Transaction"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}