const fs = require('fs');
const path = require('path');

const data = [
  "369239263222822",
  "184571475493841",
  "155887105126297",
  "551710554864076",
  "788171717923679",
  "1458999184131858",
  "369239383222810",
  "1598371140426188",
  "1598410647088904",
  "1649890685274233",
  "1598405803756055",
  "1598406790422623",
  "1458993787465731",
  "2041015329459274",
  "1458994000799043",
  "1458994024132374",
  "2041011726126301",
  "2041011836126290",
  "041011389459668",
  "2041021119458695",
  "2041021119458695",
  "1747085962269322",
  "1747083702269548" 
];

let isSendingSticker = false;
let autostickerEnabled = true;

// Đọc trạng thái từ tệp JSON khi khởi động
const configFilePath = path.join(__dirname, 'autostickerConfig.json');
if (fs.existsSync(configFilePath)) {
  const configData = JSON.parse(fs.readFileSync(configFilePath));
  autostickerEnabled = configData.autostickerEnabled;
} else {
  // Tạo tệp JSON nếu không tồn tại
  fs.writeFileSync(configFilePath, JSON.stringify({ autostickerEnabled }));
}

module.exports.handleEvent = async ({ event, api, Users }) => {
  if (autostickerEnabled && !isSendingSticker && event.body && event.senderID !== api.getCurrentUserID()) {
      let sticker = data[Math.floor(Math.random() * data.length)];
      isSendingSticker = true;
      api.sendMessage({ sticker: sticker }, event.threadID, () => {
          isSendingSticker = false;
      });
  }
}

module.exports.config = { 
  name: "autosticker", 
  version: "1.0.0", 
  hasPermssion: 0, 
  credits: "XIE", 
  description: "Nghe tin nhắn và tự động gửi sticker", 
  commandCategory: "Tiện ích" 
}

module.exports.run = async ({ event, api, Threads, args }) => {
  if (args[0] === "on") {
      autostickerEnabled = true;
      api.sendMessage("Autosticker đã được bật ✅", event.threadID);
  } else if (args[0] === "off") {
      autostickerEnabled = false;
      api.sendMessage("Autosticker đã được tắt ✅", event.threadID);
  } else {
      api.sendMessage("Sử dụng: autosticker on/off", event.threadID);
  }

  // Lưu trạng thái vào tệp JSON
  fs.writeFileSync(configFilePath, JSON.stringify({ autostickerEnabled }));
}