// 全站内容都在这个文件里改。
// 照片放在 public/photos/，src 写 "/photos/xxx.jpg"；子路径部署时要带前缀（见 README）。

export const site = {
  name: '你的名字',
  latin: 'YOUR NAME',
  role: '摄影 / PHOTOGRAPHER',
  heroLine: '等光来，也走进光里。',
  heroPhoto: {
    src: '/photos/xinjiang/hero-dunes.jpg',
    meta: 'E-M5 · 沙脊光影',
  },

  aboutPhoto: {
    src: '/photos/xinjiang/about-horses.jpg',
    alt: '牧场上的马群',
  },

  stats: [
    { k: '器材', v: 'Olympus E-M5 · OM System OM-1' },
    { k: '偏好', v: '山野 · 光影 · 微距' },
    { k: '后期', v: 'RAW 直出 · 少量调整' },
  ],

  about: [
    '拍得最多的还是等光。一条山谷的云、一片沙脊的阴影，太阳挪一寸，画面就换一次；能做的只是早点到位，然后在原地待着。',
    '也拍近处。微距里的纤维和纹理，得把光贴上去才看得见 —— 和等大风景其实是一回事，只是尺度不同。',
  ],

  // 分类：id 与作品里的 cat 对应，顺序就是页面上的顺序
  categories: [
    { id: 'all', label: '全部' },
    { id: 'xinjiang', label: '新疆' },
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
      src: '/photos/macro-tall.jpg',
      title: '金色纤维',
      meta: '微距 · 侧光',
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
