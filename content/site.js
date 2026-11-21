// 全站内容都在这个文件里改，改完重新 build 即可。
// 想加照片：把图片放进 public/photos/，把 photo.src 写成 "/photos/xxx.jpg"。
// （注意：如果站点挂在子路径下，src 要写成 `${prefix}/photos/xxx.jpg`，见 README）

export const site = {
  name: '你的名字',
  latin: 'YOUR NAME',
  role: '摄影 · 逆向工程 · 一点前端',
  tagline: '把 RAW 连拍、老游戏和小工具，折腾成能每天用的东西。',
  now: '最近在折腾：OM-1 连拍超分工作流、一堆 Windows 小工具。',

  about: [
    '白天做点工程，晚上拍点东西。喜欢能把"知道为什么"和"能跑起来"接上的活：拆格式、复现流程、把一次性的手工操作变成一键脚本。',
    '拍照主要是静物和模型，室内暗光居多；玩的最多是 RAW 处理链路 —— 从连拍、降噪到超分重建，一路看着像素怎么变好或变坏。',
  ],

  contact: [
    { label: 'GitHub', value: 'github.com/yourname', href: 'https://github.com/' },
    { label: '邮箱', value: 'you@example.com', href: 'mailto:you@example.com' },
    { label: 'Bilibili', value: 'space.bilibili.com/…', href: 'https://space.bilibili.com/' },
  ],

  projects: [
    {
      title: 'RAW 连拍超分工作流',
      year: '2026',
      desc: '用 OM-1 拍 7–14 帧连拍，跑多帧超分重建，输出线性 DNG 再进 PS 调色。踩过静止连拍、Hi-Res 误配、满阱标定缺失这些坑。',
      tags: ['摄影', 'RAW', 'WGPU'],
      href: '#',
    },
    {
      title: '插件清单跨平台复现',
      year: '2026',
      desc: '把一份 macOS 的插件清单在 Windows 上逐个复现安装，补齐缺失依赖，最后用一个验收脚本确认全部可用。',
      tags: ['Node', '安装链路'],
      href: '#',
    },
    {
      title: '老游戏存档解析',
      year: '2026',
      desc: '逆向 RPG Maker 存档的压缩与编码，写批量改道具的脚本，带自动备份和回读校验，改完在游戏里读档即生效。',
      tags: ['逆向', 'Python'],
      href: '#',
    },
  ],

  // tone 只是占位色，换成真图后改成 src
  photos: [
    { title: 'RX-78-2', meta: 'OM-1 · 60mm · ISO 200', tone: 'a' },
    { title: '台灯下的侧脸', meta: 'OM-1 · 45mm · f/1.8', tone: 'b' },
    { title: '窗框与栏杆', meta: '连拍 4 帧合成', tone: 'c' },
    { title: '桌面一角', meta: 'OM-1 · 12mm', tone: 'd' },
  ],

  posts: [
    {
      title: '多帧超分为什么在静止连拍上失效',
      date: '2026-11-20',
      summary: '帧间位移为零时，多帧信息退化成同一张图的平均：只能降噪，不能涨分辨率，还会把采样格点叠成网纹。',
      href: '#',
    },
    {
      title: '一次 GitHub Release 的分段下载与校验',
      date: '2026-11-19',
      summary: '镜像并发会返回错误页，光看文件大小会被骗；用官方 digest + zip 内部 CRC 才能定位到底坏在哪一段。',
      href: '#',
    },
    {
      title: '把 320MP 的 DNG 放进 Photoshop 之前',
      date: '2026-11-18',
      summary: '线性、未白平衡、无色调曲线 —— 直接双击预览必然灰、淡、软，先套相机配置再谈画质。',
      href: '#',
    },
  ],
};
