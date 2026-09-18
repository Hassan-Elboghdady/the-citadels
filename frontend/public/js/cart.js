// ─────────────────────────────────────────────────────
//  CART — localStorage-based shopping cart
// ─────────────────────────────────────────────────────

const Cart = {
  KEY: 'citadels_cart',

  get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch { return []; }
  },

  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  add(product, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        qty: qty
      });
    }
    this.save(items);
    this.showNotification(product.name);
  },

  updateQty(id, qty) {
    const items = this.get();
    const item = items.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, Math.min(99, qty));
      this.save(items);
    }
  },

  remove(id) {
    const items = this.get().filter(i => i.id !== id);
    this.save(items);
  },

  clear() {
    this.save([]);
  },

  getTotal() {
    return this.get().reduce((sum, i) => sum + (i.price * i.qty), 0);
  },

  getCount() {
    return this.get().reduce((sum, i) => sum + i.qty, 0);
  },

  updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getCount();
    badges.forEach(badge => {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = '';
      } else {
        badge.style.display = 'none';
      }
    });
  },

  showNotification(name) {
    // Remove any existing notification
    const old = document.querySelector('.cart-toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M7 10l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>${name} added to cart</span>
      <a href="/cart" class="cart-toast__link">View Cart</a>
    `;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => toast.classList.add('cart-toast--visible'));

    // Auto-remove after 3s
    setTimeout(() => {
      toast.classList.remove('cart-toast--visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// ─── Add to Cart buttons (collections + product detail) ───

document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = {
      id: btn.dataset.productId,
      name: btn.dataset.productName,
      price: btn.dataset.productPrice,
      image: btn.dataset.productImage
    };
    // Check for quantity input (product detail page)
    const qtyInput = document.getElementById('qty-input');
    const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
    Cart.add(product, qty);
  });
});

// ─── Quantity controls on product detail ───

const qtyMinus = document.getElementById('qty-minus');
const qtyPlus = document.getElementById('qty-plus');
const qtyInput = document.getElementById('qty-input');

if (qtyMinus && qtyPlus && qtyInput) {
  qtyMinus.addEventListener('click', () => {
    const val = parseInt(qtyInput.value, 10) || 1;
    qtyInput.value = Math.max(1, val - 1);
  });
  qtyPlus.addEventListener('click', () => {
    const val = parseInt(qtyInput.value, 10) || 1;
    qtyInput.value = Math.min(99, val + 1);
  });
}

// ─── Category filter tabs (collections page) ───

const tabs = document.querySelectorAll('.coll-filter__tab');
const cards = document.querySelectorAll('.product-card[data-category]');

if (tabs.length > 0 && cards.length > 0) {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.category;

      // Update active tab
      tabs.forEach(t => {
        t.classList.remove('coll-filter__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('coll-filter__tab--active');
      tab.setAttribute('aria-selected', 'true');

      // Filter cards
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Check URL query for initial category
  const params = new URLSearchParams(window.location.search);
  const initCat = params.get('category');
  if (initCat) {
    const matchTab = document.querySelector(`.coll-filter__tab[data-category="${initCat}"]`);
    if (matchTab) matchTab.click();
  }
}

// ─── Cart page rendering ───

function renderCartPage() {
  const cartEmpty = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');
  const cartItemsEl = document.getElementById('cart-items');

  if (!cartEmpty || !cartContent || !cartItemsEl) return;

  const items = Cart.get();

  if (items.length === 0) {
    cartEmpty.style.display = '';
    cartContent.style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  cartContent.style.display = '';

  cartItemsEl.innerHTML = items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item__img">
      <div class="cart-item__info">
        <h3 class="cart-item__name">${item.name}</h3>
        <p class="cart-item__unit-price">${Number(item.price).toLocaleString()} EGP each</p>
      </div>
      <div class="cart-item__qty">
        <button type="button" class="qty-btn cart-qty-minus" aria-label="Decrease">-</button>
        <input type="number" class="qty-input cart-qty-input" value="${item.qty}" min="1" max="99" aria-label="Quantity for ${item.name}">
        <button type="button" class="qty-btn cart-qty-plus" aria-label="Increase">+</button>
      </div>
      <p class="cart-item__total">${(item.price * item.qty).toLocaleString()} EGP</p>
      <button type="button" class="cart-item__remove" aria-label="Remove ${item.name}">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 6h12M8 6V4h4v2M6 6v10h8V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  `).join('');

  // Update totals
  updateCartTotals();

  // Bind cart item events
  cartItemsEl.querySelectorAll('.cart-item').forEach(row => {
    const id = row.dataset.id;
    const input = row.querySelector('.cart-qty-input');

    row.querySelector('.cart-qty-minus').addEventListener('click', () => {
      const val = parseInt(input.value, 10) || 1;
      input.value = Math.max(1, val - 1);
      Cart.updateQty(id, parseInt(input.value, 10));
      renderCartPage();
    });

    row.querySelector('.cart-qty-plus').addEventListener('click', () => {
      const val = parseInt(input.value, 10) || 1;
      input.value = Math.min(99, val + 1);
      Cart.updateQty(id, parseInt(input.value, 10));
      renderCartPage();
    });

    input.addEventListener('change', () => {
      Cart.updateQty(id, parseInt(input.value, 10) || 1);
      renderCartPage();
    });

    row.querySelector('.cart-item__remove').addEventListener('click', () => {
      Cart.remove(id);
      renderCartPage();
    });
  });
}

function updateCartTotals() {
  const total = Cart.getTotal();
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  if (subtotalEl) subtotalEl.textContent = total.toLocaleString() + ' EGP';
  if (totalEl) totalEl.textContent = total.toLocaleString() + ' EGP';
}

// Init
Cart.updateBadge();
renderCartPage();
