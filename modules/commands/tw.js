const axios = require('axios');

module.exports.config = {
    name: "searchtweets",
    version: "1.0.0",
    usePrefix: false,
    hasPermission: 0,
    credits: "ok",
    description: "Tìm kiếm tweet theo từ khóa",
    commandCategory: "Tiện ích",
    cooldowns: 0
};

module.exports.run = async ({ event, api, args }) => {
    let send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
    
  
    const keyword = args.join(" ");
    if (!keyword) {
        return send("Hãy cung cấp từ khóa để tìm kiếm tweet. Ví dụ: searchtweets <từ khóa>");
    }

 
    const BEARER_TOKEN = '';
    const url = `https://api.twitter.com/2/tweets/search/all?query=${encodeURIComponent(keyword)}`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`
            }
        });

        const tweets = response.data.data;

        if (!tweets || tweets.length === 0) {
            return send("Không tìm thấy tweet nào với từ khóa đã cung cấp.");
        }

        let message = "Kết quả tìm kiếm tweet:\n";
        tweets.forEach(tweet => {
            message += `ID: ${tweet.id}\n`;
            message += `Tweet: ${tweet.text}\n`;
            message += `Ngày: ${tweet.created_at}\n\n`;
        });

        await send(message);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        send("Có lỗi xảy ra khi gọi API.");
    }
};