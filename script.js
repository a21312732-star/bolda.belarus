// Появление блоков при прокрутке
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  io.observe(el);
});

// Глаза осьминога следят за курсором
const svg = document.querySelector('.octo');
const eyes = [...document.querySelectorAll('.eye')];
function look(clientX, clientY) {
  if (!svg) return;
  const r = svg.getBoundingClientRect();
  const scale = r.width / 400;
  eyes.forEach((eye) => {
    const cx = r.left + eye.dataset.cx * scale;
    const cy = r.top + eye.dataset.cy * scale;
    const a = Math.atan2(clientY - cy, clientX - cx);
    const d = Math.min(9, Math.hypot(clientX - cx, clientY - cy) / 25);
    eye.querySelector('.pupil').style.transform =
      `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px)`;
  });
}
window.addEventListener('pointermove', (e) => look(e.clientX, e.clientY));

// Счётчики
const counter = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / 1400);
      const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString('ru-RU') + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    counter.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));

// Подсветка активного пункта бокового меню
const links = [...document.querySelectorAll('.side a')];
const sections = links
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);
window.addEventListener('scroll', () => {
  const y = window.scrollY + window.innerHeight / 3;
  let current = sections[0];
  sections.forEach((s) => { if (s.offsetTop <= y) current = s; });
  links.forEach((a) =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
}, { passive: true });

// Мобильное меню
const nav = document.querySelector('.nav');
const burger = document.querySelector('.burger');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('.nav-links a').forEach((a) =>
  a.addEventListener('click', () => nav.classList.remove('open')));

// Форма
document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('form-msg');
  msg.textContent = 'Готово! 🐙 Мы пришлём доступ на вашу почту.';
  e.target.reset();
});
