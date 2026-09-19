# 王效禹 · 个人主页

纯 HTML + CSS + 少量原生 JS，没有构建步骤、没有依赖，可以直接部署到 GitHub Pages。

## 还需要你补充两样东西

- `assets/resume.pdf` —— 把你的简历 PDF 放进来并重命名为 `resume.pdf`。主页和详情页里所有「下载简历」按钮都链接到这里。
- `assets/profile.jpg`（可选）—— 你的头像照片，正方形或接近正方形效果最好（会被裁成圆形展示）。如果不放这个文件，首页会显示一个「王」字的圆形替代头像，不影响正常使用。放好照片后，把 `index.html` 里 `<!-- 01 关于 -->` 部分的这一行：
  ```html
  <div class="avatar"><span>王</span></div>
  ```
  换成：
  ```html
  <div class="avatar"><img src="assets/profile.jpg" alt="王效禹"></div>
  ```

## 目录结构

```
.
├── index.html                      # 主页
├── projects/
│   ├── haptic-companionship.html   # MSc 毕业设计（代表性研究）
│   ├── emotion-regulation.html     # 气动软体情绪调节装置
│   ├── lumaflex.html               # LumaFlex 智能拉伸系统
│   └── green-logistics.html        # 绿色物流服务平台
├── css/style.css                   # 全站样式（配色 / 字体在文件顶部的 :root 里）
├── js/main.js                      # 滚动淡入 / 打字机效果 / 英国时间
├── assets/
│   ├── resume.pdf                  # ← 你添加
│   └── profile.jpg                 # ← 你添加（可选）
└── README.md
```

## 本地预览

不需要安装任何东西，双击 `index.html` 用浏览器直接打开即可；如果想要更接近真实网站的效果（比如相对路径都正常工作），也可以在这个文件夹里起一个本地服务器：

```bash
python -m http.server 8000
```

然后打开 `http://localhost:8000`。

## 背景水波纹效果

首页和各项目页背景里那个鼠标滑过会晕开彩色墨水波纹的效果，实现在 `js/main.js` 顶部的 IIFE 里（`#ink-canvas`），css 里对应 `#ink-canvas` 和几条 `position: relative; z-index: 1;` 规则。触屏设备和开启了"减少动态效果"系统设置的用户会自动关闭这个效果。如果以后要调色，改 `js/main.js` 里的 `palette` 数组即可（数组里每个颜色的三个 RGB 分量都建议保持在 140 以上，否则颜色太深会在文字上显得脏）。

## 发布到 GitHub Pages

1. 在 GitHub 上新建一个名字**必须**是 `你的GitHub用户名.github.io` 的仓库（这样才能作为个人主页直接生效）。
2. 在这个文件夹里执行：
   ```bash
   git init
   git add .
   git commit -m "Initial personal site"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
   git push -u origin main
   ```
3. 打开仓库的 Settings → Pages，确认来源设置为 `Deploy from a branch · main · /(root)`。几分钟后网站就会在 `https://你的用户名.github.io` 上线。

## 关于后续做中英双语版本

这一版内容全部是中文（专有名词保留英文原文，比如 Arduino、TouchDesigner、STAI-6），但页面结构已经为以后加英文版预留了空间：

- 所有语义化区块都用了清晰的 `id`（`#about`、`#focus`、`#spotlight`、`#projects`、`#experience`、`#contact`），内容和排版是分离的，之后要换文案不需要动样式。
- 每个页面顶部导航都是独立、可替换的小组件，之后加一个语言切换按钮（中 / EN）不会牵动整体布局。
- 建议的实现方式：新建一份 `js/i18n.js`，把中英文案各写成一个 JS 对象（key 相同），给需要翻译的元素加上 `data-i18n="key"` 属性，切换语言时用 JS 把文案换掉、并把 `<html lang="...">` 一起切换。这样可以复用现在这一版的全部 HTML 结构和 CSS，不需要重新设计页面。

## 编辑内容

- 改文字：直接在对应的 `.html` 文件里找到中文段落改就行，都是普通语义化标签，没有用模板引擎。
- 改配色 / 字体：只需要改 `css/style.css` 顶部 `:root` 里的 CSS 变量，全站会跟着联动变化。
- 新增一个项目案例：复制 `projects/` 里任意一个文件作为模板，改标题、标签、正文和数据图表，再回到 `index.html` 的「精选项目」区块加一张卡片链接过去即可。
