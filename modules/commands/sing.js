const fs = require('fs'); // vì quá ngu si
const ytdl = require('@distube/ytdl-core');
const { resolve } = require('path'); // hải óc lul
async function downloadMusicFromYoutube(link, path) {
  var timestart = Date.now(); // kiếm ni cho tao
  if(!link) return 'Thiếu link' // dcu mày
  var resolveFunc = function () { };
  var rejectFunc = function () { };
  var returnPromise = new Promise(function (resolve, reject) {
    resolveFunc = resolve;
    rejectFunc = reject;
  });
    ytdl(link, {
            filter: format =>
                format.quality == 'tiny' && format.audioBitrate == 48 && format.hasAudio == true
        }).pipe(fs.createWriteStream(path))
        .on("close", async () => {
            var data = await ytdl.getInfo(link)
            var result = {
                title: data.videoDetails.title,
                dur: Number(data.videoDetails.lengthSeconds),
                viewCount: data.videoDetails.viewCount,
                likes: data.videoDetails.likes,
                uploadDate: data.videoDetails.uploadDate,
                author: data.videoDetails.author.name,
                sub: data.videoDetails.author.subscriber_count,
                timestart: timestart
            }
            resolveFunc(result)
        })
  return returnPromise
}
module.exports.config = {
    name: "sing",
    version: "1.0.0",
    hasPermssion: 0,
    usePrefix: false,
    credits: "D-Jukie", //Dgk thêm vài cái xàm lồn
    description: "Phát nhạc thông qua link YouTube hoặc từ khoá tìm kiếm",
    commandCategory: "𝐓𝐢𝐞̣̂𝐧 𝐈́𝐜𝐡",
    usages: "[searchMusic]",
    cooldowns: 0
};

module.exports.handleReply = async function ({ api, event, handleReply, Users , Threads }) {
    const axios = require('axios')
    
    let name = await Users.getNameUser(event.senderID);
    
    const { createReadStream, unlinkSync, statSync } = require("fs-extra")
    try {
        var path = `${__dirname}/cache/sing.mp3`
        var data = await downloadMusicFromYoutube('https://www.youtube.com/watch?v=' + handleReply.link[event.body -1], path);
        var { link, author } = handleReply;
        if (handleReply.author != event.senderID) return api.sendMessage("Cút ", threadID, messageID)
        if (fs.statSync(path).size > 29214400) return api.sendMessage('Dài Vãi Lồn Đéo Gửi Được :)', event.threadID, () => fs.unlinkSync(path), event.messageID);
        api.unsendMessage(handleReply.messageID)
        return api.sendMessage({ 
		body: `\n[ 𝙼𝚄𝚂𝙸𝙲 ]\n📝Title ${data.title}\n⌛Time ${this.convertHMS(data.dur)}\n👁️Wiew ${data.viewCount}\n👍 Lượt thích: ${data.likes}\n📆 Ngày tải lên: ${data.uploadDate}\n📻 Channel: ${data.author} ( ${data.sub} )\n⌛ Time sử lí: ${Math.floor((Date.now()- data.timestart)/1000)} 𝚐𝚒𝚊̂y\n👤 Thk gọi nhạc: ${name}`,
            attachment: fs.createReadStream(path)}, event.threadID, ()=> fs.unlinkSync(path), 
         event.messageID)
            
    }
    catch (e) { return console.log(e) }
}
module.exports.convertHMS = function(value) {
    const sec = parseInt(value, 10); 
    let hours   = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60); 
    let seconds = sec - (hours * 3600) - (minutes * 60); 
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return (hours != '00' ? hours +':': '') + minutes+':'+seconds;
}
module.exports.run = async function ({ api, event, args }) {
    if (args.length == 0 || !args) return api.sendMessage({body: ' [ Hệ Thống Tải Nhạc ]\n1. ~sing + tên bài hát\n2. ~sing + link vd youtube\n📝 Lưu ý một số nhạc bot không tải được do quá dài',attachment: (await global.nodemodule["axios"]({
url: (await global.nodemodule["axios"]('https://confusion-playful-okra.glitch.me/animemotmat')).data.url,
method: "GET",
responseType: "stream"
})).data
},event.threadID, event.messageID);
    const keywordSearch = args.join(" ");
    var path = `${__dirname}/cache/sing.mp3`
    if (fs.existsSync(path)) { 
        fs.unlinkSync(path)
    }
    if (args.join(" ").indexOf("https://") == 0) {
        try {
            var data = await downloadMusicFromYoutube(args.join(" "), path);
            var { link, author } = handleReply;
        if (handleReply.author != event.senderID) return api.sendMessage("Cút ", threadID, messageID)
            if (fs.statSync(path).size > 29214400) return api.sendMessage(' Dài Vãi Lồn Đéo Gửi Được :)', event.threadID, () => fs.unlinkSync(path), event.messageID);
            return api.sendMessage({ 
                body: `\n[ 𝙼𝚄𝚂𝙸𝙲 ]\n📝Title ${data.title}\n⏰Time ${this.convertHMS(data.dur)}\n👁️ Wiew ${data.viewCount}\n👍 Lượt thích : ${info.likes}\n📆 Ngày tải lên: ${data.uploadDate}\n📻 Channel: ${data.author} ( ${data.sub} )\n⌛ 𝚃𝚒𝚖𝚎 𝚡𝚞̛̉ 𝚕𝚒́: ${Math.floor((Date.now()- data.timestart)/1000)} 𝚐𝚒𝚊̂y\n👤 Thk gọi nhạc: ${name}`,
                attachment: fs.createReadStream(path)}, event.threadID, ()=> fs.unlinkSync(path), 
            event.messageID)
            
        }
        catch (e) { return console.log(e) }
    } else {
          try {
            var link = [],
                msg = "",
                num = 0
            const Youtube = require('youtube-search-api');
            var data = (await Youtube.GetListByKeyword(keywordSearch, false,6)).items;
            for (let value of data) {
              link.push(value.id);
              num = num+=1
              msg += (`📀${num} - ${value.title} (${value.length.simpleText})\n\n`);
            }
            var body = `»🔎 𝐂𝐨́ ${link.length} 𝐊𝐞̂́𝐭 𝐐𝐮𝐚̉ 𝐓𝐢̀𝐦 𝐊𝐢𝐞̂́𝐦 𝐂𝐮̉𝐚 𝐁𝐚̣𝐧 𝐌𝐨𝐚𝐡:\n\n${msg}📌» 𝐇𝐚̃𝐲 𝐑𝐞𝐩𝐥𝐲 𝐓𝐫𝐨𝐧𝐠 𝐍𝐡𝐮̛̃𝐧𝐠 𝐓𝐢̀𝐦 𝐊𝐢𝐞̂́𝐦 𝐂𝐮̉𝐚 𝐁𝐚̣𝐧`
            return api.sendMessage({
              body: body
            }, event.threadID, (error, info) => global.client.handleReply.push({
              type: 'reply',
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              link
            }), event.messageID);
          } catch(e) {
            return api.sendMessage('[ Lỗi ] 𝙴𝚛𝚛𝚘𝚛\n' + e, event.threadID, event.messageID);
        } // đêm qua em tuyệt lắm
    } // thần la thiên đinhhh
      } // cục xì lầu ông bê lăc