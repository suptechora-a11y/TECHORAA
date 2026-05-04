/* ===== TECHORA SHOPIFY THEME — techora.js ===== */

// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
if (cursor && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx - 6 + 'px';
    cursor.style.top = my - 6 + 'px';
  });
  setInterval(() => {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx - 18 + 'px';
    ring.style.top = ry - 18 + 'px';
  }, 16);
}

// Toast notification
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// Counter animation (hero stats)
function animCount(el, target, suffix, dur) {
  if (!el) return;
  let start = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString() + suffix;
    if (start >= target) clearInterval(timer);
  }, dur / 60);
}
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    animCount(document.getElementById('stat-products'), 500, '+', 1400);
    animCount(document.getElementById('stat-customers'), 12000, '+', 1600);
    animCount(document.getElementById('stat-satisfaction'), 98, '%', 1200);
  }, 600);
});

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Cart count badge
function updateCartBadge() {
  const btn = document.querySelector('.cart-btn');
  if (!btn) return;
  fetch('/cart.js')
    .then(r => r.json())
    .then(data => { btn.innerHTML = '🛒 Cart (' + data.item_count + ')'; })
    .catch(() => {});
}

// Add to cart (AJAX)
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('add-to-cart-btn') || e.target.classList.contains('add-btn')) {
    const form = e.target.closest('form[data-product-form]');
    if (form) {
      e.preventDefault();
      const formData = new FormData(form);
      fetch('/cart/add.js', { method: 'POST', body: formData })
        .then(r => r.json())
        .then(item => {
          showToast('✅ ' + item.title + ' added to cart!');
          updateCartBadge();
        })
        .catch(() => showToast('⚠️ Could not add to cart.'));
    }
  }
});

// Newsletter subscribe (Shopify Customer form handled server-side)
const subBtn = document.getElementById('subscribe-btn');
if (subBtn) {
  subBtn.addEventListener('click', () => {
    const val = document.getElementById('newsletter-email').value;
    if (val && val.includes('@')) {
      showToast('🎉 Subscribed! Check your inbox.');
    } else {
      showToast('⚠️ Please enter a valid email.');
    }
  });
}

// Qty selector on product page
const qtyInput = document.getElementById('qty');
document.querySelectorAll('.qty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!qtyInput) return;
    let v = parseInt(qtyInput.value) || 1;
    if (btn.dataset.action === 'plus') v++;
    if (btn.dataset.action === 'minus') v = Math.max(1, v - 1);
    qtyInput.value = v;
  });
});
