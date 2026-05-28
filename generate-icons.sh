#!/bin/bash
# 图标生成脚本
# 需要安装 ImageMagick: brew install imagemagick

echo "生成 PWA 图标..."

# 创建临时目录
mkdir -p temp_icons

# 基础 SVG 图标（使用简单的权力符号）
cat > temp_icons/icon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#d4af37;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f5d77a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="512" height="512" rx="96" fill="url(#bgGradient)" />
  
  <circle cx="256" cy="256" r="180" fill="none" stroke="url(#goldGradient)" stroke-width="24" />
  
  <path d="M256 180 L256 332 M180 256 L332 256" stroke="url(#goldGradient)" stroke-width="24" stroke-linecap="round" />
  
  <circle cx="256" cy="256" r="80" fill="none" stroke="url(#goldGradient)" stroke-width="16" />
  
  <circle cx="256" cy="256" r="12" fill="url(#goldGradient)" />
</svg>
EOF

# 生成各种尺寸的图标
sizes=(72 96 128 144 192 384 512)

for size in "${sizes[@]}"; do
  echo "生成 ${size}x${size} 图标..."
  convert temp_icons/icon.svg -resize ${size}x${size} "assets/icon-${size}.png"
done

# 生成 favicon
echo "生成 favicon.ico..."
convert temp_icons/icon.svg -resize 32x32 assets/favicon.ico

# 生成 Apple Touch Icon
echo "生成 apple-touch-icon.png..."
convert temp_icons/icon.svg -resize 180x180 assets/apple-touch-icon.png

# 生成 Android Chrome 图标（带 padding）
echo "生成 Android Chrome 图标..."
convert temp_icons/icon.svg -resize 192x192 \
  -background transparent -gravity center -extent 192x192 \
  assets/android-chrome-192x192.png

convert temp_icons/icon.svg -resize 512x512 \
  -background transparent -gravity center -extent 512x512 \
  assets/android-chrome-512x512.png

# 生成 manifest 图标配置
cat > assets/icons-manifest.json << 'EOF'
{
  "icons": [
    {
      "src": "icon-72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "icon-96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "icon-128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "icon-144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

# 清理临时文件
rm -rf temp_icons

echo "✅ 图标生成完成！"
echo "生成的文件："
ls -la assets/icon-*.png assets/favicon.ico assets/apple-touch-icon.png assets/android-chrome-*.png

echo ""
echo "下一步："
echo "1. 检查生成的图标质量"
echo "2. 更新 manifest.json 中的图标路径"
echo "3. 在 index.html 中添加 favicon 链接"