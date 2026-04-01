import { createContext, useContext, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const FinanceContext = createContext();

const STORAGE_KEYS = {
  TRANSACTIONS: "mm_transactions",
  BUDGET: "mm_budget",
};

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

const initialState = {
  transactions: loadFromStorage(STORAGE_KEYS.TRANSACTIONS, []),
  budget: loadFromStorage(STORAGE_KEYS.BUDGET, { monthlyBudget: 0 }),
};

function financeReducer(state, action) {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case "SET_BUDGET":
      return { ...state, budget: action.payload };

    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(state.budget));
  }, [state.budget]);

  function addTransaction(data) {
    const transaction = {
      ...data,
      id: uuidv4(),
      date: data.date || new Date().toISOString(),
      recurring: data.recurring || false,
    };
    dispatch({ type: "ADD_TRANSACTION", payload: transaction });
    return transaction;
  }

  function deleteTransaction(id) {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  }

  function updateTransaction(data) {
    dispatch({ type: "UPDATE_TRANSACTION", payload: data });
  }

  function setBudget(monthlyBudget) {
    dispatch({ type: "SET_BUDGET", payload: { monthlyBudget } });
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions: state.transactions,
        budget: state.budget,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        setBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
  return ctx;
}