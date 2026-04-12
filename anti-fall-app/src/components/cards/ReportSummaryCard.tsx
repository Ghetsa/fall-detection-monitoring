import { CSSProperties } from 'react';

type ReportSummaryCardProps = {
  title: string;
  value: string | number;
  description: string;
  valueColor?: string;
};

export default function ReportSummaryCard({
  title,
  value,
  description,
  valueColor = '#0f172a',
}: ReportSummaryCardProps) {
  return (
    <div style={styles.card}>
      <p style={styles.label}>{title}</p>
      <h3 style={{ ...styles.value, color: valueColor }}>{value}</h3>
      <p style={styles.description}>{description}</p>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '22px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
    minWidth: 0,
  },
  label: {
    margin: 0,
    fontSize: '14px',
    color: '#64748b',
    fontWeight: 600,
  },
  value: {
    margin: '12px 0 10px',
    fontSize: '30px',
    fontWeight: 800,
    wordBreak: 'break-word',
  },
  description: {
    margin: 0,
    fontSize: '14px',
    lineHeight: 1.7,
    color: '#475569',
  },
};