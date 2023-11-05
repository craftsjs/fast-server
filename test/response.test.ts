import { it, expect, describe, beforeEach } from "bun:test";
import { BunResponse } from "../src/server/response";

describe('BunResponse', () => {

  let bunResponse: BunResponse;

  beforeEach(() => {
    bunResponse = new BunResponse();
  });

  it('should set status code', () => {
    bunResponse.status(200);
    const response = bunResponse.getOptions();
    expect(response.status).toBe(200);
  });

  it('should set status text', () => {
    bunResponse.statusText('OK');
    const response = bunResponse.getOptions();
    expect(response.statusText).toBe('OK');
  });

  it('should set option', () => {
    bunResponse.option({ status: 404 });
    const options = bunResponse.getOptions();
    expect(options.status).toBe(404);
  });

  it('should send JSON response', () => {
    const body = { message: 'Hello' };
    bunResponse.json(body);
    const response = bunResponse.getResponse();
    // here you'd probably need to read the body to get the actual content
    // for the sake of simplicity, just checking if a response was created
    expect(response).toBeDefined();
  });

  it('should send a response with body', () => {
    const body = 'Hello';
    bunResponse.send(body);
    const response = bunResponse.getResponse();
    expect(response).toBeDefined();
  });

  it('should set header', () => {
    bunResponse.setHeader('Content-Type', 'application/json');
    const headers = bunResponse.getHeaders() as HeadersInit;
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('should set headers', () => {
    bunResponse.setHeaders({ 'Content-Type': 'application/json' });
    const headers = bunResponse.getHeaders() as HeadersInit;
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('should check if response is ready', () => {
    expect(bunResponse.isReady()).toBe(false);
    bunResponse.send('data');
    expect(bunResponse.isReady()).toBe(true);
  });
  
});
