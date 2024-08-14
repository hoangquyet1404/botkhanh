module.exports.config = {
  name: 'autosend',
  version: '10.02',
  hasPermssion: 0,
  credits: 'DC-Nam',
  description: 'Tự động gửi tin nhắn theo giờ đã cài!',
  commandCategory: 'admin',
  usages: '[]',
  cooldowns: 3
};
const nam = [{
  timer: '11:00:00 PM',
  message: ['Chúc mọi người Dí Nhau Vui Vẻ😴', 'Khuya rùi ngủ mẹ đi các bạn😇']
},
{
  timer: '1:00:00 PM',
  message: ['Chúc mọi người buổi chiều như lồn 🙌', 'Chúc mọi người buổi chiều đéo vui vẻ😼']
},
{
  timer: '6:00:00 AM',
  message: ['Chúc mọi người buổi sáng như lồn😉', 'Buổi sáng như lồn nhaa các bạn😙', 'Chúc mn buổi sáng đéo vui vẻ ❤️']
},
{
  timer: '12:00:00 PM',
  message: ['Chúc mọi người buổi trưa đéo vui vẻ😋', 'Chúc mọi người bữa trưa ăn đéo ngon miệng😋']
},           
    {
  timer: '11:00:00 AM',
  message: ['Chúc Các Bạn Đjt Nhau Vui Vẻ']
},               
 {
  timer: '10:00:00 AM',
  message: ['Nấu cơm nhớ bật nút nha không là ăn lồn 😙']
},          
{
  timer: '5:00:00 PM',
  message: ['Chúc mọi người buổi chiều như đầu buồi🥰']
}];
module.exports.onLoad = o => setInterval(() => {
  const r = a => a[Math.floor(Math.random()*a.length)];
  if (á = nam.find(i => i.timer == new Date(Date.now()+25200000).toLocaleString().split(/,/).pop().trim())) global.data.allThreadID.forEach(i => o.api.sendMessage(r(á.message), i));
}, 1000);
module.exports.run = o => {};