const fs = require('fs')
const axios = require('axios')
module.exports = class {
  static config = {
    name: "atd",
    version: "0.0.9",
    hasPermssion: 1,
    credits: "Hải harin",
    description: `Tải vd từ app fb khi phát hiện link`,
    commandCategory: "Tiện ích",
    usages: "",
    cooldowns: 5
  }
  static run() {}
  static check_url(url) {
    return /^https:\/\//.test(url)
  }
  static regext_url(type) {
    switch (type){
      case "facebook": return /^https:\/\/(?:fb\.watch|((?:www\.|m\.|web\.)?facebook.com(?:share\/|story.php|video\.php\/|videos\/|posts\/|stories\/|reel\/|groups\/|permalink.php|photo.php)?))/
    }
  }
  static async streamURL(url, type) {
    return axios.get(url, { responseType: 'arraybuffer' }).then(res => {
      const path = __dirname + `/cache/${Date.now()}.${type}`
      fs.writeFileSync(path, res.data)
      setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
      return fs.createReadStream(path)
    })
  }
  static async handleEvent(o) {
    const { threadID: t, messageID: m, body: b } = o.event
    const send = (msg, callback) => o.api.sendMessage(msg, t, callback, m)
    const head = t => `[ AUTODOWN - ${t} ]\n──────────────────`
    if(this.check_url(b)){
      if(this.regext_url("facebook").test(b)){
        const json = (await axios({
          method: "POST",
          url: `https://api.phungtuanhai.site/api/Facebook/download`, 
          data: { 
            link: b 
          },
          headers: { 
            'content-type': 'application/json' 
          } 
        })).data
        let attachment = []
         if(!json.attachments.data[0].subattachments && !json.attachments.data[0].media.source){
          attachment.push(await this.streamURL(json.attachments.data[0].media.image.src, "jpg"))
        }
        else if(json.attachments.data[0].subattachments && json.attachments.data[0].subattachments.data.length > 0){
          for(let i of json.attachments.data[0].subattachments.data){
            if(i.media.image.src && i.media.source){
              attachment.push(await this.streamURL(i.media.image.src, "jpg"))
            } else if(i.media.source && !i.media.image.src){
              attachment.push(await this.streamURL(i.media.source, "mp4"))
            } else if(i.media.image.src && !i.media.source){
              attachment.push(await this.streamURL(i.media.image.src, "jpg"))
            }
          }
        } else if(json.attachments.data[0].media.source){
          attachment = await this.streamURL(json.attachments.data[0].media.source, "mp4")
        }
        send({ body: `${head('FACEBOOK')}\n⩺  Tiêu Đề: ${json.message}`, attachment })
      }
    }
  }
}