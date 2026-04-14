import type { NextApiRequest, NextApiResponse } from 'next';

type Telemetry = {
  deviceId: string;
  heartRate?: number;
  battery?: number;
  latitude?: number;
  longitude?: number;
  status?: string;
  timestamp?: string;
};

type ResponseData = {
  success: boolean;
  message: string;
  data?: unknown;
};

let telemetryStore: Telemetry[] = [];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Telemetry data fetched',
      data: telemetryStore,
    });
  }

  if (req.method === 'POST') {
    const body: Telemetry = req.body;

    const newData: Telemetry = {
      ...body,
      timestamp: new Date().toISOString(),
    };

    telemetryStore.push(newData);

    return res.status(201).json({
      success: true,
      message: 'Telemetry data received',
      data: newData,
    });
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  });
}