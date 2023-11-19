import { callNextHandler } from '../../adapters/version-filter/next-handler';
import { describe, it, expect, mock } from 'bun:test';

describe('callNextHandler Tests', () => {

  it('should call next function when provided', () => {
    const nextMock = mock(() => {});
    callNextHandler({}, {}, nextMock);
    expect(nextMock).toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException when next is not provided', () => {
    expect(() => callNextHandler({}, {}, undefined as any)).toThrow();
  });

});
