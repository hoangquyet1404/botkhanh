const axios = require("axios");
const fs = require("fs");

const isURL = (u) => /^http(|s):\/\//.test(u);

exports.handleEvent = async function (o) {
  try {
    const str = o.event.body;
    const send = (msg) =>
      o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
    const head = (app) =>
      ` == [ ${app.toUpperCase()} - DOWNLOAD ] == \n━━━━━━━━━━━━━━━━━━━`;
    // const head = app => '';
    if (isURL(str)) {
      if (/fb|facebook/.test(str)) {
        //const data = await fbVideo(str);
        const res = await axios.get(`https://hoanghao.me/api/facebook/download?url=${str}`);
        send({
          body: `${head('FaceBook')}\n[🍒] → Tiêu Đề: ${res.data.data.title}`, attachment: await streamURL(res.data.data.video, 'mp4')
        });
      }
      /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO TIKTOK */ 
       else if (/(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//.test(str)) {
                const json = await infoPostTT(str);
                let attachment = [];
                if (json.images != undefined) {
                    for (const $ of json.images) {
                        attachment.push(await streamURL($, 'png'));
                    }
                } else {
                    attachment = await streamURL(json.play, 'mp4');
                }
          o.api.sendMessage({body: `${head('TIKTOK')}\n[📝] → Tác giả: ${json.author.nickname}\n[📋] → Tiêu Đề: ${json.title}\n[🎶] → thả cảm xúc bất kì để tải nhạc`, attachment },o.event.threadID,(error, info) => {
    global.client.handleReaction.push({
      name: this.config.name, 
      messageID: info.messageID,
      author: o.event.senderID,
      data: json
          })
                },o.event.messageID);
                    } 
      /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO YOUTUBE */ 
      else if (/(^https:\/\/)((www)\.)?(youtube|youtu)(PP)*\.(com|be)\//.test(str)) {
                let ytdl = require('ytdl-core');

               ytdl.getInfo(str).then(async info => {
                    let detail = info.videoDetails;
                    let format = info.formats.find(f => f.qualityLabel && f.qualityLabel.includes('360p') && f.audioBitrate);
                    if (format) {
                         send({
                              body: `${head('YOUTUBER')}\n- Tiêu Đề: ${detail.title}`,
                              attachment: await streamURL(format.url, 'mp4')
                         });
                    } else {
                         console.error('Không tìm thấy định dạng phù hợp!');
                    }
            }) 
                    }

    
/*AUTODOWN DRIVE VIIDEO */
      else if (/drive|google\.com/.test(str)) {
                var res = (await axios.get(`https://api.fgmods.xyz/api/downloader/gdrive?url=${str}&apikey=vQTmzp7i`))
                  send({body: `${head('DRIVE')}\n→ Tiêu Đề: ${res.data.result.fileName}\n→ Description : ${res.data.result.fileSize}\n→ type : ${res.data.result.mimetype}\n`,attachment: await streamURL(res.data.result.downloadUrl, 'mp3','mp4')})
                }
/*AUTODOWN MEDIAFILE VIIDEO */
      else if (/www|mediafile\.com/.test(str)) {
                var res = (await axios.get(`https://api.fgmods.xyz/api/downloader/mediafire?url=${str}&apikey=vQTmzp7i`))
                  send(`${head('MEDIAFILE')}\n→ Name File: ${res.data.result.filename}\n→ Description : ${res.data.result.filesize}\n→ type : ${res.data.result.filetype}\n→upload date: ${res.data.result.upload_date}\n →Loại: ${res.data.result.ext}\n→𝗟𝗶𝗻𝗸 𝗧𝗿𝗮𝗻𝗴: ${res.data.result.url}\n→𝗟𝗶𝗻𝗸 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱:${res.data.result.url}`)
                }
      /* TỰ ĐỘNG TẢI ẢNH HOẶC NHẠC SOUNDCLOUD */ 
      else if(/soundcloud\.com/.test(str)){
        send({body: `${head("SOUNDCLOUD")}`,attachment: await streamURL(`https://api.phungtuanhai.online/soundcloud/download?link=${str}&apikey=PTH`, 'mp3')})
                  }
        /* TỰ ĐỘNG TẢI ẢNH HOẶC NHẠC SPOTIFY */ 
      else if(/spotify\.com/.test(str)){
        const url = (await axios.get(`https://api.phungtuanhai.online/spotify/download?apikey=PTH&link=${str}`)).data.audio
        send({body: `${head("SPOTIFY")}`,attachment: await streamURL(url, 'mp3')})
      }
      /* TỰ ĐỘNG TẢI NHẠC ZINGMP3 */ 
      else if(/zingmp3\.vn/.test(str)){
          send({body: `${head('ZINGMP3')}\n`,attachment: await streamURL(`https://hoanghao.me/api/zingmp3/download?link= ${str}`, 'mp3')})
        }
      /* TỰ ĐỘNG TẢI ẢNH, VIDEO TWITTER */ 
      else if (/x\.com/.test(str)) {
      const res = (await axios.get(`https://hoanghao.me/api/twitter/download?url=${str}`)); 
       let attachment = [];
                      if (data.data != null) {
      attachment = await streamURL(res.data.data.video_url,"mp4")
      } else {
      attachment = await streamURL(res.data.data.media_url, 'jpg');
                      }
      send({body: `${head("TWITTER")}\n→ Tiêu đề: ${res.data.data.text}`,attachment: attachment});
      }
      /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO PINTEREST */ 

      /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO INSTAGRAM */ 
      else if (/www|xvideos\.com/.test(str)) {
                const res = await axios.get(`https://api.fgmods.xyz/api/downloader/xvideosdl?url=${str}apikey=vQTmzp7i`);
                const data = res.data.result;
const video = res.data.result.url_dl;
const download = (await axios.get(video, {
        responseType: "stream"
    })).data;          
                send({
                    body: `${head('XVIDEOS')}\n→ Tiêu Đề: ${res.data.result.title}\n View: ${res.data.result.views}\nLike: ${res.data.result.likes}\n Size: ${res.data.result.size}`,attachment: await streamURL(res.data.result.url_dl,'mp4')
                });
            }
        }

    } catch(e) {
        console.log('Error', e);
    }
};
exports.run = () => {};
exports.handleReaction = async function (o){
  const { threadID: t, messageID: m, reaction: r } = o.event
  const { handleReaction: _ } = o
  //if (r != "👍") return; 
  o.api.sendMessage({ body: `== [ MUSIC TIKTOK ] ==\n━━━━━━━━━━━━━━━━━━━\n→ Id: ${_.data.music_info.id}\n→ Tên nhạc: ${_.data.music_info.title}\n→ Link mp3: ${_.data.music_info.play}\n→ Thời lượng: ${_.data.music_info.duration}s\n→ Âm thanh của bạn yêu cầu nè, đây là tính năng tự động tải nhạc khi bạn thả cảm xúc bất kì vào video`,attachment: await streamURL(_.data.music, "mp3")},t,m)
}
exports.config = {
    name: '1',
    version: '1',
    hasPermssion: 0,
    credits: 'Công Nam mod all Harin',
    description: '',
    commandCategory: 'Autodown',
    usages: [],
    cooldowns: 3
};

function streamURL(url, type) {
    return axios.get(url, {
        responseType: 'arraybuffer'
    }).then(res => {
        const path = __dirname + `/cache/${Date.now()}.${type}`;
        fs.writeFileSync(path, res.data);
        setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
        return fs.createReadStream(path);
    });
}

function infoPostTT(url) {
    return axios({
        method: 'post',
        url: `https://tikwm.com/api/`,
        data: {
            url
        },
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.data.data);
  }

