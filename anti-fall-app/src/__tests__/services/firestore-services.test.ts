import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getAllBroadcasts, getBroadcastsForCustomer, getBroadcastsForRole, sendBroadcast } from '../../services/broadcastService';
import {
  getAllDevices,
  getDeviceByLansiaId,
  getDeviceBySerial,
  getDevicesByCustomer,
} from '../../services/deviceService';
import {
  getEmergencyByCustomer,
  getEmergencyByLansia,
  saveEmergencyContact,
  updateEmergencyContact,
} from '../../services/emergencyService';
import {
  getAllIncidents,
  getIncidentsByCustomer,
  getIncidentsByLansia,
  getRecentIncidents,
  getTodayIncidents,
} from '../../services/incidentService';
import { addLansia, deleteLansia, getAllLansia, getLansiaByCustomer, updateLansia } from '../../services/lansiaService';
import * as lansiaService from '../../services/lansiaService';
import {
  getNotificationsByCustomer,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/notificationService';
import { getReports, getReportSummary } from '../../services/reportService';
import {
  getLatestTelemetryByLansia,
  getTelemetryByCustomer,
  getTelemetryByLansia,
} from '../../services/telemetryService';

jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn((_db, name) => `collection-${name}`),
  deleteDoc: jest.fn(),
  doc: jest.fn((_db, name, id) => `doc-${name}-${id}`),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  limit: jest.fn((value) => `limit-${value}`),
  orderBy: jest.fn((field, direction) => `orderBy-${field}-${direction}`),
  query: jest.fn((...parts) => ({ parts })),
  serverTimestamp: jest.fn(() => 'server-ts'),
  Timestamp: {
    fromDate: jest.fn((date: Date) => ({ date })),
  },
  updateDoc: jest.fn(),
  where: jest.fn((field, op, value) => `where-${field}-${op}-${String(value)}`),
}));

jest.mock('../../lib/firebase', () => ({
  db: {},
}));

function makeDocs(items: Array<{ id?: string; data: Record<string, unknown> }>) {
  return items.map((item, index) => ({
    id: item.id ?? `doc-${index}`,
    ref: `ref-${item.id ?? index}`,
    data: () => item.data,
  }));
}

