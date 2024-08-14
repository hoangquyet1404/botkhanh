module.exports.config = {
 name: "lyric",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "aideobiet, tao suộc lại ok!", //quyết hoàng
 description: "Lời bài hát from nhaccuatui",
 commandCategory: "Phương tiện",
 usages: "lyric [tên bài hát]",
 cooldowns: 5
};

module.exports.run = async ({ api, event,args }) => { 
 const axios = require('axios');
let timkiem = args.join(" ");
timkiem = encodeURIComponent(timkiem);
const res = await axios.get(`https://api.fgmods.xyz/api/other/lyrics?text=${timkiem}&apikey=vQTmzp7i`);
const data = res.data.result;
if(res.data.error) return api.sendMessage("Lỗi khi lấy bài hát", event.threadID, event.messageID);
var lyrics = data.lyrics;
var name = data.title;
var singer = data.artist;
var url = data.url;
const image = data.image;
const download = (await axios.get(image, {
        responseType: "stream"
    })).data;
return api.sendMessage({body:`Tên bài hát: ${name}\n Tên ca sĩ: ${singer}\n Link: ${url}\n≻───── •• ─────≺\n Lời bài hát:\n${lyrics} `, attachment : download} ,event.threadID, event.messageID);

}