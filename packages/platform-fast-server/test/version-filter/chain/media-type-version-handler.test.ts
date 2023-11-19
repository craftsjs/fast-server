import { mock, describe, it, expect, beforeEach } from 'bun:test';
import { MediaTypeVersioningHandler } from '../../../adapters/version-filter/chain/media-type-version-handler';
import { VersioningType } from '@nestjs/common';

describe('MediaTypeVersioningHandler Tests', () => {
  let mediaTypeVersioningHandler;
  let mockReq;
  let mockRes;
  let mockNext;
  let version;
  let versioningOptions;
  let originalHandler;

  beforeEach(() => {
    mediaTypeVersioningHandler = new MediaTypeVersioningHandler();

    mockReq = {
      headers: {
        Accept: 'application/vnd.api+json;version=1.0'
      }
    };
    mockRes = {};
    mockNext = mock(() => { });
    version = '1.0';
    versioningOptions = { type: VersioningType.MEDIA_TYPE, key: 'version=' };
    originalHandler = mock(() => { });
  });

  it('should call originalHandler for matched version in Accept header', () => {
    const handlerForMediaTypeVersioning = mediaTypeVersioningHandler.handle(mockReq, mockRes, mockNext, version, versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('should call originalHandler for VERSION 1.0 as array', () => {
    mockReq.versioningOptions = { type: VersioningType.MEDIA_TYPE, key: 'version=1.0' }
    const handlerForMediaTypeVersioning = mediaTypeVersioningHandler.handle(mockReq, mockRes, mockNext, ['1.0'], versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('should call originalHandler for VERSION 1.0 as string', () => {
    mockReq.versioningOptions = { type: VersioningType.MEDIA_TYPE, key: 'version=1.0' }
    const handlerForMediaTypeVersioning = mediaTypeVersioningHandler.handle(mockReq, mockRes, mockNext, '1.0', versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('should call originalHandler without acceptHeaderVersionParameter', () => {
    mockReq.versioningOptions = { type: VersioningType.MEDIA_TYPE, key: 'version=1.0' }
    const handlerForMediaTypeVersioning = mediaTypeVersioningHandler.handle({ headers: {} }, mockRes, mockNext, ['1.0'], versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('should proceed to next handler for unmatched version', () => {
    const unmatchedVersion = '2.0';
    mediaTypeVersioningHandler.handle(mockReq, mockRes, mockNext, unmatchedVersion, versioningOptions = { type: VersioningType.URI, key: 'version=' }, originalHandler);
    expect(originalHandler).toHaveBeenCalled();
  });

  it('call next handler', () => {
    const handlerForMediaTypeVersioning = mediaTypeVersioningHandler.handle(mockReq, mockRes, mockNext, ['2.0'], versioningOptions, originalHandler);
    handlerForMediaTypeVersioning(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});
