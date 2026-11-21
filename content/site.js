// 全站内容都在这个文件里改。
// 照片放在 public/photos/，src 写 "/photos/xxx.jpg"；子路径部署时要带前缀（见 README）。

export const site = {
  name: '你的名字',
  latin: 'YOUR NAME',
  role: '摄影 / PHOTOGRAPHER',
  heroLine: '把光留在器物上。',
  heroPhoto: {
    src: '/photos/hero-figures.jpg',
    meta: 'OM-1 · ISO 200 · 1/10s',
  },

  aboutPhoto: {
    src: '/photos/gunpla-portrait.jpg',
    alt: '工作台上的 RX-78-2',
  },

  stats: [
    { k: '器材', v: 'OM System OM-1' },
    { k: '偏好', v: '静物 · 模型 · 微距' },
    { k: '后期', v: 'RAW 直出 · 少量调整' },
  ],

  about: [
    '拍东西的时间比说到底多。喜欢把器物放在一盏灯下，慢慢等它显出纹理 —— 塑料的反光、金属的划痕、织物的纤维，光线一旦对了，它们自己会说话。',
    '习惯用 RAW 记录，尽量少调：曝光、白平衡、一点点曲线。多帧与超分只用在真的需要放大的题材上，剩下的交给光。',
  ],

  // wide: true 的照片会占满整行（16:9），其余按 4:5 两栏排列
  works: [
    {
      src: '/photos/figures-detail.jpg',
      title: '双子',
      meta: 'OM-1 · ISO 200 · 1/10s',
      focus: 'center 30%',
    },
    {
      src: '/photos/gunpla-full.jpg',
      title: 'RX-78-2',
      meta: 'OM-1 · ISO 200 · 1/6s',
      focus: 'center center',
    },
    {
      src: '/photos/gunpla-detail.jpg',
      title: '装甲接缝',
      meta: '连拍 7 帧 · 多帧合成',
      wide: true,
      focus: 'center center',
    },
    {
      src: '/photos/macro-tall.jpg',
      title: '金色纤维',
      meta: '微距 · ISO 200',
      focus: 'center center',
    },
    {
      src: '/photos/macro-texture.jpg',
      title: '纹理',
      meta: '微距 · 侧逆光',
      focus: 'center center',
    },
    {
      src: '/photos/figures-bw.jpg',
      title: '灯下（黑白）',
      meta: 'OM-1 · 黑底布光',
      wide: true,
      focus: 'center 45%',
    },
  ],

  notes: [
    {
      title: '多帧超分为什么在静止连拍上失效',
      date: '2026-11-20',
      summary: '帧间位移为零时，多帧信息退化成同一张图的平均：只能降噪，不能涨分辨率。',
      href: '#',
    },
    {
      title: '一次 GitHub Release 的分段下载与校验',
      date: '2026-11-19',
      summary: '镜像并发会返回错误页，光看文件大小会被骗；用官方 digest 才能定位坏在哪一段。',
      href: '#',
    },
  ],

  contact: [
    { label: 'Email', value: 'you@example.com', href: 'mailto:you@example.com' },
    { label: 'GitHub', value: 'github.com/yourname', href: 'https://github.com/' },
    { label: 'Bilibili', value: 'space.bilibili.com/…', href: 'https://space.bilibili.com/' },
  ],
};

