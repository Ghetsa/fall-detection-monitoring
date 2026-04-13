import { Report } from '../services/reportService';
import * as XLSX from 'xlsx';

export type ReportSummaryData = {
  totalUsers: number;
  totalDevices: number;
  activeDevices: number;
  totalIncidents: number;
  monthlyReports: number;
};

export function formatReportTimestamp(ts: any): string {
  if (!ts) return '-';

  const date: Date = ts?.toDate ? ts.toDate() : new Date(ts);

  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function sanitizeFilenamePart(value: string): string {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function escapeHtml(value: unknown): string {
  return formatCellValue(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function buildReportRows(report: Report) {
  const baseRow = {
    id: report.id,
    title: report.title,
    category: report.category,
    period: report.period,
    generatedAt: formatReportTimestamp(report.generatedAt),
    status: report.status,
    description: report.description,
  };

  return report.data && Object.keys(report.data).length > 0
    ? Object.entries(report.data).map(([metric, value]) => ({
        ...baseRow,
        metric,
        value: formatCellValue(value),
      }))
    : [{ ...baseRow, metric: '-', value: '-' }];
}

function sanitizeSheetName(name: string): string {
  const cleaned = String(name || 'Sheet1')
    .replace(/[\\\/\?\*\[\]\:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (cleaned || 'Sheet1').slice(0, 31);
}

function getOrderedHeaders(rows: Array<Record<string, unknown>>): string[] {
  const headerSet = new Set<string>();

  rows.forEach((row) => {
    Object.keys(row).forEach((key) => headerSet.add(key));
  });

  return Array.from(headerSet);
}

function normalizeRows(rows: Array<Record<string, unknown>>) {
  const headers = getOrderedHeaders(rows);

  return rows.map((row) => {
    const normalizedRow: Record<string, string> = {};

    headers.forEach((header) => {
      normalizedRow[header] = formatCellValue(row[header]);
    });

    return normalizedRow;
  });
}

function buildWorksheet(rows: Array<Record<string, unknown>>) {
  const normalizedRows = normalizeRows(rows);
  const worksheet = XLSX.utils.json_to_sheet(normalizedRows);

  const headers = normalizedRows.length > 0 ? Object.keys(normalizedRows[0]) : [];

  if (headers.length > 0) {
    worksheet['!cols'] = headers.map((header) => {
      const longestCell = Math.max(
        header.length,
        ...normalizedRows.map((row) => String(row[header] ?? '-').length)
      );

      return {
        wch: Math.min(Math.max(longestCell + 2, 12), 40),
      };
    });
  }

  return worksheet;
}

export function downloadExcelWorkbook(
  sheets: Array<{ name: string; rows: Array<Record<string, unknown>> }>,
  filename: string
) {
  const workbook = XLSX.utils.book_new();

  sheets.forEach((sheet, index) => {
    const worksheetRows = Array.isArray(sheet.rows) ? sheet.rows : [];
    const worksheet =
      worksheetRows.length > 0
        ? buildWorksheet(worksheetRows)
        : XLSX.utils.json_to_sheet([{ info: 'Tidak ada data' }]);

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      sanitizeSheetName(sheet.name || `Sheet${index + 1}`)
    );
  });

  const safeFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, safeFilename);
}

export function openPdfTemplate(options: {
  title: string;
  subtitle: string;
  summaryRows?: Array<{ label: string; value: unknown }>;
  tableTitle: string;
  headers: string[];
  rows: string[][];
}) {
  const summaryHtml = (options.summaryRows ?? [])
    .map(
      (item) => `
        <div class="summary-card">
          <span class="summary-label">${escapeHtml(item.label)}</span>
          <strong class="summary-value">${escapeHtml(item.value)}</strong>
        </div>
      `
    )
    .join('');

  const headerHtml = options.headers
    .map((header) => `<th>${escapeHtml(header)}</th>`)
    .join('');

  const rowsHtml = options.rows
    .map(
      (row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`
    )
    .join('');

  const printWindow = window.open('', '_blank', 'width=1200,height=900');
  if (!printWindow) return;

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(options.title)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; background: #f8fafc; color: #0f172a; }
          .page { padding: 32px; }
          .hero { background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%); color: #fff; border-radius: 24px; padding: 28px; margin-bottom: 24px; }
          .hero-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.8; margin: 0; }
          .hero-title { font-size: 30px; font-weight: 800; margin: 8px 0 10px; }
          .hero-text { margin: 0; line-height: 1.7; max-width: 720px; }
          .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
          .summary-card { background: #fff; border: 1px solid #dbeafe; border-radius: 18px; padding: 18px; }
          .summary-label { display: block; color: #64748b; font-size: 13px; margin-bottom: 8px; }
          .summary-value { font-size: 24px; color: #1d4ed8; }
          .table-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 24px; }
          .table-title { font-size: 22px; font-weight: 800; margin: 0 0 18px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; vertical-align: top; font-size: 13px; }
          th { background: #eff6ff; color: #1d4ed8; font-weight: 800; }
          .footer { margin-top: 16px; color: #64748b; font-size: 12px; }
          @media print { body { background: #fff; } .page { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="page">
          <section class="hero">
            <p class="hero-label">Anti Fall App Report Center</p>
            <h1 class="hero-title">${escapeHtml(options.title)}</h1>
            <p class="hero-text">${escapeHtml(options.subtitle)}</p>
          </section>
          ${summaryHtml ? `<section class="summary-grid">${summaryHtml}</section>` : ''}
          <section class="table-card">
            <h2 class="table-title">${escapeHtml(options.tableTitle)}</h2>
            <table>
              <thead><tr>${headerHtml}</tr></thead>
              <tbody>${rowsHtml}</tbody>
            </table>
            <p class="footer">Dibuat pada ${escapeHtml(new Date().toLocaleString('id-ID'))}. Gunakan Print lalu pilih Save as PDF.</p>
          </section>
        </div>
        <script>window.onload = function () { window.print(); };</script>
      </body>
    </html>
  `);

  printWindow.document.close();
}