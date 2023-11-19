import { RequestMethod } from '@nestjs/common';
import { expect, mock, describe, it, beforeEach } from 'bun:test';
import { RouterMethodFactory } from '../../adapters/helpers/router-method-factory';

describe('RouterMethodFactory', () => {
  let routerMethodFactory;
  let mockHttpServer;

  beforeEach(() => {
    routerMethodFactory = new RouterMethodFactory();
    mockHttpServer = {
      get: mock(() => this),
      post: mock(() => this),
      delete: mock(() => this),
      put: mock(() => this),
      patch: mock(() => this),
      options: mock(() => this),
      head: mock(() => this),
      all: mock(() => this),
      use: mock(() => this),
    };
  });

  it('should return the correct method for GET', () => {
    expect(routerMethodFactory.get(mockHttpServer, RequestMethod.GET)).toBe(mockHttpServer.get);
  });

  it('should return the correct method for POST', () => {
    expect(routerMethodFactory.get(mockHttpServer, RequestMethod.POST)).toBe(mockHttpServer.post);
  });

  it('should return the correct method for DELETE', () => {
    expect(routerMethodFactory.get(mockHttpServer, RequestMethod.DELETE)).toBe(mockHttpServer.delete);
  });

  it('should return the correct method for PUT', () => {
    expect(routerMethodFactory.get(mockHttpServer, RequestMethod.PUT)).toBe(mockHttpServer.put);
  });

  it('should return the correct method for PATCH', () => {
    expect(routerMethodFactory.get(mockHttpServer, RequestMethod.PATCH)).toBe(mockHttpServer.patch);
  });

  it('should return the correct method for OPTIONS', () => {
    expect(routerMethodFactory.get(mockHttpServer, RequestMethod.OPTIONS)).toBe(mockHttpServer.options);
  });

  it('should return the correct method for HEAD', () => {
    expect(routerMethodFactory.get(mockHttpServer, RequestMethod.HEAD)).toBe(mockHttpServer.head);
  });

  it('should return the correct method for ALL', () => {
    expect(routerMethodFactory.get(mockHttpServer, RequestMethod.ALL)).toBe(mockHttpServer.all);
  });

  it('should return the default method for undefined request method', () => {
    expect(routerMethodFactory.get(mockHttpServer, 999)).toBe(mockHttpServer.use);
  });
});
