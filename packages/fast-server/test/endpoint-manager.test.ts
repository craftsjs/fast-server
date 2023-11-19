import { it, expect, describe, beforeEach, mock } from 'bun:test';
import { EndpointManager } from '../server/endpoint-manager';
import { Handler, Middleware } from '../server/types/handler.type';

// create stubs
// Mock handlers and middlewares
const mockHandler: Handler = mock(() => {});
const mockMiddleware: Middleware = mock(() => {});

describe('EndpointManager', () => {
  let manager: EndpointManager;

  beforeEach(() => {
    manager = new EndpointManager();
  });

  // Test static routes
  it('should recognize static routes', () => {
    manager.addEndpoint('', mockHandler);
    const match = manager.matchEndpoint('');
    expect(match).toBeDefined();
    expect(match?.handler).toBe(mockHandler);
  });

  // Test dynamic routes with parameters
  it('should recognize dynamic routes and extract parameters', () => {
    manager.addEndpoint('/user/:id', mockHandler);
    const match = manager.matchEndpoint('/user/123');
    expect(match).toBeDefined();
    expect(match?.params).toEqual({ id: '123' });
  });

  // Test routes with optional segments
  it('should handle routes with optional segments', () => {
    manager.addEndpoint('/ab?cd', mockHandler);
    const match = manager.matchEndpoint('/abcd');
    const matchOptional = manager.matchEndpoint('/acd');
    expect(match).toBeDefined();
    expect(matchOptional).toBeDefined();
  });

  // Test handling multiple middlewares
  it('should handle multiple middlewares', () => {
    manager.addEndpoint('/admin', mockHandler, [mockMiddleware, mockMiddleware]);
    const match = manager.matchEndpoint('/admin');
    expect(match).toBeDefined();
    expect(match?.middlewares).toHaveLength(2);
  });

  // Test no match found
  it('should return undefined for no match found', () => {
    const match = manager.matchEndpoint('/no-match');
    expect(match).toBeUndefined();
  });

  // Test matching all endpoints
  describe('matchAllEndpoint', () => {
    it('should match all relevant endpoints', () => {
      manager.addEndpoint('/book/:id', mockHandler, [mockMiddleware]);
      manager.addEndpoint('/book/:id', mockHandler);

      const matches = manager.matchAllEndpoint('/book/123');
      expect(matches).toHaveLength(2);
      expect(matches[0].params).toEqual({ id: '123' });
      expect(matches[1].params).toEqual({ id: '123' });
    });

    it('should handle root with multiple middlewares', () => {
      manager.addEndpoint('', mockMiddleware);
      manager.addEndpoint('', mockHandler, [mockMiddleware]);
      const matches = manager.matchAllEndpoint('');
      expect(matches).toHaveLength(2);
    });
  });

  // Additional tests could include:
  // - Overlapping routes and their resolution.
  // - Special characters in routes.
  // - Incorrectly formatted paths.
  // - Correctly handling trailing slashes.
  // - Cases where middlewares should be executed before the handler.
});

