import { useEffect, useState } from 'react';
import { Download, FileDown, FileJson, FileSpreadsheet, Loader } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ReportSummaryCard from '../../components/cards/ReportSummaryCard';
import { getReports, getReportSummary, Report } from '../../services/reportService';
import {
  buildReportRows,
  downloadExcelWorkbook,
  formatReportTimestamp,
  ReportSummaryData,
  sanitizeFilenamePart,
  triggerDownload,
  openPdfTemplate,
} from '../../lib/reportExports';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function AdminReportsView() {
  const isMobile = useIsMobile();
  const [reports, setReports] = useState<Report[]>([]);
  const [summary, setSummary] = useState<ReportSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [reportsData, summaryData] = await Promise.all([
          getReports(),
          getReportSummary(),
        ]);

        setReports(reportsData);
        setSummary(summaryData);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const downloadReportJson = (report: Report) => {
    const payload = {
      id: report.id,
      title: report.title,
      category: report.category,
      period: report.period,
      generatedAt: formatReportTimestamp(report.generatedAt),
      status: report.status,
      description: report.description,
      data: report.data ?? {},
    };

    triggerDownload(
      `${sanitizeFilenamePart(report.title || report.id)}.json`,
      JSON.stringify(payload, null, 2),
      'application/json;charset=utf-8'
    );
  };

  const downloadReportExcel = (report: Report) => {
    downloadExcelWorkbook(
      [
        {
          name: report.title || 'Report',
          rows: buildReportRows(report),
        },
      ],
      `${sanitizeFilenamePart(report.title || report.id)}.xlsx`
    );
  };

  const downloadAllReportsExcel = () => {
    downloadExcelWorkbook(
      [
        {
          name: 'Reports Summary',
          rows: reports.map((report) => ({
            id: report.id,
            title: report.title,
            category: report.category,
            period: report.period,
            generatedAt: formatReportTimestamp(report.generatedAt),
            status: report.status,
            description: report.description,
            metrics: Object.keys(report.data ?? {}).length,
          })),
        },
        ...reports
          .filter((report) => report.status === 'Completed')
          .map((report) => ({
            name: sanitizeFilenamePart(report.title || report.id) || 'Report',
            rows: buildReportRows(report),
          })),
      ],
      `admin-reports-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const downloadReportPdf = (report: Report) => {
    openPdfTemplate({
      title: report.title,
      subtitle: report.description,
      summaryRows: [
        { label: 'Kategori', value: report.category },
        { label: 'Periode', value: report.period },
        { label: 'Status', value: report.status },
        { label: 'Generated', value: formatReportTimestamp(report.generatedAt) },
      ],
      tableTitle: 'Detail Report',
      headers: ['ID', 'Kategori', 'Periode', 'Dibuat', 'Status', 'Metric', 'Value'],
      rows: buildReportRows(report).map((row) => [
        String(row.id),
        String(row.category),
        String(row.period),
        String(row.generatedAt),
        String(row.status),
        String(row.metric),
        String(row.value),
      ]),
    });
  };

  const downloadAllReportsPdf = () => {
    openPdfTemplate({
      title: 'Admin Reports Summary',
      subtitle:
        'Ringkasan seluruh laporan sistem, insiden, perangkat, dan pengguna yang tersedia pada pusat laporan admin.',
      summaryRows: summary
        ? [
            { label: 'Total Users', value: summary.totalUsers },
            { label: 'Total Devices', value: summary.totalDevices },
            { label: 'Active Devices', value: summary.activeDevices },
            { label: 'Total Incidents', value: summary.totalIncidents },
            { label: 'Monthly Reports', value: summary.monthlyReports },
          ]
        : undefined,
      tableTitle: 'Reports List',
      headers: ['Title', 'Category', 'Period', 'Generated At', 'Status', 'Metrics'],
      rows: reports.map((report) => [
        report.title,
        report.category,
        report.period,
        formatReportTimestamp(report.generatedAt),
        report.status,
        String(Object.keys(report.data ?? {}).length),
      ]),
    });
  };

  const getStatusStyle = (status: string): React.CSSProperties => {
    if (status === 'Completed') {
      return { backgroundColor: '#dcfce7', color: '#166534' };
    }

    if (status === 'Processing') {
      return { backgroundColor: '#fef3c7', color: '#92400e' };
    }

    return { backgroundColor: '#fee2e2', color: '#b91c1c' };
  };

  return (
    <DashboardLayout
      role="admin"
      title="Admin Reports"
      subtitle="Ringkasan laporan sistem dan aktivitas pengguna"
    >
      <section style={styles.content}>
        <div style={styles.heroCard}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>Reports Center</p>
            <h2 style={styles.heroTitle}>Admin Reports</h2>
            <p style={styles.heroText}>
              Lihat ringkasan laporan sistem, laporan insiden, perangkat aktif,
              dan data user secara terpusat.
            </p>
          </div>

          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot} />
            Reports Ready
          </div>
        </div>

        <div style={{ ...styles.cardGrid, ...(isMobile ? styles.singleColumnGrid : {}) }}>
          <ReportSummaryCard
            title="Total Users"
            value={loading ? '-' : summary?.totalUsers ?? 0}
            description="Jumlah seluruh user yang terdaftar."
          />
          <ReportSummaryCard
            title="Total Devices"
            value={loading ? '-' : summary?.totalDevices ?? 0}
            description="Jumlah seluruh device yang tercatat."
          />
          <ReportSummaryCard
            title="Active Devices"
            value={loading ? '-' : summary?.activeDevices ?? 0}
            description="Device yang sedang online dan aktif."
            valueColor="#166534"
          />
          <ReportSummaryCard
            title="Total Incidents"
            value={loading ? '-' : summary?.totalIncidents ?? 0}
            description="Jumlah semua kejadian yang tercatat."
            valueColor="#b91c1c"
          />
          <ReportSummaryCard
            title="Monthly Reports"
            value={loading ? '-' : summary?.monthlyReports ?? 0}
            description="Total laporan yang dihasilkan bulan ini."
            valueColor="#1d4ed8"
          />
        </div>

        <div style={styles.tableSection}>
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <h3 style={styles.tableTitle}>Reports List</h3>
              <div style={styles.tableActions}>
                <button
                  type="button"
                  style={{
                    ...styles.downloadAllButton,
                    ...styles.pdfButton,
                    ...(loading || reports.length === 0 ? styles.disabledButton : {}),
                  }}
                  onClick={downloadAllReportsPdf}
                  disabled={loading || reports.length === 0}
                >
                  <FileDown size={16} />
                  Export PDF
                </button>

                <button
                  type="button"
                  style={{
                    ...styles.downloadAllButton,
                    ...styles.excelButton,
                    ...(loading || reports.length === 0 ? styles.disabledButton : {}),
                  }}
                  onClick={downloadAllReportsExcel}
                  disabled={loading || reports.length === 0}
                >
                  <Download size={16} />
                  Export Excel
                </button>

                <span style={styles.tableBadge}>Latest</span>
              </div>
            </div>

            {loading ? (
              <div style={styles.loadingBox}>
                <Loader size={24} color="#94a3b8" />
              </div>
            ) : reports.length === 0 ? (
              <p style={styles.emptyText}>Belum ada laporan tersedia.</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Period</th>
                      <th style={styles.th}>Generated At</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => {
                      const isDownloadable = report.status === 'Completed';

                      return (
                        <tr key={report.id} style={styles.tr}>
                          <td style={styles.td}>
                            <p style={styles.reportTitle}>{report.title}</p>
                            <p style={styles.reportDesc}>{report.description}</p>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.catBadge}>{report.category}</span>
                          </td>
                          <td style={styles.td}>{report.period}</td>
                          <td style={styles.td}>{formatReportTimestamp(report.generatedAt)}</td>
                          <td style={styles.td}>
                            <span style={{ ...styles.statusBadge, ...getStatusStyle(report.status) }}>
                              {report.status}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.rowActions}>
                              <button
                                type="button"
                                style={{
                                  ...styles.actionButton,
                                  ...styles.pdfActionButton,
                                  ...(isDownloadable ? {} : styles.disabledButton),
                                }}
                                onClick={() => downloadReportPdf(report)}
                                disabled={!isDownloadable}
                                title={
                                  isDownloadable
                                    ? 'Export report sebagai PDF'
                                    : 'Laporan masih diproses'
                                }
                              >
                                <FileDown size={15} />
                                PDF
                              </button>

                              <button
                                type="button"
                                style={{
                                  ...styles.actionButton,
                                  ...styles.excelActionButton,
                                  ...(isDownloadable ? {} : styles.disabledButton),
                                }}
                                onClick={() => downloadReportExcel(report)}
                                disabled={!isDownloadable}
                                title={
                                  isDownloadable
                                    ? 'Export report sebagai Excel'
                                    : 'Laporan masih diproses'
                                }
                              >
                                <FileSpreadsheet size={15} />
                                Excel
                              </button>

                              <button
                                type="button"
                                style={{
                                  ...styles.actionButton,
                                  ...styles.jsonButton,
                                  ...(isDownloadable ? {} : styles.disabledButton),
                                }}
                                onClick={() => downloadReportJson(report)}
                                disabled={!isDownloadable}
                                title={
                                  isDownloadable
                                    ? 'Unduh laporan sebagai JSON'
                                    : 'Laporan masih diproses'
                                }
                              >
                                <FileJson size={15} />
                                JSON
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  content: { padding: '5px', minWidth: 0 },
  heroCard: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
    color: '#ffffff',
    borderRadius: '24px',
    padding: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  heroContent: { flex: 1, minWidth: 0 },
  heroLabel: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.8)',
  },
  heroTitle: { margin: '8px 0 10px', fontSize: '32px', fontWeight: 800, lineHeight: 1.2 },
  heroText: {
    margin: 0,
    fontSize: '15px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.92)',
    maxWidth: '760px',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#ffffff',
    color: '#166534',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: 800,
    fontSize: '15px',
  },
  heroBadgeDot: {
    width: '10px',
    height: '10px',
    borderRadius: '999px',
    backgroundColor: '#22c55e',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginTop: '24px',
  },
  singleColumnGrid: { gridTemplateColumns: '1fr' },
  tableSection: { marginTop: '24px' },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(15,23,42,0.05)',
    border: '1px solid #e2e8f0',
    minWidth: 0,
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  tableTitle: { margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' },
  tableActions: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  tableBadge: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
  downloadAllButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  pdfButton: { backgroundColor: '#0f172a', color: '#ffffff' },
  excelButton: { backgroundColor: '#166534', color: '#ffffff' },
  loadingBox: { display: 'flex', justifyContent: 'center', padding: '40px 0' },
  emptyText: {
    margin: 0,
    textAlign: 'center',
    fontSize: '14px',
    color: '#94a3b8',
    padding: '20px 0',
  },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '980px' },
  th: {
    textAlign: 'left',
    fontSize: '13px',
    color: '#64748b',
    fontWeight: 700,
    padding: '14px 12px',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: {
    padding: '16px 12px',
    fontSize: '14px',
    color: '#0f172a',
    verticalAlign: 'top',
  },
  reportTitle: { margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' },
  reportDesc: {
    margin: '6px 0 0',
    fontSize: '13px',
    color: '#64748b',
    lineHeight: 1.5,
    maxWidth: '320px',
  },
  catBadge: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 700,
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  rowActions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  pdfActionButton: { color: '#0f172a', borderColor: '#cbd5e1', backgroundColor: '#f8fafc' },
  excelActionButton: { color: '#166534', borderColor: '#86efac', backgroundColor: '#f0fdf4' },
  jsonButton: { color: '#1d4ed8', borderColor: '#93c5fd', backgroundColor: '#eff6ff' },
  disabledButton: { opacity: 0.55, cursor: 'not-allowed' },
};
