(function () {
  var hero = document.querySelector('.hero');
  var field = document.querySelector('.bubbles');
  var seal = document.querySelector('.seal-rot');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pointer = { x: 0, y: 0 };

  // Parallax leve com o mouse (computador)
  if (hero && !reduce) {
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = hero.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      hero.style.setProperty('--mx', pointer.x.toFixed(3));
      hero.style.setProperty('--my', pointer.y.toFixed(3));
    });
    hero.addEventListener('pointerleave', function () {
      pointer.x = 0;
      pointer.y = 0;
      hero.style.setProperty('--mx', '0');
      hero.style.setProperty('--my', '0');
    });
  }

  // Selo gira conforme a rolagem
  if (hero && seal && !reduce) {
    var sealFrame = 0;
    window.addEventListener('scroll', function () {
      if (sealFrame) return;
      sealFrame = requestAnimationFrame(function () {
        sealFrame = 0;
        seal.style.transform = 'rotate(' + (-hero.getBoundingClientRect().top * 0.25).toFixed(2) + 'deg)';
      });
    }, { passive: true });
  }

  // Logo em camadas: entrada, inclinação e brilho
  var logoTilt = document.querySelector('.logo3d-tilt');
  if (hero && logoTilt && !reduce) {
    var sheen = document.getElementById('logo-sheen');
    var lg = { rx: 0, ry: 0, gx: null, gy: null, inside: false };
    var logoFrame = 0, logoVisible = true;
    hero.addEventListener('pointermove', function (e) { lg.inside = e.pointerType === 'mouse'; });
    hero.addEventListener('pointerleave', function () { lg.inside = false; });
    window.addEventListener('deviceorientation', function (e) {
      if (e.gamma == null || e.beta == null) return;
      lg.gx = Math.max(-1, Math.min(1, e.gamma / 25));
      lg.gy = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
    });
    var logoTick = function (now) {
      logoFrame = 0;
      if (!logoVisible) return;
      var t = now / 1000, ty, tx;
      if (lg.inside) { ty = pointer.x * 18; tx = -pointer.y * 12; }
      else if (lg.gx != null) { ty = lg.gx * 16; tx = -lg.gy * 12; }
      else { ty = Math.sin(t * 0.55) * 16; tx = Math.sin(t * 0.8 + 1) * 7; }
      lg.ry += (ty - lg.ry) * 0.06;
      lg.rx += (tx - lg.rx) * 0.06;
      logoTilt.style.setProperty('--ry', lg.ry.toFixed(2) + 'deg');
      logoTilt.style.setProperty('--rx', lg.rx.toFixed(2) + 'deg');
      logoTilt.style.setProperty('--fy', (Math.sin(t * 1.3) * 6).toFixed(1) + 'px');
      if (sheen) {
        sheen.setAttribute('cx', (50 - lg.ry * 1.8).toFixed(1) + '%');
        sheen.setAttribute('cy', (34 + lg.rx * 1.8).toFixed(1) + '%');
      }
      logoFrame = requestAnimationFrame(logoTick);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        logoVisible = entries[0].isIntersecting;
        if (logoVisible && !logoFrame) logoFrame = requestAnimationFrame(logoTick);
      }).observe(hero);
    }
    logoFrame = requestAnimationFrame(logoTick);

    var ease = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
    var intro = function (sel, frames, opts) {
      var el = document.querySelector(sel);
      if (el && el.animate) el.animate(frames, Object.assign({ fill: 'backwards', easing: ease }, opts));
    };
    intro('.logo3d-intro', [{ transform: 'rotateY(-100deg) scale(0.3)' }, { transform: 'rotateY(16deg) scale(1.04)', offset: 0.62 }, { transform: 'rotateY(0deg) scale(1)' }], { duration: 1300 });
    intro('.logo3d-circle', [{ transform: 'scale(0)' }, { transform: 'scale(1.06)', offset: 0.7 }, { transform: 'scale(1)' }], { duration: 700, delay: 350 });
    intro('.logo3d-pug', [{ transform: 'translateZ(0px) scale(0.4)', opacity: 0 }, { transform: 'translateZ(80px) scale(1.08)', opacity: 1, offset: 0.6 }, { transform: 'translateZ(46px) scale(1)', opacity: 1 }], { duration: 900, delay: 550 });
    intro('.logo3d-name', [{ transform: 'translateZ(0px) translateY(40px)', opacity: 0 }, { transform: 'translateZ(26px) translateY(0px)', opacity: 1 }], { duration: 700, delay: 900 });
    intro('.logo3d-tag', [{ transform: 'translateZ(10px) translateY(24px)', opacity: 0 }, { transform: 'translateZ(10px) translateY(0px)', opacity: 1 }], { duration: 700, delay: 1150 });
    Array.prototype.forEach.call(document.querySelectorAll('.spark'), function (el, i) {
      if (!el.animate) return;
      el.animate([
        { transform: 'translateZ(60px) scale(0) rotate(0deg)', opacity: 0 },
        { transform: 'translateZ(60px) scale(1) rotate(45deg)', opacity: 1, offset: 0.08 },
        { transform: 'translateZ(60px) scale(0) rotate(90deg)', opacity: 0, offset: 0.17 },
        { transform: 'translateZ(60px) scale(0) rotate(90deg)', opacity: 0 }
      ], { duration: 4200, delay: 1700 + i * 1400, iterations: Infinity, easing: 'ease-in-out', fill: 'backwards' });
    });
  }

  // Bolhas que sobem sozinhas
  if (!field) return;
  var mobile = window.matchMedia('(max-width: 899.98px)');
  var parts = [], W = 1, H = 1, frame = 0, last = 0, visible = true, sx = 0, sy = 0;

  function roll(p) {
    var n = Math.min(1, p.size / 120);
    p.speed = 12 + (1 - n) * 26 + Math.random() * 10;
    p.amp = 6 + Math.random() * 18;
    p.freq = (0.06 + Math.random() * 0.12) * Math.PI * 2;
    p.phase = Math.random() * Math.PI * 2;
    p.depth = 10 + Math.random() * 36;
    return p;
  }

  function place(p, t) {
    var x = p.x + Math.sin(t * p.freq + p.phase) * p.amp + sx * p.depth;
    var y = p.y + sy * p.depth;
    p.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    p.el.style.opacity = Math.max(0, Math.min(1, (p.y + p.size) / (H * 0.22))).toFixed(3);
  }

  function build() {
    field.textContent = '';
    W = field.clientWidth || 1;
    H = field.clientHeight || 1;
    var count = mobile.matches ? 10 : 15;
    var max = mobile.matches ? 84 : 128;
    parts = [];
    for (var i = 0; i < count; i++) {
      var size = Math.round(9 + (max - 9) * Math.pow(1 - i / (count - 1), 3.4));
      var el = document.createElement('span');
      el.className = 'bubble';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.marginLeft = (-size / 2) + 'px';
      if (size >= 24) el.appendChild(document.createElement('i'));
      field.appendChild(el);
      parts.push(roll({ el: el, size: size, x: ((i * 0.618034 + 0.11) % 1) * W, y: (0.06 + Math.random() * 0.96) * H }));
    }
    parts.forEach(function (p) { place(p, 0); });
  }

  function tick(now) {
    frame = 0;
    if (!visible) return;
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    sx += (pointer.x - sx) * 0.05;
    sy += (pointer.y - sy) * 0.05;
    var t = now / 1000;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.y -= p.speed * dt;
      if (p.y < -p.size - 24) {
        roll(p);
        p.x = Math.random() * W;
        p.y = H + p.size + Math.random() * H * 0.2;
      }
      place(p, t);
    }
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (!frame && !reduce && visible) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  build();

  if ('ResizeObserver' in window) {
    new ResizeObserver(function () {
      var nW = field.clientWidth || 1, nH = field.clientHeight || 1;
      parts.forEach(function (p) { p.x = p.x / W * nW; p.y = p.y / H * nH; });
      W = nW;
      H = nH;
      if (reduce) parts.forEach(function (p) { place(p, 0); });
    }).observe(field);
  }

  if (mobile.addEventListener) mobile.addEventListener('change', build);

  if (!reduce) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        start();
      }).observe(field);
    }
    start();
  }
})();
