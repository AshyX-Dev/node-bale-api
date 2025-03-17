import { createReadStream } from 'fs';
import { basename } from 'path';

interface UploadOptions {
    TypeFile: string;
    path: string;
    chatID: string;
    caption?: string | null;
}

async function upload(opts: UploadOptions, callback?: (data: any) => void) {
    const formData = new FormData();
    const file = createReadStream(opts.path);
    
    // Append the file stream
    file.on("data", async (ch) => {
        formData.append(opts.TypeFile, ch.toString("binary"));
        formData.append("chat_id", opts.chatID);
        formData.append("caption", opts.caption ?? "");

        try {
            const response = await fetch(`https://tapi.bale.ai/bot1541141536:UqPXqR7Lus8yI4M9QsMMFWwiVpk1W4rbTyoOiuxp/send${opts.TypeFile}`, {
                method: 'POST',
                body: formData,
                headers: {
                    "Content-Type": 'application/octet-stream'
                }
            });

            const data = await response.json();

            if (callback) {
                data.error = false;
                data.base = null;
                callback(data);
            }
        } catch (error) {
            if (callback) {
                const data = { error: true, base: error };
                callback(data);
            }
        }
    })
    
}

upload(
    {
        path: "I:\\ws2.png",
        chatID: "554324725",
        caption: "",
        TypeFile: "Photo"
    },
    (k) => { console.log(k) }
)