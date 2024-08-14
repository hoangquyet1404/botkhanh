const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "c",
    version: "1.0.0", 
    role: 0,
    credit: "Vtuandz",
    info: "Hiển thị thư mục và dung lượng các file",
    commandCategory: "Quản Trị Viên", 
    usages: "showFolder [đường dẫn]", 
    cooldowns: 0
  },
  run: async function({ api, event, args }) {
    const p = args[0] || './';
    let d = [];
    let t = 0;

    try {
      const f = fs.readdirSync(p).filter(i => !i.startsWith('.')).map((n) => {
        const p2 = path.join(p, n);
        const s = fs.statSync(p2);
        if (s.isDirectory()) {
          const ts = getTotalSize(p2);
          d.push({ name: n, size: ts, isDirectory: true });
          t += ts;
        } else {
          d.push({ name: n, size: s.size, isDirectory: false });
          t += s.size;
        }
      });

      d.sort((a, b) => b.size - a.size);

      d.forEach((item, i) => {
        const size = item.isDirectory ? formatSize(item.size) : formatSize(item.size);
        const icon = item.isDirectory ? '📁' : '📄';
        d[i] = `${'  '.repeat(1)}${i + 1}. ${icon} ${item.name} - ${size}`;
      });

      const r = `Danh sách thư mục và file:\n${d.join('\n')}\n\nTổng dung lượng: ${formatSize(t)}`;
      api.sendMessage(r, event.threadID);
    } catch (e) {
      api.sendMessage(`Đã xảy ra lỗi: ${e.message}`, event.threadID);
    }
  }
};

const formatSize = (size) => {
  if (size < 1024) return `${size} B`;
  else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const getTotalSize = (dirPath) => {
  let totalSize = 0;

  const calculateSize = (filePath) => {
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      const fileNames = fs.readdirSync(filePath);
      fileNames.forEach(fileName => {
        calculateSize(path.join(filePath, fileName));
      });
    }
  };

  calculateSize(dirPath);

  return totalSize;
};