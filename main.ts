import { EventEmitter } from 'events';
import { Connection } from "./Network/connection";
import {
    chatTypes, stickerTypes, MessageTypes, InlineKeyboard, ReplyKeyboard,
    MaskText,
    User, Chat, ChatPhoto, PhotoSizeInterface,
    SendMessageOptions, ConstructorOptions,
    AnimationInterface, AudioInterface, DocumentLikeInterface, VideoInterface,
    VoiceInterface, ContactInterface, ContactArray, LocationInterface, FileInterface,
    StickerInterface, StickerSetInterface, Invoice, CallbackQuery, MessageForm
} from "./Objects/interfaces";

interface events {
    "message": (message: MessageForm) => void,
    "callback_query": (callbacking: CallbackQuery) => void
}

export class BaleBot extends EventEmitter{
    bot_token: string;
    request: Connection;
    private time: number;

    constructor(BotToken: string, options: ConstructorOptions = { polling_interval: 999 }){
        super();
        this.bot_token = BotToken;
        this.request = new Connection(this.bot_token);
        this.time;
        this.poll(options.polling_interval ?? 999);
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
                    const c: Chat = {
                        id: res.result.chat['id'],
                        type: res.result.chat['type'],
                        photo: res.result.chat['photo']
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

    async poll(intervalTime: number | undefined){
        setInterval(async () => {
            if (this.eventNames().includes("message")){
                await this.request.makeConnection("getUpdates", {}, (res) => {
                    if (res.ok){
                        let indexes =  res['result'] ?? [{}];
                        let last_index = indexes.length - 1;
                        if (Object.keys(indexes[last_index]).includes("message") === true){
                            let last_update = indexes[last_index]['message'];

                            const f: User = {
                                id: last_update['from']?.['id'],
                                is_bot: last_update['from']?.['is_bot'],
                                first_name: last_update['from']?.['first_name'],
                                last_name: last_update['from']?.['last_name'],
                                username: last_update['from']?.['username'],
                                language_code: last_update['from']?.['language_code']
                            };

                            const ff: User = {
                                id: last_update['forward_from']?.['id'],
                                is_bot: last_update['forward_from']?.['is_bot'],
                                first_name: last_update['forward_from']?.['first_name'],
                                last_name: last_update['forward_from']?.['last_name'],
                                username: last_update['forward_from']?.['username'],
                                language_code: last_update['forward_from']?.['language_code']
                            };

                            const ph: ChatPhoto = {
                                small_file_id: last_update['chat']?.['photo']?.['small_file_id'],
                                small_file_unique_id: last_update['chat']?.['photo']?.['small_file_unique_id'],
                                big_file_id: last_update['chat']?.['photo']?.['big_file_id'],
                                big_file_unique_id: last_update['chat']?.['photo']?.['big_file_unique_id']
                            };

                            const c: Chat = {
                                id: last_update['chat']?.['id'],
                                first_name: last_update['chat']?.['first_name'],
                                photo: ph,
                                type: last_update['chat']?.['type'],
                                title: last_update['chat']?.['title'],
                                username: last_update['chat']?.['username'],
                                invite_link: last_update['chat']?.['invite_link']
                            };

                            const d: DocumentLikeInterface = {
                                file_id: last_update['document']?.['file_id'],
                                file_unique_id: last_update['document']?.['file_unique_id'],
                                file_name: last_update['document']?.['file_name'],
                                mime_type: last_update['document']?.['mime_type'],
                                file_size: last_update['document']?.['file_size']
                            };

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

                            const video: VideoInterface = {
                                file_id: last_update['video']?.['file_id'],
                                file_unique_id: last_update['video']?.['file_unique_id'],
                                width: last_update['video']?.['width'],
                                height: last_update['video']?.['height'],
                                duration: last_update['video']?.['duration'],
                                mime_type: last_update['video']?.['mime_type'],
                                file_size: last_update['video']?.['file_size']
                            };

                            const auv: AudioInterface | VoiceInterface = {
                                file_id: last_update['audio']?.['file_id'],
                                file_unique_id: last_update['audio']?.['file_unique_id'],
                                duration: last_update['audio']?.['duration'],
                                mime_type: last_update['audio']?.['mime_type'],
                                file_size: last_update['audio']?.['file_size']
                            };

                            const cont: ContactInterface = {
                                phone_number: last_update['contact']?.['phone_number'],
                                first_name: last_update['contact']?.['first_name'],
                                user_id: last_update['contact']?.['user_id']
                            };

                            const loc: LocationInterface = {
                                latitude: last_update['location']?.['latitude'],
                                longitude: last_update['location']?.['longitude']
                            };

                            const m: MessageForm = {
                                text: last_update['text'],
                                id: last_update['message_id'],
                                from: f,
                                date: last_update['date'],
                                chat: c,
                                forward_from: ff,
                                forward_from_message_id: last_update['forward_from_message_id'],
                                edit_date: last_update['edit_date'],
                                document: d,
                                photo: phs,
                                video: video,
                                audio: auv,
                                voice: auv,
                                caption: last_update['caption'],
                                contact: cont,
                                location: loc
                            };

                            this.emit("message", last_update);
                        }
                    }
                })
            }
        }, intervalTime ?? this.time)
    }

}



// const bot = new BaleBot("", { polling_interval: 0 });

// bot.on("message", (msg) => {
//     console.log(msg);
// })

// module.exports = { BaleBot };