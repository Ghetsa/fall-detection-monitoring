import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminDashboardView from '../../../views/admin/AdminDashboardView';
import AdminBroadcastsView from '../../../views/admin/AdminBroadcastsView';
import AdminIncidentsView from '../../../views/admin/AdminIncidentsView';
import AdminProfileView from '../../../views/admin/AdminProfileView';
import AdminReportsView from '../../../views/admin/AdminReportsView';
import AdminSettingsView from '../../../views/admin/AdminSettingsView';
import AdminUsersView from '../../../views/admin/AdminUsersView';
import { useAuth } from '../../../hooks/useAuth';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { getAllUsers, getUserById, saveUserProfile, updateUserRole } from '../../../services/userService';
import { getAllDevices } from '../../../services/deviceService';
import { getRecentIncidents, getTodayIncidents, getAllIncidents } from '../../../services/incidentService';
import { getAllBroadcasts, sendBroadcast } from '../../../services/broadcastService';
import { getReports, getReportSummary } from '../../../services/reportService';
import { downloadExcelWorkbook, openPdfTemplate, triggerDownload } from '../../../lib/reportExports';
import { showSuccessAlert } from '../../../lib/alerts';

jest.mock('../../../components/layout/DashboardLayout', () => ({
  __esModule: true,
  default: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

jest.mock('../../../components/cards/ReportSummaryCard', () => ({
  __esModule: true,
  default: ({ title, value }: { title: string; value: string | number }) => (
    <div>{`${title}: ${value}`}</div>
  ),
}));

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../hooks/useIsMobile', () => ({
  useIsMobile: jest.fn(),
}));

