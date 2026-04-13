export interface Telemetry {
  id: string;
  lansiaId: string;
  deviceId: string;
  customerId: string;
  timestamp: any;
  latitude: number;
  longitude: number;
  locationName: string;
  batteryLevel: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  isFallDetected: boolean;
  stepCount: number;
}
