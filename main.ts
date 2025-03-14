// write callback of SendMessage carefully ( handle photo )

import { EventEmitter } from 'events';
import { Connection } from "./Network/connection";
import {
    chatTypes, stickerTypes, MessageTypes, InlineKeyboard, ReplyKeyboard,
    MaskText,
    User, Chat, ChatPhoto, PhotoSizeInterface,
    SendMessageOptions, ConstructorOptions,
    AnimationInterface, AudioInterface, DocumentLikeInterface, VideoInterface,
    VoiceInterface, ContactInterface, ContactArray, LocationInterface, FileInterface,
    StickerInterface, StickerSetInterface, Invoice, CallbackQuery, MessageForm,
    ForwardOptions
} from "./Objects/interfaces";

interface events {
    message: (message: MessageForm) => void,
    callback_query: (callbacking: CallbackQuery) => void,
    photo: (message: MessageForm) => void,
    video: (message: MessageForm) => void,
    audio: (message: MessageForm) => void,
    voice: (message: MessageForm) => void,
    sticker: (message: MessageForm) => void,
    document: (message: MessageForm) => void
}

export class BaleBot extends EventEmitter{
    bot_token: string;
    request: Connection;
    private time: number;

    constructor(BotToken: string, options: ConstructorOptions = { polling_interval: 999, polling: false }){
        super();
        this.bot_token = BotToken;
        this.request = new Connection(this.bot_token);
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

    async poll(intervalTime: number | undefined){
        let mesids = [];
        let clids  = [];
        setInterval(async () => {
            const evs = this.eventNames();
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

                                const sticker_thumb: PhotoSizeInterface = {
                                    file_id: last_update['sticker']?.['thumb']?.['file_id'],
                                    file_unique_id: last_update['sticker']?.['thumb']?.['file_unique_id'],
                                    file_size: last_update['sticker']?.['thumb']?.['file_id'],
                                    width: last_update['sticker']?.['thumb']?.['width'],
                                    height: last_update['sticker']?.['thumb']?.['height']
                                };

                                const stick: StickerInterface = {
                                    file_id: last_update['sticker']?.['file_id'],
                                    file_unique_id: last_update['sticker']?.['file_unique_id'],
                                    type: last_update['sticker']?.['type'],
                                    width: last_update['sticker']?.['width'],
                                    height: last_update['sticker']?.['height'],
                                    is_animated: last_update['sticker']?.['is_animated'],
                                    is_video: last_update['sticker']?.['is_video'],
                                    thumbnail: sticker_thumb,
                                    set_name: last_update['sticker']?.['set_name'],
                                    file_size: last_update['sticker']?.['file_size']
                                };

                                const left: User = {
                                    id: last_update['left_chat_member']?.['id'],
                                    is_bot: last_update['left_chat_member']?.['is_bot'],
                                    first_name: last_update['left_chat_member']?.['first_name'],
                                    last_name: last_update['left_chat_member']?.['last_name'],
                                    username: last_update['left_chat_member']?.['username'],
                                    language_code: last_update['left_chat_member']?.['language_code'],
                                };

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
                                    location: loc,
                                    sticker: stick,
                                    left_chat_member: left,
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
                                    if (video.file_id !== undefined){
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
                            if (!(clids.includes(last_update['id']))){
                                const f: User = {
                                    id: last_update['from']?.['id'],
                                    is_bot: last_update['from']?.['is_bot'],
                                    first_name: last_update['from']?.['first_name'],
                                    last_name: last_update['from']?.['last_name'],
                                    username: last_update['from']?.['username'],
                                    language_code: last_update['from']?.['language_code']
                                };

                                const fm: User = {
                                    id: last_update['message']?.['from']?.['id'],
                                    is_bot: last_update['message']?.['from']?.['is_bot'],
                                    first_name: last_update['message']?.['from']?.['first_name'],
                                    last_name: last_update['message']?.['from']?.['last_name'],
                                    username: last_update['message']?.['from']?.['username'],
                                    language_code: last_update['message']?.['from']?.['language_code']
                                };

                                const cmPhoto: ChatPhoto = {
                                    big_file_id: last_update['message']?.['chat']?.['photo']?.['big_file_id'],
                                    big_file_unique_id: last_update['message']?.['chat']?.['photo']?.['big_file_unique_id'],
                                    small_file_id: last_update['message']?.['chat']?.['photo']?.['small_file_id'],
                                    small_file_unique_id: last_update['message']?.['chat']?.['photo']?.['small_file_unique_id']
                                };

                                const cm: Chat = {
                                    id: last_update['message']?.['chat']?.['id'],
                                    first_name: last_update['message']?.['chat']?.['first_name'],
                                    photo: cmPhoto,
                                    type: last_update['message']?.['chat']?.['type'],
                                    title: last_update['message']?.['chat']?.['title'],
                                    username: last_update['message']?.['chat']?.['username'],
                                    invite_link: last_update['message']?.['chat']?.['invite_link']
                                };

                                const m: MessageForm = {
                                    id: last_update['message']?.['message_id'],
                                    text: last_update['message']?.['text'],
                                    from: fm,
                                    date: last_update['message']?.['date'],
                                    chat: cm
                                };

                                const cq: CallbackQuery = {
                                    id: last_update['id'],
                                    from: f,
                                    message: m,
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

        }, intervalTime ?? this.time)
    }

}



// const b = new BaleBot("1541141536:UqPXqR7Lus8yI4M9QsMMFWwiVpk1W4rbTyoOiuxp", { polling_interval: 999, polling: true });


// b.on("message", (msg) => {
//     if (msg.text.startsWith("/start")){
//         b.sendMessage(
//             msg.chat.id,
//             "Hi",
//             {
//                 reply_to_message_id: msg.id,
//                 keyboard_mode: "inline_keyboard",
//                 reply_markup: [
//                     [
//                         {
//                             text: "close message",
//                             callback_data: "close"
//                         }
//                     ]
//                 ]
//             }
//         )
//     }
// })

// b.on("callback_query", (call) => {
//     console.log(call)
//     if (call.data === "close"){
//         b.sendMessage(
//             call.chat_instance,
//             "Message will delete",
//             {
//                 reply_to_message_id: call.message.id
//             },
//             (a) => {console.log(a)}
//         )
//     }
// })

// bot.forwardMessage(
//     554324725,
//     {
//         to_chat: 554324725,
//         message_id: 172
//     },
//     (msg) => {
//         console.log(msg)
//     }
// )

module.exports = { BaleBot };