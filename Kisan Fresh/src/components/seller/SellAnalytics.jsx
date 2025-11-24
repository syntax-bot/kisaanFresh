import { useState } from "react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend, ResponsiveContainer
} from "recharts";

const STATUS_COLORS = {
  Completed: "#22c55e",
  CancelledByBuyer: "#f97316",
  CancelledBySeller: "#ef4444",
};

const transactions = [
  {
    "purchase_id": 1,
    "transaction_id": "1-1-COMPLETE",
    "buyer": "buyer1@example.com",
    "seller": "seller1@example.com",
    "vegetable_name": "Tomato",
    "variety": "Organic",
    "quantity": 2,
    "total_price": 60,
    "rating": 4,
    "status": "Completed",
    "created_at": "2025-11-20 10:15:00"
  },
  {
    "purchase_id": 2,
    "transaction_id": "2-1-CANCEL-BUYER",
    "buyer": "buyer1@example.com",
    "seller": "seller2@example.com",
    "vegetable_name": "Potato",
    "variety": "Hybrid",
    "quantity": 3,
    "total_price": 90,
    "rating": null,
    "status": "CancelledByBuyer",
    "created_at": "2025-11-19 09:45:00"
  },
  {
    "purchase_id": 3,
    "transaction_id": "3-1-CANCEL-SELLER",
    "buyer": "buyer2@example.com",
    "seller": "seller1@example.com",
    "vegetable_name": "Carrot",
    "variety": "Local",
    "quantity": 1,
    "total_price": 25,
    "rating": null,
    "status": "CancelledBySeller",
    "created_at": "2025-11-18 13:50:00"
  },

  {
    "purchase_id": 4,
    "transaction_id": "4-1-COMPLETE",
    "buyer": "buyer1@example.com",
    "seller": "seller3@example.com",
    "vegetable_name": "Onion",
    "variety": "Organic",
    "quantity": 1.5,
    "total_price": 45,
    "rating": 5,
    "status": "Completed",
    "created_at": "2025-11-17 15:22:00"
  },
  {
    "purchase_id": 5,
    "transaction_id": "5-1-CANCEL-SELLER",
    "buyer": "buyer3@example.com",
    "seller": "seller2@example.com",
    "vegetable_name": "Cabbage",
    "variety": "Local",
    "quantity": 2,
    "total_price": 50,
    "rating": null,
    "status": "CancelledBySeller",
    "created_at": "2025-11-16 11:10:00"
  },
  {
    "purchase_id": 6,
    "transaction_id": "6-1-CANCEL-BUYER",
    "buyer": "buyer1@example.com",
    "seller": "seller1@example.com",
    "vegetable_name": "Cauliflower",
    "variety": "Organic",
    "quantity": 1,
    "total_price": 40,
    "rating": null,
    "status": "CancelledByBuyer",
    "created_at": "2025-11-15 17:05:00"
  },
  {
    "purchase_id": 7,
    "transaction_id": "7-1-COMPLETE",
    "buyer": "buyer2@example.com",
    "seller": "seller2@example.com",
    "vegetable_name": "Spinach",
    "variety": "Local",
    "quantity": 1,
    "total_price": 25,
    "rating": 4,
    "status": "Completed",
    "created_at": "2025-11-14 08:30:00"
  },
  {
    "purchase_id": 8,
    "transaction_id": "8-1-COMPLETE",
    "buyer": "buyer3@example.com",
    "seller": "seller3@example.com",
    "vegetable_name": "Beans",
    "variety": "Hybrid",
    "quantity": 2,
    "total_price": 70,
    "rating": 5,
    "status": "Completed",
    "created_at": "2025-11-14 10:10:00"
  },
  {
    "purchase_id": 9,
    "transaction_id": "9-1-CANCEL-BUYER",
    "buyer": "buyer2@example.com",
    "seller": "seller1@example.com",
    "vegetable_name": "Drumstick",
    "variety": "Local",
    "quantity": 1,
    "total_price": 30,
    "rating": null,
    "status": "CancelledByBuyer",
    "created_at": "2025-11-13 18:15:00"
  },
  {
    "purchase_id": 10,
    "transaction_id": "10-1-COMPLETE",
    "buyer": "buyer3@example.com",
    "seller": "seller2@example.com",
    "vegetable_name": "Brinjal",
    "variety": "Hybrid",
    "quantity": 1.2,
    "total_price": 45,
    "rating": 3,
    "status": "Completed",
    "created_at": "2025-11-13 07:42:00"
  },
  {
    "purchase_id": 11,
    "transaction_id": "11-CANCEL-SELLER",
    "buyer": "buyer1@example.com",
    "seller": "seller3@example.com",
    "vegetable_name": "Mushroom",
    "variety": "Organic",
    "quantity": 0.5,
    "total_price": 60,
    "rating": null,
    "status": "CancelledBySeller",
    "created_at": "2025-11-12 12:40:00"
  },
  {
    "purchase_id": 12,
    "transaction_id": "12-1-COMPLETE",
    "buyer": "buyer2@example.com",
    "seller": "seller1@example.com",
    "vegetable_name": "Pumpkin",
    "variety": "Local",
    "quantity": 3,
    "total_price": 90,
    "rating": 4,
    "status": "Completed",
    "created_at": "2025-11-12 09:50:00"
  },
  {
    "purchase_id": 13,
    "transaction_id": "13-1-COMPLETE",
    "buyer": "buyer1@example.com",
    "seller": "seller2@example.com",
    "vegetable_name": "Radish",
    "variety": "Local",
    "quantity": 2,
    "total_price": 35,
    "rating": 5,
    "status": "Completed",
    "created_at": "2025-11-11 20:33:00"
  },
  {
    "purchase_id": 14,
    "transaction_id": "14-1-CANCEL-BUYER",
    "buyer": "buyer3@example.com",
    "seller": "seller1@example.com",
    "vegetable_name": "Chili",
    "variety": "Hybrid",
    "quantity": 0.3,
    "total_price": 20,
    "rating": null,
    "status": "CancelledByBuyer",
    "created_at": "2025-11-11 11:00:00"
  },
  {
    "purchase_id": 15,
    "transaction_id": "15-1-CANCEL-SELLER",
    "buyer": "buyer2@example.com",
    "seller": "seller3@example.com",
    "vegetable_name": "Corn",
    "variety": "Organic",
    "quantity": 1,
    "total_price": 45,
    "rating": null,
    "status": "CancelledBySeller",
    "created_at": "2025-11-10 13:20:00"
  },

  {
    "purchase_id": 16,
    "transaction_id": "16-1-COMPLETE",
    "buyer": "buyer3@example.com",
    "seller": "seller1@example.com",
    "vegetable_name": "Capsicum",
    "variety": "Hybrid",
    "quantity": 0.8,
    "total_price": 35,
    "rating": 4,
    "status": "Completed",
    "created_at": "2025-11-10 19:45:00"
  },
  {
    "purchase_id": 17,
    "transaction_id": "17-1-COMPLETE",
    "buyer": "buyer2@example.com",
    "seller": "seller2@example.com",
    "vegetable_name": "Cucumber",
    "variety": "Organic",
    "quantity": 1,
    "total_price": 30,
    "rating": 3,
    "status": "Completed",
    "created_at": "2025-11-09 08:00:00"
  },
  {
    "purchase_id": 18,
    "transaction_id": "18-1-CANCEL-SELLER",
    "buyer": "buyer1@example.com",
    "seller": "seller1@example.com",
    "vegetable_name": "Lady Finger",
    "variety": "Local",
    "quantity": 2,
    "total_price": 50,
    "rating": null,
    "status": "CancelledBySeller",
    "created_at": "2025-11-09 09:30:00"
  },
  {
    "purchase_id": 19,
    "transaction_id": "19-1-CANCEL-BUYER",
    "buyer": "buyer1@example.com",
    "seller": "seller3@example.com",
    "vegetable_name": "Beetroot",
    "variety": "Local",
    "quantity": 1,
    "total_price": 40,
    "rating": null,
    "status": "CancelledByBuyer",
    "created_at": "2025-11-08 14:10:00"
  },
  {
    "purchase_id": 20,
    "transaction_id": "20-1-COMPLETE",
    "buyer": "buyer2@example.com",
    "seller": "seller2@example.com",
    "vegetable_name": "Bottle Gourd",
    "variety": "Local",
    "quantity": 1.5,
    "total_price": 55,
    "rating": 5,
    "status": "Completed",
    "created_at": "2025-11-08 16:00:00"
  }
]

