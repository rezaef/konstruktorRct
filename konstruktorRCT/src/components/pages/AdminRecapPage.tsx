import { FileSpreadsheet, Plus, Send, Settings, Trash2, DollarSign, User, Calendar, FileText, ExternalLink, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { sheetsService } from '../../services/googleSheets';

interface SpreadsheetConfig {
  id: string;
  name: string;
  url: string;
  spreadsheetId: string;
  category: string;
}

interface ProjectSheetMapping {
  projectName: string;
  sheetName: string;
  sheetGid: string;
  columnMapping: {
    date: string;
    amount: string;
    recipient: string;
    description: string;
    type: string;
  };
  startRow: number; // Row pertama untuk data (setelah header)
}

interface RecapEntry {
  id: string;
  date: string;
  spreadsheet: string;
  project: string;
  sheetName: string;
  rowNumber: number;
  amount: number;
  type: 'income' | 'expense' | 'payment';
  recipient: string;
  description: string;
}

export function AdminRecapPage() {
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetConfig[]>([
    {
      id: '1',
      name: 'HDA Interior - Main Spreadsheet',
      url: 'https://docs.google.com/spreadsheets/d/1-9jejlBp23kFnX39isQeWWJU1n9_JBzACQ6IlXQcQLg/edit?gid=7270850#gid=7270850',
      spreadsheetId: '1-9jejlBp23kFnX39isQeWWJU1n9_JBzACQ6IlXQcQLg',
      category: 'cashflow',
    },
    {
      id: '2',
      name: 'Cashflow 2025',
      url: 'https://docs.google.com/spreadsheets/d/1ABC123...',
      spreadsheetId: '1ABC123',
      category: 'cashflow',
    },
  ]);

  // Mapping project ke sheet di spreadsheet
  const [projectSheetMappings, setProjectSheetMappings] = useState<ProjectSheetMapping[]>([
    {
      projectName: 'Modern Villa - Surabaya',
      sheetName: 'Villa Surabaya',
      sheetGid: '7270850',
      columnMapping: {
        date: 'A',
        amount: 'B',
        recipient: 'C',
        description: 'D',
        type: 'E',
      },
      startRow: 2,
    },
    {
      projectName: 'Office Renovation - Jakarta',
      sheetName: 'Office Jakarta',
      sheetGid: '0',
      columnMapping: {
        date: 'A',
        amount: 'B',
        recipient: 'C',
        description: 'D',
        type: 'E',
      },
      startRow: 2,
    },
    {
      projectName: 'Luxury Apartment - Bali',
      sheetName: 'Apartment Bali',
      sheetGid: '1',
      columnMapping: {
        date: 'A',
        amount: 'B',
        recipient: 'C',
        description: 'D',
        type: 'E',
      },
      startRow: 2,
    },
    {
      projectName: 'Restaurant Interior - Bandung',
      sheetName: 'Restaurant Bandung',
      sheetGid: '2',
      columnMapping: {
        date: 'A',
        amount: 'B',
        recipient: 'C',
        description: 'D',
        type: 'E',
      },
      startRow: 2,
    },
    {
      projectName: 'Hotel Lobby - Yogyakarta',
      sheetName: 'Hotel Yogyakarta',
      sheetGid: '3',
      columnMapping: {
        date: 'A',
        amount: 'B',
        recipient: 'C',
        description: 'D',
        type: 'E',
      },
      startRow: 2,
    },
  ]);

  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);

  const [recentEntries, setRecentEntries] = useState<RecapEntry[]>([
    {
      id: '1',
      date: '2025-10-12',
      spreadsheet: 'HDA Interior - Main Spreadsheet',
      project: 'Modern Villa - Surabaya',
      sheetName: 'Villa Surabaya',
      rowNumber: 5,
      amount: 50000000,
      type: 'income',
      recipient: 'PT. Indo Makmur',
      description: 'Pembayaran DP 50%',
    },
    {
      id: '2',
      date: '2025-10-11',
      spreadsheet: 'HDA Interior - Main Spreadsheet',
      project: 'Office Renovation - Jakarta',
      sheetName: 'Office Jakarta',
      rowNumber: 8,
      amount: 15000000,
      type: 'expense',
      recipient: 'Toko Bangunan Jaya',
      description: 'Pembelian material lantai',
    },
  ]);

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  
  const [formData, setFormData] = useState({
    spreadsheetId: '',
    project: '',
    amount: '',
    type: 'income' as 'income' | 'expense' | 'payment',
    recipient: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [newSpreadsheet, setNewSpreadsheet] = useState({
    name: '',
    url: '',
    category: 'cashflow',
  });

  const [newMapping, setNewMapping] = useState<ProjectSheetMapping>({
    projectName: '',
    sheetName: '',
    sheetGid: '0',
    columnMapping: {
      date: 'A',
      amount: 'B',
      recipient: 'C',
      description: 'D',
      type: 'E',
    },
    startRow: 2,
  });

  // Load available sheets dari spreadsheet yang dipilih
  const loadSheetsFromSpreadsheet = async (spreadsheetId: string) => {
    if (!spreadsheetId) return;
    
    setIsLoadingSheets(true);
    try {
      const sheets = await sheetsService.getSheetNames(spreadsheetId);
      setAvailableSheets(sheets);
      toast.success(`Berhasil memuat ${sheets.length} sheet dari spreadsheet`);
    } catch (error) {
      toast.error('Gagal memuat sheet dari spreadsheet');
    } finally {
      setIsLoadingSheets(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.spreadsheetId || !formData.project || !formData.amount) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    // Cari mapping untuk project yang dipilih
    const mapping = projectSheetMappings.find(m => m.projectName === formData.project);
    if (!mapping) {
      toast.error('Project belum memiliki mapping sheet. Silakan konfigurasi terlebih dahulu.');
      return;
    }

    const selectedSheet = spreadsheets.find(s => s.id === formData.spreadsheetId);
    if (!selectedSheet) {
      toast.error('Spreadsheet tidak ditemukan');
      return;
    }

    try {
      // Cari baris kosong berikutnya di sheet
      const nextRow = await sheetsService.findNextEmptyRow(
        selectedSheet.spreadsheetId,
        mapping.sheetName,
        mapping.columnMapping.date,
        mapping.startRow
      );

      // Format data sesuai column mapping
      const rowData = sheetsService.formatDataForSheet(
        formData.date,
        parseFloat(formData.amount),
        formData.recipient,
        formData.description,
        formData.type,
        mapping.columnMapping
      );

      // Insert data (mock untuk sekarang, nanti bisa pakai real API)
      const success = await sheetsService.insertDataSorted(
        selectedSheet.spreadsheetId,
        mapping.sheetName,
        new Date(formData.date),
        rowData,
        mapping.columnMapping,
        'mock-token' // Nanti ganti dengan real OAuth token
      );

      if (success) {
        const newEntry: RecapEntry = {
          id: Date.now().toString(),
          date: formData.date,
          spreadsheet: selectedSheet.name,
          project: formData.project,
          sheetName: mapping.sheetName,
          rowNumber: nextRow,
          amount: parseFloat(formData.amount),
          type: formData.type,
          recipient: formData.recipient,
          description: formData.description,
        };

        setRecentEntries([newEntry, ...recentEntries]);
        
        toast.success(
          `✅ Data berhasil disimpan ke sheet "${mapping.sheetName}" baris ${nextRow}!`
        );
        
        // Reset form
        setFormData({
          spreadsheetId: '',
          project: '',
          amount: '',
          type: 'income',
          recipient: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
        });
      } else {
        toast.error('Gagal menyimpan data ke spreadsheet');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data');
      console.error(error);
    }
  };

  const handleAddSpreadsheet = () => {
    if (!newSpreadsheet.name || !newSpreadsheet.url) {
      toast.error('Mohon lengkapi nama dan URL spreadsheet');
      return;
    }

    const spreadsheetId = sheetsService.extractSpreadsheetId(newSpreadsheet.url);
    if (!spreadsheetId) {
      toast.error('URL spreadsheet tidak valid');
      return;
    }

    const newSheet: SpreadsheetConfig = {
      id: Date.now().toString(),
      name: newSpreadsheet.name,
      url: newSpreadsheet.url,
      spreadsheetId: spreadsheetId,
      category: newSpreadsheet.category,
    };

    setSpreadsheets([...spreadsheets, newSheet]);
    setNewSpreadsheet({ name: '', url: '', category: 'cashflow' });
    setShowConfigModal(false);
    toast.success('Spreadsheet berhasil ditambahkan!');
  };

  const handleAddMapping = () => {
    if (!newMapping.projectName || !newMapping.sheetName) {
      toast.error('Mohon lengkapi nama project dan sheet');
      return;
    }

    setProjectSheetMappings([...projectSheetMappings, { ...newMapping }]);
    setNewMapping({
      projectName: '',
      sheetName: '',
      sheetGid: '0',
      columnMapping: {
        date: 'A',
        amount: 'B',
        recipient: 'C',
        description: 'D',
        type: 'E',
      },
      startRow: 2,
    });
    setShowMappingModal(false);
    toast.success('Mapping project berhasil ditambahkan!');
  };

  const handleDeleteSpreadsheet = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus konfigurasi spreadsheet ini?')) {
      setSpreadsheets(spreadsheets.filter(s => s.id !== id));
      toast.success('Spreadsheet berhasil dihapus');
    }
  };

  const handleDeleteMapping = (projectName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mapping untuk "${projectName}"?`)) {
      setProjectSheetMappings(projectSheetMappings.filter(m => m.projectName !== projectName));
      toast.success('Mapping berhasil dihapus');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return 'bg-green-100 text-green-700';
      case 'expense': return 'bg-red-100 text-red-700';
      case 'payment': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'income': return 'Pemasukan';
      case 'expense': return 'Pengeluaran';
      case 'payment': return 'Pelunasan';
      default: return type;
    }
  };

  // Get projects yang sudah dimapping
  const getMappedProjects = () => {
    return projectSheetMappings.map(m => m.projectName);
  };

  // Get sheet info untuk project tertentu
  const getSheetInfo = (projectName: string) => {
    const mapping = projectSheetMappings.find(m => m.projectName === projectName);
    return mapping ? `Sheet: ${mapping.sheetName}` : '';
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[#2D3748] mb-2">Rekapitulasi Keuangan</h2>
          <p className="text-gray-600">Input dan kelola data keuangan terintegrasi dengan Google Spreadsheet</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowMappingModal(true)}
            className="px-6 py-3 bg-white border-2 border-[#E89B7C] text-[#E89B7C] rounded-lg hover:bg-[#E89B7C] hover:text-white transition-colors flex items-center gap-2"
          >
            <LinkIcon size={20} />
            Mapping Project
          </button>
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-6 py-3 bg-white border-2 border-[#5BA8A8] text-[#5BA8A8] rounded-lg hover:bg-[#5BA8A8] hover:text-white transition-colors flex items-center gap-2"
          >
            <Settings size={20} />
            Kelola Spreadsheet
          </button>
        </div>
      </div>

      {/* Google Sheets Integration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <FileSpreadsheet size={24} className="text-blue-600 mt-1" />
          <div className="flex-1">
            <h4 className="text-blue-900 mb-1">Sinkronisasi Otomatis dengan Google Spreadsheet</h4>
            <p className="text-sm text-blue-700 mb-2">
              Sistem akan otomatis mendeteksi sheet berdasarkan project yang dipilih dan menempatkan data di baris kosong berikutnya. Data akan diurutkan berdasarkan tanggal.
            </p>
            <div className="flex gap-4 text-sm text-blue-600">
              <span>✓ Auto-detect baris kosong</span>
              <span>✓ Mapping project ke sheet</span>
              <span>✓ Format sesuai struktur sheet</span>
              <span>✓ Sorted by date</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Input */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-[#2D3748] mb-6">Form Input Rekapitulasi</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tanggal */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-2">
                  <Calendar size={18} className="text-[#5BA8A8]" />
                  Tanggal *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                />
              </div>

              {/* Pilih Spreadsheet */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-2">
                  <FileSpreadsheet size={18} className="text-[#5BA8A8]" />
                  Pilih Spreadsheet *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.spreadsheetId}
                    onChange={(e) => {
                      setFormData({ ...formData, spreadsheetId: e.target.value });
                      const selected = spreadsheets.find(s => s.id === e.target.value);
                      if (selected) {
                        loadSheetsFromSpreadsheet(selected.spreadsheetId);
                      }
                    }}
                    required
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                  >
                    <option value="">-- Pilih Spreadsheet --</option>
                    {spreadsheets.map((sheet) => (
                      <option key={sheet.id} value={sheet.id}>
                        {sheet.name} ({sheet.category})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const selected = spreadsheets.find(s => s.id === formData.spreadsheetId);
                      if (selected) {
                        loadSheetsFromSpreadsheet(selected.spreadsheetId);
                      } else {
                        toast.error('Pilih spreadsheet terlebih dahulu');
                      }
                    }}
                    disabled={isLoadingSheets}
                    className="px-4 py-3 bg-[#5BA8A8] text-white rounded-lg hover:bg-[#4A9090] transition-colors disabled:opacity-50"
                  >
                    {isLoadingSheets ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <RefreshCw size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Pilih Proyek */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-2">
                  <FileText size={18} className="text-[#5BA8A8]" />
                  Nama Proyek *
                </label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                >
                  <option value="">-- Pilih Proyek --</option>
                  {getMappedProjects().map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
                {formData.project && (
                  <p className="mt-2 text-sm text-[#5BA8A8]">
                    📋 {getSheetInfo(formData.project)}
                  </p>
                )}
              </div>

              {/* Tipe Transaksi */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Tipe Transaksi *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      formData.type === 'income'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      formData.type === 'expense'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-red-300'
                    }`}
                  >
                    Pengeluaran
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'payment' })}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      formData.type === 'payment'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    Pelunasan
                  </button>
                </div>
              </div>

              {/* Jumlah */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-2">
                  <DollarSign size={18} className="text-[#5BA8A8]" />
                  Jumlah (Rp) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0"
                  step="1000"
                  placeholder="5000000"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                />
              </div>

              {/* Pengirim/Penerima */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-2">
                  <User size={18} className="text-[#5BA8A8]" />
                  Pengirim / Penerima *
                </label>
                <input
                  type="text"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  required
                  placeholder="Nama perusahaan atau individu"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                />
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Deskripsi detail transaksi..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-4 bg-[#E89B7C] text-white rounded-lg hover:bg-[#D8845F] transition-colors flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Simpan ke Spreadsheet
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Configured Spreadsheets */}
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h3 className="text-[#2D3748] mb-4">Spreadsheet Terkonfigurasi</h3>
            
            {spreadsheets.length === 0 ? (
              <div className="text-center py-8">
                <FileSpreadsheet size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Belum ada spreadsheet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {spreadsheets.map((sheet) => (
                  <div key={sheet.id} className="border border-gray-200 rounded-lg p-3 hover:border-[#5BA8A8] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-[#2D3748] mb-1">{sheet.name}</p>
                        <span className="inline-block px-2 py-1 bg-[#5BA8A8]/10 text-[#5BA8A8] text-xs rounded">
                          {sheet.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSpreadsheet(sheet.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <a
                      href={sheet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 truncate"
                    >
                      <ExternalLink size={12} />
                      Buka Spreadsheet
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Mappings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-[#2D3748] mb-4">Mapping Project → Sheet</h3>
            
            {projectSheetMappings.length === 0 ? (
              <div className="text-center py-8">
                <LinkIcon size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Belum ada mapping</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projectSheetMappings.map((mapping) => (
                  <div key={mapping.projectName} className="border border-gray-200 rounded-lg p-3 hover:border-[#E89B7C] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-[#2D3748] mb-1">{mapping.projectName}</p>
                        <p className="text-xs text-gray-500">→ {mapping.sheetName}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            Row {mapping.startRow}+
                          </span>
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            GID: {mapping.sheetGid}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMapping(mapping.projectName)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h3 className="text-[#2D3748] mb-6">Entri Terakhir</h3>
        
        {recentEntries.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada data rekapitulasi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Tanggal</th>
                  <th className="text-left py-3 px-4 text-gray-600">Proyek</th>
                  <th className="text-left py-3 px-4 text-gray-600">Sheet</th>
                  <th className="text-left py-3 px-4 text-gray-600">Baris</th>
                  <th className="text-left py-3 px-4 text-gray-600">Tipe</th>
                  <th className="text-right py-3 px-4 text-gray-600">Jumlah</th>
                  <th className="text-left py-3 px-4 text-gray-600">Penerima/Pengirim</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{entry.project}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{entry.sheetName}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">Row {entry.rowNumber}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${getTypeColor(entry.type)}`}>
                        {getTypeLabel(entry.type)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-right">
                      <span className={entry.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {entry.type === 'income' ? '+' : '-'} {formatCurrency(entry.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{entry.recipient}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Spreadsheet Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-[#2D3748] mb-6">Tambah Spreadsheet Baru</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nama Spreadsheet *</label>
                <input
                  type="text"
                  value={newSpreadsheet.name}
                  onChange={(e) => setNewSpreadsheet({ ...newSpreadsheet, name: e.target.value })}
                  placeholder="HDA Interior - Main"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">URL Spreadsheet *</label>
                <input
                  type="url"
                  value={newSpreadsheet.url}
                  onChange={(e) => setNewSpreadsheet({ ...newSpreadsheet, url: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Kategori</label>
                <select
                  value={newSpreadsheet.category}
                  onChange={(e) => setNewSpreadsheet({ ...newSpreadsheet, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                >
                  <option value="cashflow">Cashflow</option>
                  <option value="expenses">Expenses</option>
                  <option value="payments">Payments</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfigModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddSpreadsheet}
                className="flex-1 px-6 py-3 bg-[#5BA8A8] text-white rounded-lg hover:bg-[#4A9090] transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Mapping Modal */}
      {showMappingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-[#2D3748] mb-6">Tambah Mapping Project ke Sheet</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nama Project *</label>
                <input
                  type="text"
                  value={newMapping.projectName}
                  onChange={(e) => setNewMapping({ ...newMapping, projectName: e.target.value })}
                  placeholder="Modern Villa - Surabaya"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nama Sheet *</label>
                  {availableSheets.length > 0 ? (
                    <select
                      value={newMapping.sheetName}
                      onChange={(e) => setNewMapping({ ...newMapping, sheetName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                    >
                      <option value="">-- Pilih Sheet --</option>
                      {availableSheets.map((sheet) => (
                        <option key={sheet} value={sheet}>
                          {sheet}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={newMapping.sheetName}
                      onChange={(e) => setNewMapping({ ...newMapping, sheetName: e.target.value })}
                      placeholder="Villa Surabaya"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {availableSheets.length > 0 ? 'Sheet dimuat dari spreadsheet' : 'Pilih spreadsheet dan klik refresh untuk memuat sheet'}
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Sheet GID</label>
                  <input
                    type="text"
                    value={newMapping.sheetGid}
                    onChange={(e) => setNewMapping({ ...newMapping, sheetGid: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                  />
                  <p className="text-xs text-gray-500 mt-1">ID dari URL sheet (#gid=...)</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Baris Mulai Data</label>
                <input
                  type="number"
                  value={newMapping.startRow}
                  onChange={(e) => setNewMapping({ ...newMapping, startRow: parseInt(e.target.value) })}
                  min="1"
                  placeholder="2"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5BA8A8]"
                />
                <p className="text-xs text-gray-500 mt-1">Baris pertama setelah header (biasanya 2)</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-gray-700 mb-3">Mapping Kolom</h4>
                <div className="grid grid-cols-5 gap-3">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Tanggal</label>
                    <input
                      type="text"
                      value={newMapping.columnMapping.date}
                      onChange={(e) => setNewMapping({ 
                        ...newMapping, 
                        columnMapping: { ...newMapping.columnMapping, date: e.target.value.toUpperCase() }
                      })}
                      placeholder="A"
                      maxLength={2}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[#5BA8A8] text-center uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Jumlah</label>
                    <input
                      type="text"
                      value={newMapping.columnMapping.amount}
                      onChange={(e) => setNewMapping({ 
                        ...newMapping, 
                        columnMapping: { ...newMapping.columnMapping, amount: e.target.value.toUpperCase() }
                      })}
                      placeholder="B"
                      maxLength={2}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[#5BA8A8] text-center uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Penerima</label>
                    <input
                      type="text"
                      value={newMapping.columnMapping.recipient}
                      onChange={(e) => setNewMapping({ 
                        ...newMapping, 
                        columnMapping: { ...newMapping.columnMapping, recipient: e.target.value.toUpperCase() }
                      })}
                      placeholder="C"
                      maxLength={2}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[#5BA8A8] text-center uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Keterangan</label>
                    <input
                      type="text"
                      value={newMapping.columnMapping.description}
                      onChange={(e) => setNewMapping({ 
                        ...newMapping, 
                        columnMapping: { ...newMapping.columnMapping, description: e.target.value.toUpperCase() }
                      })}
                      placeholder="D"
                      maxLength={2}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[#5BA8A8] text-center uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Tipe</label>
                    <input
                      type="text"
                      value={newMapping.columnMapping.type}
                      onChange={(e) => setNewMapping({ 
                        ...newMapping, 
                        columnMapping: { ...newMapping.columnMapping, type: e.target.value.toUpperCase() }
                      })}
                      placeholder="E"
                      maxLength={2}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[#5BA8A8] text-center uppercase"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Masukkan huruf kolom sesuai struktur di spreadsheet (A, B, C, dst)</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowMappingModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddMapping}
                className="flex-1 px-6 py-3 bg-[#E89B7C] text-white rounded-lg hover:bg-[#D8845F] transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Tambah Mapping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
