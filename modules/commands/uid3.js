module.exports.config = {
    name: "uid3",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Mirai Team",
    description: "Lấy ID người dùng.",
    commandCategory: "Tiện Ích",
    cooldowns: 0
  };

module.exports.run = async function({ api, event, args }) {
  async function streamURL(url, mime='jpg') {
    const dest = `${__dirname}/cache/${Date.now()}.${mime}`,
    downloader = require('image-downloader'),
    fse = require('fs-extra');
    await downloader.image({
        url, dest
    });
    setTimeout(j=>fse.unlinkSync(j), 60*1000, dest);
    return fse.createReadStream(dest);
  };
    const axios = global.nodemodule['axios']; 
    if(event.type == "message_reply") { 
	uid = event.messageReply.senderID
	return api.sendMessage({body:`${uid}`,attachment: await streamURL(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=66262`)}, event.threadID, event.messageID) }
    if (!args[0]) {return api.sendMessage({body:`${event.senderID}`,attachment: await streamURL(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=66262`)}, event.threadID, event.messageID);}
    else {
	if (args[0].indexOf(".com/")!==-1) {
    const res_ID = await api.getUID(args[0]);  
    return api.sendMessage({body:`${res_ID}`,attachment: await streamURL(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)},event.threadID,event.messageID) }
	else {
		for (var i = 0; i < Object.keys(event.mentions).length; i++) api.sendMessage({body:`${Object.keys(event.mentions)[i]}`,attachment: await streamURL(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)}, event.threadID);
		return;
	}
}
}