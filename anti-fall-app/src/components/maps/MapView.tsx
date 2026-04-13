type MapViewProps = {
  latitude?: number | null;
  longitude?: number | null;
  locationName?: string;
  height?: number;
};

function hasValidCoordinates(
  latitude?: number | null,
  longitude?: number | null
): latitude is number {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  );
}

export default function MapView({
  latitude,
  longitude,
  locationName = 'Lokasi perangkat',
  height = 420,
}: MapViewProps) {
  if (!hasValidCoordinates(latitude, longitude)) {
    return (
      <div
        style={{
          ...styles.wrapper,
          minHeight: `${height}px`,
          background:
            'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
        }}
      >
        <div style={styles.emptyState}>
          <p style={styles.emptyTitle}>Belum ada data lokasi</p>
          <p style={styles.emptyText}>
            Peta akan tampil setelah perangkat mengirim koordinat terbaru.
          </p>
        </div>
      </div>
    );
  }

  const lat = latitude as number;
  const lng = longitude as number;
  const delta = 0.008;
  const bbox = [
    lng - delta,
    lat - delta,
    lng + delta,
    lat + delta,
  ].join('%2C');

  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  const directionsUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  return (
    <div style={{ ...styles.wrapper, minHeight: `${height}px` }}>
      <iframe
        title={locationName}
        src={embedUrl}
        style={styles.iframe}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <div style={styles.overlay}>
        <div>
          <p style={styles.overlayLabel}>Lokasi Saat Ini</p>
          <p style={styles.overlayTitle}>{locationName}</p>
          <p style={styles.overlayCoords}>
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </p>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          style={styles.linkButton}
        >
          Buka Peta
        </a>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: 'relative',
    width: '100%',
    borderRadius: '18px',
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
  },
  iframe: {
    width: '100%',
    height: '100%',
    minHeight: '420px',
    border: 'none',
    display: 'block',
  },
  overlay: {
    position: 'absolute',
    left: '16px',
    right: '16px',
    bottom: '16px',
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    color: '#ffffff',
    borderRadius: '16px',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  overlayLabel: {
    margin: 0,
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.72)',
  },
  overlayTitle: {
    margin: '4px 0 0',
    fontSize: '17px',
    fontWeight: 800,
  },
  overlayCoords: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.8)',
  },
  linkButton: {
    textDecoration: 'none',
    backgroundColor: '#ffffff',
    color: '#1d4ed8',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  emptyState: {
    minHeight: '420px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
    color: '#1d4ed8',
  },
  emptyTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 800,
  },
  emptyText: {
    margin: '10px 0 0',
    maxWidth: '360px',
    fontSize: '14px',
    lineHeight: 1.7,
    color: '#1e3a8a',
  },
};
