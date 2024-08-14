const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "sptf",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "Tìm kiếm và tải nhạc trên spotify",
    commandCategory: "Tiện ích",
    usages: "search",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs": ""
    }
};

module.exports.run = async function ({ api, event, args, Currencies, Users }) {
    const { threadID, senderID, messageID } = event;
    var data = await Currencies.getData(event.senderID);
    const out = (msg) => api.sendMessage(msg, threadID);

    if (!args.join(" ")) return out("Thiếu Tên Nhạc Trên Spotify");
    const search = args.join(" ");
    const attachments = [];
    const dungkon = [];

    try {
        const res = (await axios.get(`https://sptf.dungkon.net/spotify/search?keywords=${encodeURIComponent(search)}`)).data;
        const data = res;

        if (!data || data.length === 0) {
            return api.sendMessage("Không tìm thấy kết quả nào.", threadID);
        }

        for (let i = 0; i < Math.min(10, data.length); i++) {
            const video = data[i];
            const message = `ID: ${i + 1}.\n📝Tiêu đề: ${video.title}\nTác giả: ${video.author}\nKhoảng thời gian: ${video.duration}\n⊱ ⋅ ────────── ⋅ ⊰`;
            dungkon.push(message);

            if (video.thumb) {
                const thumbPath = path.join(__dirname, `cache/${i + 1}.jpg`);
                const response = await axios.get(video.thumb, { responseType: 'arraybuffer' });
                fs.writeFileSync(thumbPath, Buffer.from(response.data));
                attachments.push(fs.createReadStream(thumbPath));
            }
        }

        // Gửi tất cả thông tin và ảnh trong một lần
        api.sendMessage(
            {
                body:"[TÌM KIẾM NHẠC TRÊN SPOTIFY]\n" + dungkon.join("\n\n") + "\n\n» Hãy reply(phản hồi) chọn một trong những tìm kiếm trên",
                attachment: attachments
            },
            threadID,
            (error, info) => {
                global.client.handleReply.push({
                    name: module.exports.config.name,
                    author: senderID,
                    messageID: info.messageID,
                    result: data,
                    attachment: attachments,
                });
            }
        );
    } catch (error) {
        api.sendMessage("Lỗi: " + error.message, threadID);
        console.error("Đã xảy ra lỗi:", error); // Log ra tìm lỗi
    }
};

module.exports.handleReply = async function ({ event, api, Currencies, Users, handleReply }) {
    const { threadID, messageID, body, senderID } = event;

    // Kiểm tra xem người reply có phải là người dùng lệnh không
    if (senderID !== handleReply.author) {
        return api.sendMessage("Bạn không phải người dùng lệnh", threadID, messageID);
    }

    const choose = parseInt(body.trim());

    api.unsendMessage(handleReply.messageID);
    if (isNaN(choose)) {
        return api.sendMessage("⚠️ Vui lòng nhập 1 con số", threadID, messageID);
    }
    if (choose > handleReply.result.length || choose < 1) {
        return api.sendMessage("❎ Lựa chọn không nằm trong danh sách", threadID, messageID);
    }

    const chosenVideo = handleReply.result[choose - 1];
    api.sendMessage(`${(await Users.getData(event.senderID)).name} vui lòng đợi`, event.threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID); }, 10000)); // tự động gỡ tin nhắn sau 20 giây 

    try {
        const res = await axios.get(`https://sptf.dungkon.net/spotify/download?url=${encodeURIComponent(chosenVideo.link)}`);
        console.log(res)
        const response = res.data.metadata;
        const artists = response.artists;
        const title = response.title;
        const album = response.album;
        const time = response.releaseDate

        const videoUrl = res.data.link;

        if (!videoUrl) {
            return api.sendMessage("Không tìm thấy URL video chất lượng HD.", threadID, messageID);
        }

        // Kiểm tra dung lượng video
        const headRes = await axios.head(videoUrl);
        const contentLength = headRes.headers['content-length'];

        if (contentLength > 24 * 1024 * 1024) { // 24MB
            return api.sendMessage("Video vượt quá dung lượng 24MB và không thể tải xuống.", threadID, messageID);
        }

        const filePath = path.join(__dirname, `cache/${title.replace(/[^\w\s]/gi, '')}.mp3`);

        const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(videoResponse.data));

        api.sendMessage(
            {
                body: `[TẢI NHẠC TRÊN SPOTIFY]\nTiêu đề: ${title}\nTác giả: ${artists}\nAlbum: ${album}\nThời gian đăng: ${time}`,
                attachment: fs.createReadStream(filePath)
            },
            threadID,
            (error, info) => {
                if (error) return console.error(error);
                
                fs.unlinkSync(filePath);
            },
            messageID
        );
    } catch (error) {
        console.error("Error:", error.message);
        api.sendMessage("Đã xảy ra lỗi khi tải video.", threadID, messageID);
    }
};