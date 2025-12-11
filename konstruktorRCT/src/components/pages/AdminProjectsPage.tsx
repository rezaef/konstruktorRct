import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useState } from 'react';

export function AdminProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    {
      id: 1,
      name: 'Luxury Villa Renovation',
      status: 'In Progress',
      startDate: '2025-08-15',
      progress: 75,
      client: 'Mr. Johnson',
    },
    {
      id: 2,
      name: 'Office Tower - Floor 12',
      status: 'In Progress',
      startDate: '2025-09-01',
      progress: 45,
      client: 'TechCorp Inc.',
    },
    {
      id: 3,
      name: 'Café Interior Makeover',
      status: 'Near Complete',
      startDate: '2025-07-20',
      progress: 90,
      client: 'Brew & Co.',
    },
    {
      id: 4,
      name: 'Residential Complex',
      status: 'Planning',
      startDate: '2025-10-01',
      progress: 30,
      client: 'GreenLand Developers',
    },
    {
      id: 5,
      name: 'Modern Kitchen Remodel',
      status: 'Completed',
      startDate: '2025-06-10',
      progress: 100,
      client: 'The Anderson Family',
    },
    {
      id: 6,
      name: 'Boutique Hotel Lobby',
      status: 'In Progress',
      startDate: '2025-08-25',
      progress: 60,
      client: 'Luxury Hotels Group',
    },
  ];

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Near Complete':
        return 'bg-purple-100 text-purple-700';
      case 'Planning':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[#2C2C2C]">Project Management</h1>
          <p className="text-gray-600">Manage and track all your interior design projects</p>
        </div>
        <button className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C19B2B] transition-colors flex items-center gap-2">
          <Plus size={20} />
          New Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600">Project Name</th>
                <th className="px-6 py-4 text-left text-gray-600">Client</th>
                <th className="px-6 py-4 text-left text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-gray-600">Start Date</th>
                <th className="px-6 py-4 text-left text-gray-600">Progress</th>
                <th className="px-6 py-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{project.name}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{project.client}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{project.startDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                        <div
                          className="bg-[#D4AF37] h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 min-w-[45px]">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-2">Total Projects</p>
          <p className="text-3xl text-[#2C2C2C]">{projects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-2">In Progress</p>
          <p className="text-3xl text-blue-600">
            {projects.filter((p) => p.status === 'In Progress').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-2">Near Complete</p>
          <p className="text-3xl text-purple-600">
            {projects.filter((p) => p.status === 'Near Complete').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-2">Completed</p>
          <p className="text-3xl text-green-600">
            {projects.filter((p) => p.status === 'Completed').length}
          </p>
        </div>
      </div>
    </div>
  );
}
