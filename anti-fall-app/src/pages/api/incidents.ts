import type { NextApiRequest, NextApiResponse } from 'next';

type Incident = {
  id?: string;
  deviceId: string;
  type: 'fall' | 'emergency' | 'manual';
  status: 'pending' | 'resolved';
  description?: string;
  timestamp?: string;
};

type ResponseData = {
  success: boolean;
  message: string;
  data?: unknown;
};

let incidentsStore: Incident[] = [];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Incidents fetched',
      data: incidentsStore,
    });
  }

  if (req.method === 'POST') {
    const body: Incident = req.body;

    const newIncident: Incident = {
      ...body,
      id: Date.now().toString(),
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    incidentsStore.push(newIncident);

    return res.status(201).json({
      success: true,
      message: 'Incident created',
      data: newIncident,
    });
  }

  if (req.method === 'PUT') {
    const { id, status } = req.body;

    const incident = incidentsStore.find((i) => i.id === id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    incident.status = status || incident.status;

    return res.status(200).json({
      success: true,
      message: 'Incident updated',
      data: incident,
    });
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  });
}