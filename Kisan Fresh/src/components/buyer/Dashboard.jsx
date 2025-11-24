import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, ResponsiveContainer
} from "recharts";

const STATUS_COLORS = {
  Completed: "#16a34a",       // green
  CancelledByBuyer: "#fb923c", // orange
  CancelledBySeller: "#ef4444", // red
};

export default function BuyerAnalyticsLight() {
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/buyer/my_transactions/",
          { withCredentials: true }
        );
        console.log("Transactions:", res.data.transactions);
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.log("Fetch Error:", err);
      }
    })();
  }, []);

  // Analytics Calculation
  const stats = useMemo(() => {
    let spend = 0;
    const statusCount = {}, dateCount = {}, vegCount = {};

    for (const t of transactions) {
      statusCount[t.status] = (statusCount[t.status] || 0) + 1;

      if (t.status === "Completed") spend += t.total_price;

      const date = t.created_at.split(" ")[0];
      dateCount[date] = (dateCount[date] || 0) + 1;

      vegCount[t.vegetable_name] = (vegCount[t.vegetable_name] || 0) + 1;
    }

    return {
      totalOrders: transactions.length,
      totalSpend: spend,
      statusData: Object.entries(statusCount).map(([name, value]) => ({ name, value })),
      ordersOverTime: Object.entries(dateCount).map(([date, count]) => ({ date, count })),
      topVeggies: Object.entries(vegCount).map(([name, value]) => ({ name, value })).slice(0, 5),
    };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-4">Buyer Analytics</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card label="Total Orders" value={stats.totalOrders} />
        <Card label="Total Spend" value={`₹${stats.totalSpend.toFixed(2)}`} />
        <Card
          label="Completed Orders"
          value={stats.statusData.find(s => s.name === "Completed")?.value || 0}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Orders Over Time */}
        <ChartBox title="Orders Over Time">
          <LineChart data={stats.ordersOverTime}>
            <CartesianGrid stroke="#ddd" />
            <XAxis dataKey="date" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip />
            <Line dataKey="count" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ChartBox>

        {/* Status Pie Chart */}
        <ChartBox title="Order Status Distribution">
          <PieChart>
            <Pie data={stats.statusData} dataKey="value" nameKey="name" innerRadius={50}>
              {stats.statusData.map((e, i) => (
                <Cell key={i} fill={STATUS_COLORS[e.name]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartBox>

        {/* Top Vegetables */}
        <ChartBox title="Top Ordered Vegetables">
          <BarChart data={stats.topVeggies}>
            <CartesianGrid stroke="#ddd" />
            <XAxis dataKey="name" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip />
            <Bar dataKey="value" fill="#a855f7" />
          </BarChart>
        </ChartBox>
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl text-center border border-gray-200 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-bold mt-1 text-gray-900">{value}</div>
    </div>
  );
}

function ChartBox({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-sm mb-2 font-medium text-gray-700">{title}</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
