export interface Device {
  id: string; // Firestore doc id (commonly the deviceId / serial)

  /**
   * New schema prefers deviceId as the stable identifier referenced by lansia.deviceId.
   * Backward compat: some data may still only have serial.
   */
  deviceId?: string;
  serial?: string;

  /**
   * New schema: device is linked to a lansia via lansiaId, and lansia points back via deviceId.
   * Backward compat: some docs may not have this yet.
   */
  lansiaId?: string;

  isOnline: boolean;
  lastSeen?: unknown;
  firmware?: string;
  model?: string;

  /**
   * New schema: last known device telemetry snapshot.
   * Backward compat: older schema stored location + battery fields at top-level.
   */
  lastLocation?: {
    latitude: number;
    longitude: number;
    locationName?: string;
    batteryLevel?: number;
    recordedAt?: unknown;
  };

  batteryLevel?: number;
  latitude?: number;
  longitude?: number;
  locationName?: string;

  createdAt?: unknown;
}
