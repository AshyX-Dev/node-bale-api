// const a = fetch("https://tapi.bale.ai/bot1541141536:UqPXqR7Lus8yI4M9QsMMFWwiVpk1W4rbTyoOiuxp/sendPhoto", {method: "POST", body:JSON.stringify({chat_id: 554324725, photo: "https://avatars.githubusercontent.com/u/196440184?v=4"}), headers: { "Content-Type": "application/json" }});
// a.then((res) => {
//     res.json().then((b) => {
//         console.log(b)
//     })
// })

// const a = { key: "value" };

// // Check if 'a' is a plain object
// if (typeof a === 'object' && a !== null && !Array.isArray(a)) {
//   console.log("a is a plain object.");
// } else {
//   console.log("a is not a plain object.");
// }

const fs = require('fs');

// Create a writable stream
const stream = fs.createWriteStream('output.png');

// Example binary data (replace with your actual data)
const data = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]); // PNG header

// Write data to the stream
stream.write(data, (err) => {
    if (err) {
        console.error('Error writing data:', err);
    } else {
        console.log('Data written successfully');
    }
});

// End the stream
stream.end(() => {
    console.log('Stream closed');
});

// Handle stream errors
stream.on('error', (err) => {
    console.error('Stream error:', err);
});
