import { mock, describe, it, expect, beforeEach } from 'bun:test';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { CustomVersioningHandler } from '../../../adapters/version-filter/chain/custom-version-handler';

describe('CustomVersioningHandler Tests', () => {
  let customVersioningHandler;
  let mockReq;
  let mockRes;
  let mockNext;
  let version;
  let versioningOptions;
  let originalHandler;

  beforeEach(() => {
    customVersioningHandler = new CustomVersioningHandler();

    mockReq = {
      headers: {
        Accept: 'application/vnd.api+json;version=1.0',
        version: '1.0'
      },
      version: '1.0'
    };
    mockRes = {};
    mockNext = mock(() => { });
    version = '1.0';
    versioningOptions = { type: VersioningType.CUSTOM, key: 'version=', extractor: (req) => req.version };
    originalHandler = mock(() => { });
  });

  it('should call originalHandler for matched version in extractor', () => {
    const handlerForMediaTypeVersioning = customVersioningHandler.handle(mockReq, mockRes, mockNext, version, versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('should call originalHandler for matched version in extractor with req array', () => {
    mockReq = {
      version: ['1.0']
    }
    const handlerForMediaTypeVersioning = customVersioningHandler.handle(mockReq, mockRes, mockNext, version, versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('should call originalHandler for VERSION 1.0 as array', () => {
    const handlerForMediaTypeVersioning = customVersioningHandler.handle(mockReq, mockRes, mockNext, ['1.0'], versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('should call originalHandler for VERSION 1.0 as array and req version is array', () => {
    mockReq = {
      version: ['1.0']
    }
    const handlerForMediaTypeVersioning = customVersioningHandler.handle(mockReq, mockRes, mockNext, ['1.0'], versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('call next handler', () => {
    mockReq = {
      version: ['2.0']
    }
    const handlerForMediaTypeVersioning = customVersioningHandler.handle(mockReq, mockRes, mockNext, ['1.0'], versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  // it('should call originalHandler without acceptHeaderVersionParameter WITH NEUTRAL version', () => {
  //   versioningOptions = { type: VersioningType.HEADER, key: 'version=', header: 'other' };
  //   const handlerForMediaTypeVersioning = headerVersioningHandler.handle(mockReq, mockRes, mockNext, [VERSION_NEUTRAL], versioningOptions, originalHandler);
  //   handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
  //   expect(originalHandler).toHaveBeenCalled();
  // });

  // it('should proceed to next handler for unmatched version', () => {
  //   const unmatchedVersion = '2.0';
  //   headerVersioningHandler.handle(mockReq, mockRes, mockNext, unmatchedVersion, versioningOptions = { type: VersioningType.URI, key: 'version=' }, originalHandler);
  //   expect(originalHandler).toHaveBeenCalled();
  // });
});
