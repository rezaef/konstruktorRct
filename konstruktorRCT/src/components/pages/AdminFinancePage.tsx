import { DollarSign, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AdminFinancePage() {
  const monthlyData = [
    { month: 'Jan', income: 450000, expenses: 280000 },
    { month: 'Feb', income: 380000, expenses: 240000 },
    { month: 'Mar', income: 520000, expenses: 310000 },
    { month: 'Apr', income: 680000, expenses: 420000 },
    { month: 'May', income: 590000, expenses: 350000 },
    { month: 'Jun', income: 720000, expenses: 460000 },
    { month: 'Jul', income: 510000, expenses: 320000 },
    { month: 'Aug', income: 820000, expenses: 510000 },
    { month: 'Sep', income: 650000, expenses: 390000 },
    { month: 'Oct', income: 890000, expenses: 540000 },
  ];

  const transactions = [
    { date: '2025-10-08', description: 'Villa Renovation - Final Payment', amount: 125000, type: 'Income' },
    { date: '2025-10-07', description: 'Material Purchase - Marble', amount: -45000, type: 'Expense' },
    { date: '2025-10-05', description: 'Office Project - Milestone 2', amount: 80000, type: 'Income' },
    { date: '2025-10-04', description: 'Contractor Payment', amount: -35000, type: 'Expense' },
    { date: '2025-10-03', description: 'Café Interior - Deposit', amount: 50000, type: 'Income' },
    { date: '2025-10-02', description: 'Equipment Rental', amount: -12000, type: 'Expense' },
    { date: '2025-10-01', description: 'Design Consultation Fee', amount: 15000, type: 'Income' },
    { date: '2025-09-30', description: 'Software Subscription', amount: -2500, type: 'Expense' },
  ];

  const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthlyData.reduce((sum, item) => sum + item.expenses, 0);
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[#2C2C2C]">Finance & Reports</h1>
          <p className="text-gray-600">Track income, expenses, and financial performance</p>
        </div>
        <button className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C19B2B] transition-colors flex items-center gap-2">
          <Download size={20} />
          Export to CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Total Income</h4>
            <TrendingUp size={24} className="text-green-500" />
          </div>
          <p className="text-3xl text-[#2C2C2C] mb-1">${(totalIncome / 1000).toFixed(0)}K</p>
          <p className="text-sm text-green-600">Year to date</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Total Expenses</h4>
            <TrendingDown size={24} className="text-red-500" />
          </div>
          <p className="text-3xl text-[#2C2C2C] mb-1">${(totalExpenses / 1000).toFixed(0)}K</p>
          <p className="text-sm text-red-600">Year to date</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#D4AF37]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Net Profit</h4>
            <DollarSign size={24} className="text-[#D4AF37]" />
          </div>
          <p className="text-3xl text-[#2C2C2C] mb-1">${(netProfit / 1000).toFixed(0)}K</p>
          <p className="text-sm text-green-600">+15% vs last year</p>
        </div>
      </div>

      {/* Monthly Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-[#2C2C2C] mb-6">Monthly Performance</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-[#2C2C2C]">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-gray-600">Description</th>
                <th className="px-6 py-4 text-left text-gray-600">Type</th>
                <th className="px-6 py-4 text-right text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">{transaction.date}</td>
                  <td className="px-6 py-4 text-gray-700">{transaction.description}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        transaction.type === 'Income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
