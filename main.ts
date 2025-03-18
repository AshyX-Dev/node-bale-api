// write callback of SendMessage carefully ( handle photo )

import { existsSync, createReadStream, createWriteStream, readSync, readFileSync, writeFile, writeFileSync } from 'fs';
import { Readable } from 'stream';
import { basename } from 'path';
import { EventEmitter } from 'events';
import { Connection } from "./Network/connection";
import {
    chatTypes, stickerTypes, MessageTypes, InlineKeyboard, ReplyKeyboard, medias,
    MaskText,
    User, Chat, ChatPhoto, PhotoSizeInterface, PhotoCallback, reWrite,
    SendMessageOptions, ConstructorOptions, ForwardOptions, MediaOptions, MediaUpload,
    AnimationInterface, AudioInterface, DocumentLikeInterface, VideoInterface,
    VoiceInterface, ContactInterface, ContactArray, LocationInterface, FileInterface,
    StickerInterface, StickerSetInterface, Invoice, CallbackQuery, MessageForm,
} from "./Objects/interfaces";

interface events {
    message: (message: MessageForm) => void,
    callback_query: (callbacking: CallbackQuery) => void,
    photo: (message: MessageForm) => void,
    video: (message: MessageForm) => void,
    audio: (message: MessageForm) => void,
    voice: (message: MessageForm) => void,
    sticker: (message: MessageForm) => void,
    document: (message: MessageForm) => void,
    close: () => void
}

export class BaleBot extends EventEmitter {
    bot_token: string;
    request: Connection;
    private time: number;
    private intervalId: NodeJS.Timeout | number;
    private file_id_regex: RegExp;
    private link_url_regex: RegExp

