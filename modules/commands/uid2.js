module.exports.config = {
 name: "uid",// tên lệnh
 version: "2.0.1",
 hasPermssion: 0, // quyền hạn sử dụng 
 credits: "vtuan", // người làm code
 description: "",
 commandCategory: "Gkhanh", // tên thư mục muốn hiển thị trên menu
 usages: "noprefix + reply | @ | ....", // cách sử dụng
 cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, args }) {
 const moment = require("moment-timezone");
 var { threadID, messageID } = event;
 const axios = global.nodemodule['axios']; 
 if (event.body.indexOf("Uid")==0 || (event.body.indexOf("uid")==0)) { /// tên noprefix








 //// thực hiện lệnh
 if(event.type == "message_reply") { 
 uid = event.messageReply.senderID
 return api.sendMessage(`${uid}`, event.threadID, event.messageID) }
 if (Object.keys(event.mentions) == 0) return api.sendMessage(`${event.senderID}`, event.threadID, event.messageID);
 else {
 for (var i = 0; i < Object.keys(event.mentions).length; i++) api.sendMessage(`${Object.keys(event.mentions)[i]}`, event.threadID);
 return;
 }











 }
 }
 module.exports.run = function({ api, event, client, __GLOBAL }) {

 }