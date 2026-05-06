export interface Incident {
  id: string;
  lansiaId: string;
  deviceId: string;
  customerId: string;
  type: 'fall_detected' | 'battery_low' | 'safe' | 'sos' | 'device_offline';
  severity: 'danger' | 'warning' | 'normal';
  description: string;
  location: {
    latitude?: number;
    longitude?: number;
    locationName?: string;
  };
  timestamp: unknown;
  isResolved: boolean;
  resolvedAt?: unknown;
}
