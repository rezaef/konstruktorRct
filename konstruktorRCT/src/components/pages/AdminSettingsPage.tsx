import { UserPlus, Lock, Database, Shield } from 'lucide-react';
import { useState } from 'react';

export function AdminSettingsPage() {
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const admins = [
    { id: 1, name: 'John Doe', email: 'john@hdainterior.id', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@hdainterior.id', role: 'Admin', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@hdainterior.id', role: 'Staff', status: 'Active' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@hdainterior.id', role: 'Viewer', status: 'Active' },
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[#2C2C2C]">Admin Settings</h1>
        <p className="text-gray-600">Manage system settings and user access</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Change Password */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center">
              <Lock size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-[#2C2C2C]">Change Password</h3>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C19B2B] transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Add New Admin */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center">
              <UserPlus size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-[#2C2C2C]">Add New Admin</h3>
              <p className="text-sm text-gray-600">Create a new admin account</p>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
                placeholder="email@hdainterior.id"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Access Level</label>
              <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D4AF37]">
                <option>Admin</option>
                <option>Staff</option>
                <option>Viewer</option>
              </select>
            </div>
            <button
              type="button"
              className="w-full px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C19B2B] transition-colors"
              onClick={() => alert('Admin account created!')}
            >
              Create Admin
            </button>
          </form>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-lg shadow-md mt-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-[#2C2C2C]">User Management</h3>
              <p className="text-sm text-gray-600">Manage admin access and permissions</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600">Name</th>
                <th className="px-6 py-4 text-left text-gray-600">Email</th>
                <th className="px-6 py-4 text-left text-gray-600">Role</th>
                <th className="px-6 py-4 text-left text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{admin.name}</td>
                  <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      admin.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      admin.role === 'Staff' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#D4AF37] hover:underline mr-4">Edit</button>
                    <button className="text-red-600 hover:underline">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Backup */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center">
            <Database size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-[#2C2C2C]">Data Backup</h3>
            <p className="text-sm text-gray-600">Backup and restore system data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">Last Backup</p>
            <p className="text-sm text-gray-600 mb-4">October 8, 2025 - 02:30 AM</p>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              View Backup History
            </button>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">Create New Backup</p>
            <p className="text-sm text-gray-600 mb-4">Export all system data</p>
            <button className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C19B2B] transition-colors">
              Backup Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
