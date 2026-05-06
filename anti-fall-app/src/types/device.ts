export interface Device {
  id: string; // serial number
  serial: string;
  lansiaId: string;
  batteryLevel: number;
  isOnline: boolean;
  lastSeen: unknown;
  firmware: string;
  model: string;
  latitude: number;
  longitude: number;
  locationName: string;
  createdAt?: unknown;
}
