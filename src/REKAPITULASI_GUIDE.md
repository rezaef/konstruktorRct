# 📊 Panduan Fitur Rekapitulasi Keuangan - HDA Interior

## 🎯 Overview

Fitur Rekapitulasi terintegrasi dengan Google Spreadsheet yang memungkinkan:
- ✅ **Auto-mapping** project ke sheet tertentu di Google Spreadsheet
- ✅ **Auto-detect** baris kosong berikutnya
- ✅ **Sinkronisasi otomatis** dengan format kolom di spreadsheet
- ✅ **Sorted insert** berdasarkan tanggal
- ✅ **Multiple spreadsheet** support

---

## 📁 Struktur File

```
/services/googleSheets.ts          → Service untuk Google Sheets API
/components/pages/AdminRecapPage.tsx  → UI Halaman Rekapitulasi
```

---

## 🔧 Cara Kerja Sistem

### 1. **Spreadsheet Configuration**
Daftar Google Spreadsheet yang akan digunakan:
- Nama spreadsheet
- URL lengkap
- Spreadsheet ID (auto-extract dari URL)
- Kategori (cashflow/expenses/payments)

### 2. **Project-Sheet Mapping**
Setiap project dimapping ke sheet tertentu:
```javascript
{
  projectName: "Modern Villa - Surabaya",
  sheetName: "Villa Surabaya",
  sheetGid: "7270850",
  columnMapping: {
    date: "A",        // Kolom untuk tanggal
    amount: "B",      // Kolom untuk jumlah
    recipient: "C",   // Kolom untuk pengirim/penerima
    description: "D", // Kolom untuk keterangan
    type: "E"         // Kolom untuk tipe transaksi
  },
  startRow: 2         // Baris mulai data (setelah header)
}
```

### 3. **Auto-Detect Baris Kosong**
Sistem otomatis mencari baris kosong berikutnya di sheet:
```typescript
async findNextEmptyRow(
  spreadsheetId: string,
  sheetName: string,
  dateColumn: string = 'A',
  startRow: number = 2
): Promise<number>
```

### 4. **Sorted Insert by Date**
Data diurutkan berdasarkan tanggal:
```typescript
async insertDataSorted(
  spreadsheetId: string,
  sheetName: string,
  newDate: Date,
  values: any[],
  columnMapping: ColumnMapping,
  accessToken: string
): Promise<boolean>
```

---

## 🚀 Cara Menggunakan

### **Step 1: Tambah Spreadsheet**
1. Klik tombol **"Kelola Spreadsheet"**
2. Masukkan:
   - Nama spreadsheet
   - URL lengkap Google Spreadsheet
   - Kategori
3. Sistem auto-extract `spreadsheetId` dari URL

### **Step 2: Tambah Mapping Project**
1. Klik tombol **"Mapping Project"**
2. Pilih spreadsheet dan klik **refresh** untuk memuat daftar sheet
3. Isi form:
   - **Nama Project**: Nama proyek (misal: "Modern Villa - Surabaya")
   - **Nama Sheet**: Pilih dari dropdown atau ketik manual
   - **Sheet GID**: ID sheet dari URL (`#gid=7270850`)
   - **Baris Mulai**: Baris pertama setelah header (biasanya 2)
   - **Mapping Kolom**: Tentukan kolom untuk setiap field
     - Tanggal → A
     - Jumlah → B
     - Penerima → C
     - Keterangan → D
     - Tipe → E

### **Step 3: Input Data Rekapitulasi**
1. Pilih tanggal transaksi
2. Pilih spreadsheet (akan auto-load sheets)
3. Pilih project (akan show mapping sheet info)
4. Pilih tipe transaksi: Pemasukan/Pengeluaran/Pelunasan
5. Isi jumlah, pengirim/penerima, dan keterangan
6. Klik **"Simpan ke Spreadsheet"**

### **Step 4: Hasil**
Sistem akan:
- ✅ Cari baris kosong berikutnya di sheet yang dimapping
- ✅ Format data sesuai column mapping
- ✅ Insert data di posisi yang tepat (sorted by date)
- ✅ Tampilkan notifikasi sukses dengan info sheet dan row number
- ✅ Tambahkan entri ke tabel riwayat

---

## 🔗 Integrasi Google Sheets API

### **Current State: Mock Service**
Saat ini menggunakan `MockGoogleSheetsService` untuk development.

### **Production Setup:**

