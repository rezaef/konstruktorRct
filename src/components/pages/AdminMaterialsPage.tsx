import { Package, Upload, Search, Plus } from 'lucide-react';
import { useState } from 'react';

export function AdminMaterialsPage() {
  const [activeTab, setActiveTab] = useState<'purchases' | 'inventory'>('purchases');
  const [searchTerm, setSearchTerm] = useState('');

  const purchases = [
    {
      id: 1,
      item: 'Italian Marble - Carrara White',
      quantity: '50 sq.m',
      price: 45000,
      supplier: 'Marble World Indonesia',
      status: 'Delivered',
      date: '2025-10-05',
    },
    {
      id: 2,
      item: 'Oak Wood Panels',
      quantity: '100 pcs',
      price: 28000,
      supplier: 'Premium Woods Co.',
      status: 'In Transit',
      date: '2025-10-07',
    },
    {
      id: 3,
      item: 'LED Light Fixtures',
      quantity: '25 units',
      price: 12500,
      supplier: 'Lighting Solutions',
      status: 'Delivered',
      date: '2025-10-03',
    },
    {
      id: 4,
      item: 'Acoustic Ceiling Panels',
      quantity: '80 sq.m',
      price: 18000,
      supplier: 'Sound Control Inc.',
      status: 'Pending',
      date: '2025-10-08',
    },
  ];

  const inventory = [
    {
      id: 1,
      item: 'Paint - Premium White',
      quantity: 45,
      unit: 'gallons',
      location: 'Warehouse A',
      status: 'In Stock',
    },
    {
      id: 2,
      item: 'Ceramic Tiles - Glossy',
      quantity: 120,
      unit: 'boxes',
      location: 'Warehouse B',
      status: 'In Stock',
    },
    {
      id: 3,
      item: 'Glass Partition Panels',
      quantity: 8,
      unit: 'units',
      location: 'Warehouse A',
      status: 'Low Stock',
    },
    {
      id: 4,
      item: 'Wallpaper Rolls - Textured',
      quantity: 30,
      unit: 'rolls',
      location: 'Warehouse C',
      status: 'In Stock',
    },
    {
      id: 5,
      item: 'Hardwood Flooring',
      quantity: 5,
      unit: 'boxes',
      location: 'Warehouse B',
      status: 'Low Stock',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
      case 'In Stock':
        return 'bg-green-100 text-green-700';
      case 'In Transit':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-orange-100 text-orange-700';
      case 'Low Stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredPurchases = purchases.filter((item) =>
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInventory = inventory.filter((item) =>
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[#2C2C2C]">Material & Inventory</h1>
          <p className="text-gray-600">Manage purchases and track inventory assets</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-white transition-colors flex items-center gap-2">
            <Upload size={20} />
            Upload Proof
          </button>
          <button className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C19B2B] transition-colors flex items-center gap-2">
            <Plus size={20} />
            Add Item
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`pb-3 px-4 transition-colors ${
            activeTab === 'purchases'
              ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
              : 'text-gray-600 hover:text-[#D4AF37]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Package size={20} />
            Material Purchases
          </div>
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 transition-colors ${
            activeTab === 'inventory'
              ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
              : 'text-gray-600 hover:text-[#D4AF37]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Package size={20} />
            Inventory Assets
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === 'purchases' ? 'Search purchases...' : 'Search inventory...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Material Purchases Table */}
      {activeTab === 'purchases' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-600">Item Name</th>
                  <th className="px-6 py-4 text-left text-gray-600">Quantity</th>
                  <th className="px-6 py-4 text-left text-gray-600">Price</th>
                  <th className="px-6 py-4 text-left text-gray-600">Supplier</th>
                  <th className="px-6 py-4 text-left text-gray-600">Date</th>
                  <th className="px-6 py-4 text-left text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">{purchase.item}</td>
                    <td className="px-6 py-4 text-gray-600">{purchase.quantity}</td>
                    <td className="px-6 py-4 text-gray-700">${purchase.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600">{purchase.supplier}</td>
                    <td className="px-6 py-4 text-gray-600">{purchase.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(purchase.status)}`}>
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Assets Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-600">Item Name</th>
                  <th className="px-6 py-4 text-left text-gray-600">Quantity</th>
                  <th className="px-6 py-4 text-left text-gray-600">Unit</th>
                  <th className="px-6 py-4 text-left text-gray-600">Location</th>
                  <th className="px-6 py-4 text-left text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">{item.item}</td>
                    <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
                    <td className="px-6 py-4 text-gray-600">{item.unit}</td>
                    <td className="px-6 py-4 text-gray-600">{item.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
