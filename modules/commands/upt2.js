const os = require('os');
const moment = require('moment-timezone');
const fs = require('fs').promises;

module.exports.config = {
  name: "upte",
  version: "2.0.0",
  hasPermission: 0,
  credits: "N.Trung",
  Rent: 2,
  description: "Hiển thị thông tin hệ thống của bot",
  commandCategory: "Admin-Hệ Thống",
  usages: "",
  cooldowns: 5
};

async function getDependencyCount() {
    const packageJsonString = await fs.readFile('package.json', 'utf8');
    const packageJson = JSON.parse(packageJsonString);
    const depCount = Object.keys(packageJson.dependencies || {}).length;
    return { depCount };
}

function getStatusByPing(ping) {
  if (ping < 0) {
    return 'rất tốt';
  } else if (ping < 99) {
    return 'tốt';
  } else if (ping < 300) {
    return 'bình thường';
  } else {
    return 'xấu';
  }
}

module.exports.run = async ({ api, event, Threads, Users }) => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const uptime = process.uptime();
  const { depCount } = await getDependencyCount();
  let name = await Users.getNameUser(event.senderID);
  const botStatus = getStatusByPing(Date.now() - event.timestamp);

  const uptimeHours = Math.floor(uptime / (60 * 60));
  const uptimeMinutes = Math.floor((uptime % (60 * 60)) / 60);
  const uptimeSeconds = Math.floor(uptime % 60);

  const uptimeString = `${uptimeHours.toString().padStart(2, '0')}:${uptimeMinutes.toString().padStart(2, '0')}:${uptimeSeconds.toString().padStart(2, '0')}`;
  const replyMsg = `
『 𝕌ℙ𝕋𝕀𝕄𝔼 ℝ𝕆𝔹𝕆𝕋 』
▱▱▱▱▱▱▱▱▱▱▱▱▱
⏰|‣ 𝕋𝕚𝕞𝕖 𝕠𝕟𝕝 ${uptimeString}
————————————————
📥|‣ 𝕋ổ𝕟𝕘 𝕤ố 𝕡𝕒𝕔𝕜𝕒𝕘𝕖: ${depCount}
————————————————
🖥|‣ 𝕋ì𝕟𝕙 𝕥𝕣ạ𝕟𝕘: ${botStatus}
————————————————
🛠|‣ ℙ𝕚𝕟𝕘: ${Date.now() - event.timestamp}ms
————————————————
📈|‣ ℝ𝔸𝕄: ${(usedMemory / 1024 / 1024 / 1024).toFixed(2)}GB/${(totalMemory / 1024 / 1024 / 1024).toFixed(2)}GB
📊|‣ ℂℙ𝕌: ${os.cpus().length} core(s) - ${os.cpus()[0].model.trim()} @ ${os.cpus()[0].speed}MHz
⚙️|‣ ℍệ đ𝕚ề𝕦 𝕙à𝕟𝕙: ${os.type()} ${os.release()} (${os.arch()})
————————————————
👤• 𝕐ê𝕦 𝕔ầ𝕦 𝕓ở𝕚: ${name}
▱▱▱▱▱▱▱▱▱▱▱▱▱
• ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}`.trim();

  api.sendMessage({body: replyMsg,attachment: (await axios.get((await axios.get(`https://confusion-playful-okra.glitch.me/vdcosplayv2`)).data.url, {
                                     responseType: 'stream'
                                 })).data
                   }, event.threadID, event.messageID);
}