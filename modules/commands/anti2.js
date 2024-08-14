module.exports.config = {
  name: "anti2",
  version: "4.1.5",
  hasPermssion: 1,
  credits: "",
  description: "ANTI BOX",
  commandCategory: "Admin",
  usages: "Dùng để bật tắt các chức năng nhóm mess",
  cooldowns: 0,
  dependencies: {
    "fs-extra": "",
  },
};

const {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  unlinkSync,
} = require("fs");
const axios = require('axios')

module.exports.handleReply = async function ({
  api,
  event,
  args,
  handleReply,
}) {
  const { senderID, threadID, messageID, messageReply } = event;
  const { author, permssion } = handleReply;
  
  const pathData = global.anti;
  const dataAnti = JSON.parse(readFileSync(pathData, "utf8"));

  if(author !== senderID ) return api.sendMessage(`Bạn không người dùng lệnh!`,threadID)

  var number = event.args.filter(i=> !isNaN(i))
 for (const num of number){
  switch (num) {
    case "1": {
      //---> CODE ADMIN ONLY<---//
      if (permssion < 1)
        return api.sendMessage(
          "BẠN CHƯA ĐỦ TUỔI ĐỂ DÙNG LỆNH NÀY!",
          threadID,
          messageID
        );
      var NameBox = dataAnti.boxname;
      const antiImage = NameBox.find(
        (item) => item.threadID === threadID
      );
      if (antiImage) {
        dataAnti.boxname = dataAnti.boxname.filter((item) => item.threadID !== threadID);
        api.sendMessage(
          "✅ Tắt thành công chế độ ANTI đổi tên box ",
          threadID,
          messageID
        );
      } else {
        var threadName = (await api.getThreadInfo(event.threadID)).threadName;
        dataAnti.boxname.push({
          threadID,
          name: threadName
        })
        api.sendMessage(
          "✅ Bật thành công chế độ ANTI đổi tên box",
          threadID,
          messageID
        );
      }
      writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
      break;
    }
    case "2": {
      if (permssion < 1)
        return api.sendMessage(
          "BẠN CHƯA ĐỦ TUỔI ĐỂ DÙNG LỆNH NÀY!",
          threadID,
          messageID
        );
      const antiImage = dataAnti.boximage.find(
        (item) => item.threadID === threadID
      );
      if (antiImage) {
        dataAnti.boximage = dataAnti.boximage.filter((item) => item.threadID !== threadID);
        api.sendMessage(
          "✅ Tắt thành công chế độ ANTI đổi ảnh box",
          threadID,
          messageID
        );
      } else {
        var threadInfo = await api.getThreadInfo(event.threadID);
        //console.log(threadInfo)
        var options = {
          method: "POST",
          url: "https://api.imgur.com/3/image",
          headers: {
            Authorization: "Client-ID fc9369e9aea767c",
          },
          data: {
            image: threadInfo.imageSrc,
          },
        };
        const res = await axios(options);

        var data = res.data.data;
        var img = data.link;
        dataAnti.boximage.push({
          threadID,
          url: img,
        });
        api.sendMessage(
          "✅ Bật thành công chế độ ANTI đổi ảnh box",
          threadID,
          messageID
        );
      }
      writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
      break;
    }
    case "3": {
      if (permssion < 1)
        return api.sendMessage(
          " BẠN CHƯA ĐỦ TUỔI ĐỂ DÙNG LỆNH NÀY!",
          threadID,
          messageID
        );
      const NickName = dataAnti.antiNickname.find(
        (item) => item.threadID === threadID
      );
      
      if (NickName) {
        dataAnti.antiNickname = dataAnti.antiNickname.filter((item) => item.threadID !== threadID);
        api.sendMessage(
          "✅ Tắt thành công chế độ ANTI đổi biệt danh ",
          threadID,
          messageID
        );
      } else {
        const nickName = (await api.getThreadInfo(event.threadID)).nicknames
        dataAnti.antiNickname.push({
          threadID,
          data: nickName
        });
        api.sendMessage(
          "✅ Bật thành công chế độ ANTI đổi biệt danh",
          threadID,
          messageID
        );
      }
      writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
      break;
    }
    case "4": {
      if (permssion < 1)
        return api.sendMessage(
          " BẠN CHƯA ĐỦ TUỔI ĐỂ DÙNG LỆNH NÀY!",
          threadID,
          messageID
        );
      const antiout = dataAnti.antiout;
      if (antiout[threadID] == true) {
        antiout[threadID] = false;
        api.sendMessage(
          "✅ Tắt thành công chế độ ANTI out! ",
          threadID,
          messageID
        );
      } else {
        antiout[threadID] = true;
        api.sendMessage(
          "✅ Bật thành công chế độ ANTI out!",
          threadID,
          messageID
        );
      }
      writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
      break;
    } 
    case "5": {
        const database = require('./cache/data.json');
        const { adminbox } = database
        if (permssion < 1)
          return api.sendMessage(
            "𝗠𝗢𝗗𝗘 - Quyền nồn biên giới ",
            threadID,
            messageID
          );
        if (adminbox[threadID] == true) {
          adminbox[threadID] = false;
          api.sendMessage(
            "𝗠𝗢𝗗𝗘 - Tắt thành công chế độ Quản trị viên, tất cả thành viên có thể sử dụng Bot",
            threadID,
            messageID
          );
        } else {
          adminbox[threadID] = true;
          api.sendMessage(
            "𝗠𝗢𝗗𝗘 - Kích hoạt thành công chế độ Quản trị viên, chỉ Quản trị viên có thể sử dụng Bot",
            threadID,
            messageID
          );
        }
        writeFileSync(__dirname + '/cache/data.json', JSON.stringify(database, null, 4));
        break;
      }
      case "~": {
        //---> CODE ADMIN ONLY<---//
        if (permssion < 1)
          return api.sendMessage("⚡️ nịt nek lấy ko", threadID, messageID);
        var dataI = {
            adminonly: {},
          };
        if (!existsSync(__dirname + '/cache/dataAd.json')) writeFileSync(__dirname + '/cache/dataAd.json', JSON.stringify(dataI,null,4));
        const database = require('./cache/dataAd.json');
        const { adminonly } = database
        if (adminonly[threadID] == true) {
          adminonly[threadID] = false;
          api.sendMessage(
            "✅ Tắt thành công chế độ chỉ ADMIN có thể dùng bot ",
            threadID,
            messageID
          );
        } else {
          adminonly[threadID] = true;
          api.sendMessage(
            "✅ Bật thành công chế độ chỉ ADMIN có thể dùng bot",
            threadID,
            messageID
          );
        }
        writeFileSync(__dirname + '/cache/dataAd.json', JSON.stringify(database, null, 4));
        break;
      }
    case "~": {
      const antiImage = dataAnti.boximage.find(
        (item) => item.threadID === threadID
      );
      const antiBoxname = dataAnti.boxname.find(
        (item) => item.threadID === threadID
      );
      const antiNickname = dataAnti.antiNickname.find(
        (item) => item.threadID === threadID
      );
      const qtvOnly = require('./cache/data.json')
      const adminOnly = require('./cache/dataAd.json')
      return api.sendMessage(
        `---- CHECK ANTI ----\n↪ ANTI AVT BOX: ${
          antiImage ? "true" : "false"
        }\n↪ ANTI NAME BOX: ${antiBoxname ? "true" : "false"}\n↪ ANTI NICK NAME: ${antiNickname ? "true" : "false"}\n↪ ANTI OUT: ${dataAnti.antiout[threadID] ? "true" : "false"}\n↪ QTV ONLY: ${qtvOnly.adminbox[event.threadID] ? true : false}\n↪ ADMIN ONLY: ${adminOnly.adminonly[event.threadID] ? true : false}`,
        threadID
      );
      break;
    }

    default: {
      return api.sendMessage(
        `Số bạn chọn không có trong anti!`,
        threadID
      );
    }
  }
 }
};

module.exports.run = async ({ api, event, args, permssion, Threads }) => {
  const { threadID, messageID, senderID } = event;
  const threadSetting = (await Threads.getData(String(threadID))).data || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;

  return api.sendMessage(
        `==== 『ANTI 』 ====\n━━━━━━━━━━━━━━━\n🌼 1.Cấm đổi tên nhóm của bạn\n🌸 2.Cấm đổi avatar nhóm\n🌺 3.Cấm đổi biệt danh\n🏵️ 4.Cấm người dùng out chùa\n🌻 5.Cấm thành viên dùng bot\n━━━━━━━━━━━━━━━\nHãy reply tin nhắn này và chọn chức năng mình muốn`,
        threadID, (error, info) => {
            if (error) {
              return api.sendMessage("Đã xảy ra lỗi!", threadID);
            } else {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                permssion
              });
            }
          });
};
