export type EventCallback = (...args: any[]) => void;

export class EventEmitter {
  private events: Map<string, EventCallback[]>;

  constructor() {
    this.events = new Map();
  }

  once(type: string, callback: EventCallback): void {
    const onceWrapper: EventCallback = (...args: any[]) => {
      // Después de ejecutar el callback, removemos el listener.
      this.removeListener(type, onceWrapper);
      callback.apply(this, args);
    };

    this.addListener(type, onceWrapper);
  }

  addListener(type: string, callback: EventCallback): void {
    const callbacks = this.events.get(type) || [];
    callbacks.push(callback);
    this.events.set(type, callbacks);
  }

  removeListener(type: string, callback: EventCallback): void {
    const callbacks = this.events.get(type);
    if (!callbacks) return;

    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
      // Actualizamos el array de callbacks solo si no está vacío
      if (callbacks.length > 0) {
        this.events.set(type, callbacks);
      } else {
        this.events.delete(type);
      }
    }
  }

  emit(type: string, ...args: any[]): void {
    const callbacks = this.events.get(type);
    if (!callbacks) return;

    callbacks.forEach((callback) => {
      callback.apply(this, args);
    });
  }
}
