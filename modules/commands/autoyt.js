const axios = require("axios");
const fs = require("fs");
const ytdl = require('@distube/ytdl-core');
module.exports = class {
  static config = {
    name: "atdytb",
    version: "0.0.9",
    hasPremssion: 0,
    credits: "Hải harin",
    description: "Tải vd từ ytb khi phát hiện link ytb",
    commandCategory: "Tiện ích",
    usages: "",
    cooldowns: 5
  }
  static run() {}
  static check_url(url){
    return /^https:\/\//.test(url)
  }
  static async streamURL(url, type) {
    return axios.get(url, { responseType: 'arraybuffer' }).then(res => {
      const path = __dirname + `/cache/${Date.now()}.${type}`
      fs.writeFileSync(path, res.data)
      setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
      return fs.createReadStream(path)
    })
  }
  static convertHMS(value) {
    const sec = parseInt(value, 10); 
    let hours   = Math.floor(sec / 3600)
    let minutes = Math.floor((sec - (hours * 3600)) / 60); 
    let seconds = sec - (hours * 3600) - (minutes * 60); 
    if (hours   < 10) { hours   = "0" + hours }
    if (minutes < 10) { minutes = "0" + minutes }
    if (seconds < 10) { seconds = "0" + seconds }
    return (hours != '00' ? hours + ':' : '') + minutes + ':' + seconds
  }
  static handleEvent(o){
    const { threadID: t, messageID: m, body: b } = o.event
    const send = msg => o.api.sendMessage(msg, t, m)
    const head = t => `[ AUTODOWN - ${t} ]\n──────────────────`
    if(this.check_url(b)){
      if (/(^https:\/\/)((www)\.)?(youtube|youtu)(PP)*\.(com|be)\//.test(b)) {
        ytdl.getInfo(b).then(async info => {
          let detail = info.videoDetails
          let format = info.formats.find(f => f.qualityLabel && f.qualityLabel.includes('360p') && f.audioBitrate)
          if (format) {
            send({ body: `${head('YOUTUBER')}\n⩺  Tiêu Đề: ${detail.title}\n⩺ Thời lượng: ${this.convertHMS(Number(detail.lengthSeconds))}`, attachment: await this.streamURL(format.url, 'mp4') });
          } else {
            console.error('Không tìm thấy định dạng phù hợp!');
          }
        }) 
      }
    }
  }
}