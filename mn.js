const { BaleBot } = require("./main");
const b = new BaleBot("1541141536:UqPXqR7Lus8yI4M9QsMMFWwiVpk1W4rbTyoOiuxp");

b.sendMessage(
    554324725,
    "Hellooo",
    { reply_to_message_id: 32 },
    (msg) => {
        console.log(msg.text)
    }
)