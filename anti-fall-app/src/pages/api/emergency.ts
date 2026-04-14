import type { NextApiRequest, NextApiResponse } from 'next';

type EmergencyResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmergencyResponse>
) {
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Emergency API is working',
      data: [],
    });
  }

  if (req.method === 'POST') {
    const body = req.body;

    return res.status(200).json({
      success: true,
      message: 'Emergency request received successfully',
      data: body,
    });
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  });
}