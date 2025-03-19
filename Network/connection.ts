import * as axios from "axios";
import { createReadStream } from "fs";
import { basename } from "path";
import { MediaUpload } from "../Objects/interfaces";
const FormData = require("form-data");

export class Connection {
    url: string;
    file_url: string;
    token: string;

    constructor(token: string){
        this.token = token;
        this.url = `https://tapi.bale.ai/bot${this.token}`;
        this.file_url = `https://tapi.bale.ai/file/bot${this.token}/`
    }

    async makeConnection(
        method: string,
        inputes: any,
        callback: (RESULT: any) => void
    ){
        try{
            const url = this.url+`/${method}`;
            const _ = await fetch(url, {
                method: "POST",
                body: JSON.stringify(inputes),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const res = await _.json();
            callback(res);
        } catch (e) {
            callback({ok: false, message: e});
        }
    }

    toTitleCase(str: string): string {
        return str
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

    async uploadSomething(opts: MediaUpload, callback: (data: any) => void = (data) => {}){
        try {
            const fileStream = createReadStream(opts.path);
            const formData = new FormData();

            formData.append("chat_id", opts.chat_id.toString());
            formData.append(opts.media, fileStream, basename(opts.path));
            formData.append("caption", opts.caption??"");
            if (opts.reply_to_message_id !== undefined){
                formData.append("reply_to_message_id", opts.reply_to_message_id.toString());
            }
            if (opts.reply_markup !== undefined){
                formData.append("reply_markup", JSON.stringify({keyboard:opts.reply_markup}))
            }
            await axios.post(`https://tapi.bale.ai/bot${this.token}/send${this.toTitleCase(opts.media)}`, formData, {
              headers: {
                ...formData.getHeaders(),
              },
            }).then((resp) => {
                callback(resp.data);
            })
        } catch (error) {
            callback({
                ok: false,
                message: error
            });
        }
    }

    async setChatPhoto(path: string, chatId: number, callback: (data: any) => void = (data) => {}){
        try {
            const fileStream = createReadStream(path);
            const formData = new FormData();

            formData.append("chat_id", chatId.toString());
            formData.append("photo", fileStream, basename(path));
            await axios.post(`https://tapi.bale.ai/bot${this.token}/setChatPhoto`, formData, {
              headers: {
                ...formData.getHeaders(),
              },
            }).then((resp) => {
                callback(resp.data);
            })
        } catch (error) {
            callback({
                ok: false,
                message: error
            });
        }
    }

    /* Beta */
    async uploadSticker(path: string, userId: number, callback: (data: any) => void = (data) => {}){
        try {
            const fileStream = createReadStream(path);
            const formData = new FormData();

            formData.append("user_id", userId.toString());
            formData.append("sticker", fileStream, basename(path));
            await axios.post(`https://tapi.bale.ai/bot${this.token}/uploadStickerFile`, formData, {
              headers: {
                ...formData.getHeaders(),
              },
            }).then((resp) => {
                callback(resp.data);
            })
        } catch (error) {
            callback({
                ok: false,
                message: error
            });
        }
    }

    /* Beta */
    async uploadStickerToSet(path: string, userId: number, setName: string, callback: (data: any) => void = (data) => {}){
        try {
            const fileStream = createReadStream(path);
            const formData = new FormData();

            formData.append("user_id", userId.toString());
            formData.append("name", setName);
            formData.append("sticker", fileStream, basename(path));
            await axios.post(`https://tapi.bale.ai/bot${this.token}/addStickerToSet`, formData, {
              headers: {
                ...formData.getHeaders(),
              },
            }).then((resp) => {
                callback(resp.data);
            })
        } catch (error) {
            callback({
                ok: false,
                message: error
            });
        }
    }

    async fileConnection(filePath: string, callback: (data: any) => void = (data: any) => {}){
        try{
            const url = this.file_url+filePath;
            const _ = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const res = await _.text();
            callback(res);
        } catch (e) {
            callback({ok: false, message: e});
        }
    }
}


module.exports = { Connection };