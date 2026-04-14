import { render, screen } from '@testing-library/react';
import MapView from '../../../components/maps/MapView';

describe('MapView', () => {
  it('renders empty state when coordinates are missing', () => {
    render(<MapView locationName="Bandar Lampung" height={320} />);

    expect(screen.getByText('Belum ada data lokasi')).toBeInTheDocument();
    expect(
      screen.getByText(/Peta akan tampil setelah perangkat mengirim koordinat terbaru/i)
    ).toBeInTheDocument();
  });

  it('renders map iframe and link when coordinates are valid', () => {
    render(
      <MapView
        latitude={-5.4292}
        longitude={105.261}
        locationName="Bandar Lampung"
        height={360}
      />
    );

    expect(screen.getByTitle('Bandar Lampung')).toHaveAttribute(
      'src',
      expect.stringContaining('openstreetmap.org/export/embed.html')
    );
    expect(screen.getByText('Lokasi Saat Ini')).toBeInTheDocument();
    expect(screen.getByText('Bandar Lampung')).toBeInTheDocument();
    expect(screen.getByText('-5.42920, 105.26100')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Buka Peta/i })).toHaveAttribute(
      'href',
      expect.stringContaining('openstreetmap.org/?mlat=-5.4292')
    );
  });
});