jest.mock('../../../services/userService', () => ({
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  saveUserProfile: jest.fn(),
  updateUserRole: jest.fn(),
  addUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock('../../../services/deviceService', () => ({
  getAllDevices: jest.fn(),
}));

jest.mock('../../../services/incidentService', () => ({
  getRecentIncidents: jest.fn(),
  getTodayIncidents: jest.fn(),
  getAllIncidents: jest.fn(),
}));

jest.mock('../../../services/broadcastService', () => ({
  getAllBroadcasts: jest.fn(),
  sendBroadcast: jest.fn(),
}));

jest.mock('../../../services/reportService', () => ({
  getReports: jest.fn(),
  getReportSummary: jest.fn(),
}));

jest.mock('../../../lib/reportExports', () => ({
  buildReportRows: jest.fn(() => [{ id: 1, metric: 'users', value: 10, category: 'User', period: 'April', generatedAt: 'today', status: 'Completed' }]),
  buildReportNarrative: jest.fn(() => ({ title: 'Report', intro: 'Intro', points: [], closing: 'Done' })),
  buildNarrativeRows: jest.fn(() => []),
  downloadExcelWorkbook: jest.fn(),
  formatReportTimestamp: jest.fn(() => '14 Apr 2026'),
  sanitizeFilenamePart: jest.fn(() => 'report'),
  triggerDownload: jest.fn(),
  openPdfTemplate: jest.fn(),
}));

jest.mock('../../../lib/alerts', () => ({
  showSuccessAlert: jest.fn(),
  showErrorAlert: jest.fn(),
}));

const adminAuth = {
  user: { uid: 'admin-1', email: 'admin@test.com', displayName: 'Admin User', photoURL: null },
  role: 'admin',
  loading: false,
};

describe('admin views', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue(adminAuth);
    (useIsMobile as jest.Mock).mockReturnValue(false);
    (getAllUsers as jest.Mock).mockResolvedValue([
      { uid: 'u1', fullName: 'Admin User', email: 'admin@test.com', role: 'admin', phone: '081' },
      { uid: 'u2', fullName: 'Customer User', email: 'user@test.com', role: 'customer', phone: '082' },
    ]);
    (getAllDevices as jest.Mock).mockResolvedValue([
      { isOnline: true },
      { isOnline: false },
    ]);
    (getTodayIncidents as jest.Mock).mockResolvedValue([{ id: 't1' }]);
    (getRecentIncidents as jest.Mock).mockResolvedValue([
      {
        id: 'i1',
        type: 'fall_detected',
        severity: 'danger',
        deviceId: 'ESP32-001',
        timestamp: new Date('2026-04-14T10:00:00Z'),
      },
    ]);
    (getAllIncidents as jest.Mock).mockResolvedValue([
      {
        id: 'i1',
        type: 'fall_detected',
        severity: 'danger',
        description: 'Ada kejadian besar',
        location: 'Bandar Lampung',
        timestamp: new Date('2026-04-14T10:00:00Z'),
        isResolved: false,
        deviceId: 'ESP32-001',
      },
    ]);
    (getAllBroadcasts as jest.Mock).mockResolvedValue([
      {
        id: 'b1',
        title: 'Info penting',
        message: 'Pesan penting',
        type: 'info',
        targetRole: 'all',
        createdAt: new Date('2026-04-14T10:00:00Z'),
      },
    ]);
    (getReports as jest.Mock).mockResolvedValue([
      {
        id: 'r1',
        title: 'Laporan Bulanan',
        category: 'System',
        period: 'April 2026',
        generatedAt: new Date('2026-04-14T10:00:00Z'),
        status: 'Completed',
        description: 'Ringkasan sistem',
        data: { users: 10 },
      },
    ]);
    (getReportSummary as jest.Mock).mockResolvedValue({
      totalUsers: 2,
      totalDevices: 2,
      activeDevices: 1,
      totalIncidents: 1,
      monthlyReports: 1,
    });
    (getUserById as jest.Mock).mockResolvedValue({
      fullName: 'Admin User',
      email: 'admin@test.com',
      phone: '081',
      department: 'System Monitoring',
      role: 'admin',
      photoURL: '/images/logo.png',
    });
  });

  it('renders admin dashboard data', async () => {
    render(<AdminDashboardView />);

    expect(await screen.findByText('2')).toBeInTheDocument();
    expect(screen.getByText(/Recent Incidents/i)).toBeInTheDocument();
    expect(screen.getByText(/ESP32-001/i)).toBeInTheDocument();
  });

  it('sends broadcast from form', async () => {
    render(<AdminBroadcastsView />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/Info Maintenance Sistem/i), 'Maintenance');
    await user.type(screen.getByPlaceholderText(/Tulis pengumuman/i), 'Sistem maintenance malam ini');
    await user.click(screen.getByRole('button', { name: /Kirim Broadcast/i }));

    await waitFor(() =>
      expect(sendBroadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Maintenance',
          message: 'Sistem maintenance malam ini',
          createdBy: 'admin-1',
        })
      )
    );
  });

  it('filters incidents by search', async () => {
    render(<AdminIncidentsView />);
    const user = userEvent.setup();

    expect(await screen.findByText(/Ada kejadian besar/i)).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText(/Cari device, lokasi/i), 'Bandar');
    expect(screen.getByText(/Bandar Lampung/i)).toBeInTheDocument();
  });

  it('loads and saves admin profile', async () => {
    render(<AdminProfileView />);
    const user = userEvent.setup();

    expect(await screen.findByDisplayValue('Admin User')).toBeInTheDocument();
    await user.clear(screen.getByPlaceholderText('Divisi'));
    await user.type(screen.getByPlaceholderText('Divisi'), 'Operasional');
    await user.click(screen.getByRole('button', { name: /Simpan Perubahan/i }));

    await waitFor(() =>
      expect(saveUserProfile).toHaveBeenCalledWith(
        'admin-1',
        expect.objectContaining({ department: 'Operasional', role: 'admin' })
      )
    );
  });

  it('exports reports in pdf, excel and json', async () => {
    render(<AdminReportsView />);
    const user = userEvent.setup();

    expect(await screen.findByText(/Reports List/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Export PDF/i }));
    await user.click(screen.getByRole('button', { name: /Export Excel/i }));
    await user.click(screen.getByRole('button', { name: /^PDF$/i }));
    await user.click(screen.getByRole('button', { name: /^Excel$/i }));
    await user.click(screen.getByRole('button', { name: /^JSON$/i }));

    expect(openPdfTemplate).toHaveBeenCalled();
    expect(downloadExcelWorkbook).toHaveBeenCalled();
    expect(triggerDownload).toHaveBeenCalled();
  });

  it('updates settings toggles and saves', async () => {
    render(<AdminSettingsView />);
    const user = userEvent.setup();

    const maintenanceTitle = screen.getByText('Mode Maintenance');
    const switchRow = maintenanceTitle.closest('div')?.parentElement?.parentElement;

    expect(switchRow).not.toBeNull();

    const toggleButton = switchRow?.querySelector('button');

    expect(toggleButton).not.toBeNull();

    await user.click(toggleButton as HTMLButtonElement);
    await user.click(screen.getByRole('button', { name: /Simpan Pengaturan/i }));

    expect(showSuccessAlert).toHaveBeenCalledWith('Pengaturan berhasil disimpan');
  });

  it('changes user role from users table', async () => {
    render(<AdminUsersView />);
    const user = userEvent.setup();

    expect(await screen.findByText('Customer User')).toBeInTheDocument();
    const selects = screen.getAllByDisplayValue(/customer|admin/i);
    await user.selectOptions(selects[1], 'admin');

    await waitFor(() =>
      expect(updateUserRole).toHaveBeenCalledWith('u2', 'admin')
    );
  });
});
