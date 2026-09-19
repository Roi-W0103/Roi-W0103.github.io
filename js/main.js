// 王效禹个人主页 · 通用交互脚本
// 说明：未来若要做中英双语版本，可在此文件里加一个语言切换函数，
// 配合 HTML 里已经预留的 data-i18n="key" 属性和一份 zh/en 文案表即可，
// 不需要重新设计页面结构。

// ——— 水波纹背景：鼠标移动时晕开的彩色墨水波纹 ———
// 灵感来自日本"墨流し"（suminagashi）水面拓染工艺：色环随鼠标移动晕开、缓慢扩散、淡出。
(function () {
  const canvas = document.getElementById('ink-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // 触屏 / 无精确指针的设备直接关闭，避免无意义的性能开销
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    canvas.style.display = 'none';
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  let W = window.innerWidth;
  let H = window.innerHeight;
  const BASE = [250, 247, 240]; // 与 --bg 一致的米白底色

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = `rgb(${BASE[0]},${BASE[1]},${BASE[2]})`;
    ctx.fillRect(0, 0, W, H);
  }
  window.addEventListener('resize', resize);
  resize();

  // 取自站点配色的柔和色板：鼠尾草绿、暖金、赤陶橙、雾蓝、苔绿、暖粉棕
  const palette = [
    [176, 198, 158],
    [222, 189, 140],
    [222, 168, 148],
    [178, 194, 214],
    [190, 205, 170],
    [224, 198, 176],
  ];
  let colorIdx = 0;
  const drops = [];

  function drawOrganicRing(x, y, r, seed, alpha, col, lineW) {
    if (r <= 0 || alpha <= 0.004) return;
    const pts = 72;
    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const wobble = 1
        + Math.sin(a * 2 + seed) * 0.06
        + Math.sin(a * 3 + seed * 1.7) * 0.038
        + Math.cos(a * 5 + seed * 0.9) * 0.022
        + Math.sin(a * 7 + seed * 2.3) * 0.012;
      const px = x + Math.cos(a) * r * wobble;
      const py = y + Math.sin(a) * r * wobble;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`;
    ctx.lineWidth = lineW;
    ctx.stroke();
  }

  function addDrop(x, y, idx, scale) {
    const col = palette[idx % palette.length];
    const seed = Math.random() * Math.PI * 2;
    drops.push({
      x, y, col, seed,
      r: 2,
      maxR: (60 + Math.random() * 100) * scale,
      speed: (0.5 + Math.random() * 0.75) * scale,
      alpha: 0.34 + Math.random() * 0.12,
      ringW: 1.6 + Math.random() * 1.4,
      frame: 0,
    });
  }

  let lastX = -999;
  let lastY = -999;
  window.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (dx * dx + dy * dy > 900) {
      addDrop(e.clientX, e.clientY, colorIdx, 1);
      addDrop(
        e.clientX + (Math.random() - 0.5) * 6,
        e.clientY + (Math.random() - 0.5) * 6,
        colorIdx + 1,
        0.55
      );
      colorIdx += 1;
      lastX = e.clientX;
      lastY = e.clientY;
    }
  }, { passive: true });

  const FADE_ALPHA = 0.003;
  const FADE_START_FRAME = 300;
  ctx.globalCompositeOperation = 'source-over';

  function frame() {
    ctx.fillStyle = `rgba(${BASE[0]},${BASE[1]},${BASE[2]},${FADE_ALPHA})`;
    ctx.fillRect(0, 0, W, H);

    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.frame += 1;

      let alpha = d.alpha;
      if (d.frame > FADE_START_FRAME) {
        const decay = (d.frame - FADE_START_FRAME) / 60;
        alpha = Math.max(0, d.alpha * (1 - decay));
      }

      const progress = d.r / d.maxR;
      drawOrganicRing(d.x, d.y, d.r + 2, d.seed, alpha * 0.12 * (1 - progress), d.col, d.ringW * 0.5);
      drawOrganicRing(d.x, d.y, d.r, d.seed, alpha * 0.65 * (1 - progress * 0.7), d.col, d.ringW);
      drawOrganicRing(d.x, d.y, d.r - 4, d.seed, alpha * 0.38 * (1 - progress * 0.5), d.col, d.ringW * 0.7);
      drawOrganicRing(d.x, d.y, d.r - 8, d.seed, alpha * 0.18 * (1 - progress * 0.4), d.col, d.ringW * 0.45);

      d.r += d.speed;
      if (d.r >= d.maxR || alpha <= 0.004) drops.splice(i, 1);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

document.addEventListener('DOMContentLoaded', () => {
  // 滚动淡入
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  // 卡片入场动效：整块 section 翻转 / 上浮进入视野
  // 「关于」「代表性研究」这两个最先被看到的板块用翻转，制造惊喜感；其余板块统一用上浮，避免太花哨
  const spinIds = ['about', 'spotlight'];
  const sections = document.querySelectorAll('section');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  sections.forEach((el) => {
    el.classList.add(spinIds.includes(el.id) ? 'panel-spin' : 'panel-rise');
  });
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    sections.forEach((el) => el.classList.add('in-view'));
  } else {
    const panelIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          panelIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
    sections.forEach((el) => panelIo.observe(el));
  }

  // 中国北京时间（Asia/Shanghai，天津与北京同一时区）
  const clockEl = document.querySelector('[data-cn-clock]');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      clockEl.textContent = fmt.format(now);
    };
    updateClock();
    setInterval(updateClock, 30000);
  }

  // 打字机效果（当前状态一行）
  const tw = document.querySelector('[data-typewriter]');
  if (tw) {
    tw.dataset.typewriterStarted = 'true'; // 供 i18n.js 判断：语言切换时要不要重新打字
    const full = tw.getAttribute('data-typewriter');
    tw.textContent = '';
    let i = 0;
    const type = () => {
      if (i <= full.length) {
        tw.textContent = full.slice(0, i);
        i += 1;
        setTimeout(type, 28);
      }
    };
    type();
  }
});
