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
        } catch (e) {}
    }

}

module.exports = { Connection };