    constructor(BotToken: string, options: ConstructorOptions = { polling_interval: 999, polling: false }){
        super();
        this.bot_token = BotToken;
        this.request = new Connection(this.bot_token);
        this.intervalId = -1;
        this.file_id_regex = /^\d+:-?\d+:\d+:[a-f0-9]+$/;
        this.link_url_regex = /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})(\/[^\s]*)?$/
        this.time = 999;
        if (options.polling){
            this.poll(options.polling_interval ?? 999);
        }
    }

    emit<K extends keyof events>(event: K, ...args: Parameters<events[K]>): boolean {
        return super.emit(event, ...args);
    }

    on<K extends keyof events>(event: K, listener: events[K]): this {
        return super.on(event, listener);
    }

    async getMe(callback: (user: User) => void = (user) => {}) {
        await this.request.makeConnection("getMe", {}, (res) => {
            if (callback) {
                if (res.ok){
                    const u: User = {
                        id: res.result['id'],
                        is_bot: res.result['is_bot'],
                        first_name: res.result['first_name'],
                        last_name: res.result['last_name'],
                        username: res.result['username'],
                        language_code: res.result['language_code']
                    }
                    callback(u);
                }
            }
        });
    }

    async logout(callback: (loggingOut: any) => void = (loggingOut) => {}){
        await this.request.makeConnection("logout", {}, (res) => {
            if (callback) {
                if (res.ok){
                    callback(res);
                }
            }
        });
    }

    async close(callback: (closing: any) => void = (closing) => {}){
        await this.request.makeConnection("close", {}, (res) => {
            if (callback) {
                if (res.ok){
                    callback(res);
                }
            }
        });
    }

    async sendMessage(
        chatId: number,
        text: string,
        options: SendMessageOptions,
        callback: (message: MessageForm) => void = (message) => {}
    ){
        var _ = options.keyboard_mode;
        var __ = {};
        __[_] = options.reply_markup;
        await this.request.makeConnection("sendMessage", {
            chat_id: chatId,
            text: text,
            reply_to_message_id: options.reply_to_message_id,
            reply_markup: JSON.stringify(__)
        }, (res) => {
            if (callback) {
                if (res.ok){
                    const phc: ChatPhoto = {
                        big_file_id: res['result']?.['chat']?.['photo']?.['big_file_id'],
                        big_file_unique_id: res['result']?.['chat']?.['photo']?.['big_file_unique_id'],
                        small_file_id: res['result']?.['chat']?.['photo']?.['small_file_id'],
                        small_file_unique_id: res['result']?.['chat']?.['photo']?.['small_file_unique_id'],
                    };
                    const c: Chat = {
                        id: res.result.chat['id'],
                        type: res.result.chat['type'],
                        photo: phc
                    };
                    const f: User = {
                        id: res.result.from['id'],
                        is_bot: res.result.from['is_bot'],
                        first_name: res.result.from['first_name'],
                        last_name: res.result.from['last_name'],
                        username: res.result.from['username'],
                        language_code: res.result.from['language_code']
                    };
                    const m: MessageForm = {
                        text: text,
                        from: f,
                        id: res.result['message_id'],
                        date: res.result['date'],
                        chat: c
                    };
                    callback(m);
                }
            }
        });
    }

    async forwardMessage(
        chatId: number,
        options: ForwardOptions,
        callback: (message: MessageForm) => void = (message) => {}
    ){
        await this.request.makeConnection("forwardMessage", {
            from_chat_id: chatId,
            chat_id: options.to_chat,
            message_id: options.message_id
        }, (res) => {
            if (res.ok){
                const f: User = {
                    id: res['result']?.['from']?.['id'],
                    is_bot: res['result']?.['from']?.['is_bot'],
                    first_name: res['result']?.['from']?.['first_name'],
                    last_name: res['result']?.['from']?.['last_name'],
                    username: res['result']?.['from']?.['username'],
                    language_code: res['result']?.['from']?.['language_code'],
                };
                const phc: ChatPhoto = {
                    big_file_id: res['result']?.['chat']?.['photo']?.['big_file_id'],
                    big_file_unique_id: res['result']?.['chat']?.['photo']?.['big_file_unique_id'],
                    small_file_id: res['result']?.['chat']?.['photo']?.['small_file_id'],
                    small_file_unique_id: res['result']?.['chat']?.['photo']?.['small_file_unique_id'],
                };
                const c: Chat = {
                    id: res['result']?.['chat']?.['id'],
                    first_name: res['result']?.['chat']?.['first_name'],
                    last_name: res['result']?.['chat']?.['last_name'],
                    title: res['result']?.['chat']?.['title'],
                    type: res['result']?.['chat']?.['type'],
                    invite_link: res['result']?.['chat']?.['invite_link'],
                    photo: phc
                };
                const fm: MessageForm = {
                    id: res['result']?.['message_id'],
                    from: f,
                    date: res['result']?.['date'],
                    chat: c,
                    forward_from: f,
                    forward_date: res['result']?.['forward_date'],
                    text: undefined
                };

                callback(fm);

            }
        })
    }

    async sendMedia(
        mediaOptions  : MediaUpload,
        callback      : (call: MessageForm ) => void = (call: any) => {}
    ){
        if (existsSync(mediaOptions.path !== undefined ? mediaOptions.path : "")){
            await this.request.uploadSomething(
                {
                    path: mediaOptions.path,
                    chat_id: mediaOptions.chat_id,
                    media: mediaOptions.media,
                    reply_to_message_id: mediaOptions.reply_to_message_id,
                    reply_markup: mediaOptions.reply_markup
                },
                (res) => {
                    if (res.ok){

                        const f: User = {
                            id: res['result']?.['from']?.['id'],
                            is_bot: res['result']?.['from']?.['is_bot'],
                            first_name: res['result']?.['from']?.['first_name'],
                            last_name: res['result']?.['from']?.['last_name'],
                            username: res['result']?.['from']?.['username'],
                            language_code: res['result']?.['from']?.['language_code'],
                        };

                        const phc: ChatPhoto = {
                            big_file_id: res['result']?.['chat']?.['photo']?.['big_file_id'],
                            big_file_unique_id: res['result']?.['chat']?.['photo']?.['big_file_unique_id'],
                            small_file_id: res['result']?.['chat']?.['photo']?.['small_file_id'],
                            small_file_unique_id: res['result']?.['chat']?.['photo']?.['small_file_unique_id'],
                        };

                        const c: Chat = {
                            id: res['result']?.['chat']?.['id'],
                            first_name: res['result']?.['chat']?.['first_name'],
                            last_name: res['result']?.['chat']?.['last_name'],
                            title: res['result']?.['chat']?.['title'],
                            type: res['result']?.['chat']?.['type'],
                            invite_link: res['result']?.['chat']?.['invite_link'],
                            photo: phc
                        };

                        if (mediaOptions.media === "photo"){
                            const photos = res['result']?.['photo'];
                            const phs: PhotoSizeInterface[] = [];
                            photos.forEach(photo => {
                                const { file_id, file_unique_id, file_size, width, height } = photo;
                                phs.push({
                                    file_id: file_id,
                                    file_unique_id: file_unique_id,
                                    file_size: file_size,
                                    width: width,
                                    height: height
                                });
                            })
                            const pcb: MessageForm = {
                                id: res['result']?.['message_id'],
                                from: f,
                                chat: c,
                                date: res['result']?.['date'],
                                photo: phs,
                                text: undefined,
                                caption: res['result']?.['caption']
                            };
                            callback(pcb);
                        } else if (mediaOptions.media === "video"){
                            const thumb: PhotoSizeInterface = {
                                file_id: res['result']?.['video']?.['thumb']?.['file_id'],
                                file_unique_id: res['result']?.['video']?.['thumb']?.['file_unique_id'],
                                file_size: res['result']?.['video']?.['thumb']?.['file_size'],
                                width: res['result']?.['video']?.['thumb']?.['width'],
                                height: res['result']?.['video']?.['thumb']?.['height']
                            };

                            const video: VideoInterface = {
                                file_id: res['result']?.['video']?.['file_id'],
                                file_unique_id: res['result']?.['video']?.['file_unique_id'],
                                file_size: res['result']?.['video']?.['file_size'],
                                width: res['result']?.['video']?.['width'],
                                height: res['result']?.['video']?.['height'],
                                thumbnail: thumb,
                                mime_type: res['result']?.['video']?.['mime_type'],
                                duration: res['result']?.['video']?.['duration']
                            };

                            const vcb: MessageForm = {
                                id: res['result']?.['message_id'],
                                from: f,
                                chat: c,
                                date: res['result']?.['date'],
                                video: video,
                                text: undefined,
                                caption: res['result']?.['caption']
                            };
                            callback(vcb);

                        } else if (mediaOptions.media === "document"){
                            const dcmnt: DocumentLikeInterface = {
                                file_id: res['result']?.['document']?.['file_id'],
                                file_unique_id: res['result']?.['document']?.['file_unique_id'],
                                file_name: res['result']?.['document']?.['file_name'],
                                file_size: res['result']?.['document']?.['file_size'],
                                mime_type: res['result']?.['document']?.['mime_type']
                            };
                            const dcb: MessageForm = {
                                id: res['result']?.['message_id'],
                                from: f,
                                chat: c,
                                date: res['result']?.['date'],
                                document: dcmnt,
                                text: undefined,
                                caption: res['result']?.['caption']
                            };
                            callback(dcb);
                        } else if (mediaOptions.media === "audio"){
                            const aud: AudioInterface = {
                                file_id: res['result']?.['audio']?.['file_id'],
                                file_unique_id: res['result']?.['audio']?.['file_unique_id'],
                                duration: res['result']?.['audio']?.['duration'],
                                file_size: res['result']?.['audio']?.['file_size'],
                                mime_type: res['result']?.['audio']?.['mime_type']
                            };
                            const acb: MessageForm = {
                                id: res['result']?.['message_id'],
                                from: f,
                                chat: c,
                                date: res['result']?.['date'],
                                audio: aud,
                                text: undefined,
                                caption: res['result']?.['caption']
                            };
                            callback(acb);
                        } else if (mediaOptions.media === "voice"){
                            const voice: VoiceInterface = {
                                file_id: res['result']?.['voice']?.['file_id'],
                                file_unique_id: res['result']?.['voice']?.['file_unique_id'],
                                duration: res['result']?.['voice']?.['duration'],
                                file_size: res['result']?.['voice']?.['file_size'],
                                mime_type: res['result']?.['voice']?.['mime_type']
                            };
                            const acb: MessageForm = {
                                id: res['result']?.['message_id'],
                                from: f,
                                chat: c,
                                date: res['result']?.['date'],
                                voice: voice,
                                text: undefined,
                                caption: res['result']?.['caption']
                            };
                            callback(acb);
                        } else if (mediaOptions.media === "animation"){
                            const thumb: PhotoSizeInterface = {
                                file_id: res['result']?.['video']?.['thumb']?.['file_id'],
                                file_unique_id: res['result']?.['video']?.['thumb']?.['file_unique_id'],
                                file_size: res['result']?.['video']?.['thumb']?.['file_size'],
                                width: res['result']?.['video']?.['thumb']?.['width'],
                                height: res['result']?.['video']?.['thumb']?.['height']
                            };

                            const animation: AnimationInterface = {
                                file_id: res['result']?.['animation']?.['file_id'],
                                file_unique_id: res['result']?.['animation']?.['file_unique_id'],
                                file_size: res['result']?.['animation']?.['file_size'],
                                width: res['result']?.['animation']?.['width'],
                                height: res['result']?.['animation']?.['height'],
                                thumbnail: thumb,
                                mime_type: res['result']?.['animation']?.['mime_type'],
                                duration: res['result']?.['animation']?.['duration']
                            };

                            const ancb: MessageForm = {
                                id: res['result']?.['message_id'],
                                from: f,
                                chat: c,
                                date: res['result']?.['date'],
                                animation: animation,
                                text: undefined,
                                caption: res['result']?.['caption']
                            };
                            callback(ancb);
                        }
                    } else {
                        let _: MessageForm = {text: undefined};
                        callback(_);
                    }
                }
            )
        } else if (mediaOptions.path !== undefined && this.link_url_regex.test(mediaOptions.path)) {
            const absData = {}
            Object.defineProperty(absData, "chat_id", {
                value: mediaOptions.chat_id,
                writable: true,
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(absData, "caption", {
                value: mediaOptions.caption,
                writable: true,
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(absData, "reply_to_message_id", {
                value: mediaOptions.reply_to_message_id,
                writable: true,
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(absData, "reply_markup", {
                value: JSON.stringify({keyboard: mediaOptions.reply_markup}),
                writable: true,
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(absData, mediaOptions.media, {
                value: mediaOptions.path,
                writable: true,
                enumerable: true,
                configurable: true
            });

            await this.request.makeConnection(`send${this.request.toTitleCase(mediaOptions.media)}`, absData, (res) => {
                if (res.ok){

                    const f: User = {
                        id: res['result']?.['from']?.['id'],
                        is_bot: res['result']?.['from']?.['is_bot'],
                        first_name: res['result']?.['from']?.['first_name'],
                        last_name: res['result']?.['from']?.['last_name'],
                        username: res['result']?.['from']?.['username'],
                        language_code: res['result']?.['from']?.['language_code'],
                    };

                    const phc: ChatPhoto = {
                        big_file_id: res['result']?.['chat']?.['photo']?.['big_file_id'],
                        big_file_unique_id: res['result']?.['chat']?.['photo']?.['big_file_unique_id'],
                        small_file_id: res['result']?.['chat']?.['photo']?.['small_file_id'],
                        small_file_unique_id: res['result']?.['chat']?.['photo']?.['small_file_unique_id'],
                    };

                    const c: Chat = {
                        id: res['result']?.['chat']?.['id'],
                        first_name: res['result']?.['chat']?.['first_name'],
                        last_name: res['result']?.['chat']?.['last_name'],
                        title: res['result']?.['chat']?.['title'],
                        type: res['result']?.['chat']?.['type'],
                        invite_link: res['result']?.['chat']?.['invite_link'],
                        photo: phc
                    };

                    if (mediaOptions.media === "photo"){
                        const photos = res['result']?.['photo'];
                        const phs: PhotoSizeInterface[] = [];
                        photos.forEach(photo => {
                            const { file_id, file_unique_id, file_size, width, height } = photo;
                            phs.push({
                                file_id: file_id,
                                file_unique_id: file_unique_id,
                                file_size: file_size,
                                width: width,
                                height: height
                            });
                        })
                        const pcb: MessageForm = {
                            id: res['result']?.['message_id'],
                            from: f,
                            chat: c,
                            date: res['result']?.['date'],
                            photo: phs,
                            text: undefined,
                            caption: res['result']?.['caption']
                        };
                        callback(pcb);
                    } else if (mediaOptions.media === "video"){
                        const thumb: PhotoSizeInterface = {
                            file_id: res['result']?.['video']?.['thumb']?.['file_id'],
                            file_unique_id: res['result']?.['video']?.['thumb']?.['file_unique_id'],
                            file_size: res['result']?.['video']?.['thumb']?.['file_size'],
                            width: res['result']?.['video']?.['thumb']?.['width'],
                            height: res['result']?.['video']?.['thumb']?.['height']
                        };

                        const video: VideoInterface = {
                            file_id: res['result']?.['video']?.['file_id'],
                            file_unique_id: res['result']?.['video']?.['file_unique_id'],
                            file_size: res['result']?.['video']?.['file_size'],
                            width: res['result']?.['video']?.['width'],
                            height: res['result']?.['video']?.['height'],
                            thumbnail: thumb,
                            mime_type: res['result']?.['video']?.['mime_type'],
                            duration: res['result']?.['video']?.['duration']
                        };

                        const vcb: MessageForm = {
                            id: res['result']?.['message_id'],
                            from: f,
                            chat: c,
                            date: res['result']?.['date'],
                            video: video,
                            text: undefined,
                            caption: res['result']?.['caption']
                        };
                        callback(vcb);

                    } else if (mediaOptions.media === "document"){
                        const dcmnt: DocumentLikeInterface = {
                            file_id: res['result']?.['document']?.['file_id'],
                            file_unique_id: res['result']?.['document']?.['file_unique_id'],
                            file_name: res['result']?.['document']?.['file_name'],
                            file_size: res['result']?.['document']?.['file_size'],
                            mime_type: res['result']?.['document']?.['mime_type']
                        };
                        const dcb: MessageForm = {
                            id: res['result']?.['message_id'],
                            from: f,
                            chat: c,
                            date: res['result']?.['date'],
                            document: dcmnt,
                            text: undefined,
                            caption: res['result']?.['caption']
                        };
                        callback(dcb);
                    } else if (mediaOptions.media === "audio"){
                        const aud: AudioInterface = {
                            file_id: res['result']?.['audio']?.['file_id'],
                            file_unique_id: res['result']?.['audio']?.['file_unique_id'],
                            duration: res['result']?.['audio']?.['duration'],
                            file_size: res['result']?.['audio']?.['file_size'],
                            mime_type: res['result']?.['audio']?.['mime_type']
                        };
                        const acb: MessageForm = {
                            id: res['result']?.['message_id'],
                            from: f,
                            chat: c,
                            date: res['result']?.['date'],
                            audio: aud,
                            text: undefined,
                            caption: res['result']?.['caption']
                        };
                        callback(acb);
                    } else if (mediaOptions.media === "voice"){
                        const voice: VoiceInterface = {
                            file_id: res['result']?.['voice']?.['file_id'],
                            file_unique_id: res['result']?.['voice']?.['file_unique_id'],
                            duration: res['result']?.['voice']?.['duration'],
                            file_size: res['result']?.['voice']?.['file_size'],
                            mime_type: res['result']?.['voice']?.['mime_type']
                        };
                        const acb: MessageForm = {
                            id: res['result']?.['message_id'],
                            from: f,
                            chat: c,
                            date: res['result']?.['date'],
                            voice: voice,
                            text: undefined,
                            caption: res['result']?.['caption']
                        };
                        callback(acb);
                    } else if (mediaOptions.media === "animation"){
                        const thumb: PhotoSizeInterface = {
                            file_id: res['result']?.['video']?.['thumb']?.['file_id'],
                            file_unique_id: res['result']?.['video']?.['thumb']?.['file_unique_id'],
                            file_size: res['result']?.['video']?.['thumb']?.['file_size'],
                            width: res['result']?.['video']?.['thumb']?.['width'],
                            height: res['result']?.['video']?.['thumb']?.['height']
                        };

                        const animation: AnimationInterface = {
                            file_id: res['result']?.['animation']?.['file_id'],
                            file_unique_id: res['result']?.['animation']?.['file_unique_id'],
                            file_size: res['result']?.['animation']?.['file_size'],
                            width: res['result']?.['animation']?.['width'],
                            height: res['result']?.['animation']?.['height'],
                            thumbnail: thumb,
                            mime_type: res['result']?.['animation']?.['mime_type'],
                            duration: res['result']?.['animation']?.['duration']
                        };

                        const ancb: MessageForm = {
                            id: res['result']?.['message_id'],
                            from: f,
                            chat: c,
                            date: res['result']?.['date'],
                            animation: animation,
                            text: undefined,
                            caption: res['result']?.['caption']
                        };
                        callback(ancb);
                    }
                } else {
                    let _: MessageForm = {text: undefined};
                    callback(_);
                }
            });
        } else if (mediaOptions.file_id !== undefined && this.file_id_regex.test(mediaOptions.file_id)) {
            const absData = {}
            Object.defineProperty(absData, "chat_id", {
                value: mediaOptions.chat_id,
                writable: true,
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(absData, "caption", {
                value: mediaOptions.caption,
                writable: true,
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(absData, "reply_to_message_id", {
                value: mediaOptions.reply_to_message_id,
                writable: true,
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(absData, "reply_markup", {
                value: JSON.stringify({keyboard: mediaOptions.reply_markup}),
                writable: true,
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(absData, mediaOptions.media, {
                value: mediaOptions.file_id,
                writable: true,
                enumerable: true,
                configurable: true
            });

            await this.request.makeConnection(`send${this.request.toTitleCase(mediaOptions.media)}`, absData, (res) => {
                if (res.ok){

                    const f: User = {
                        id: res['result']?.['from']?.['id'],
                        is_bot: res['result']?.['from']?.['is_bot'],
                        first_name: res['result']?.['from']?.['first_name'],
                        last_name: res['result']?.['from']?.['last_name'],
                        username: res['result']?.['from']?.['username'],
                        language_code: res['result']?.['from']?.['language_code'],
                    };

                    const phc: ChatPhoto = {
                        big_file_id: res['result']?.['chat']?.['photo']?.['big_file_id'],
                        big_file_unique_id: res['result']?.['chat']?.['photo']?.['big_file_unique_id'],
                        small_file_id: res['result']?.['chat']?.['photo']?.['small_file_id'],
                        small_file_unique_id: res['result']?.['chat']?.['photo']?.['small_file_unique_id'],
                    };

                    const c: Chat = {
                        id: res['result']?.['chat']?.['id'],
                        first_name: res['result']?.['chat']?.['first_name'],
                        last_name: res['result']?.['chat']?.['last_name'],
                        title: res['result']?.['chat']?.['title'],
                        type: res['result']?.['chat']?.['type'],
                        invite_link: res['result']?.['chat']?.['invite_link'],
                        photo: phc
                    };

                    if (mediaOptions.media === "photo"){
                        const photos = res['result']?.['photo'];
                        const phs: PhotoSizeInterface[] = [];
                        photos.forEach(photo => {
                            const { file_id, file_unique_id, file_size, width, height } = photo;
                            phs.push({
                                file_id: file_id,
                                file_unique_id: file_unique_id,
                                file_size: file_size,
                                width: width,
                                height: height
                            });
                        })
                        const pcb: MessageForm = {
                            id: res['result']?.['message_id'],
                            from: f,
                            chat: c,
                            date: res['result']?.['date'],
                            photo: phs,
                            text: undefined,
                            caption: res['result']?.['caption']
                        };
                        callback(pcb);
                    } else if (mediaOptions.media === "video"){
                        const thumb: PhotoSizeInterface = {
                            file_id: res['result']?.['video']?.['thumb']?.['file_id'],
                            file_unique_id: res['result']?.['video']?.['thumb']?.['file_unique_id'],
                            file_size: res['result']?.['video']?.['thumb']?.['file_size'],
                            width: res['result']?.['video']?.['thumb']?.['width'],
                            height: res['result']?.['video']?.['thumb']?.['height']
                        };

                        const video: VideoInterface = {
                            file_id: res['result']?.['video']?.['file_id'],
                            file_unique_id: res['result']?.['video']?.['file_unique_id'],
                            file_size: res['result']?.['video']?.['file_size'],
                            width: res['result']?.['video']?.['width'],
                            height: res['result']?.['video']?.['height'],
                            thumbnail: thumb,
                            mime_type: res['result']?.['video']?.['mime_type'],
                            duration: res['result']?.['video']?.['duration']
                        };

                        const vcb: MessageForm = {
                            id: res['result']?.['message_id'],
                            from: f,
                            chat: c,
                            date: res['result']?.['date'],
                            video: video,
                            text: undefined,
                            caption: res['result']?.['caption']
                        };
                        callback(vcb);

                    } else if (mediaOptions.media === "document"){
                        const dcmnt: DocumentLikeInterface = {
                            file_id: res['result']?.['document']?.['file_id'],
                            file_unique_id: res['result']?.['document']?.['file_unique_id'],
                            file_name: res['result']?.['document']?.['file_name'],
                            file_size: res['result']?.['document']?.['file_size'],
                            mime_type: res['result']?.['document']?.['mime_type']
                        };
                        const dcb: MessageForm = {
                            id: res['result']?.['message_id'],
                            from: f,
                            chat: c,
                            date: res['result']?.['date'],
                            document: dcmnt,
                            text: undefined,
                            caption: res['result']?.['caption']
                        };
                        callback(dcb);
                    } else if (mediaOptions.media === "audio"){
                        const aud: AudioInterface = {
                            file_id: res['result']?.['audio']?.['file_id'],
                            file_unique_id: res['result']?.['audio']?.['file_unique_id'],
                            duration: res['result']?.['audio']?.['duration'],
                            file_size: res['result']?.['audio']?.['file_size'],
                            mime_type: res['result']?.['audio']?.['mime_type']
                        };
                        const acb: MessageForm = {
                            id: res['result']?.['message_id'],
                            from: f,
                            chat: c,
                            date: res['result']?.['date'],
                            audio: aud,
                            text: undefined,
                            caption: res['result']?.['caption']
                        };
                        callback(acb);
                    } else if (mediaOptions.media === "voice"){
                        const voice: VoiceInterface = {
                            file_id: res['result']?.['voice']?.['file_id'],
                            file_unique_id: res['result']?.['voice']?.['file_unique_id'],
                            duration: res['result']?.['voice']?.['duration'],
                            file_size: res['result']?.['voice']?.['file_size'],
                            mime_type: res['result']?.['voice']?.['mime_type']
                        };
                        const acb: MessageForm = {
                            id: res['result']?.['message_id'],
                            from: f,
                            chat: c,
                            date: res['result']?.['date'],
                            voice: voice,
                            text: undefined,
                            caption: res['result']?.['caption']
                        };
                        callback(acb);
                    } else if (mediaOptions.media === "animation"){
                        const thumb: PhotoSizeInterface = {
                            file_id: res['result']?.['video']?.['thumb']?.['file_id'],
                            file_unique_id: res['result']?.['video']?.['thumb']?.['file_unique_id'],
                            file_size: res['result']?.['video']?.['thumb']?.['file_size'],
                            width: res['result']?.['video']?.['thumb']?.['width'],
                            height: res['result']?.['video']?.['thumb']?.['height']
                        };

                        const animation: AnimationInterface = {
                            file_id: res['result']?.['animation']?.['file_id'],
                            file_unique_id: res['result']?.['animation']?.['file_unique_id'],
                            file_size: res['result']?.['animation']?.['file_size'],
                            width: res['result']?.['animation']?.['width'],
                            height: res['result']?.['animation']?.['height'],
                            thumbnail: thumb,
                            mime_type: res['result']?.['animation']?.['mime_type'],
                            duration: res['result']?.['animation']?.['duration']
                        };

                        const ancb: MessageForm = {
                            id: res['result']?.['message_id'],
                            from: f,
                            chat: c,
                            date: res['result']?.['date'],
                            animation: animation,
                            text: undefined,
                            caption: res['result']?.['caption']
                        };
                        callback(ancb);
                    }
                } else {
                    let _: MessageForm = {text: undefined};
                    callback(_);
                }
            });
        }
    }

    async sendLocation(
        chatId: number,
        latitude: number,
        longitude: number,
        options: SendMessageOptions = {},
        horizontalAccuracy: boolean = null,
        callback: (location: MessageForm ) => void = (location) => {}
    ){
        await this.request.makeConnection("sendLocation", {
            chat_id: chatId,
            latitude: latitude,
            longitude: longitude,
            horizontal_accuracy: horizontalAccuracy,
            reply_to_message_id: options.reply_to_message_id,
            reply_markup: JSON.stringify({}[options.keyboard_mode] = options.reply_markup)
        }, (res) => {
            if (res.ok){
                const f: User = {
                    id: res['result']?.['from']?.['id'],
                    is_bot: res['result']?.['from']?.['is_bot'],
                    first_name: res['result']?.['from']?.['first_name'],
                    last_name: res['result']?.['from']?.['last_name'],
                    username: res['result']?.['from']?.['username'],
                    language_code: res['result']?.['from']?.['language_code'],
                };

                const phc: ChatPhoto = {
                    big_file_id: res['result']?.['chat']?.['photo']?.['big_file_id'],
                    big_file_unique_id: res['result']?.['chat']?.['photo']?.['big_file_unique_id'],
                    small_file_id: res['result']?.['chat']?.['photo']?.['small_file_id'],
                    small_file_unique_id: res['result']?.['chat']?.['photo']?.['small_file_unique_id'],
                };

                const c: Chat = {
                    id: res['result']?.['chat']?.['id'],
                    first_name: res['result']?.['chat']?.['first_name'],
                    last_name: res['result']?.['chat']?.['last_name'],
                    title: res['result']?.['chat']?.['title'],
                    type: res['result']?.['chat']?.['type'],
                    invite_link: res['result']?.['chat']?.['invite_link'],
                    photo: phc
                };
                const location_: LocationInterface = {
                    longitude: res['result']?.['location']?.['longitude'],
                    latitude: res['result']?.['location']?.['latitude']
                };
                const msg: MessageForm = {
                    id: res['result']?.['message_id'],
                    chat: c,
                    from: f,
                    location: location_,
                    text: undefined
                };
                callback(msg);
            } else {
                const _: MessageForm = {text: undefined};
                callback(_);
            }
        })
    }

    async sendContact(
        chatId: number,
        phoneNumber: string,
        firstName: string,
        lastName: string = null,
        options: SendMessageOptions = {},
        callback: (clback: MessageForm) => void = (clback) => {}
    ){
        await this.request.makeConnection("sendContact", {
            chat_id: chatId,
            phone_number: phoneNumber,
            first_name: firstName,
            last_name: lastName,
            reply_to_message_id: options.reply_to_message_id,
            reply_markup: JSON.stringify({}[options.keyboard_mode] = options.reply_markup)
        }, (res) => {
            if (res.ok){
                const f: User = {
                    id: res['result']?.['from']?.['id'],
                    is_bot: res['result']?.['from']?.['is_bot'],
                    first_name: res['result']?.['from']?.['first_name'],
                    last_name: res['result']?.['from']?.['last_name'],
                    username: res['result']?.['from']?.['username'],
                    language_code: res['result']?.['from']?.['language_code'],
                };
                const phc: ChatPhoto = {
                    big_file_id: res['result']?.['chat']?.['photo']?.['big_file_id'],
                    big_file_unique_id: res['result']?.['chat']?.['photo']?.['big_file_unique_id'],
                    small_file_id: res['result']?.['chat']?.['photo']?.['small_file_id'],
                    small_file_unique_id: res['result']?.['chat']?.['photo']?.['small_file_unique_id'],
                };
                const c: Chat = {
                    id: res['result']?.['chat']?.['id'],
                    first_name: res['result']?.['chat']?.['first_name'],
                    last_name: res['result']?.['chat']?.['last_name'],
                    title: res['result']?.['chat']?.['title'],
                    type: res['result']?.['chat']?.['type'],
                    invite_link: res['result']?.['chat']?.['invite_link'],
                    photo: phc
                };
                const cont: ContactInterface = {
                    first_name: res['result']?.['contact']?.['first_name'],
                    last_name: res['result']?.['contact']?.['last_name'],
                    phone_number: res['result']?.['contact']?.['phone_number'],
                    user_id: res['result']?.['contact']?.['user_id']
                };
                const msg: MessageForm = {
                    id: res['result']?.['message_id'],
                    chat: c,
                    from: f,
                    contact: cont,
                    text: undefined
                };
                console.log(res['result'])
                callback(msg);
            } else {
                const _: MessageForm = {text: undefined};
                callback(_);
            }
        })
    }

    async getFile(
        fileId: string,
        callback: (file: FileInterface) => void = (file) => {}
    ){
        await this.request.makeConnection("getFile",
            {
                file_id: fileId
            },
            (res) => {
                if (res.ok){
                    const file: FileInterface = {
                        id: res['result']?.['file_id'],
                        unique_id: res['result']?.['file_unique_id'],
                        size: res['result']?.['file_size'],
                        path: res['result']?.['file_path']
                    };
                    callback(file);
                } else {
                    const _: FileInterface = {};
                    callback(_);
                }
            }
        )
    }

    async getFileContent(
        filePath: string,
        callback: (rewrite: reWrite) => void = (rewrite) => {}
    ){
        await this.request.fileConnection(filePath, (s) => {
            if (typeof s === 'object' && s !== null && !Array.isArray(s)) {
                callback({
                    ok: false,
                    error_message: s['local_error']
                });
            } else {
                callback({
                    ok: true,
                    data: s
                });
            }
        })
    }

    async getChat(
        chatId: number,
        callback: (chat: Chat) => void = (chat) => {}
    ){
        await this.request.makeConnection(
            "getChat", { chat_id: chatId },
            (res) => {
                callback({
                    first_name: res['result']?.['first_name'],
                    last_name: res['result']?.['last_name'],
                    id: res['result']?.['id'],
                    title: res['result']?.['title'],
                    invite_link: res['result']?.['invite_link'],
                    username: res['result']?.['username'],
                    photo: {
                        big_file_id: res['result']?.['photo']?.['big_file_id'],
                        big_file_unique_id: res['result']?.['photo']?.['big_file_unique_id'],
                        small_file_id: res['result']?.['photo']?.['small_file_id'],
                        small_file_unique_id: res['result']?.['photo']?.['big_file_id'],
                    }
                });
            }
        )
    }

    async poll(intervalTime: number | undefined){  
        let mesids = [];
        let clids  = [];
        const interval: NodeJS.Timeout = setInterval(async () => {
            const evs = this.eventNames();
            if (evs.includes("close")){
                if (this.intervalId !== -1){
                    clearInterval(this.intervalId);
                    this.emit("close");
                }
            } else {
                if (
                    evs.includes("message") ||
                    evs.includes("photo")   ||
                    evs.includes("video")   ||
                    evs.includes("audio")   ||
                    evs.includes("voice")   ||
                    evs.includes("sticker") ||
                    evs.includes("document")
                ){
                    await this.request.makeConnection("getUpdates", {}, (res) => {
                        if (res.ok){
                            let indexes =  res['result'] ?? [{}];
                            let last_index = indexes.length - 1;
                            if (Object.keys(indexes[last_index]).includes("message") === true){
                                let last_update = indexes[last_index]['message'];
                                if (!(last_update['date'] <= Math.max(...mesids))){
                                    const photos = last_update['photo'] ?? [];
                                    const phs: PhotoSizeInterface[] = [];
                                    photos.forEach(photo => {
                                        const { file_id, file_unique_id, width, height, file_size } = photo;
                                        phs.push({
                                            file_id: file_id,
                                            file_unique_id: file_unique_id,
                                            width: width,
                                            height: height,
                                            file_size: file_size
                                        });
                                    });

                                    const news = last_update['new_chat_members'] ?? [];
                                    const nws: User[] = [];
                                    news.forEach(user => {
                                        const { first_name, last_name, id, username, language_code, is_bot } = user;
                                        nws.push({
                                            first_name: first_name,
                                            last_name: last_name,
                                            id: id,
                                            username: username,
                                            is_bot: is_bot,
                                            language_code: language_code
                                        });
                                    })

                                    const m: MessageForm = {
                                        text: last_update['text'],
                                        id: last_update['message_id'],
                                        from: {
                                            id: last_update['from']?.['id'],
                                            is_bot: last_update['from']?.['is_bot'],
                                            first_name: last_update['from']?.['first_name'],
                                            last_name: last_update['from']?.['last_name'],
                                            username: last_update['from']?.['username'],
                                            language_code: last_update['from']?.['language_code']
                                        },
                                        date: last_update['date'],
                                        chat: {
                                            id: last_update['chat']?.['id'],
                                            first_name: last_update['chat']?.['first_name'],
                                            photo: {
                                                small_file_id: last_update['chat']?.['photo']?.['small_file_id'],
                                                small_file_unique_id: last_update['chat']?.['photo']?.['small_file_unique_id'],
                                                big_file_id: last_update['chat']?.['photo']?.['big_file_id'],
                                                big_file_unique_id: last_update['chat']?.['photo']?.['big_file_unique_id']
                                            },
                                            type: last_update['chat']?.['type'],
                                            title: last_update['chat']?.['title'],
                                            username: last_update['chat']?.['username'],
                                            invite_link: last_update['chat']?.['invite_link']
                                        },
                                        forward_from: {
                                            id: last_update['forward_from']?.['id'],
                                            is_bot: last_update['forward_from']?.['is_bot'],
                                            first_name: last_update['forward_from']?.['first_name'],
                                            last_name: last_update['forward_from']?.['last_name'],
                                            username: last_update['forward_from']?.['username'],
                                            language_code: last_update['forward_from']?.['language_code']
                                        },
                                        forward_from_message_id: last_update['forward_from_message_id'],
                                        edit_date: last_update['edit_date'],
                                        document: {
                                            file_id: last_update['document']?.['file_id'],
                                            file_unique_id: last_update['document']?.['file_unique_id'],
                                            file_name: last_update['document']?.['file_name'],
                                            mime_type: last_update['document']?.['mime_type'],
                                            file_size: last_update['document']?.['file_size']
                                        },
                                        photo: phs,
                                        video: {
                                            file_id: last_update['video']?.['file_id'],
                                            file_unique_id: last_update['video']?.['file_unique_id'],
                                            width: last_update['video']?.['width'],
                                            height: last_update['video']?.['height'],
                                            duration: last_update['video']?.['duration'],
                                            mime_type: last_update['video']?.['mime_type'],
                                            file_size: last_update['video']?.['file_size']
                                        },
                                        audio: {
                                            file_id: last_update['audio']?.['file_id'],
                                            file_unique_id: last_update['audio']?.['file_unique_id'],
                                            duration: last_update['audio']?.['duration'],
                                            mime_type: last_update['audio']?.['mime_type'],
                                            file_size: last_update['audio']?.['file_size']
                                        },
                                        voice: {
                                            file_id: last_update['voice']?.['file_id'],
                                            file_unique_id: last_update['voice']?.['file_unique_id'],
                                            duration: last_update['voice']?.['duration'],
                                            mime_type: last_update['voice']?.['mime_type'],
                                            file_size: last_update['voice']?.['file_size']
                                        },
                                        caption: last_update['caption'],
                                        contact: {
                                            phone_number: last_update['contact']?.['phone_number'],
                                            first_name: last_update['contact']?.['first_name'],
                                            user_id: last_update['contact']?.['user_id']
                                        },
                                        location: {
                                            latitude: last_update['location']?.['latitude'],
                                            longitude: last_update['location']?.['longitude']
                                        },
                                        sticker: {
                                            file_id: last_update['sticker']?.['file_id'],
                                            file_unique_id: last_update['sticker']?.['file_unique_id'],
                                            type: last_update['sticker']?.['type'],
                                            width: last_update['sticker']?.['width'],
                                            height: last_update['sticker']?.['height'],
                                            is_animated: last_update['sticker']?.['is_animated'],
                                            is_video: last_update['sticker']?.['is_video'],
                                            thumbnail: {
                                                file_id: last_update['sticker']?.['thumb']?.['file_id'],
                                                file_unique_id: last_update['sticker']?.['thumb']?.['file_unique_id'],
                                                file_size: last_update['sticker']?.['thumb']?.['file_id'],
                                                width: last_update['sticker']?.['thumb']?.['width'],
                                                height: last_update['sticker']?.['thumb']?.['height']
                                            },
                                            set_name: last_update['sticker']?.['set_name'],
                                            file_size: last_update['sticker']?.['file_size']
                                        },
                                        left_chat_member: {
                                            id: last_update['left_chat_member']?.['id'],
                                            is_bot: last_update['left_chat_member']?.['is_bot'],
                                            first_name: last_update['left_chat_member']?.['first_name'],
                                            last_name: last_update['left_chat_member']?.['last_name'],
                                            username: last_update['left_chat_member']?.['username'],
                                            language_code: last_update['left_chat_member']?.['language_code'],
                                        },
                                        new_chat_members: nws
                                    };

                                    if (evs.includes("message")){
                                        mesids.push(last_update['date']);
                                        this.emit("message", m);
                                    } if (evs.includes("photo")){
                                        if (m.photo.length > 0){
                                            mesids.push(last_update['date']);
                                            this.emit("photo", m);
                                        }
                                    } if (evs.includes("video")){
                                        if (m.video.file_id !== undefined){
                                            mesids.push(last_update['date']);
                                            this.emit("video", m);
                                        }
                                    } if (evs.includes("sticker")){
                                        if (m.sticker.file_id !== undefined){
                                            mesids.push(last_update['date']);
                                            this.emit("sticker", m);
                                        }
                                    }  if (evs.includes("audio")){
                                        if (m.audio.file_id !== undefined){
                                            mesids.push(last_update['date']);
                                            this.emit("audio", m);
                                        }
                                    } if (evs.includes("voice")){
                                        if (m.voice.file_id !== undefined){
                                            mesids.push(last_update['date']);
                                            this.emit("voice", m);
                                        }
                                    } if (evs.includes("document")){
                                        if (m.document.file_id !== undefined){
                                            mesids.push(last_update['date']);
                                            this.emit("document", m);
                                        }
                                    }
                                }
                            }
                        }
                    })
                } if (evs.includes("callback_query")){
                    await this.request.makeConnection("getUpdates", {}, (res) => {
                        if (res.ok){
                            let indexes =  res['result'] ?? [{}];
                            let last_index = indexes.length - 1;
                            if (Object.keys(indexes[last_index]).includes("callback_query") === true){
                                const last_update = indexes[last_index]['callback_query'];
                                if (!(clids.includes(last_update['id']))){;;

                                    const cq: CallbackQuery = {
                                        id: last_update['id'],
                                        from: {
                                            id: last_update['from']?.['id'],
                                            is_bot: last_update['from']?.['is_bot'],
                                            first_name: last_update['from']?.['first_name'],
                                            last_name: last_update['from']?.['last_name'],
                                            username: last_update['from']?.['username'],
                                            language_code: last_update['from']?.['language_code']
                                        },
                                        message: {
                                            id: last_update['message']?.['message_id'],
                                            text: last_update['message']?.['text'],
                                            from: {
                                                id: last_update['message']?.['from']?.['id'],
                                                is_bot: last_update['message']?.['from']?.['is_bot'],
                                                first_name: last_update['message']?.['from']?.['first_name'],
                                                last_name: last_update['message']?.['from']?.['last_name'],
                                                username: last_update['message']?.['from']?.['username'],
                                                language_code: last_update['message']?.['from']?.['language_code']
                                            },
                                            date: last_update['message']?.['date'],
                                            chat: {
                                                id: last_update['message']?.['chat']?.['id'],
                                                first_name: last_update['message']?.['chat']?.['first_name'],
                                                photo: {
                                                    big_file_id: last_update['message']?.['chat']?.['photo']?.['big_file_id'],
                                                    big_file_unique_id: last_update['message']?.['chat']?.['photo']?.['big_file_unique_id'],
                                                    small_file_id: last_update['message']?.['chat']?.['photo']?.['small_file_id'],
                                                    small_file_unique_id: last_update['message']?.['chat']?.['photo']?.['small_file_unique_id']
                                                },
                                                type: last_update['message']?.['chat']?.['type'],
                                                title: last_update['message']?.['chat']?.['title'],
                                                username: last_update['message']?.['chat']?.['username'],
                                                invite_link: last_update['message']?.['chat']?.['invite_link']
                                            }
                                        },
                                        inline_message_id: last_update['inline_message_id'],
                                        chat_instance: last_update['chat_instance'],
                                        data: last_update['data']
                                    };

                                    clids.push(last_update['id']);
                                    this.emit("callback_query", cq);
                                }
                            }
                        }
                    })
                }
            }
        }, intervalTime ?? this.time)
        this.intervalId = interval;
    }

}

// const b = new BaleBot("1541141536:UqPXqR7Lus8yI4M9QsMMFWwiVpk1W4rbTyoOiuxp", { polling: true, polling_interval: 1000});

// b.getChat(
//     554324725,
//     (data) => {
//         console.log(data)
//     }
// )

// b.sendMedia(
//     {
//         media: "video",
//         path: "./movie.mp4",
//         chat_id: 554324725,
//     },
//     (data) => {
//         console.log(data)
//     }
// )
// b.getFileContent("1541141536:8796073695150022400:1:c40e1ca80d6f476b4c174c1f29cc90d5", (re) => {
//     console.log(re.data)
// })
// b.getFile(
//     "1541141536:6198042179158220547:1:19072fd85f4cd4b9",
//     (data) => {
//         console.log(data)
//     }
// )
// b.sendPhoto(
//     554324725,
//     "I:\\ws2.png",
//     {
//         reply_markup: [
//             [
//                 {
//                     text: "KO",
//                     request_contact: true
//                 }
//             ]
//         ]
//     },
//     (msg) => { console.log(msg.photo) }
// )


// b.sendPhoto(
//     554324725,
//     "https://avatars.githubusercontent.com/u/196440184?v=4",
//     {
//         reply_markup: [
//             [
//                 {
//                     text: "KO",
//                     request_contact: true
//                 }
//             ]
//         ]
//     },
//     (msg) => { console.log(msg.photo) }
// )

// b.sendMessage(
//     554324725,
//     "hi",
//     {},
//     (c) => { console.log(c) }
// )

module.exports = { BaleBot };