import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomerDashboardView from '../../../views/customer/CustomerDashboardView';
import CustomerEmergencyView from '../../../views/customer/CustomerEmergencyView';
import CustomerLansiaView from '../../../views/customer/CustomerLansiaView';
import CustomerLogsView from '../../../views/customer/CustomerLogsView';
import CustomerNotificationsView from '../../../views/customer/CustomerNotificationsView';
import CustomerProfileView from '../../../views/customer/CustomerProfileView';
import CustomerTrackingView from '../../../views/customer/CustomerTrackingView';
import { useAuth } from '../../../hooks/useAuth';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { getLansiaByCustomer, addLansia, updateLansia, deleteLansia } from '../../../services/lansiaService';
import { getDeviceByLansiaId } from '../../../services/deviceService';
import { getIncidentsByCustomer } from '../../../services/incidentService';
import { getBroadcastsForRole } from '../../../services/broadcastService';
import {
  getEmergencyByCustomer,
  saveEmergencyContact,
  updateEmergencyContact,
} from '../../../services/emergencyService';
import {
  getNotificationsByCustomer,
  markAllNotificationsRead,
} from '../../../services/notificationService';
import { getUserById, saveUserProfile } from '../../../services/userService';

jest.mock('../../../components/layout/DashboardLayout', () => ({
  __esModule: true,
  default: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

jest.mock('../../../components/maps/MapView', () => ({
  __esModule: true,
  default: ({ locationName }: { locationName?: string }) => (
    <div>Map Mock {locationName}</div>
  ),
}));

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../hooks/useIsMobile', () => ({
  useIsMobile: jest.fn(),
}));

jest.mock('../../../services/lansiaService', () => ({
  getLansiaByCustomer: jest.fn(),
  addLansia: jest.fn(),
  updateLansia: jest.fn(),
  deleteLansia: jest.fn(),
}));

jest.mock('../../../services/deviceService', () => ({
  getDeviceByLansiaId: jest.fn(),
}));

jest.mock('../../../services/incidentService', () => ({
  getIncidentsByCustomer: jest.fn(),
}));

jest.mock('../../../services/broadcastService', () => ({
  getBroadcastsForRole: jest.fn(),
}));

jest.mock('../../../services/emergencyService', () => ({
  getEmergencyByCustomer: jest.fn(),
  saveEmergencyContact: jest.fn(),
  updateEmergencyContact: jest.fn(),
}));

jest.mock('../../../services/notificationService', () => ({
  getNotificationsByCustomer: jest.fn(),
  markAllNotificationsRead: jest.fn(),
}));

jest.mock('../../../services/userService', () => ({
  getUserById: jest.fn(),
  saveUserProfile: jest.fn(),
}));

jest.mock('../../../lib/alerts', () => ({
  showSuccessAlert: jest.fn(),
  showErrorAlert: jest.fn(),
}));

const authValue = {
  user: { uid: 'customer-1', email: 'customer@test.com', displayName: 'Customer User', photoURL: null },
  role: 'customer',
  loading: false,
};

