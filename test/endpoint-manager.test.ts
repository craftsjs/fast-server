import { it, expect, describe, beforeEach } from "bun:test";
import { EndpointManager } from "../src/server/endpoint-manager";
import { Handler, Middleware } from "../src/server/types/handler.type";

describe('EndpointManager', () => {

  let manager: EndpointManager;
  const mockHandler: Handler = (req, res) => { };
  const mockMiddleware: Middleware = (req, res, next) => next();

  beforeEach(() => {
    manager = new EndpointManager();
  });

  it('should be able to add an endpoint with a handler', () => {
    manager.addEndpoint('/test/:id', mockHandler);
    expect(manager['endpoints']).toHaveLength(1);
  });

  it('should be able to add an endpoint with middleware', () => {
    manager.addEndpoint('/test-middleware', mockMiddleware);
    expect(manager['endpoints']).toHaveLength(1);
  });

  it('should match the correct endpoint', () => {
    manager.addEndpoint('/test/:id', mockHandler);
    const match = manager.matchEndpoint('/test/123');
    expect(match).not.toBeNull();
    expect(match?.params.id).toBe('123');
  });

  it('should not match an incorrect endpoint', () => {
    manager.addEndpoint('/test/:id', mockHandler);
    const match = manager.matchEndpoint('/test-wrong/123');
    expect(match).toBeUndefined();
  });

  it('should extract multiple parameters', () => {
    manager.addEndpoint('/test/:type/:id', mockHandler);
    const match = manager.matchEndpoint('/test/user/123');
    expect(match).not.toBeNull();
    expect(match?.params.type).toBe('user');
    expect(match?.params.id).toBe('123');
  });

  it('should match an endpoint with middlewares', () => {
    manager.addEndpoint('/test/:id', mockHandler, [mockMiddleware]);
    const match = manager.matchEndpoint('/test/123');
    expect(match).not.toBeNull();
    expect(match?.middlewares).toHaveLength(1);
  });
});

