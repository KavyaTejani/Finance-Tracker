import axios from "axios";

const exchangeAPI = axios.create({
  baseURL: "https://api.exchangerate-api.com/v4",
  timeout: 5000,
});

export async function getCurrencyRates(base = "INR") {
  const { data } = await exchangeAPI.get(`/latest/${base}`);
  return data;
}

// Optional: financial news
export async function getFinancialNews() {
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const { data } = await axios.get(
    `https://newsapi.org/v2/top-headlines?category=business&country=in&apiKey=${API_KEY}`
  );
  return data.articles;
}