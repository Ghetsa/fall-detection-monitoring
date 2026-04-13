export interface Device {
  id: string; // serial number
  serial: string;
  lansiaId: string;
  customerId: string;
  batteryLevel: number;
  isOnline: boolean;
  lastSeen: any;
  firmware: string;
  model: string;
  latitude: number;
  longitude: number;
  locationName: string;
  createdAt?: any;
}
