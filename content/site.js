// 全站内容都在这个文件里改。文案統一用繁體。
// 照片放在 public/photos/，src 寫 "/photos/xxx.jpg"；子路徑部署時要帶前綴（見 README）。

export const site = {
  name: 'SKYVAULT',
  latin: 'SKYVAULT',
  role: '攝影 / PHOTOGRAPHY',
  heroLine: '大多時候，都在等光。',
  heroPhoto: {
    src: '/photos/thunder/mountain-grass.jpg',
    meta: 'E-M5 · 山脊與草甸',
  },

  aboutPhoto: {
    src: '/photos/thunder/about-portrait.jpg',
    alt: '湖與雪線',
  },

  stats: [
    { k: '器材', v: 'OM System OM-1 · Olympus E-M5' },
    { k: '偏好', v: '風光 · 生態' },
    { k: '後期', v: 'RAW 直出 · 少量調整' },
  ],

  about: [
    '主要拍攝題材是風光與生態攝影。',
    '風光多在高原、沙丘與湖岸，等雲、等光、等一條山脊慢慢暗下去；生態多在水邊，白鷺、鵜鶘、枯木上停著的鳥，靠的是耐心，還有一支長焦。',
  ],

  // 分類：id 與作品裡的 cat 對應，順序就是頁面上的順序
  categories: [
    { id: 'all', label: '全部' },
    { id: 'landscape', label: '風景' },
    { id: 'bird', label: '鳥類' },
    { id: 'city', label: '城市' },
    { id: 'still', label: '靜物' },
    { id: 'night', label: '夜景' },
  ],

  // cat 決定歸類；focus 控制裁切重心；照片按自然比例排進瀑布流
  works: [
    { src: '/photos/thunder/mountain-grass.jpg', title: '山脊與草甸', meta: 'E-M5 · 午後', cat: 'landscape', focus: 'center 55%' },
    { src: '/photos/thunder/lake-snow.jpg', title: '湖與雪線', meta: 'E-M5 · 高原湖', cat: 'landscape', focus: 'center 45%' },
    { src: '/photos/thunder/clouds-peaks.jpg', title: '雲上雪峰', meta: 'E-M5 · 雲層', cat: 'landscape', focus: 'center 40%' },
    { src: '/photos/thunder/sunset-slope.jpg', title: '日落坡', meta: 'E-M5 · 逆光', cat: 'landscape', focus: 'center 50%' },
    { src: '/photos/thunder/river-terrace.jpg', title: '河谷台地', meta: 'E-M5 · 河谷', cat: 'landscape', focus: 'center 55%' },
    { src: '/photos/thunder/valley-cloud.jpg', title: '雲谷', meta: 'E-M5 · 雲海', cat: 'landscape', focus: 'center 50%' },
    { src: '/photos/thunder/green-hills.jpg', title: '綠色山丘', meta: 'E-M5 · 草原', cat: 'landscape', focus: 'center 55%' },
    { src: '/photos/thunder/valley-green.jpg', title: '山谷', meta: 'E-M5 · 牧場', cat: 'landscape', focus: 'center 60%' },
    { src: '/photos/thunder/dunes-abstract.jpg', title: '沙丘', meta: 'E-M5 · 沙脊', cat: 'landscape', focus: 'center 50%' },
    { src: '/photos/thunder/cable-car-bw.jpg', title: '纜車（黑白）', meta: 'E-M5 · 黑白', cat: 'landscape', focus: 'center 45%' },

    { src: '/photos/thunder/egret-box.jpg', title: '木箱上的白鷺', meta: 'E-M5 · 岸邊', cat: 'bird', focus: 'center 45%' },
    { src: '/photos/thunder/egret-portrait.jpg', title: '白鷺', meta: 'E-M5 · 草叢', cat: 'bird', focus: 'center 40%' },
    { src: '/photos/thunder/pelican.jpg', title: '鵜鶘', meta: 'E-M5 · 濕地', cat: 'bird', focus: 'center 40%' },
    { src: '/photos/thunder/bird-snag.jpg', title: '枯木與鳥', meta: 'E-M5 · 濕地', cat: 'bird', focus: 'center 35%' },
    { src: '/photos/thunder/heron.jpg', title: '蒼鷺', meta: 'E-M5 · 白底', cat: 'bird', focus: 'center 45%' },

    { src: '/photos/thunder/canton-tower.jpg', title: '廣州塔', meta: 'E-M5 · 月夜', cat: 'city', focus: 'center 55%' },
    { src: '/photos/thunder/star-ferry.jpg', title: '天星小輪', meta: 'E-M5 · 維港', cat: 'city', focus: 'center 55%' },
    { src: '/photos/thunder/pier-boat.jpg', title: '碼頭', meta: 'E-M5 · 維港', cat: 'city', focus: 'center 55%' },
    { src: '/photos/thunder/harbour-boat.jpg', title: '維港', meta: 'E-M5 · 午後', cat: 'city', focus: 'center 55%' },

    { src: '/photos/thunder/rose-dark.jpg', title: '黑玫瑰', meta: 'E-M5 · 黑底', cat: 'still', focus: 'center 50%' },
    { src: '/photos/thunder/star-trails.jpg', title: '星軌', meta: 'E-M5 · 長曝光', cat: 'night', focus: 'center 50%' },
  ],

  // GitHub 上的小項目：name 是倉庫名，desc 自己寫，tags 顯示在卡片底部
  projects: [
    {
      name: 'spektralab-intel',
      desc: '為 Intel Mac 打的 SpektraLab 編譯補丁 —— 自己 build，不發二進位。',
      tags: ['Shell', 'GPL-3.0', '2026'],
      href: 'https://github.com/CCFLY-flyforY/spektralab-intel',
    },
    {
      name: 'open-wallpaper-engine-mac-patched',
      desc: 'Open Wallpaper Engine 的 macOS 分支，讓 Intel Mac 也能跑：場景渲染、音頻律動條、屬性面板。',
      tags: ['Swift', 'GPL-3.0', '2026'],
      href: 'https://github.com/CCFLY-flyforY/open-wallpaper-engine-mac-patched',
    },
  ],

  // 筆記區目前在頁面上隱藏，資料保留，想恢復見 app/page.jsx 的註解
  notes: [
    {
      title: '多幀超分為什麼在靜止連拍上失效',
      date: '2026-11-20',
      summary: '幀間位移為零時，多幀資訊退化成同一張圖的平均：只能降噪，不能漲解析度。',
      href: '#',
    },
  ],

  // 第一條會顯示成頁尾的大號郵箱，其餘顯示成下面的小連結
  contact: [
    { label: 'Email', value: '2961981161@qq.com', href: 'mailto:2961981161@qq.com' },
    { label: 'GitHub', value: 'github.com/CCFLY-flyforY', href: 'https://github.com/CCFLY-flyforY' },
    { label: 'Bilibili', value: 'FLYforY07', href: 'https://space.bilibili.com/455989258' },
  ],
};
