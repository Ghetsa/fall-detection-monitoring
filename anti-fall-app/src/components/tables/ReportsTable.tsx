import { CSSProperties } from 'react';
import { ReportItem } from '../../types/report';

type ReportsTableProps = {
  reports: ReportItem[];
};

export default function ReportsTable({ reports }: ReportsTableProps) {
  const getStatusStyle = (status: ReportItem['status']): CSSProperties => {
    if (status === 'Completed') {
      return {
        backgroundColor: '#dcfce7',
        color: '#166534',
      };
    }

    if (status === 'Processing') {
      return {
        backgroundColor: '#fef3c7',
        color: '#92400e',
      };
    }

    return {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
    };
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h3 style={styles.title}>Reports List</h3>
        <span style={styles.badge}>Latest</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Report ID</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Period</th>
              <th style={styles.th}>Generated At</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id} style={styles.tr}>
                <td style={styles.td}>{report.id}</td>
                <td style={styles.td}>
                  <div>
                    <p style={styles.reportTitle}>{report.title}</p>
                    <p style={styles.reportDescription}>{report.description}</p>
                  </div>
                </td>
                <td style={styles.td}>{report.category}</td>
                <td style={styles.td}>{report.period}</td>
                <td style={styles.td}>{report.generatedAt}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...getStatusStyle(report.status),
                    }}
                  >
                    {report.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  wrapper: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
    minWidth: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 800,
    color: '#0f172a',
  },
  badge: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px',
  },
  th: {
    textAlign: 'left',
    fontSize: '13px',
    color: '#64748b',
    fontWeight: 700,
    padding: '14px 12px',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid #e2e8f0',
  },
  td: {
    padding: '16px 12px',
    fontSize: '14px',
    color: '#0f172a',
    verticalAlign: 'top',
  },
  reportTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
  },
  reportDescription: {
    margin: '6px 0 0',
    fontSize: '13px',
    color: '#64748b',
    lineHeight: 1.5,
  },
  statusBadge: {
    display: 'inline-block',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
  },
};