#### 1. **Setup Google Cloud Project**
```bash
1. Buka https://console.cloud.google.com
2. Buat project baru
3. Enable Google Sheets API
4. Create credentials (API Key atau OAuth 2.0)
```

#### 2. **Update Service File**
Edit `/services/googleSheets.ts`:
```typescript
// Ganti MockGoogleSheetsService dengan GoogleSheetsService
export const sheetsService = new GoogleSheetsService();
```

#### 3. **Add API Key**
```typescript
private apiKey: string = 'YOUR_ACTUAL_API_KEY';
```

#### 4. **OAuth untuk Write Access**
Untuk write operations, perlu OAuth 2.0:
```bash
npm install @react-oauth/google
```

Implementasi OAuth flow untuk mendapatkan `accessToken`.

---

## 📊 Contoh Struktur Spreadsheet

### **Sheet: "Villa Surabaya"**
```
| A (Date)   | B (Amount)  | C (Recipient)      | D (Description)        | E (Type)    |
|------------|-------------|--------------------|------------------------|-------------|
| 2025-10-01 | 50000000    | PT. Indo Makmur    | Pembayaran DP 50%      | income      |
| 2025-10-05 | 15000000    | Toko Bangunan      | Material lantai        | expense     |
| 2025-10-12 | 25000000    | PT. Indo Makmur    | Pembayaran tahap 2     | payment     |
|            |             |                    |                        |             | ← Next empty row
```

---

## 🎨 Fitur UI

### **Form Input**
- Date picker untuk tanggal
- Dropdown spreadsheet dengan refresh button
- Dropdown project (auto-filter yang sudah dimapping)
- Info sheet name ditampilkan setelah pilih project
- 3 button tipe transaksi dengan color coding
- Input currency dengan format Rupiah
- Toast notifications untuk feedback

### **Sidebar Info**
- **Spreadsheet Terkonfigurasi**: Daftar spreadsheet dengan link
- **Mapping Project → Sheet**: Daftar mapping dengan detail kolom

### **Tabel Riwayat**
Menampilkan:
- Tanggal
- Project
- Sheet name
- Row number (baris di spreadsheet)
- Tipe transaksi
- Jumlah dengan format Rupiah
- Penerima/Pengirim

---

## 🔐 Security & Best Practices

### **API Key Protection**
```typescript
// JANGAN commit API key ke git!
// Gunakan environment variables
const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
```

### **OAuth Scope**
Untuk write access, request scope:
```
https://www.googleapis.com/auth/spreadsheets
```

### **Rate Limiting**
Google Sheets API limits:
- Read: 100 requests per 100 seconds
- Write: 100 requests per 100 seconds

Implement debouncing dan batching untuk production.

---

## 📝 Kustomisasi

### **Tambah Field Baru**
1. Update interface `RecapEntry`
2. Update `columnMapping` di `ProjectSheetMapping`
3. Update form di `AdminRecapPage`
4. Update `formatDataForSheet` di service

### **Custom Validation**
Tambahkan di `handleSubmit`:
```typescript
if (parseFloat(formData.amount) > 1000000000) {
  toast.error('Jumlah terlalu besar!');
  return;
}
```

### **Export to Excel**
Install library:
```bash
npm install xlsx
```

Tambahkan function export di `AdminRecapPage`.

---

## 🐛 Troubleshooting

### **Issue: Sheet tidak dimuat**
- Pastikan spreadsheet public atau API key memiliki akses
- Check console untuk error message
- Verifikasi spreadsheet ID benar

### **Issue: Write gagal**
- Pastikan menggunakan OAuth token, bukan API key
- Verifikasi OAuth scope includes `spreadsheets`
- Check permission spreadsheet

### **Issue: Data masuk ke baris salah**
- Verifikasi `startRow` di mapping
- Check column mapping (A, B, C, dst)
- Pastikan header di row 1

---

## 📞 Support

Untuk pertanyaan atau issue:
- Email: hda.interiordesign@gmail.com
- WhatsApp: 081703177030 / 08113011224

---

## 🎉 Fitur Mendatang

- [ ] Batch import dari Excel
- [ ] Export riwayat ke PDF
- [ ] Dashboard analytics
- [ ] Auto-backup spreadsheet
- [ ] Multi-user collaboration
- [ ] Approval workflow

---

**Created by HDA Interior Development Team**
*Last updated: October 16, 2025*
