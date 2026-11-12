const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Плавное появление текста при скролле
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el) => {
  const siblings = [...el.parentElement.querySelectorAll(':scope > .reveal')];
  el.style.transitionDelay = `${siblings.indexOf(el) * 90}ms`;
  io.observe(el);
});

// Параллакс осьминога за курсором + лёгкий сдвиг при скролле
const layer = document.querySelector('.parallax');
let mx = 0, my = 0, sy = 0;
function applyParallax() {
  layer.style.transform = `translate3d(${mx * -26}px, ${my * -18 + sy}px, 0) rotate(${mx * -1.2}deg)`;
}
if (!reduceMotion && layer) {
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
    applyParallax();
  });
  window.addEventListener('scroll', () => {
    sy = Math.min(scrollY, innerHeight) * 0.25;
    applyParallax();
  }, { passive: true });
}

// Видео: на некоторых телефонах autoplay нужно «подтолкнуть»
const video = document.querySelector('.octopus');
if (video) {
  const play = () => video.play().catch(() => {});
  play();
  document.addEventListener('touchstart', play, { once: true, passive: true });
}

// Счётчики
const counter = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || '';
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1600);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counter.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));

// Активный пункт меню
const links = [...document.querySelectorAll('.panel a')];
const targets = links.map((a) => document.querySelector(a.getAttribute('href')));
window.addEventListener('scroll', () => {
  const y = scrollY + innerHeight * 0.4;
  let idx = 0;
  targets.forEach((s, i) => { if (s && s.offsetTop <= y) idx = i; });
  links.forEach((a, i) => a.classList.toggle('active', i === idx));
}, { passive: true });

// Мобильное меню
const panel = document.getElementById('panel');
const toggle = document.querySelector('.menu-toggle');
toggle.addEventListener('click', () => {
  const open = panel.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.forEach((a) => a.addEventListener('click', () => {
  panel.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Форма
document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('form-msg').textContent = 'Thank you — an expert will be in touch shortly.';
  e.target.reset();
});
