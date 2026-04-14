type MockResponse = {
  statusCode: number;
  body: any;
  status: jest.Mock;
  json: jest.Mock;
};

function createResponse(): MockResponse {
  const res = {
    statusCode: 200,
    body: null,
    status: jest.fn(function (this: MockResponse, code: number) {
      this.statusCode = code;
      return this;
    }),
    json: jest.fn(function (this: MockResponse, body: any) {
      this.body = body;
      return this;
    }),
  } as MockResponse;

  return res;
}

describe('API routes', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('handles telemetry get, post, and invalid method', () => {
    const handler = require('../../pages/api/telemetry').default;

    const postRes = createResponse();
    handler(
      { method: 'POST', body: { deviceId: 'ESP32-001', battery: 80 } },
      postRes
    );

    expect(postRes.statusCode).toBe(201);
    expect(postRes.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Telemetry data received',
        data: expect.objectContaining({
          deviceId: 'ESP32-001',
          battery: 80,
          timestamp: expect.any(String),
        }),
      })
    );

    const getRes = createResponse();
    handler({ method: 'GET' }, getRes);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.data).toHaveLength(1);

    const badRes = createResponse();
    handler({ method: 'DELETE' }, badRes);
    expect(badRes.statusCode).toBe(405);
  });

  it('handles incidents lifecycle and not found update', () => {
    const handler = require('../../pages/api/incidents').default;

    const createRes = createResponse();
    handler(
      {
        method: 'POST',
        body: { deviceId: 'ESP32-001', type: 'fall', status: 'resolved' },
      },
      createRes
    );

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: 'pending',
        type: 'fall',
      })
    );

    const createdId = createRes.body.data.id;

    const updateRes = createResponse();
    handler(
      { method: 'PUT', body: { id: createdId, status: 'resolved' } },
      updateRes
    );
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.data.status).toBe('resolved');

    const notFoundRes = createResponse();
    handler(
      { method: 'PUT', body: { id: 'missing-id', status: 'resolved' } },
      notFoundRes
    );
    expect(notFoundRes.statusCode).toBe(404);

    const getRes = createResponse();
    handler({ method: 'GET' }, getRes);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.data).toHaveLength(1);
  });

  it('handles broadcast api methods', () => {
    const handler = require('../../pages/api/broadcasts').default;

    const getRes = createResponse();
    handler({ method: 'GET' }, getRes);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.message).toBe('Broadcast API is working');

    const postRes = createResponse();
    handler(
      { method: 'POST', body: { title: 'Info', message: 'Hello' } },
      postRes
    );
    expect(postRes.statusCode).toBe(200);
    expect(postRes.body.data).toEqual({ title: 'Info', message: 'Hello' });

    const badRes = createResponse();
    handler({ method: 'PATCH' }, badRes);
    expect(badRes.statusCode).toBe(405);
  });

  it('handles emergency api methods', () => {
    const handler = require('../../pages/api/emergency').default;

    const getRes = createResponse();
    handler({ method: 'GET' }, getRes);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.message).toBe('Emergency API is working');

    const postRes = createResponse();
    handler(
      { method: 'POST', body: { contactName: 'Budi', contactPhone: '08111' } },
      postRes
    );
    expect(postRes.statusCode).toBe(200);
    expect(postRes.body.data).toEqual({
      contactName: 'Budi',
      contactPhone: '08111',
    });

    const badRes = createResponse();
    handler({ method: 'PUT' }, badRes);
    expect(badRes.statusCode).toBe(405);
  });
});
