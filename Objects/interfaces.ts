type chatTypes = 'private' | 'group' | 'channel';
type stickerTypes = 'regular' | 'mask';
type MessageTypes = 
  | 'message'
  | 'photo'
  | 'video'
  | 'text'
  | 'animation'
  | 'audio'
  | 'voice';

class MaskText{
    text: string;

    constructor(text: string){
        this.text = text;
    }

    bold(): string {
        return `*${this.text}*`;
    }

    italic(): string {
        return `_${this.text}_`;
    }

    createLink(link: string): string {
        return `[${this.text}](${link})`;
    }

    createDocumentation(object: string): string {
        return "```" + `[${this.text}]${object}` + "```";
    }

}

interface User {
    id: number | undefined;
    is_bot: boolean | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    username: string | undefined;
    language_code: string | undefined;
}

interface ChatPhoto {
    small_file_id: string | undefined;
    small_file_unique_id: string | undefined;
    big_file_id: string | undefined;
    big_file_unique_id: string | undefined;
}

interface PhotoSize {
    file_id: string | undefined;
    file_unique_id: string | undefined;
    width: number | undefined;
    height: number | undefined;
    size: number | undefined;
}

interface AnimationInterface {
    file_id: string | undefined;
    file_unique_id: string | undefined;
    width: number | undefined;
    height: number | undefined;
    duration: number | undefined;
    thumbnail: PhotoSize;
    file_name: string | undefined;
    mime_type: string | undefined;
    file_size: number | undefined;
}

interface AudioInterface {
    file_id: string | undefined;
    file_unique_id: string | undefined;
    duration: number | undefined;
    title: string | undefined;
    first_name: string | undefined;
    mime_type: string | undefined;
    file_size: number | undefined;
}

interface DocumentLikeInterface {
    file_id: string | undefined;
    file_unique_id: string | undefined;
    thumbnail: PhotoSize;
    file_name: string | undefined;
    mime_type: string | undefined;
    file_size: number | undefined;
}

interface VideoInterface {
    file_id: string | undefined;
    file_unique_id: string | undefined;
    width: number | undefined;
    height: number | undefined;
    duration: number | undefined;
    file_name: string | undefined;
    mime_type: string | undefined;
    file_size: number | undefined;
}

interface VoiceInterface {
    file_id: string | undefined;
    file_unique_id: string | undefined;
}

interface ContactInterface {
    phone_number: string | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    user_id: number | undefined;
}

interface ContactArray {
    contacts: Array<ContactInterface> | [] | undefined;
}

interface LocationInterface {
    longitude: number | undefined;
    latitude: number | undefined;
}

interface FileInterface {
    id: string | undefined;
    unique_id: string | undefined;
    size: number | undefined;
    path: string | undefined;
}

interface StickerInterface {
    file_id: string | undefined;
    file_unique_id: string | undefined;
    file_size: number | undefined;
    type: stickerTypes | undefined;
    width: number | undefined;
    height: number | undefined;
}

interface StickerSetInterface {
    name: string | undefined;
    title: string | undefined;
    stickers: Array<StickerInterface> | [] | undefined;
    thumbnail: PhotoSize | undefined;
}

interface InlineKeyboardNotSuggest {
    text: string;
    callback_data?: string;
    callback_url?: string;
}

type inline_buttons = InlineKeyboardNotSuggest[];
type InlineKeyboard = inline_buttons[];

interface ReplyKeyboardNotSuggest {
    text: string;
    resize_keyboard?: boolean | undefined;
    one_time_keyboard?: boolean | undefined;
    request_contact?: boolean | undefined;
    request_location?: boolean | undefined;
}

type reply_buttons = ReplyKeyboardNotSuggest[];
type ReplyKeyboard = reply_buttons[];

interface Chat {
    id: number | undefined;
    type: chatTypes | undefined;
    title: string | undefined;
    username: string | undefined;
    photo: ChatPhoto | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    invite_link: string | undefined;
}

interface Invoice {
    chat_id: number | undefined;
    title: string | undefined;
    description: string | undefined;
    payload: string | undefined;
    provider_token: string | undefined;
    photo_url: string | undefined;
    reply_to_message_id: number | undefined;
    reply_markup: InlineKeyboard | ReplyKeyboard | undefined;
    prices: Array<Map<string, string>>;
}

interface CallbackQuery {
    clicked_from_chat: number | undefined;
    id: number | undefined;
    inline_id: number | undefined;
    from: User | undefined;
    data: string | undefined;
}

interface MessageForm {
    id: number | undefined;
    from: User | undefined;
    date: number | undefined;
    chat: Chat | undefined;
    forward_from?: User | undefined;
    forward_from_chat?: Chat | undefined;
    forward_from_message_id?: number | undefined;
    forward_date?: number | undefined;
    edit_date?: number | undefined;
    text: string | undefined;
    animation?: Animation | undefined;
    audio?: AudioInterface | undefined;
    voice?: VoiceInterface | undefined;
    document?: DocumentLikeInterface | undefined;
    video?: VideoInterface | undefined;
    photo?: Array<PhotoSize> | undefined;
    sticker?: StickerInterface | undefined;
    caption?: string | undefined;
    contact?: ContactInterface | undefined;
    location?: LocationInterface | undefined;
    new_chat_members?: Array<User> | undefined;
    left_chat_member?: User | undefined;
    invoice?: Invoice | undefined;
    successful_payment?: Map<string, string> | undefined;
    reply_markup?: InlineKeyboard | undefined;
    callback_query?: CallbackQuery | undefined;
}