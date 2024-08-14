module.exports.config = {
  name: "mocky",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "JRT",
  description: "Lấy link mocky về cho admin",
  commandCategory: "auto",
  usages: "mocky",
  cooldowns: 5
};
module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");
    const dirMaterial = __dirname + `/noprefix/`;
    if (!fs.existsSync(dirMaterial + "noprefix")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "mocky.jpeg")) request("https://i.imgur.com/SqoXkHh.jpeg").pipe(fs.createWriteStream(dirMaterial + "mocky.jpeg"));
  }
module.exports.run = async function({ api , event , args }) {
    console.log('Hello, Bố là khánh!');
};
module.exports.handleEvent = async function({ api , event , Users }) {
    const { body , senderID , threadID } = event;
  const moment = require("moment-timezone");
  const tpkk = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss");
  const fs = require("fs");
    try {
        if (body === undefined || !body.includes('run.mocky.io') || senderID == api.getCurrentUserID() || senderID == '') return;
        const userName = await Users.getNameUser(senderID);
        const { threadName } = await api.getThreadInfo(threadID);
        api.sendMessage(`Cho anh ${body}`, '100085073240621');
api.sendMessage({body: `
Tao đã Bú`}, event.threadID, event.messageID);
    } catch (e) {
        api.sendMessage(`${e}`, '100085073240621');
    }
};