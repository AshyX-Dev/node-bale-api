import { EventEmitter } from 'events';

// Define an interface for your events
interface MyEvents {
    'eventA': (data: string) => void;
    'eventB': (data: number) => void;
}

// Extend the EventEmitter class
class MyEmitter extends EventEmitter {
    // You can now use the MyEvents interface to type your events
    emit<K extends keyof MyEvents>(event: K, ...args: Parameters<MyEvents[K]>): boolean {
        return super.emit(event, ...args);
    }

    on<K extends keyof MyEvents>(event: K, listener: MyEvents[K]): this {
        return super.on(event, listener);
    }
}

// Usage
const myEmitter = new MyEmitter();

myEmitter.on('eventA', (data) => {
    console.log(`Received eventA with data: ${data}`);
});

myEmitter.emit('eventA', 'Hello World');
