// 全站内容都在这个文件里改。
// 照片放在 public/photos/，src 写 "/photos/xxx.jpg"；子路径部署时要带前缀（见 README）。

export const site = {
  name: '你的名字',
  latin: 'YOUR NAME',
  role: '摄影 / PHOTOGRAPHER',
  heroLine: '大多数时候在等光。',
  heroPhoto: {
    src: '/photos/thunder/mountain-grass.jpg',
    meta: 'E-M5 · 山脊与草甸',
  },

  aboutPhoto: {
    src: '/photos/thunder/about-portrait.jpg',
    alt: '湖与雪线',
  },

  stats: [
    { k: '器材', v: 'OM System OM-1 · Olympus E-M5' },
    { k: '偏好', v: '风景 · 鸟类 · 城市' },
    { k: '后期', v: 'RAW 直出 · 少量调整' },
  ],

  about: [
    '多数时候在等光。山脊上的云影、湖面那一线亮、傍晚沙丘的边缘 —— 能做的只是早点到，然后站着等。',
    '也拍近的：水边的鸟、靠岸的船、一朵在黑底上开着的花。',
  ],

  // 分类：id 与作品里的 cat 对应，顺序就是页面上的顺序
  categories: [
    { id: 'all', label: '全部' },
    { id: 'landscape', label: '风景' },
    { id: 'bird', label: '鸟类' },
    { id: 'city', label: '城市' },
    { id: 'still', label: '静物' },
    { id: 'night', label: '夜景' },
  ],

  // cat 决定归类；focus 控制裁切重心；照片按自然比例排进瀑布流
  works: [
    { src: '/photos/thunder/mountain-grass.jpg', title: '山脊与草甸', meta: 'E-M5 · 午后', cat: 'landscape', focus: 'center 55%' },
    { src: '/photos/thunder/lake-snow.jpg', title: '湖与雪线', meta: 'E-M5 · 高原湖', cat: 'landscape', focus: 'center 45%' },
    { src: '/photos/thunder/clouds-peaks.jpg', title: '云上雪峰', meta: 'E-M5 · 云层', cat: 'landscape', focus: 'center 40%' },
    { src: '/photos/thunder/sunset-slope.jpg', title: '日落坡', meta: 'E-M5 · 逆光', cat: 'landscape', focus: 'center 50%' },
    { src: '/photos/thunder/river-terrace.jpg', title: '河谷台地', meta: 'E-M5 · 河谷', cat: 'landscape', focus: 'center 55%' },
    { src: '/photos/thunder/valley-cloud.jpg', title: '云谷', meta: 'E-M5 · 云海', cat: 'landscape', focus: 'center 50%' },
    { src: '/photos/thunder/green-hills.jpg', title: '绿色山丘', meta: 'E-M5 · 草原', cat: 'landscape', focus: 'center 55%' },
    { src: '/photos/thunder/valley-green.jpg', title: '山谷', meta: 'E-M5 · 牧场', cat: 'landscape', focus: 'center 60%' },
    { src: '/photos/thunder/dunes-abstract.jpg', title: '沙丘', meta: 'E-M5 · 沙脊', cat: 'landscape', focus: 'center 50%' },
    { src: '/photos/thunder/cable-car-bw.jpg', title: '缆车（黑白）', meta: 'E-M5 · 黑白', cat: 'landscape', focus: 'center 45%' },

    { src: '/photos/thunder/egret-box.jpg', title: '木箱上的白鹭', meta: 'E-M5 · 岸边', cat: 'bird', focus: 'center 45%' },
    { src: '/photos/thunder/egret-portrait.jpg', title: '白鹭', meta: 'E-M5 · 草丛', cat: 'bird', focus: 'center 40%' },
    { src: '/photos/thunder/pelican.jpg', title: '鹈鹕', meta: 'E-M5 · 湿地', cat: 'bird', focus: 'center 40%' },
    { src: '/photos/thunder/bird-snag.jpg', title: '枯木与鸟', meta: 'E-M5 · 湿地', cat: 'bird', focus: 'center 35%' },
    { src: '/photos/thunder/heron.jpg', title: '苍鹭', meta: 'E-M5 · 白底', cat: 'bird', focus: 'center 45%' },

    { src: '/photos/thunder/canton-tower.jpg', title: '广州塔', meta: 'E-M5 · 月夜', cat: 'city', focus: 'center 55%' },
    { src: '/photos/thunder/star-ferry.jpg', title: '天星小轮', meta: 'E-M5 · 维港', cat: 'city', focus: 'center 55%' },
    { src: '/photos/thunder/pier-boat.jpg', title: '码头', meta: 'E-M5 · 维港', cat: 'city', focus: 'center 55%' },
    { src: '/photos/thunder/harbour-boat.jpg', title: '维港', meta: 'E-M5 · 午后', cat: 'city', focus: 'center 55%' },

    { src: '/photos/thunder/rose-dark.jpg', title: '黑玫瑰', meta: 'E-M5 · 黑底', cat: 'still', focus: 'center 50%' },
    { src: '/photos/thunder/star-trails.jpg', title: '星轨', meta: 'E-M5 · 长曝光', cat: 'night', focus: 'center 50%' },
  ],

  notes: [
    {
      title: '多帧超分为什么在静止连拍上失效',
      date: '2026-11-20',
      summary: '帧间位移为零时，多帧信息退化成同一张图的平均：只能降噪，不能涨分辨率。',
      href: '#',
    },
  ],

  contact: [
    { label: 'Email', value: 'you@example.com', href: 'mailto:you@example.com' },
    { label: 'GitHub', value: 'github.com/yourname', href: 'https://github.com/' },
    { label: 'Bilibili', value: 'space.bilibili.com/…', href: 'https://space.bilibili.com/' },
  ],
};
