import { DollarSign, TrendingUp, FolderKanban, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const projectData = [
    { month: 'Jan', projects: 4 },
    { month: 'Feb', projects: 3 },
    { month: 'Mar', projects: 5 },
    { month: 'Apr', projects: 7 },
    { month: 'May', projects: 6 },
    { month: 'Jun', projects: 8 },
    { month: 'Jul', projects: 5 },
    { month: 'Aug', projects: 9 },
    { month: 'Sep', projects: 7 },
    { month: 'Oct', projects: 10 },
    { month: 'Nov', projects: 11 },
    { month: 'Dec', projects: 12 }
  ];

  const financeData = [
    { month: 'Jan', income: 450, expenses: 280 },
    { month: 'Feb', income: 380, expenses: 240 },
    { month: 'Mar', income: 520, expenses: 310 },
    { month: 'Apr', income: 680, expenses: 420 },
    { month: 'May', income: 590, expenses: 350 },
    { month: 'Jun', income: 720, expenses: 460 },
    { month: 'Jul', income: 510, expenses: 320 },
    { month: 'Aug', income: 820, expenses: 510 },
    { month: 'Sep', income: 650, expenses: 390 },
    { month: 'Oct', income: 890, expenses: 540 },
    { month: 'Nov', income: 990, expenses: 680 },
    { month: 'Dec', income: 1105, expenses: 720 }
  ];

  const ongoingProjects = [
    { name: 'Luxury Villa Renovation', progress: 75, deadline: '2025-11-15' },
    { name: 'Office Tower - Floor 12', progress: 45, deadline: '2025-12-01' },
    { name: 'Café Interior Makeover', progress: 90, deadline: '2025-10-20' },
    { name: 'Residential Complex', progress: 30, deadline: '2026-01-30' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[#2C2C2C]">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#D4AF37]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Total Projects</h4>
            <FolderKanban size={24} className="text-[#D4AF37]" />
          </div>
          <p className="text-3xl text-[#2C2C2C]">68</p>
          <p className="text-sm text-green-600 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Monthly Profit</h4>
            <DollarSign size={24} className="text-green-500" />
          </div>
          <p className="text-3xl text-[#2C2C2C]">$350K</p>
          <p className="text-sm text-green-600 mt-2">+8% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Ongoing Projects</h4>
            <TrendingUp size={24} className="text-blue-500" />
          </div>
          <p className="text-3xl text-[#2C2C2C]">12</p>
          <p className="text-sm text-gray-500 mt-2">4 near completion</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Total Expenses</h4>
            <AlertCircle size={24} className="text-orange-500" />
          </div>
          <p className="text-3xl text-[#2C2C2C]">$540K</p>
          <p className="text-sm text-orange-600 mt-2">Monitor carefully</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-[#2C2C2C] mb-4">Annual Project Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="projects" fill="#D4AF37" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-[#2C2C2C] mb-4">Financial Report</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ongoing Projects Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-[#2C2C2C]">Ongoing Projects</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">Project Name</th>
                <th className="px-6 py-3 text-left text-gray-600">Progress</th>
                <th className="px-6 py-3 text-left text-gray-600">Deadline</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ongoingProjects.map((project, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{project.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[150px]">
                        <div
                          className="bg-[#D4AF37] h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{project.deadline}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        project.progress >= 80
                          ? 'bg-green-100 text-green-700'
                          : project.progress >= 50
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {project.progress >= 80 ? 'Near Complete' : project.progress >= 50 ? 'In Progress' : 'Started'}
                    </span>
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
