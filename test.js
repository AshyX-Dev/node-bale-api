"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
// Function to display the list of photos
function displayPhotoList(photos) {
    photos.forEach(function (photo) {
        var file_id = photo.file_id, width = photo.width, height = photo.height, file_size = photo.file_size;
        console.log("Photo ID: ".concat(file_id));
        console.log("Dimensions: ".concat(width, "x").concat(height));
        console.log("File Size: ".concat(file_size, " bytes"));
        console.log('-----------------------');
    });
}
// Example usage with a sample photo list
var photoList = [
    {
        file_id: '554324725:7914214516436901635:1:1f7b4f37acf0b933d86ce9d712d333e6204fc8392c7b55d8cda5d316c40cbf7d3c7b7805ace94705',
        file_unique_id: 'unique_id_1',
        width: 1096,
        height: 1224,
        file_size: 205169
    },
    {
        file_id: '554324725:7914214516436901635:1:1f7b4f37acf0b933d86ce9d712d333e6204fc8392c7b55d8cda5d316c40cbf7d3c7b7805ace94705',
        file_unique_id: 'unique_id_2',
        width: 800,
        height: 600,
        file_size: 150000
    }
];
// Call the function to display the photos
displayPhotoList(photoList);
// // Define an interface for your events
// // interface MyEvents {
// //     'eventA': (data: string) => void;
// //     'eventB': (data: number) => void;
// // }
// // // Extend the EventEmitter class
// // class MyEmitter extends EventEmitter {
// //     // You can now use the MyEvents interface to type your events
// //     emit<K extends keyof MyEvents>(event: K, ...args: Parameters<MyEvents[K]>): boolean {
// //         return super.emit(event, ...args);
// //     }
// //     on<K extends keyof MyEvents>(event: K, listener: MyEvents[K]): this {
// //         return super.on(event, listener);
// //     }
// // }
// // // Usage
// // const myEmitter = new MyEmitter();
// // myEmitter.on('eventA', (data) => {
// //     console.log(`Received eventA with data: ${data}`);
// // });
// // myEmitter.emit('eventA', 'Hello World');
// // import { EventEmitter } from 'events';
// // import { Connection } from "./Network/connection";
// // import {
// //     User, Chat, MessageForm
// // } from "./Objects/interfaces";
// // // Define an interface for your events
// // interface MyEvents {
// //     'message': (data: MessageForm) => void;
// // }
// // // Extend the EventEmitter class
// // class MyEmitter extends EventEmitter {
// //     emit<K extends keyof MyEvents>(event: K, ...args: Parameters<MyEvents[K]>): boolean {
// //         return super.emit(event, ...args);
// //     }
// //     on<K extends keyof MyEvents>(event: K, listener: MyEvents[K]): this {
// //         return super.on(event, listener);
// //     }
// // }
// // // BaleBot class with event handling
// // export class BaleBot {
// //     bot_token: string;
// //     request: Connection;
// //     emitter: MyEmitter;
// //     constructor(BotToken: string) {
// //         this.bot_token = BotToken;
// //         this.request = new Connection(this.bot_token);
// //         this.emitter = new MyEmitter();
// //         // Start listening for messages
// //         this.startListening();
// //     }
// //     private startListening() {
// //         // Assuming you have a method to listen for incoming messages
// //         this.emitter.on('message', (resemit) => {
// //             this.request.makeConnection("getUpdates", {}, (res) => {
// //                 if (res.ok) {
// //                     const message: MessageForm = {
// //                         text: res.result.text,
// //                         from: res.result.from,
// //                         id: res.result.message_id,
// //                         date: res.result.date,
// //                         chat: res.result.chat
// //                     };
// //                     // Emit the message event
// //                     this.emitter.emit('message', message);
// //                 }
// //             })
// //         });
// //     }
// //     // Method to handle message events
// //     onMessage(callback: (message: MessageForm) => void) {
// //         this.emitter.on('message', callback);
// //     }
// //     // Other methods (getMe, sendMessage, etc.) can go here...
// // }
// // // Usage
// // const bot = new BaleBot("1541141536:UqPXqR7Lus8yI4M9QsMMFWwiVpk1W4rbTyoOiuxp");
// // // Listen for incoming messages
// // bot.onMessage((message) => {
// //     console.log(`Received message: ${message.text} from ${message.from.username}`);
// // });
// // // Example sendMessage method (for completeness)
// // Define an interface for your events
// // interface MyEvents {
// //     'eventA': (data: string) => void;
// //     'eventB': (data: number) => void;
// // }
// // // Create a class that uses EventEmitter
// // class MyClass extends EventEmitter {
// //     constructor() {
// //         super(); // Call the parent constructor
// //         // You can set up any initial state here if needed
// //     }
// //     // Method to trigger eventA
// //     triggerEventA(data: string) {
// //         this.emit('eventA', data);
// //     }
// //     // Method to trigger eventB
// //     triggerEventB(data: number) {
// //         this.emit('eventB', data);
// //     }
// //     // Method to setup event listeners
// //     setupListeners() {
// //         this.on('eventA', (data) => {
// //             console.log(`Event A received with data: ${data}`);
// //         });
// //         this.on('eventB', (data) => {
// //             console.log(`Event B received with data: ${data}`);
// //         });
// //     }
// // }
// // // Usage
// // const myInstance = new MyClass();
// // myInstance.setupListeners(); // Set up the event listeners
// // // Trigger events
// // myInstance.triggerEventA('Hello World');
// // myInstance.triggerEventB(42);
// // type messages = "message";
// // class Emitter extends EventEmitter {
// //     constructor(){
// //         super();
// //     }
// //     on(eventName: messages, listener: (output: MessageForm) => void = (output) => {}){
// //     }
// // }
var a = {
    "m": ""
};
// Safely access the nested property using optional chaining
var result = (_b = (_a = a['f']) === null || _a === void 0 ? void 0 : _a['a']) === null || _b === void 0 ? void 0 : _b['v'];
console.log(result);
