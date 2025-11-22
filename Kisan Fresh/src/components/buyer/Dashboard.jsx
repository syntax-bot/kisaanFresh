import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend
} from "recharts";
import Loader from "../misc/Loader";

const BuyerAnalytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8000/my_transactions/",
        { withCredentials: true }
      );
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 👉 Format Data for Charts
  const spendingOverTime = transactions.map((t) => ({
    date: t.date,
    amount: parseFloat(t.total_price || t.amount || 0),
  }));

  // Group by vegetable
  const vegTotals = {};
  transactions.forEach((t) => {
    if (!vegTotals[t.vegetable]) vegTotals[t.vegetable] = 0;
    vegTotals[t.vegetable] += t.total_price;
  });

  const topVegetables = Object.entries(vegTotals).map(([name, amount]) => ({
    name,
    amount,
  }));

  // Summary
  const totalSpent = spendingOverTime.reduce((a, b) => a + b.amount, 0);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader width={40} height={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-10">
        💹 Purchase Analytics
      </h1>

      {/* SUMMARY */}
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg mb-10">
        <h2 className="text-xl font-semibold text-gray-700">Summary</h2>
        <p className="mt-2 text-gray-600 text-lg">
          <strong>Total Spent:</strong>{" "}
          <span className="text-green-600 font-bold">₹{totalSpent.toFixed(2)}</span>
        </p>
        <p className="text-gray-600 text-lg mt-1">
          <strong>Total Transactions:</strong> {transactions.length}
        </p>
      </div>

      {/* SPENDING OVER TIME */}
      <div className="bg-white shadow p-6 rounded-lg mb-10 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          📅 Spending Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={spendingOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="amount" stroke="#16a34a" name="Amount Spent" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TOP VEGETABLES */}
      <div className="bg-white shadow p-6 rounded-lg mb-10 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          🥕 Most Purchased Items
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topVegetables}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#3b82f6" name="Total Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BuyerAnalytics;
