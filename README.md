# 王效禹 · 个人主页

这是我的个人作品集网站，收录了硕士毕业设计和几个人机交互 / 产品相关的项目案例。纯 HTML + CSS + 少量原生 JS 写的，没有用框架也没有构建步骤，改起来快，部署到 GitHub Pages 也很省心。

## 目录结构

```
.
├── index.html                      # 主页
├── projects/
│   ├── haptic-companionship.html   # MSc 毕业设计（代表性研究）
│   ├── emotion-regulation.html     # 气动软体情绪调节装置
│   ├── lumaflex.html               # LumaFlex 智能拉伸系统
│   └── green-logistics.html        # 绿色物流服务平台
├── css/style.css                   # 全站样式（配色 / 字体变量都在文件顶部的 :root 里）
├── js/main.js                      # 滚动淡入、卡片入场动效、水波纹背景等交互
├── assets/
│   ├── resume.pdf                  # 简历，首页和详情页的「下载简历」按钮都链接到这里
│   └── img/                        # 各项目页用到的图片，按项目分了子文件夹
└── README.md
```

头像目前用的是「王」字占位图。以后想换成真人照片的话，把照片放进 `assets/profile.jpg`，再把 `index.html` 里「关于」板块的这一行：

```html
<div class="avatar"><span>王</span></div>
```

换成：

```html
<div class="avatar"><img src="assets/profile.jpg" alt="王效禹"></div>
```

## 本地预览

改完东西想看效果，直接双击 `index.html` 用浏览器打开就行。如果想要相对路径都按线上环境跑（比较接近真实效果），就在这个文件夹里起个本地服务器：

```bash
python -m http.server 8000
```

然后打开 `http://localhost:8000`。

## 背景水波纹效果

首页和各项目页背景里那个鼠标划过会晕开彩色墨水波纹的效果，灵感来自日本"墨流し"（水面拓染）工艺，是我挺喜欢的一个小细节。实现在 `js/main.js` 顶部的 `#ink-canvas` 部分，配色和淡出速度都可以调；CSS 里对应 `#ink-canvas` 以及给各板块加的 `position: relative; z-index: 1`（不加这个的话板块会被水波纹盖住）。触屏设备和开启了系统"减少动态效果"的用户会自动关闭这个效果。如果以后想换配色，改 `js/main.js` 里的 `palette` 数组就行，数组里每个颜色的三个 RGB 分量最好都保持在 140 以上，不然颜色太深会在文字上显得脏。

板块进场时的翻转 / 上浮动效也是同一套逻辑，在 `js/main.js` 里搜 `panel-spin` / `panel-rise` 能找到。

## 部署

网站部署在 GitHub Pages 上，仓库设置里 Pages 的来源选的是 `main` 分支的根目录（`/root`）。以后改完内容，正常 `git add / commit / push` 到 `main`，几分钟内线上就会自动更新，不需要额外操作。

## 以后想做的事：中英双语

现在整站只有中文（一些没有合适中文说法的专有名词保留了英文，比如 Arduino、TouchDesigner、STAI-6）。为了以后加英文版更方便，页面结构上留了一些余地：

- 每个板块都有清晰的 `id`（`#about`、`#focus`、`#spotlight`、`#projects`、`#experience`、`#contact`），内容和排版是分开的，换文案不用动样式。
- 每个页面的顶部导航都是独立的小组件，以后加个语言切换按钮不会影响整体布局。
- 打算这么实现：加一份 `js/i18n.js`，把中英文案各写成一个 JS 对象（key 保持一致），给需要翻译的元素加上 `data-i18n="key"` 属性，切换语言的时候用 JS 换文案，同时把 `<html lang="...">` 也切换一下。这样可以直接复用现在这套 HTML 结构和 CSS，不用重新排版。

## 编辑笔记

- **改文字**：直接在对应的 `.html` 文件里找中文段落改，都是普通语义化标签，没有模板引擎那一套。
- **改配色 / 字体**：改 `css/style.css` 顶部 `:root` 里的 CSS 变量就行，全站跟着联动。
- **加一个新项目**：复制 `projects/` 里任意一个文件当模板，改标题、标签、正文和数据图表，再回到 `index.html` 的「精选项目」板块加一张卡片链接过去。
