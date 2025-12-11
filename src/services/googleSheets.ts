// Google Sheets API Service
// Untuk integrasi dengan Google Sheets API

interface SheetConfig {
  spreadsheetId: string;
  sheetName: string;
  gid: string;
  range: string;
}

interface ColumnMapping {
  date: string;      // Kolom untuk tanggal (misal: "A")
  amount: string;    // Kolom untuk jumlah (misal: "B")
  recipient: string; // Kolom untuk pengirim/penerima (misal: "C")
  description: string; // Kolom untuk keterangan (misal: "D")
  type: string;      // Kolom untuk tipe transaksi (misal: "E")
}

export class GoogleSheetsService {
  private apiKey: string = 'YOUR_API_KEY_HERE'; // Ganti dengan API Key Anda
  private baseUrl: string = 'https://sheets.googleapis.com/v4/spreadsheets';

  // Extract Spreadsheet ID dari URL
  extractSpreadsheetId(url: string): string {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : '';
  }

  // Extract GID (Sheet ID) dari URL
  extractGid(url: string): string {
    const match = url.match(/[#&]gid=([0-9]+)/);
    return match ? match[1] : '0';
  }

  // Get semua sheet names dari spreadsheet
  async getSheetNames(spreadsheetId: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${spreadsheetId}?key=${this.apiKey}`
      );
      const data = await response.json();
      
      if (data.sheets) {
        return data.sheets.map((sheet: any) => sheet.properties.title);
      }
      return [];
    } catch (error) {
      console.error('Error fetching sheet names:', error);
      return [];
    }
  }

  // Get data dari range tertentu
  async getSheetData(
    spreadsheetId: string,
    sheetName: string,
    range: string = 'A:Z'
  ): Promise<any[][]> {
    try {
      const fullRange = `${sheetName}!${range}`;
      const response = await fetch(
        `${this.baseUrl}/${spreadsheetId}/values/${encodeURIComponent(fullRange)}?key=${this.apiKey}`
      );
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      return [];
    }
  }

  // Cari baris kosong berikutnya berdasarkan kolom tanggal
  async findNextEmptyRow(
    spreadsheetId: string,
    sheetName: string,
    dateColumn: string = 'A',
    startRow: number = 2 // Mulai dari row 2 (skip header)
  ): Promise<number> {
    try {
      const range = `${dateColumn}${startRow}:${dateColumn}`;
      const data = await this.getSheetData(spreadsheetId, sheetName, range);
      
      // Cari row pertama yang kosong
      for (let i = 0; i < data.length; i++) {
        if (!data[i] || !data[i][0]) {
          return startRow + i;
        }
      }
      
      // Jika semua terisi, return row setelah data terakhir
      return startRow + data.length;
    } catch (error) {
      console.error('Error finding next empty row:', error);
      return startRow;
    }
  }

  // Append data ke sheet (menambah di baris terakhir)
  async appendData(
    spreadsheetId: string,
    sheetName: string,
    values: any[][],
    accessToken: string // OAuth token diperlukan untuk write
  ): Promise<boolean> {
    try {
      const range = `${sheetName}!A:Z`;
      const response = await fetch(
        `${this.baseUrl}/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: values,
          }),
        }
      );
      
      return response.ok;
    } catch (error) {
      console.error('Error appending data:', error);
      return false;
    }
  }

  // Update data di baris tertentu
  async updateRow(
    spreadsheetId: string,
    sheetName: string,
    rowNumber: number,
    values: any[],
    columnMapping: ColumnMapping,
    accessToken: string
  ): Promise<boolean> {
    try {
      // Format range berdasarkan column mapping
      const startCol = columnMapping.date;
      const endCol = columnMapping.description; // atau kolom terakhir yang digunakan
      const range = `${sheetName}!${startCol}${rowNumber}:${endCol}${rowNumber}`;
      
      const response = await fetch(
        `${this.baseUrl}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [values],
          }),
        }
      );
      
      return response.ok;
    } catch (error) {
      console.error('Error updating row:', error);
      return false;
    }
  }

  // Insert data berdasarkan urutan tanggal (sorted insert)
  async insertDataSorted(
    spreadsheetId: string,
    sheetName: string,
    newDate: Date,
    values: any[],
    columnMapping: ColumnMapping,
    accessToken: string
  ): Promise<boolean> {
    try {
      // 1. Get semua data tanggal
      const dateColumn = columnMapping.date;
      const existingData = await this.getSheetData(
        spreadsheetId,
        sheetName,
        `${dateColumn}2:${dateColumn}` // Skip header row
      );

      // 2. Cari posisi insert yang tepat
      let insertRow = 2; // Default start after header
      for (let i = 0; i < existingData.length; i++) {
        if (existingData[i] && existingData[i][0]) {
          const existingDate = new Date(existingData[i][0]);
          if (newDate < existingDate) {
            insertRow = i + 2; // +2 karena skip header dan index 0-based
            break;
          }
        }
        insertRow = i + 3; // Next row after last data
      }

      // 3. Insert di row yang tepat
      return await this.updateRow(
        spreadsheetId,
        sheetName,
        insertRow,
        values,
        columnMapping,
        accessToken
      );
    } catch (error) {
      console.error('Error inserting sorted data:', error);
      return false;
    }
  }

  // Format data sesuai dengan struktur sheet
  formatDataForSheet(
    date: string,
    amount: number,
    recipient: string,
    description: string,
    type: string,
    columnMapping: ColumnMapping
  ): any[] {
    // Buat array dengan urutan sesuai column mapping
    // Asumsi: A=Date, B=Amount, C=Recipient, D=Description, E=Type
    return [
      date,
      amount,
      recipient,
      description,
      type,
    ];
  }
}

// Mock service untuk development (tanpa API key)
export class MockGoogleSheetsService extends GoogleSheetsService {
  async getSheetNames(spreadsheetId: string): Promise<string[]> {
    // Return mock sheet names
    return [
      'Villa Surabaya',
      'Office Jakarta',
      'Apartment Bali',
      'Restaurant Bandung',
      'Hotel Yogyakarta',
      'Summary',
      'Cashflow',
    ];
  }

  async findNextEmptyRow(
    spreadsheetId: string,
    sheetName: string,
    dateColumn: string = 'A',
    startRow: number = 2
  ): Promise<number> {
    // Mock: return random row number
    return Math.floor(Math.random() * 10) + startRow;
  }

  async appendData(
    spreadsheetId: string,
    sheetName: string,
    values: any[][],
    accessToken: string
  ): Promise<boolean> {
    console.log('Mock: Appending data to sheet', {
      spreadsheetId,
      sheetName,
      values,
    });
    return true;
  }

  async updateRow(
    spreadsheetId: string,
    sheetName: string,
    rowNumber: number,
    values: any[],
    columnMapping: ColumnMapping,
    accessToken: string
  ): Promise<boolean> {
    console.log('Mock: Updating row', {
      spreadsheetId,
      sheetName,
      rowNumber,
      values,
      columnMapping,
    });
    return true;
  }

  async insertDataSorted(
    spreadsheetId: string,
    sheetName: string,
    newDate: Date,
    values: any[],
    columnMapping: ColumnMapping,
    accessToken: string
  ): Promise<boolean> {
    console.log('Mock: Inserting sorted data', {
      spreadsheetId,
      sheetName,
      newDate,
      values,
    });
    return true;
  }
}

export const sheetsService = new MockGoogleSheetsService();
