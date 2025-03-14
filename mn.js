const { BaleBot } = require("./main");
const b = new BaleBot("1541141536:UqPXqR7Lus8yI4M9QsMMFWwiVpk1W4rbTyoOiuxp", { polling: true });

b.on("message", (msg) => {
    if (msg.text.startsWith("/start")){
        b.sendMessage(
            msg.chat.id,
            "Hi",
            {
                reply_to_message_id: msg.id,
                keyboard_mode: "inline_keyboard",
                reply_markup: [
                    [
                        {
                            text: "close message",
                            callback_data: "close"
                        }
                    ]
                ]
            }
        )
    }
})

b.on("callback_query", (call) => {
    console.log(call)
    if (call.data === "close"){
        b.sendMessage(
            call.chat_instance,
            "Message will delete",
            {
                reply_to_message_id: call.message.id
            },
            (a) => {console.log(a)}
        )
    }
})