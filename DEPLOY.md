# 职场权力人格测评 H5 项目 - 部署与使用指南

## 项目概述
一个基于SM权力关系模型的职场人格测评H5页面，通过30道趣味问题帮助用户了解自己的职场权力人格类型，生成个性化报告并支持社交分享。

## 快速开始

### 1. 本地预览
直接双击打开 `src/index.html` 即可在浏览器中运行。

### 2. 在线部署
将 `src/` 目录上传到任意静态托管服务：

**Vercel（推荐）**
```bash
npm i -g vercel
vercel --prod
```

**GitHub Pages**
1. 创建GitHub仓库
2. 上传 `src/` 目录
3. 设置 GitHub Pages 源为 `/src` 目录

**Netlify**
拖拽 `src/` 文件夹到 Netlify 部署界面

## 功能特性

### ✅ 已实现
- **120题题库池**：3个维度各40题，每次随机抽取30题
- **六种人格类型**：支配者、服从者、施压者、承压者、切换者、安全词持有者
- **精美UI设计**：深色主题+金属质感+毛玻璃效果
- **完整测评流程**：引导→测评→加载→结果→分享
- **雷达图可视化**：六维人格分布图
- **分享卡片**：精美报告卡片设计
- **响应式设计**：适配手机/平板/桌面

### 🔜 待集成
- 图片保存功能（需集成html2canvas）
- 微信分享（需微信JS-SDK）
- 数据统计（可选）

## 题库管理

### 题库结构
```
assets/questions.json
├── power (40题) - 权力偏好维度
├── stress (40题) - 压力应对维度
└── relation (40题) - 关系模式维度
```

### 添加新题目
编辑 `assets/questions.json`，在对应维度下添加：

```json
{
  "id": 121,  // 新ID
  "text": "你的题目文本",
  "options": [
    "选项1（支配者）",
    "选项2（服从者）", 
    "选项3（施压者）",
    "选项4（承压者）",
    "选项5（切换者）",
    "选项6（安全词持有者）"
  ]
}
```

**注意**：选项顺序必须严格对应6种人格类型。

### 调整抽取数量
在 `index.html` 中搜索 `slice(0, 10)`，修改数字即可调整每维度抽取题数。

## 人格类型配置

编辑 `assets/config.json` 可修改人格类型定义：

```json
"Dominant": {
  "name": "支配者",
  "tagline": "掌权者 · 天生的指挥官",
  "icon": "👑",
  "description": "会议室里，话语权自然流向你...",
  "traits": ["决策果断", "目标导向", "善于掌控"],
  "risks": ["可能忽视团队感受", "过度控制"],
  "advice": "学会授权，培养倾听能力...",
  "color": "#D4AF37"
}
```

## 自定义样式

### 修改主题色
编辑 `index.html` 中的 CSS 变量：

```css
:root {
  --bg-primary: #0a0a0f;        /* 主背景 */
  --accent-gold: #d4af37;       /* 主色调（金） */
  --accent-red: #e74c3c;        /* 强调色（红） */
  --border: #2a2a3e;            /* 边框色 */
}
```

### 修改字体
```html
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
:root {
  --font-title: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
</style>
```

## 分享功能增强

### 1. 图片保存（需html2canvas）
```html
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script>
async function saveShareImage() {
  const card = document.getElementById('share-card');
  const canvas = await html2canvas(card);
  const img = canvas.toDataURL('image/png');
  // 触发下载
  const link = document.createElement('a');
  link.download = '职场权力人格报告.png';
  link.href = img;
  link.click();
}
</script>
```

### 2. 微信分享（需公众号）
```javascript
// 引入微信JS-SDK
wx.ready(() => {
  wx.updateAppMessageShareData({
    title: '职场权力人格测评',
    desc: '测测你的职场SM属性，揭开你的权力人格',
    link: window.location.href,
    imgUrl: '分享缩略图URL'
  });
});
```

## 数据统计

### 简单统计（可选）
```javascript
// 匿名统计完成率
function trackCompletion() {
  const userId = localStorage.getItem('user_id') || Date.now();
  const duration = Date.now() - startTime;
  // 发送到统计服务
  fetch('https://your-analytics.com/track', {
    method: 'POST',
    body: JSON.stringify({ userId, duration })
  });
}
```

## 性能优化建议

1. **图片懒加载**：分享卡片中的二维码可延迟加载
2. **代码分割**：如果功能复杂，可拆分为多个JS文件
3. **缓存策略**：题库JSON可缓存到localStorage
4. **PWA支持**：添加manifest.json和Service Worker

## 常见问题

### Q: 如何修改测评题目数量？
A: 修改 `index.html` 中的 `slice(0, 10)`，三个维度都要改。

### Q: 如何添加新的人格类型？
A: 在 `config.json` 的 `personalities` 中添加新类型，并确保题库选项对应。

### Q: 分享图片不清晰？
A: html2canvas可设置scale参数提高清晰度：`html2canvas(card, { scale: 2 })`

### Q: 如何收集用户反馈？
A: 可在结果页添加评分组件，或通过问卷链接收集。

## 更新日志

### v1.0.0 (2026-05-27)
- ✅ 基础测评功能（30题随机抽取）
- ✅ 六种人格类型定义
- ✅ 完整UI设计（深色主题）
- ✅ 雷达图可视化
- ✅ 分享卡片设计
- ✅ 响应式适配

## 联系方式
如有问题或建议，请通过项目仓库提交Issue。

---

## 免责声明
本测评仅供娱乐和职场自我认知参考，不构成专业心理评估或职业建议。请勿将结果用于招聘、晋升等正式决策。