describe('customer views', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue(authValue);
    (useIsMobile as jest.Mock).mockReturnValue(false);
    (getLansiaByCustomer as jest.Mock).mockResolvedValue([
      {
        id: 'l1',
        customerId: 'customer-1',
        nama: 'Siti',
        usia: 72,
        jenisKelamin: 'Perempuan',
        alamat: 'Bandar Lampung',
        noHp: '08123',
        kontakDarurat: '08111',
        namaKontakDarurat: 'Budi',
        kondisiKesehatan: 'Hipertensi',
        deviceSerial: 'ESP32-001',
        deviceId: 'ESP32-001',
        status: 'Aktif',
        catatan: 'catatan',
      },
    ]);
    (getDeviceByLansiaId as jest.Mock).mockResolvedValue({
      serial: 'ESP32-001',
      batteryLevel: 87,
      isOnline: true,
      locationName: 'Bandar Lampung',
      lastSeen: new Date('2026-04-14T10:00:00Z'),
      latitude: -5.4,
      longitude: 105.2,
      firmware: 'v2.1.0',
    });
    (getIncidentsByCustomer as jest.Mock).mockResolvedValue([
      {
        id: 'inc-1',
        type: 'fall_detected',
        severity: 'danger',
        description: 'Insiden jatuh terdeteksi',
        location: 'Bandar Lampung',
        timestamp: new Date('2026-04-14T10:00:00Z'),
        isResolved: false,
        deviceId: 'ESP32-001',
      },
    ]);
    (getEmergencyByCustomer as jest.Mock).mockResolvedValue([
      {
        id: 'em-1',
        lansiaId: 'l1',
        contactName: 'Budi',
        contactPhone: '08111',
        relationship: 'Anak',
      },
    ]);
    (getNotificationsByCustomer as jest.Mock).mockResolvedValue([
      {
        id: 'n1',
        title: 'Peringatan',
        description: 'Ada notifikasi penting',
        type: 'danger',
        isRead: false,
        lansiaName: 'Siti',
        createdAt: new Date('2026-04-14T10:00:00Z'),
      },
    ]);
    (getBroadcastsForRole as jest.Mock).mockResolvedValue([
      {
        id: 'b1',
        title: 'Maintenance',
        message: 'Sistem maintenance malam ini',
        type: 'info',
        targetRole: 'all',
        createdAt: new Date('2026-04-14T10:00:00Z'),
      },
    ]);
    (getUserById as jest.Mock).mockResolvedValue({
      fullName: 'Customer User',
      email: 'customer@test.com',
      phone: '08123',
      address: 'Bandar Lampung',
      relationship: 'Anak',
      photoURL: '/images/logo.png',
    });
  });

  it('renders dashboard statistics and recent incidents', async () => {
    render(<CustomerDashboardView />);

    expect(await screen.findByText(/Terdeteksi kemungkinan jatuh!/i)).toBeInTheDocument();
    expect(screen.getByText('Bandar Lampung')).toBeInTheDocument();
    expect(screen.getByText(/Insiden jatuh terdeteksi/i)).toBeInTheDocument();
  });

  it('loads emergency contact and updates it', async () => {
    render(<CustomerEmergencyView />);
    const user = userEvent.setup();

    expect(await screen.findByDisplayValue('Budi')).toBeInTheDocument();
    await user.clear(screen.getByPlaceholderText('Nama keluarga'));
    await user.type(screen.getByPlaceholderText('Nama keluarga'), 'Ibu Dewi');
    await user.click(screen.getByRole('button', { name: /Simpan Kontak/i }));

    await waitFor(() => expect(updateEmergencyContact).toHaveBeenCalled());
  });

  it('filters lansia data and opens add modal', async () => {
    render(<CustomerLansiaView />);
    const user = userEvent.setup();

    expect(await screen.findByText('Siti')).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText(/Cari nama atau serial device/i), 'ESP32-001');
    expect(screen.getByText('Siti')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Tambah Lansia/i }));
    expect(screen.getByText('Tambah Lansia Baru')).toBeInTheDocument();
  });

  it('renders monitoring history list', async () => {
    render(<CustomerLogsView />);
    expect(await screen.findByText('Monitoring History')).toBeInTheDocument();
    expect(await screen.findByText(/Ada notifikasi penting/i)).toBeInTheDocument();
  });

  it('renders broadcasts in notifications page', async () => {
    render(<CustomerNotificationsView />);
    expect(await screen.findByText('Maintenance')).toBeInTheDocument();
    expect(screen.getByText(/Sistem maintenance malam ini/i)).toBeInTheDocument();
  });

  it('marks all monitoring history alerts as read', async () => {
    render(<CustomerLogsView />);
    const user = userEvent.setup();

    expect(await screen.findByText(/1 alert belum dibaca/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Tandai Semua Dibaca/i }));

    await waitFor(() =>
      expect(markAllNotificationsRead).toHaveBeenCalledWith('customer-1')
    );
  });

  it('loads and saves customer profile', async () => {
    render(<CustomerProfileView />);
    const user = userEvent.setup();

    expect(await screen.findByDisplayValue('Customer User')).toBeInTheDocument();
    await user.clear(screen.getByPlaceholderText('Nomor WhatsApp'));
    await user.type(screen.getByPlaceholderText('Nomor WhatsApp'), '08999');
    await user.click(screen.getByRole('button', { name: /Simpan Perubahan/i }));

    await waitFor(() =>
      expect(saveUserProfile).toHaveBeenCalledWith(
        'customer-1',
        expect.objectContaining({ phone: '08999', role: 'customer' })
      )
    );
  });

  it('renders tracking details and map', async () => {
    render(<CustomerTrackingView />);

    expect(await screen.findByText(/Map Mock Bandar Lampung/i)).toBeInTheDocument();
    expect(screen.getByText('Aktif & Terhubung')).toBeInTheDocument();
    expect(screen.getByText(/Serial:\s*ESP32-001/i)).toBeInTheDocument();
  });
});
