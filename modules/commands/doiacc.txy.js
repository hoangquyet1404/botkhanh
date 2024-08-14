const fs = require("fs-extra");
const acc = JSON.parse(fs.readFileSync("./acc.json"));

module.exports.config = {
  name: "doiacc",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "pqc2304",
  description: "doiacc",
  commandCategory: "Admin",
  usages: "doiacc [stt]",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const uids = acc.map(account => account.uid);
  let message = "Danh sách tài khoản:\n";
  for (let i = 0; i < uids.length; i++) {
    message += `${i + 1}. ${uids[i]}\n`;
  }
  if (!args[0] || isNaN(args[0])) {
    api.sendMessage(`Vui lòng nhập số thứ tự của tài khoản cần đổi! ${message}`, event.threadID);
    return;
  }
  const stt = parseInt(args[0]);
  if (stt < 1 || stt > uids.length) {
    api.sendMessage(`Số thứ tự không hợp lệ! ${message}`, event.threadID);
    return;
  }
  const { uid, pass, auth } = acc[stt - 1];
  try {
    const { data } = await axios.get(`https://api.phamquoccuong.dev/appstate?account=${uid}|${pass}|${auth}`);
    api.sendMessage(data, event.threadID);
  } catch (error) {
    console.log(error);
    api.sendMessage("Đã xảy ra lỗi khi đổi tài khoản!", event.threadID);
  }
};
