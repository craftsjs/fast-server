import { it, expect, describe, afterAll } from "bun:test";
import server from "./server";

describe('Server routes', () => {
  const baseUrl = 'http://localhost:3000';

  afterAll(() => {
    server.close();
  })

  it('should respond not found /not-found', async () => {
    const response = await fetch(`${baseUrl}/not-found`, { method: 'POST' });
    const data = await response.json();
    expect(response.status).toBe(404);
    expect(data.message).toBe('Router not found');
  });

  it('should respond to head /', async () => {
    const response = await fetch(`${baseUrl}`, { method: 'HEAD' });
    expect(response.status).toBe(200);
  });

  it('should respond to options /', async () => {
    const response = await fetch(`${baseUrl}`, { method: 'OPTIONS' });
    expect(response.status).toBe(200);
  });

  it('should respond to GET /hello', async () => {
    const response = await fetch(`${baseUrl}/hello`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Hello World');
  });

  it('should respond to GET /other-end', async () => {
    const response = await fetch(`${baseUrl}/other-end`);
    expect(response.status).toBe(200);
  });

  it('should respond to POST /data', async () => {
    const response = await fetch(`${baseUrl}/data`, { method: 'POST' });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Data received');
  });

  it('should respond to PUT /update', async () => {
    const response = await fetch(`${baseUrl}/update`, { method: 'PUT' });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Data updated');
  });

  it('should respond to DELETE /delete', async () => {
    const response = await fetch(`${baseUrl}/delete`, { method: 'DELETE' });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Data deleted');
  });

  it('should respond to PATCH /modify', async () => {
    const response = await fetch(`${baseUrl}/modify`, { method: 'PATCH' });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Data modified');
  });

  // Pruebas para los endpoints del router
  it('should respond to GET /tenant/:id', async () => {
    const response = await fetch(`${baseUrl}/tenant/123`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Hello World with id 123');
  });

  it('should respond to POST /tenant/:id', async () => {
    const response = await fetch(`${baseUrl}/tenant/123`, { method: 'POST' });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Data received with id 123');
  });

  it('should respond to PUT /tenant/:id', async () => {
    const response = await fetch(`${baseUrl}/tenant/123`, { method: 'PUT' });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Data updated with id 123');
  });

  it('should respond to DELETE /tenant/:id', async () => {
    const response = await fetch(`${baseUrl}/tenant/123`, { method: 'DELETE' });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Data deleted with id 123');
  });

  it('should respond to PATCH /tenant/:id', async () => {
    const response = await fetch(`${baseUrl}/tenant/123`, { method: 'PATCH' });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Data modified with id 123');
  });
});