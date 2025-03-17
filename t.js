const a = fetch("https://tapi.bale.ai/bot1541141536:UqPXqR7Lus8yI4M9QsMMFWwiVpk1W4rbTyoOiuxp/sendPhoto", {method: "POST", body:JSON.stringify({chat_id: 554324725, photo: "https://avatars.githubusercontent.com/u/196440184?v=4"}), headers: { "Content-Type": "application/json" }});
a.then((res) => {
    res.json().then((b) => {
        console.log(b)
    })
})