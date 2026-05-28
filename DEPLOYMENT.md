# 职场权力人格测评 - 部署与维护指南

## 项目结构
```
h5/
├── src/
│   ├── index.html              # 主页面（已增强）
│   ├── admin.html              # 题库管理后台
│   ├── manifest.json           # PWA配置
│   ├── service-worker.js       # 离线缓存
│   └── assets/
│       ├── analytics.js        # 数据统计模块
│       ├── config.json         # 人格配置
│       └── questions.json      # 120题题库
├── README.md                   # 项目说明
├── DEPLOYMENT.md               # 部署指南
├── MARKETING.md                # 营销方案
└── DEV_LOG.md                  # 开发日志
```

## 🚀 快速部署

### 1. GitHub Pages（免费）
```bash
# 1. 创建GitHub仓库
git init
git add .
git commit -m "初始提交"
git branch -M main
git remote add origin https://github.com/你的用户名/wpr-h5.git
git push -u origin main

# 2. 开启GitHub Pages
# 设置 → Pages → Source: main branch → /src
```

### 2. Vercel（推荐）
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 部署
vercel
# 或直接访问 vercel.com 拖拽上传
```

### 3. Netlify
```bash
# 1. 安装Netlify CLI
npm i -g netlify-cli

# 2. 部署
netlify deploy --prod
```

## 🔧 环境配置

### PWA配置
- 需要生成图标：72x72, 96x96, 128x128, 144x144, 192x192, 384x384, 512x512
- 使用工具：https://realfavicongenerator.net/

### 微信分享配置（需要公众号）
```javascript
wx.config({
    debug: false,
    appId: '你的AppID',
    timestamp: 时间戳,
    nonceStr: '随机字符串',
    signature: '签名',
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
});
```

## 📊 数据统计

### 本地统计（默认）
- 使用 `localStorage` 存储匿名数据
- 可查看管理后台 `/admin.html`
- 数据包括：测评完成数、分享次数、人格分布等

### 云端统计（可选）
1. 注册 Google Analytics 或 Umami
2. 在 `index.html` 头部添加跟踪代码
3. 配置 `analytics.js` 发送数据

## 🛡️ 安全与隐私

### 数据保护
- 所有数据本地存储，不上传服务器
- 用户ID随机生成，不收集个人信息
- 可随时通过管理后台重置统计数据

### 合规性
- 符合GDPR（仅本地存储）
- 无第三方跟踪（除非配置）
- 用户可清除所有数据

## 🔄 更新维护

### 题库更新
1. 访问 `/admin.html`
2. 编辑题目或添加新题
3. 点击"保存"自动生效

### 人格配置更新
1. 编辑 `src/assets/config.json`
2. 或通过管理后台修改

### 版本更新
```bash
# 1. 修改版本号
# 2. 更新 service-worker.js 中的 CACHE_NAME
# 3. 部署新版本
```

## 📱 移动端优化

### iOS Safari
- 已配置 `apple-mobile-web-app-capable`
- 支持添加到主屏幕
- 全屏模式体验

### 微信内
- 检测微信环境
- 优化分享提示
- 支持图片保存

## 🚨 故障排除

### 常见问题
1. **图片保存失败** → 检查 html2canvas CDN
2. **PWA不工作** → 确保 HTTPS 和正确的 manifest
3. **数据丢失** → 检查 localStorage 权限
4. **分享失败** → 微信环境需要公众号配置

### 调试工具
- Chrome DevTools: Application → Storage
- Safari: Develop → Web Inspector
- 微信开发者工具

## 📈 性能优化

### 已实现
- 代码压缩（Tailwind CDN）
- 图片懒加载
- Service Worker 缓存
- 按需加载

### 待优化
- 图片压缩（使用 WebP）
- 代码分割（如果使用框架）
- 字体优化

## 🔗 相关链接

- [Tailwind CSS](https://tailwindcss.com)
- [html2canvas](https://html2canvas.hertzen.com)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [微信JS-SDK](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)

## 📝 更新日志

### v1.2 (2026-05-28)
- ✅ 集成 html2canvas 图片保存
- ✅ 添加数据统计模块
- ✅ 创建题库管理后台
- ✅ 添加 PWA 支持
- ✅ 优化移动端体验

### v1.1 (2026-05-27)
- ✅ 基础测评功能
- ✅ 120题题库
- ✅ 六种人格类型
- ✅ 响应式设计

### v1.0 (2026-05-27)
- ✅ 项目初始化
- ✅ 需求分析与设计