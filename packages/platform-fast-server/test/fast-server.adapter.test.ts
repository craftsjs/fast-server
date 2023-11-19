import { expect, describe, beforeEach, mock, it } from 'bun:test';
import { FastServerAdapter } from '../adapters/fast-server.adapter';
import { RequestMethod, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';


describe('fast-server-adapter', () => {
  let adapter: FastServerAdapter;

  beforeEach(() => {
    adapter = new FastServerAdapter();
  });

  let mockResponse;
  let mockRequest;

  beforeEach(() => {
    mockResponse = {
      status: mock(() => this),
      end: mock(() => this),
      json: mock(() => this),
      send: mock(() => this),
      getHeader: mock(() => this),
      setHeader: mock(() => this),
      isReady: mock(() => this)
    };

    mockRequest = {
      hostname: 'localhost',
      method: 'GET',
      originalUrl: 'http://localhost:3000'
    }
  });

  describe('reply', () => {
    it('should send a JSON response when an object is provided', () => {
      adapter.reply(mockResponse, { message: 'test' }, 200);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.getHeader).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should end the response when null is provided', () => {
      adapter.reply(mockResponse, null);
      expect(mockResponse.end).toHaveBeenCalled();
    });
  })

  describe('listen', () => {

    it('in port 3000', () => {
      const server = adapter.listen(3000);
      expect(server.port).toEqual(3000);
      server.stop();
    });

    it('call callback', () => {
      const mockCallBack = mock(() => this);
      const server = adapter.listen(3000, mockCallBack);
      expect(mockCallBack).toHaveBeenCalled();
      server.stop();
    });

    it('set host and call callback', () => {
      const mockCallBack = mock(() => this);
      const server = adapter.listen(3000, 'localhost', mockCallBack);
      expect(mockCallBack).toHaveBeenCalled();
      expect(server.hostname).toEqual('localhost');
      server.stop();
    });

  })

  it('set response status', () => {
    adapter.status(mockResponse, 200);
    expect(mockResponse.status).toHaveBeenCalled();
  });

  it('Call function end', () => {
    adapter.end(mockResponse);
    expect(mockResponse.end).toHaveBeenCalled();
  });

  it('Call function setErrorHandler', () => {
    adapter.use = mock(() => this);
    adapter.setErrorHandler(() => { });
    expect(adapter.use).toHaveBeenCalled();
  });

  it('Call function setNotFoundHandler', () => {
    adapter['instance'].setNotFoundHandler = mock(() => this);
    adapter.setNotFoundHandler(() => { });
    expect(adapter['instance'].setNotFoundHandler).toHaveBeenCalled();
  });

  it('Call function setHeader', () => {
    adapter.setHeader(mockResponse, 'key', 'value');
    expect(mockResponse.setHeader).toHaveBeenCalled();
  });

  it('Call function isHeadersSent', () => {
    adapter.isHeadersSent(mockResponse)
    expect(mockResponse.isReady).toHaveBeenCalled();
  });

  it('Call function close', () => {
    adapter.initHttpServer({});
    adapter['httpServer'].close = mock(() => this);
    adapter.close();
    expect(adapter['httpServer'].close).toHaveBeenCalled();
  });

  it('getRequestHostname return hostname localhost', () => {
    const hostName = adapter.getRequestHostname(mockRequest);
    expect(hostName).toEqual(mockRequest.hostname);
  });

  it('getRequestMethod return method GET', () => {
    const method = adapter.getRequestMethod(mockRequest);
    expect(method).toEqual(mockRequest.method);
  });

  it('getRequestUrl return originalUrl', () => {
    const originalUrl = adapter.getRequestUrl(mockRequest);
    expect(originalUrl).toEqual(mockRequest.originalUrl);
  });

  it('getType return fast-server', () => {
    const type = adapter.getType();
    expect(type).toEqual('fast-server');
  });

  it('Call function useStaticAssets', () => {
    adapter.use = mock(() => this);
    adapter['instance'].static = mock(() => this);
    adapter.useStaticAssets('', {});
    expect(adapter.use).toHaveBeenCalled();
    expect(adapter['instance'].static).toHaveBeenCalled();
  });

  it('Call function useStaticAssets with prefix', async () => {
    adapter.use = mock(() => this);
    adapter['instance'].static = mock(() => this);
    await adapter.useStaticAssets('', {
      prefix: 'test'
    });
    expect(adapter.use).toHaveBeenCalled();
    expect(adapter['instance'].static).toHaveBeenCalled();
  });

  it('Call function render', () => {
    adapter.render(mockResponse, '', {});
    expect(mockResponse.send).toHaveBeenCalled();
  });

  it('Call function applyVersionFilter', () => {
    const handler = mock(() => this);
    const execute = adapter.applyVersionFilter(
      handler,
      VERSION_NEUTRAL,
      { type: VersioningType.URI, key: 'version=' }
    );
    execute({}, {}, mock(() => this))
    expect(handler).toHaveBeenCalled();
  });

  it('Call function createMiddlewareFactory', () => {
    const mockHttpServer = {
      get: mock(() => this)
    };
    adapter.createMiddlewareFactory(RequestMethod.GET);
    expect(mockHttpServer.get).toHaveBeenCalled;
  });

  it('Call function setHeadersIfUndefined', () => {
    adapter['setHeadersIfUndefined'](mockResponse, {});
    expect(mockResponse.getHeader).toHaveBeenCalled;
    expect(mockResponse.setHeader).toHaveBeenCalled;
  });

  it('Call function ensureContentType', () => {
    const response = {
      getHeader: mock(() => ''),
      setHeader: mock(() => {})
    }
    adapter['ensureContentType'](response as any, { statusCode: 500 });
    expect(response.getHeader).toHaveBeenCalled;
    expect(response.setHeader).toHaveBeenCalled;
  });

});