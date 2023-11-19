import { mock, describe, it, expect, beforeEach } from 'bun:test';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { HeaderVersioningHandler } from '../../../adapters/version-filter/chain/header-version-handler';

describe('HeaderVersioningHandler Tests', () => {
  let headerVersioningHandler;
  let mockReq;
  let mockRes;
  let mockNext;
  let version;
  let versioningOptions;
  let originalHandler;

  beforeEach(() => {
    headerVersioningHandler = new HeaderVersioningHandler();

    mockReq = {
      headers: {
        Accept: 'application/vnd.api+json;version=1.0',
        version: '1.0'
      }
    };
    mockRes = {};
    mockNext = mock(() => { });
    version = '1.0';
    versioningOptions = { type: VersioningType.HEADER, key: 'version=', header: 'version' };
    originalHandler = mock(() => { });
  });

  it('should call originalHandler for matched version in Accept header', () => {
    const handlerForMediaTypeVersioning = headerVersioningHandler.handle(mockReq, mockRes, mockNext, version, versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('should call originalHandler for VERSION 1.0 as array', () => {
    const handlerForMediaTypeVersioning = headerVersioningHandler.handle(mockReq, mockRes, mockNext, ['1.0'], versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('should call originalHandler without acceptHeaderVersionParameter WITH NEUTRAL version', () => {
    versioningOptions = { type: VersioningType.HEADER, key: 'version=', header: 'other' };
    const handlerForMediaTypeVersioning = headerVersioningHandler.handle(mockReq, mockRes, mockNext, [VERSION_NEUTRAL], versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('should proceed to next handler for unmatched version', () => {
    const unmatchedVersion = '2.0';
    headerVersioningHandler.handle(mockReq, mockRes, mockNext, unmatchedVersion, versioningOptions = { type: VersioningType.URI, key: 'version=' }, originalHandler);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('call next handler', () => {
    const handlerForMediaTypeVersioning = headerVersioningHandler.handle(mockReq, mockRes, mockNext, ['2.0'], versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});
