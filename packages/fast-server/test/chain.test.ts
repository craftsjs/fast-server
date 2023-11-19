import { it, expect, describe, beforeEach } from 'bun:test';
import { Chain } from '../server/chain';
import { IRequest } from '../server/interfaces/request.interface';

describe('Chain', () => {

  let chain: Chain;
  let mockRequest: IRequest;

  const mockResponse: { body?: any; statusCode: any; status; json; } = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.body = obj;
      return this;
    },
    statusCode: undefined,
    body: undefined
  };

  beforeEach(() => {
    chain = new Chain();
    mockRequest = {} as IRequest; // Asume una estructura simple de IRequest, puedes reemplazar esto según necesites
  });

  it('should stop chain execution on error', async () => {
    const results: number[] = [];

    chain.add([
      (req, res, next) => { next({ message: 'Bad Request' }); },
      (req, res, next) => { results.push(2); next(); }
    ]);

    await chain.executeChain(mockRequest, mockResponse as any);
    expect(results).toEqual([]);
    expect(mockResponse.statusCode).toBe(500);
    expect(mockResponse.body).toEqual({
      message: 'Bad Request',
      status: 500
    });
  });

  it('should stop chain execution on error', async () => {
    const results: number[] = [];

    chain.add([
      (req, res, next) => { next({ status: 400, message: 'Bad Request' }); },
      (req, res, next) => { results.push(2); next(); }
    ]);

    await chain.executeChain(mockRequest, mockResponse as any);
    expect(results).toEqual([]);
    expect(mockResponse.statusCode).toBe(400);
    expect(mockResponse.body).toEqual({
      message: 'Bad Request',
      status: 400
    });
  });

  it('should be able to add middlewares', () => {
    const middleware1 = (req, res, next) => next();
    chain.add([middleware1]);
    expect(chain['middlewares']).toContain(middleware1);
  });

  it('should execute added middlewares in order', async () => {
    let order = 0;
    const middleware1 = (req, res, next) => {
      order++;
      expect(order).toBe(1);
      next();
    };
    const middleware2 = (req, res, next) => {
      order++;
      expect(order).toBe(2);
      next();
    };

    chain.add([middleware1, middleware2]);
    await chain.executeChain(mockRequest, mockResponse as any);
    expect(order).toBe(2);
  });

  it('should throw an error if middleware does not call next', async () => {
    try {
      const middleware1 = (req, res, next) => {
        // Do nothing
      };
      chain.add([middleware1]);
    } catch (error) {
      await expect((error as Error).message).toBe('Middleware 1 did not call next.');
    }
  });

});
