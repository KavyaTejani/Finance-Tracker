import { useState, useEffect } from "react";
import { getCurrencyRates } from "../services/api";

const CACHE_KEY = "mm_currency_rates";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function useCurrency(baseCurrency = "INR") {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setRates(cached.rates);
          return;
        }
        setLoading(true);
        const data = await getCurrencyRates(baseCurrency);
        const payload = { rates: data.rates, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
        setRates(data.rates);
      } catch (err) {
        console.warn("Currency fetch failed, using INR only", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, [baseCurrency]);

  function format(amount, currency = "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  function convert(amount, toCurrency = "USD") {
    if (!rates[toCurrency]) return amount;
    return amount * rates[toCurrency];
  }

  return { format, convert, rates, loading };
}