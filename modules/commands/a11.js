module.exports.config = {
  name: "du",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "nnl", //thích thay cre ko bố m đã bố thí cho dùng rồi bớt bớt lại nha con chó
  description: "Random",
  commandCategory: "media",
  usages: "mông",
  cooldowns: 5,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

const request = require('request');
const fs = require("fs");

module.exports.run = async ({ api, event }) => {
  const axios = require('axios');
  const threadID = event.threadID;

  const imageUrls = await Promise.all(Array.from({ length: 13}, async () => {
    const res = await axios.get('https://living-stream-khaan.glitch.me/images/du');
    return res.data.url;
    
  }));

  const attachments = await Promise.all(imageUrls.map(async (url) => {
    return (await axios({
      url,
      method: "GET",
      responseType: "stream"
    })).data
  }));

  api.sendMessage({
    body: `[🖤] → 𝗔̉𝗻𝗵 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝗯𝗲̂𝗻 𝗱𝘂̛𝗼̛́𝗶
⚠️ 𝗔̉𝗻𝗵 𝘀𝗲̃ 𝗿𝗮 𝗻𝗴𝗮̂̃𝘂 𝗻𝗵𝗶𝗲̂𝗻 𝘁𝘂̛̀ 𝟭 => 𝟲 𝗮̉𝗻𝗵`,
    attachment: attachments
  }, threadID);
};