export default function SellAnalytics() {
  
  const {
    totalOrders,
    completed,
    cancelledByBuyer,
    cancelledBySeller,
    totalSpend,
    statusData,
    ordersOverTime,
    topVegetables
  } = useMemo(() => {
    const totalOrders = transactions.length;
    let completed = 0, cancelledByBuyer = 0, cancelledBySeller = 0;
    let totalSpend = 0;

    const statusCount = {};
    const dateCount = {};
    const vegCount = {};

    for (const t of transactions) {
      // status
      if (t.status === "Completed") completed++;
      else if (t.status === "CancelledByBuyer") cancelledByBuyer++;
      else if (t.status === "CancelledBySeller") cancelledBySeller++;

      // money (only completed)
      if (t.status === "Completed") {
        totalSpend += t.total_price;
      }

      // for pie chart
      statusCount[t.status] = (statusCount[t.status] || 0) + 1;

      // for line chart: group by date
      const date = t.created_at.split(" ")[0]; // "2025-11-20"
      dateCount[date] = (dateCount[date] || 0) + 1;

      // for bar chart: veggie popularity
      vegCount[t.vegetable_name] =
        (vegCount[t.vegetable_name] || 0) + 1;
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
  }, []);

  // ✅ 2. Render UI (we’ll style + animate in next step)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Buyer Analytics SellAnalytics</h1>
            <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Completed" value={completed} accent="text-emerald-400" />
        <StatCard label="Cancelled by Buyer" value={cancelledByBuyer} accent="text-orange-400" />
        <StatCard label="Cancelled by Seller" value={cancelledBySeller} accent="text-red-400" />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* left: charts */}
        <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h2 className="text-sm font-semibold mb-2">Orders Over Time</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
                      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h2 className="text-sm font-semibold mb-2">Top Vegetables (by Orders)</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topVegetables}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#a855f7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>


        </div>

        {/* right: pie chart + total spend */}
        <div className="space-y-6">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h2 className="text-sm font-semibold mb-2">Order Status Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.name]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <motion.div
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4"
            whileHover={{ scale: 1.03 }}
          >
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Total Spend (Completed Orders)
            </div>
            <div className="text-3xl font-semibold text-emerald-400 mt-1">
              ₹{totalSpend.toFixed(2)}
            </div>
          </motion.div>

        </div>
      </motion.div>

    </div>
  );
}
    
function StatCard({ label, value, accent = "text-sky-400" }) {
  return (
    <motion.div
      className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className={`text-2xl font-semibold mt-1 ${accent}`}>
        {value}
      </div>
    </motion.div>
  );
}

        
    
  