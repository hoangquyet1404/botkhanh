const axios = require('axios');
const fs = require('fs');

const isURL = u => /^http(|s):\/\//.test(u);

exports.handleEvent = async function(o) {
    try {
        const str = o.event.body;
        const send = msg => o.api.sendMessage(msg, o.event.threadID);
        const head = app => `${app.toUpperCase()} title:\n\n`;

        if (isURL(str)) {
            if (/imgur\.com/.test(str)) {
                send({
                    body: ` ===== imgur =====`,
                    attachment: await streamURL(str, str.split('.').pop())
                })
            } else if (/(^https:\/\/)((www)\.)?(pinterest|pin)*\.(com|it)\//.test(str)) {
                const res = await axios.get(`https://api.imgbb.com/1/upload?key=588779c93c7187148b4fa9b7e9815da9&image=${str}`);
                send({
                    body: `${head('pinterest')}- link: ${res.data.data.image.url}`, attachment: await streamURL(res.data.data.image.url, 'jpg')});
            } 
        }
    } catch(e) {
        console.log('Error', e);
    }
};
exports.run = () => {};
exports.config = {
    name: 'autodown5',
    version: '1',
    hasPermssion: 0,
    credits: 'Sơnkb',
    description: '',
    commandCategory: 'Tiện ích',
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