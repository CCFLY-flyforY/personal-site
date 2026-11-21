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
    { k: '器材', v: 'OM System OM-1 · Olympus E-M5' },
    { k: '偏好', v: '静物 · 模型 · 微距 · 山野' },
    { k: '后期', v: 'RAW 直出 · 少量调整' },
  ],

  about: [
    '拍东西的时间比说到底多。喜欢把器物放在一盏灯下，慢慢等它显出纹理 —— 塑料的反光、金属的划痕、织物的纤维，光线一旦对了，它们自己会说话。',
    '也走远路。高原的湖、牧场的马群、云层下的林线，那些光不在我能控制的地方，只能等它来。',
  ],

  // 分类：id 与作品里的 cat 对应，顺序就是页面上的顺序
  categories: [
    { id: 'all', label: '全部' },
    { id: 'xinjiang', label: '新疆' },
    { id: 'still', label: '静物' },
    { id: 'model', label: '模型' },
    { id: 'macro', label: '微距' },
  ],

  // cat 决定归类；focus 控制裁切重心；照片按自然比例排进瀑布流
  works: [
    {
      src: '/photos/xinjiang/P1010197.jpg',
      title: '高原湖',
      meta: 'E-M5 · 湖与雪线',
      cat: 'xinjiang',
      focus: 'center 45%',
    },
    {
      src: '/photos/xinjiang/P1010406.jpg',
      title: '牧场的午后',
      meta: 'E-M5 · 草原与雪山',
      cat: 'xinjiang',
      focus: 'center 40%',
    },
    {
      src: '/photos/xinjiang/P1010473.jpg',
      title: '云谷',
      meta: 'E-M5 · 云海下的林线',
      cat: 'xinjiang',
      focus: 'center 50%',
    },
    {
      src: '/photos/xinjiang/P1010507.jpg',
      title: '河谷台地',
      meta: 'E-M5 · 河谷',
      cat: 'xinjiang',
      focus: 'center 55%',
    },
    {
      src: '/photos/xinjiang/P1010527.jpg',
      title: '雪线之上',
      meta: 'E-M5 · 云与雪峰',
      cat: 'xinjiang',
      focus: 'center 45%',
    },
    {
      src: '/photos/xinjiang/P1010798.jpg',
      title: '沙丘',
      meta: 'E-M5 · 沙脊光影',
      cat: 'xinjiang',
      focus: 'center 55%',
    },
    {
      src: '/photos/xinjiang/P1010800.jpg',
      title: '逆光',
      meta: 'E-M5 · 高原逆光',
      cat: 'xinjiang',
      focus: 'center 60%',
    },
    {
      src: '/photos/figures-detail.jpg',
      title: '双子',
      meta: 'OM-1 · ISO 200 · 1/10s',
      cat: 'still',
      focus: 'center 30%',
    },
    {
      src: '/photos/figures-bw.jpg',
      title: '灯下（黑白）',
      meta: 'OM-1 · 黑底布光',
      cat: 'still',
      focus: 'center 45%',
    },
    {
      src: '/photos/gunpla-full.jpg',
      title: 'RX-78-2',
      meta: 'OM-1 · ISO 200 · 1/6s',
      cat: 'model',
      focus: 'center center',
    },
    {
      src: '/photos/gunpla-detail.jpg',
      title: '装甲接缝',
      meta: '连拍 7 帧 · 多帧合成',
      cat: 'model',
      focus: 'center center',
    },
    {
      src: '/photos/macro-tall.jpg',
      title: '金色纤维',
      meta: '微距 · ISO 200',
      cat: 'macro',
      focus: 'center center',
    },
    {
      src: '/photos/macro-texture.jpg',
      title: '纹理',
      meta: '微距 · 侧逆光',
      cat: 'macro',
      focus: 'center center',
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
