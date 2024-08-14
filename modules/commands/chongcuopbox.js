module.exports.config = {

 name: "chongcuopbox",

 version: "1.0.0",

 credits: "D-Jukie",

 hasPermssion: 1,

 description: "Ngăn chặn việc thay đổi admin",

 usages: "chongcuopbox",

 commandCategory: "Hệ thống admin-bot",

 cooldowns: 0

};

module.exports.run = async({ api, event, Threads}) => {

    const info = await api.getThreadInfo(event.threadID);

    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 

      return api.sendMessage('[🔑]→ Quản Trị Viên Bố Đâu:)?', event.threadID, event.messageID);

    const data = (await Threads.getData(event.threadID)).data || {};

    if (typeof data["guard"] == "guard" || data["guard"] == false) data["guard"] = true;

    else data["guard"] = false;

    await Threads.setData(event.threadID, { data });

      global.data.threadData.set(parseInt(event.threadID), data);

    return api.sendMessage(`[🧪]• Đã ${(data["guard"] == true) ? "bật" : "tắt"} thành công chống cướp box\n[🔒] • Tuổi lồn cướp được box bố`, event.threadID, event.messageID);

}