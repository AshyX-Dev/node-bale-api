# Node Bale API
+ [Github Page is Here ! 👥🍷](https://github.com/AshyX-Dev/node-bale-api)

## Usage
+ polling: boolean => create a interval
+ polling_interval: number => a ms time to make a request for polling

```javascript 
const token = "...";
const { BaleBot } = require("node-bale-api/main");
const bot = new BaleBot(token, { polling: true, polling_interval: 1000 });

// Handling messages
bot.on("message", (msg) => {
    if (msg.text.startsWith("/start")){
        bot.replyTo(
            msg,
            "Hello NBA World !",
            {
                keyboard_mode: "inline_keyboard",
                reply_markup: [
                    [
                        {
                            text: "close the panel !",
                            callback_data: "close"
                        }
                    ]
                ]
            }
        )

        // OR SENDING A MESSAGE
        bot.sendMessage(
            msg,
            "Hello NBA World !",
            {
                reply_to_message_id: msg.id
                keyboard_mode: "inline_keyboard", // on the other hand we have keyboard
                reply_markup: [
                    [
                        {
                            text: "close the panel !",
                            callback_data: "close" // if you use keyboard, you will allow to use `one_time_keyboard`: boolean, `resize_keyboard`: boolean, `request_contact`: boolean, `request_location`: boolean
                        }
                    ]
                ]
            }
        )
    }
})


// Handling Queries
bot.on("callback_query", (query) => {
    if (query.data == "close"){
        bot.deleteMessage(
            query.message.chat.id,
            query.message.id // You can use an Array<number> to delete more than 1 message => [1, 2, 3, ....]
        )
    }
})

// Clear the Polling Interval
bot.on("close", () => {
    console.log("Polling interval has been closed !");
})

// Handling Errors !
bot.on("fumble", (error_message, error_code) => {
    console.log(`!Error: ${error_message} => code: ${error_code}`);
})

/*
* Other Events:
*   photo
*   video
*   audio
*   voice
*   sticker
*   document:
*/

```
