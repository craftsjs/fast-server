import { it, expect, describe, beforeEach, mock } from 'bun:test';
import { EventEmitter } from '../server/utils/event-emiter.util';

describe('EventEmitter', () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  it('addListener should add a listener that responds to emits', () => {
    const mockCallback = mock(() => { });
    emitter.addListener('test', mockCallback);

    emitter.emit('test');
    expect(mockCallback).toHaveBeenCalled();
  });

  it('once should add a one-time listener that responds to the first emit only', () => {
    const mockCallback = mock(() => { });
    emitter.once('test', mockCallback);

    emitter.emit('test');
    emitter.emit('test');

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('removeListener should remove the specified listener', () => {
    const mockCallback = mock(() => { });
    emitter.addListener('test', mockCallback);

    emitter.emit('test');
    expect(mockCallback).toHaveBeenCalled();

    emitter.removeListener('test', mockCallback);
    mockCallback.mockReset();

    emitter.emit('test');
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('emit should not throw error if type has no listeners', () => {
    expect(() => {
      emitter.emit('test');
    }).not.toThrow();
  });

  it('emit should pass arguments to the listeners', () => {
    const mockCallback = mock(() => {});
    emitter.addListener('test', mockCallback);

    const arg1 = 'argument1';
    const arg2 = 'argument2';
    emitter.emit('test', arg1, arg2);
    expect(mockCallback.mock.calls.pop()).toEqual([arg1, arg2] as any);
  });

  it('listeners should be called in the order they were added', () => {
    const calls: number[] = [];
    const firstListener = () => calls.push(1);
    const secondListener = () => calls.push(2);

    emitter.addListener('test', firstListener);
    emitter.addListener('test', secondListener);

    emitter.emit('test');

    expect(calls).toEqual([1, 2]);
  });
});
