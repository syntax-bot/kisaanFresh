import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = {
  Completed: "#16a34a",       // green
  CancelledByBuyer: "#fb923c", // orange
  CancelledBySeller: "#ef4444" // red
};

export default function SellAnalytics() {
  const [transactions, setTransactions] = useState([]);

  // 📌 Fetch Transactions From Server
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/seller/my_transactions/",
          { withCredentials: true }
        );
        if (res.data.transactions) {
          setTransactions(res.data.transactions);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // 📊 DATA ANALYSIS using useMemo (optimized)
  const {
    totalOrders,
    completed,
    cancelledByBuyer,
    cancelledBySeller,
    totalSpend,
    statusData,
    ordersOverTime,
    topVegetables,
  } = useMemo(() => {
    const totalOrders = transactions.length;
    let completed = 0,
      cancelledByBuyer = 0,
      cancelledBySeller = 0,
      totalSpend = 0;

    const statusCount = {};
    const dateCount = {};
    const vegCount = {};

    for (const t of transactions) {
      const status = (t.status || "").trim();

      if (status === "Completed") completed++;
      else if (status === "CancelledByBuyer") cancelledByBuyer++;
      else if (status === "CancelledBySeller") cancelledBySeller++;

      if (status === "Completed") {
        totalSpend += parseFloat(t.total_price) || 0;
      }

      statusCount[status] = (statusCount[status] || 0) + 1;

      const date = (t.created_at || "").split(" ")[0];
      if (date) dateCount[date] = (dateCount[date] || 0) + 1;

      const veg = t.vegetable_name;
      if (veg) vegCount[veg] = (vegCount[veg] || 0) + 1;
    }

    const statusData = Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
    }));

    const ordersOverTime = Object.entries(dateCount)
      .sort(([d1], [d2]) => (d1 < d2 ? -1 : 1))
      .map(([date, count]) => ({ date, count }));

    const topVegetables = Object.entries(vegCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalOrders,
      completed,
      cancelledByBuyer,
      cancelledBySeller,
      totalSpend,
      statusData,
      ordersOverTime,
      topVegetables,
    };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6">Sell Analytics (Light Theme)</h1>

      {/* Top Stat Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Completed" value={completed} accent="text-green-600" />
        <StatCard label="Cancelled by Buyer" value={cancelledByBuyer} accent="text-orange-500" />
        <StatCard label="Cancelled by Seller" value={cancelledBySeller} accent="text-red-500" />
      </motion.div>

      {/* Chart Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="lg:col-span-2 space-y-6">

          {/* Orders Over Time */}
          <ChartCard title="Orders Over Time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#0284c7" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Vegetables */}
          <ChartCard title="Top Vegetables (by Orders)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVegetables}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#9333ea" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        
        <div className="space-y-6">

          
          <ChartCard title="Order Status Distribution">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Total Spend */}
          <motion.div
            className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm"
            whileHover={{ scale: 1.03 }}
          >
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Total Revenue (Completed Orders)
            </div>
            <div className="text-3xl font-semibold text-green-600 mt-1">
              ₹{totalSpend.toFixed(2)}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
      <h2 className="text-sm font-semibold mb-2">{title}</h2>
      <div className="h-60">{children}</div>
    </div>
  );
}

function StatCard({ label, value, accent = "text-blue-600" }) {
  return (
    <motion.div
      className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${accent}`}>{value}</div>
    </motion.div>
  );
}