describe('firestore services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('covers broadcast service functions', async () => {
    (getDocs as jest.Mock)
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 'b1', data: { title: 'Info' } }]),
      })
      .mockResolvedValueOnce({
        docs: makeDocs([
          { id: 'all-1', data: { targetRole: 'all', createdAt: { seconds: 2 } } },
        ]),
      })
      .mockResolvedValueOnce({
        docs: makeDocs([
          { id: 'customer-1', data: { targetRole: 'customer', createdAt: { seconds: 3 } } },
          { id: 'all-1', data: { targetRole: 'all', createdAt: { seconds: 2 } } },
        ]),
      })
      .mockResolvedValueOnce({
        docs: makeDocs([
          { id: 'all-2', data: { targetRole: 'all', createdAt: { seconds: 5 } } },
        ]),
      })
      .mockResolvedValueOnce({
        docs: makeDocs([
          { id: 'admin-1', data: { targetRole: 'admin', createdAt: { seconds: 6 } } },
        ]),
      });
    (addDoc as jest.Mock).mockResolvedValue({ id: 'broadcast-new' });

    await expect(getAllBroadcasts()).resolves.toEqual([
      { id: 'b1', title: 'Info' },
    ]);
    await expect(getBroadcastsForCustomer()).resolves.toEqual([
      { id: 'customer-1', targetRole: 'customer', createdAt: { seconds: 3 } },
      { id: 'all-1', targetRole: 'all', createdAt: { seconds: 2 } },
    ]);
    await expect(getBroadcastsForRole('admin')).resolves.toEqual([
      { id: 'admin-1', targetRole: 'admin', createdAt: { seconds: 6 } },
      { id: 'all-2', targetRole: 'all', createdAt: { seconds: 5 } },
    ]);
    await expect(
      sendBroadcast({ title: 'Alert', message: 'Msg', type: 'info', targetRole: 'all', isActive: true, createdBy: 'admin' } as any)
    ).resolves.toBe('broadcast-new');

    expect(serverTimestamp).toHaveBeenCalled();
  });

  it('covers device service functions', async () => {
    (getDocs as jest.Mock)
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 'd1', data: { serial: 'ESP32-001' } }]),
      })
      .mockResolvedValueOnce({
        empty: false,
        docs: makeDocs([{ id: 'd2', data: { customerId: 'c1' } }]),
      })
      .mockResolvedValueOnce({
        empty: false,
        docs: makeDocs([{ id: 'd3', data: { lansiaId: 'l1' } }]),
      })
      .mockResolvedValueOnce({
        empty: true,
        docs: [],
      });
    (getDoc as jest.Mock)
      .mockResolvedValueOnce({
        exists: () => true,
        id: 'ESP32-001',
        data: () => ({ serial: 'ESP32-001' }),
      })
      .mockResolvedValueOnce({
        exists: () => false,
      });

    await expect(getAllDevices()).resolves.toEqual([
      { id: 'd1', serial: 'ESP32-001' },
    ]);
    await expect(getDevicesByCustomer('c1')).resolves.toEqual([
      { id: 'd2', customerId: 'c1' },
    ]);
    await expect(getDeviceBySerial('ESP32-001')).resolves.toEqual({
      id: 'ESP32-001',
      serial: 'ESP32-001',
    });
    await expect(getDeviceBySerial('missing')).resolves.toBeNull();
    await expect(getDeviceByLansiaId('l1')).resolves.toEqual({
      id: 'd3',
      lansiaId: 'l1',
    });
    await expect(getDeviceByLansiaId('empty')).resolves.toBeNull();
  });

  it('covers emergency service functions', async () => {
    (getDocs as jest.Mock)
      .mockResolvedValueOnce({
        empty: false,
        docs: makeDocs([{ id: 'e1', data: { customerId: 'c1' } }]),
      })
      .mockResolvedValueOnce({
        empty: false,
        docs: makeDocs([{ id: 'e2', data: { lansiaId: 'l1' } }]),
      })
      .mockResolvedValueOnce({
        empty: true,
        docs: [],
      });
    (addDoc as jest.Mock).mockResolvedValue({ id: 'emergency-new' });

    await expect(getEmergencyByCustomer('c1')).resolves.toEqual([
      { id: 'e1', customerId: 'c1' },
    ]);
    await expect(getEmergencyByLansia('l1')).resolves.toEqual({
      id: 'e2',
      lansiaId: 'l1',
    });
    await expect(getEmergencyByLansia('missing')).resolves.toBeNull();
    await expect(
      saveEmergencyContact({ lansiaId: 'l1', contactName: 'Budi', contactPhone: '08111', relationship: 'Anak', isActive: true } as any)
    ).resolves.toBe('emergency-new');

    await updateEmergencyContact('e1', { contactPhone: '08111' });
    expect(updateDoc).toHaveBeenCalledWith('doc-emergencyContacts-e1', {
      contactPhone: '08111',
      updatedAt: 'server-ts',
    });
  });

  it('covers incident service functions', async () => {
    (getDocs as jest.Mock)
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 'i1', data: { deviceId: 'ESP32-001' } }]),
      })
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 'i2', data: { customerId: 'c1' } }]),
      })
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 'i3', data: { lansiaId: 'l1' } }]),
      })
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 'i4', data: { today: true } }]),
      })
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 'i5', data: { recent: true } }]),
      });

    await expect(getAllIncidents()).resolves.toEqual([
      { id: 'i1', deviceId: 'ESP32-001' },
    ]);
    await expect(getIncidentsByCustomer('c1')).resolves.toEqual([
      { id: 'i2', customerId: 'c1' },
    ]);
    await expect(getIncidentsByLansia('l1')).resolves.toEqual([
      { id: 'i3', lansiaId: 'l1' },
    ]);
    await expect(getTodayIncidents()).resolves.toEqual([
      { id: 'i4', today: true },
    ]);
    await expect(getRecentIncidents(3)).resolves.toEqual([
      { id: 'i5', recent: true },
    ]);

    expect(Timestamp.fromDate).toHaveBeenCalled();
    expect(limit).toHaveBeenCalledWith(3);
  });

  it('covers lansia and notification service functions', async () => {
    (getDocs as jest.Mock)
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 'l1', data: { nama: 'Siti', customerId: 'c1' } }]),
      })
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 'l2', data: { nama: 'Dewi' } }]),
      })
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 'n1', data: { title: 'Alert' } }]),
      })
      .mockResolvedValueOnce({
        docs: [
          { ref: 'notif-1' },
          { ref: 'notif-2' },
        ],
      });
    (addDoc as jest.Mock).mockResolvedValue({ id: 'lansia-new' });

    await expect(getLansiaByCustomer('c1')).resolves.toEqual([
      { id: 'l1', nama: 'Siti', customerId: 'c1' },
    ]);
    await expect(getAllLansia()).resolves.toEqual([
      { id: 'l2', nama: 'Dewi' },
    ]);
    await expect(addLansia({ nama: 'Murniati' } as any)).resolves.toBe('lansia-new');
    await updateLansia('l1', { status: 'Aktif' } as any);
    await deleteLansia('l1');

    await expect(getNotificationsByCustomer('c1')).resolves.toEqual([
      { id: 'n1', title: 'Alert' },
    ]);
    await markNotificationRead('n1');
    await markAllNotificationsRead('c1');

    expect(updateDoc).toHaveBeenCalledWith('doc-lansia-l1', { status: 'Aktif' });
    expect(deleteDoc).toHaveBeenCalledWith('doc-lansia-l1');
    expect(updateDoc).toHaveBeenCalledWith('doc-notifications-n1', { isRead: true });
    expect(updateDoc).toHaveBeenCalledWith('notif-1', { isRead: true });
    expect(updateDoc).toHaveBeenCalledWith('notif-2', { isRead: true });
  });

  it('covers report and telemetry service functions', async () => {
    const currentMonthDate = {
      toDate: () => new Date(),
    };
    const oldDate = {
      toDate: () => new Date('2020-01-01T00:00:00Z'),
    };

    (getDocs as jest.Mock)
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 'r1', data: { title: 'Monthly Report' } }]),
      })
      .mockResolvedValueOnce({ size: 3, docs: [] })
      .mockResolvedValueOnce({
        size: 2,
        docs: [
          { data: () => ({ isOnline: true }) },
          { data: () => ({ isOnline: false }) },
        ],
      })
      .mockResolvedValueOnce({ size: 5, docs: [] })
      .mockResolvedValueOnce({
        size: 2,
        docs: [
          { data: () => ({ generatedAt: currentMonthDate }) },
          { data: () => ({ generatedAt: oldDate }) },
        ],
      })
      .mockResolvedValueOnce({
        empty: false,
        docs: makeDocs([{ id: 't1', data: { bpm: 90 } }]),
      })
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 't2', data: { bpm: 88 } }]),
      })
      .mockResolvedValueOnce({
        docs: makeDocs([{ id: 't3', data: { bpm: 80 } }]),
      })
      .mockResolvedValueOnce({
        empty: true,
        docs: [],
      });

    await expect(getReports()).resolves.toEqual([
      { id: 'r1', title: 'Monthly Report' },
    ]);
    await expect(getReportSummary()).resolves.toEqual({
      totalUsers: 3,
      totalDevices: 2,
      activeDevices: 1,
      totalIncidents: 5,
      monthlyReports: 1,
    });
    await expect(getLatestTelemetryByLansia('l1')).resolves.toEqual({
      id: 't1',
      bpm: 90,
    });
    await expect(getTelemetryByLansia('l1', 10)).resolves.toEqual([
      { id: 't2', bpm: 88 },
    ]);
    await expect(getTelemetryByCustomer('c1')).resolves.toEqual([
      { id: 't3', bpm: 80 },
    ]);
    await expect(getLatestTelemetryByLansia('missing')).resolves.toBeNull();

    expect(limit).toHaveBeenCalledWith(1);
    expect(limit).toHaveBeenCalledWith(10);
    expect(limit).toHaveBeenCalledWith(50);
  });
});
