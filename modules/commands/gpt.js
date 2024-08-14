const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
    name: "gpt",
    version: "8.8",
    hasPermission: 0,
    credits: "ex ★ machina",
    description: "ChatGPT 4.0",
    commandCategory: "noprefix",
    usages: "noprefix",
    cooldowns: 3,
};

module.exports.handleEvent = async function({ api, event }) {
    if (!(event.body.indexOf("Gpt") === 0 || event.body.indexOf("gpt") === 0)) return;
    const args = event.body.split(/\s+/);
    args.shift();
    if (args.length === 0) {
        api.sendMessage("🤖 ChatGPT 4.0 được huấn luyện bởi OpenAI.\n🔍 Để sử dụng: [Gpt / gpt] [input]\n👉 Ví dụ hãy nhắn: Gpt ý nghĩa của cuộc sống", event.threadID, event.messageID);
        return; 
    }
    try {
        api.sendMessage("🗨️ | Đang khởi tạo văn bản, vui lòng chờ ...", event.threadID, event.messageID);
        const prompt = args.join(" ");
        const response = await axios.get(`https://akhiro-rest-api.onrender.com/api/gpt4?q=${encodeURIComponent(prompt)}`);
        if (response.data && response.data.content) {
            const currentTimePH = moment().tz('Asia/Ho_Chi_Minh').format('hh:mm:ss A');
            api.sendMessage(`🎓 ℂ𝕙𝕒𝕥𝔾ℙ𝕋 𝟜.𝟘\n\n🖋️ Hỏi: '${prompt}'\n\n${response.data.content}\n\n⏰ Time: ${currentTimePH}`, event.threadID, event.messageID);
        } else {
            api.sendMessage("🔍 Đã xảy ra lỗi, vui lòng kiểm tra ChatGPT API của bạn và thử lại", event.threadID);
        }
    } catch (error) {
        api.sendMessage("🔍 Đã xảy ra lỗi kết nối với ChatGPT API.", event.threadID); 
        console.error("🚫 Lỗi phản hồi:", error);
    }
};

module.exports.run = async function({ api, event }) {};