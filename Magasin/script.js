document.addEventListener('DOMContentLoaded', function () {
  // Sidebar menu toggle
  const menuBtn = document.getElementById('menuboutton');
  const sidebar = document.getElementById('menucote');
  const closeBtn = document.querySelector('.close-menu');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => sidebar.classList.add('active'));
  }
  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => sidebar.classList.remove('active'));
  }

  let sliderInterval = null;
  function initSlider() {
    const sliderContainer = document.querySelector('.slider');
    const slides = Array.from(document.querySelectorAll('.slider .slide'));
    if (slides.length) {
      let current = 0;
      slides.forEach((s, i) => { if (i === 0) s.classList.add('active'); });
      function tick() {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }
      sliderInterval = setInterval(tick, 4000);
      if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => { clearInterval(sliderInterval); sliderInterval = null; });
        sliderContainer.addEventListener('mouseleave', () => { sliderInterval = setInterval(tick, 4000); });
      }
    }
  }

  // Accessibility: allow closing sidebar with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar) sidebar.classList.remove('active');
  });

  // normPath is provided by js/utils.js (loaded before script.js on pages that need it)
  var normPath = window.normPath || function (raw) {
    if (!raw) return '';
    var p = String(raw).trim();
    if (!p) return '';
    var base = window.API_BASE || (window.location.hostname === 'localhost' 
  ? 'http://localhost:4000' 
  : 'https://projet-techweb-arw-cosmetics-backen.onrender.com');
    return base + '/images/' + encodeURIComponent(p);
  };

  // Mini search panel open/close
  const searchOpenBtn = document.getElementById('searchOpenBtn');
  const searchPanel = document.getElementById('searchPanel');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const miniSearchForm = document.getElementById('miniSearchForm');

  function openSearchPanel() {
    if (searchPanel) {
      searchPanel.classList.add('open');
      searchPanel.setAttribute('aria-hidden', 'false');
      const input = document.getElementById('miniSearchInput');
      if (input) input.focus();
    }
  }

  function closeSearchPanel() {
    if (searchPanel) {
      searchPanel.classList.remove('open');
      searchPanel.setAttribute('aria-hidden', 'true');
    }
  }

  if (searchOpenBtn) searchOpenBtn.addEventListener('click', openSearchPanel);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSearchPanel();
  });

  // Close when clicking outside inner panel
  if (searchPanel) {
    searchPanel.addEventListener('click', (e) => {
      if (e.target === searchPanel) closeSearchPanel();
    });
  }

  // Handle search form submission - redirect to products page with query
  if (miniSearchForm) {
    miniSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = document.getElementById('miniSearchInput').value.trim();

      if (searchTerm) {
        // Redirect to products.html with search query parameter
        window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
      }
    });
  }

  // ==========================================
  // PRODUCTS PAGE: Category Filter & Search
  // ==========================================
  const categoryFilters = document.querySelectorAll('.category-filter');
  const productSearchInput = document.getElementById('product-search');
  const productCards = document.querySelectorAll('.product-card');

  if (categoryFilters.length > 0 || productSearchInput) {
    // NOTE: Demo `productData` removed. Products will be loaded dynamically from backend.
    // Function to filter product DOM nodes (works when products are rendered into the DOM)
    function filterProducts() {
      const selectedCategories = Array.from(categoryFilters)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
      const searchTerm = productSearchInput ? productSearchInput.value.toLowerCase() : '';

      const cards = document.querySelectorAll('.product-card');
      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardName = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes('tous') || selectedCategories.includes(cardCategory);
        const searchMatch = searchTerm === '' || cardName.includes(searchTerm);
        card.style.display = (categoryMatch && searchMatch) ? '' : 'none';
      });
    }

    // Add event listeners to category filters
    categoryFilters.forEach(filter => {
      filter.addEventListener('change', () => {
        if (filter.value === 'tous' && filter.checked) {
          categoryFilters.forEach(f => { if (f.value !== 'tous') f.checked = false; });
        } else if (filter.value !== 'tous' && filter.checked) {
          categoryFilters.forEach(f => { if (f.value === 'tous') f.checked = false; });
        }
        filterProducts();
      });
    });

    if (productSearchInput) {
      productSearchInput.addEventListener('input', filterProducts);
    }
  }

  // -----------------------------
  // Cart helpers (localStorage)
  // -----------------------------
  function getCart() {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
  }

  function getCartCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  function updateCartBadge() {
    const cart = getCart();
    const count = getCartCount();
    // Try to update all cart badges on the page (handles both home and other pages)
    const badges = document.querySelectorAll('#cartBadge, .cart-badge');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  // Delegated add-to-cart handler for current and future product cards
  document.addEventListener('click', function (e) {
    if (e.target && e.target.matches('.btn-add-cart')) {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const id = card.getAttribute('data-id') || card.getAttribute('data-product-id') || card.querySelector('[data-id]')?.getAttribute('data-id') || null;
      const name = card.querySelector('.product-name') ? card.querySelector('.product-name').textContent.trim() : 'Produit';
      const priceText = card.querySelector('.product-price') ? card.querySelector('.product-price').textContent.trim() : null;
      const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0 : 0;
      const cart = getCart();
      const existing = id ? cart.find(i => i.id == id) : null;
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ id: id || Date.now(), name, price, quantity: 1 });
      }
      saveCart(cart);
    }
  });

  // Initialize badge on load
  updateCartBadge();

  // ==========================================
  // API INTEGRATION
  // ==========================================
  const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000/api' 
  : 'https://projet-techweb-arw-cosmetics-backen.onrender.com/api';
  let authToken = localStorage.getItem('authToken');

  // Helper: Make API request
  async function apiCall(method, endpoint, body = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (authToken) {
      options.headers.Authorization = `Bearer ${authToken}`;
    }
    if (body) options.body = JSON.stringify(body);

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, options);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'API Error');
      return data;
    } catch (err) {
      console.error(`API Error (${method} ${endpoint}):`, err.message);
      throw err;
    }
  }

  // Load single product on product.html
  async function loadProductDetail(productId) {
    try {
      const product = await apiCall('GET', `/products/${productId}`);

      // Basic fields
      document.querySelector('#product-title') && (document.querySelector('#product-title').textContent = product.name || '');
      document.querySelector('#product-subtitle') && (document.querySelector('#product-subtitle').textContent = product.category || '');
      document.querySelector('#product-price-detail') && (document.querySelector('#product-price-detail').textContent = `${parseFloat(product.price).toFixed(2)} DA`);
      document.querySelector('#product-description-text') && (document.querySelector('#product-description-text').textContent = product.description || '');

      // Render composition and benefices into lists (accept arrays or newline-separated strings)
      function renderList(selector, value) {
        const ul = document.querySelector(selector);
        if (!ul) return;
        ul.innerHTML = '';
        const items = Array.isArray(value)
          ? value
          : (value ? String(value).split(/\r?\n/).map(s => s.trim()).filter(Boolean) : []);
        if (!items.length) {
          ul.style.display = 'none';
          const header = ul.previousElementSibling;
          if (header && header.tagName === 'H3') header.style.display = 'none';
          return;
        }
        ul.style.display = '';
        const header = ul.previousElementSibling;
        if (header && header.tagName === 'H3') header.style.display = '';
        items.forEach(it => {
          const li = document.createElement('li');
          li.textContent = it;
          ul.appendChild(li);
        });
      }

      renderList('#product-composition', product.composition || product.composition);
      renderList('#product-benefits', product.benefices || product.benefits || product.benefice || product.benefices);

      const imgEl = document.querySelector('.product-detail-image');
      if (imgEl) imgEl.src = normPath(product.image1 || product.image) || imgEl.src;
    } catch (err) {
      console.error('Failed to load product:', err);
    }
  }

  // Sign up
  window.signUp = async function (email, password, prenom = '', nom = '', phone = '') {
    try {
      const result = await apiCall('POST', '/auth/signup', {
        email, password, prenom, nom, phone
      });
      authToken = result.token;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userId', result.user.id);
      return result.user;
    } catch (err) {
      throw err;
    }
  };

  // Login
  window.logIn = async function (email, password) {
    try {
      const result = await apiCall('POST', '/auth/login', { email, password });
      authToken = result.token;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userId', result.user.id);
      return result.user;
    } catch (err) {
      throw err;
    }
  };

  // Logout
  window.logOut = function () {
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('cart'); // Clear cart on logout
    window.location.href = 'login.html';
  };

  // Get current user
  window.getCurrentUser = async function () {
    try {
      return await apiCall('GET', '/auth/me');
    } catch (err) {
      return null;
    }
  };

  // Add to cart (backend). Pass productName and price when available so cart has correct totals.
  window.addToCartBackend = async function (productId, quantity = 1, productName, price) {
    try {
      if (!authToken) {
        console.warn('Not logged in, using localStorage cart');
        const cart = getCart();
        const existing = cart.find(i => String(i.id) === String(productId));
        if (existing) {
          existing.quantity += quantity;
        } else {
          cart.push({ id: productId, name: productName, price: price, quantity });
        }
        saveCart(cart);
        return;
      }
      const body = { productId, quantity };
      if (productName != null) body.productName = productName;
      if (price != null) body.price = price;
      await apiCall('POST', '/cart', body);
      updateCartBadge();
    } catch (err) {
      throw err;
    }
  };

  // Get cart
  window.getCartBackend = async function () {
    try {
      if (!authToken) return { items: [], total: 0 };
      return await apiCall('GET', '/cart');
    } catch (err) {
      return { items: [], total: 0 };
    }
  };

  // Checkout
  window.checkout = async function (shippingAddress, paymentMethod = 'COD') {
    try {
      const cart = authToken ? await getCartBackend() : { items: getCart() };
      const total = cart.items.reduce((sum, item) => sum + (item.quantity * item.priceAt), 0);

      const result = await apiCall('POST', '/orders', {
        total,
        shippingAddress,
        paymentMethod
      });

      // Clear cart after successful order
      if (authToken) {
        await apiCall('DELETE', '/cart');
      } else {
        localStorage.removeItem('cart');
      }
      updateCartBadge();

      return result;
    } catch (err) {
      throw err;
    }
  };

  // Auto-load product detail if on product page
  const productId = new URLSearchParams(window.location.search).get('id');
  if (productId && document.querySelector('[id^="product-"]')) {
    loadProductDetail(productId);
  }

  // ========== HOME: Load 3 random products per category ==========
  async function fetchProductsForCategory(category) {
    const res = await fetch(`${API_BASE}/products?category=${encodeURIComponent(category)}&limit=100`);
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    return data.items || [];
  }

  function pickRandom(arr, n) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  }

  function renderHomeSection(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    if (!products || products.length === 0) {
      container.innerHTML = '<div class="empty-message">Aucun produit trouvé</div>';
      return;
    }
    products.forEach(p => {
      const img = normPath(p.image1 || p.image) || 'https://via.placeholder.com/240x180?text=No+Image';
      const card = document.createElement('article');
      card.className = 'panier-produit';
      card.innerHTML = `
        <h3>${p.name}</h3>
        <p>Prix: ${p.price} DA</p>
        <div style="display:flex;gap:8px;align-items:center">
          <a href="product.html?id=${encodeURIComponent(p.id)}" class="btn-link">Voir détails</a>
          <button class="btn-add-cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-image="${img}">Ajouter au panier</button>
        </div>
      `;

      // Add click handler for add to cart button
      card.querySelector('.btn-add-cart').addEventListener('click', function (e) {
        e.preventDefault();
        const productId = this.getAttribute('data-id');
        const productName = this.getAttribute('data-name');
        const productPrice = this.getAttribute('data-price');
        const productImage = this.getAttribute('data-image');

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.id === productId);

        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
          });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        alert(`${productName} ajouté au panier!`);
      });

      container.appendChild(card);
    });
  }

  async function loadHomeFeatured() {
    const categories = ['Soins Visage', 'Soins Corps', 'Ongles'];
    const ids = ['home-soins-visage', 'home-soins-corps', 'home-ongles'];
    try {
      for (let i = 0; i < categories.length; i++) {
        const items = await fetchProductsForCategory(categories[i]);
        const pick = pickRandom(items, 3);
        renderHomeSection(ids[i], pick);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des produits de la page d\'accueil:', err);
      // Show error in all sections
      ids.forEach(id => {
        const c = document.getElementById(id);
        if (c) c.innerHTML = '<div class="empty-message">Erreur de chargement des produits</div>';
      });
    }
  }

  // Trigger home load if containers exist
  if (document.getElementById('home-soins-visage')) {
    loadHomeFeatured();
  }

  // Load slider products for home page (single source; matches home look with image + overlay)
  async function loadSliderProducts() {
    const sliderContainer = document.getElementById('sliderContainer');
    if (!sliderContainer) return;

    try {
   const base = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000' 
  : 'https://projet-techweb-arw-cosmetics-backen.onrender.com';
      const res = await fetch(`${base}/api/products?limit=50`);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      const allItems = data.items || [];
      const products = allItems.sort(() => Math.random() - 0.5).slice(0, 10);

      if (products.length === 0) {
        sliderContainer.innerHTML = '<div class="slide"><p>Aucun produit disponible</p></div>';
        initSlider();
        return;
      }

      sliderContainer.innerHTML = '';
      products.forEach((product, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide' + (index === 0 ? ' active' : '');
        slide.style.zIndex = products.length - index;
        const imgUrl = normPath(product.image1) || '';
        const imageHTML = imgUrl ? `<img class="slider-image" src="${imgUrl}" alt="${product.name}">` : '';
        const contentHTML = `
          <div class="slide-content">
            <h2>${product.name}</h2>
            <p>${product.category || ''}</p>
            <p class="slide-price">${product.price} DA</p>
            <a href="product.html?id=${encodeURIComponent(product.id)}" class="slide-link">Voir le produit →</a>
          </div>
        `;
        slide.innerHTML = imageHTML + contentHTML;
        sliderContainer.appendChild(slide);
      });

      initSlider();
    } catch (err) {
      console.error('Error loading slider products:', err);
      sliderContainer.innerHTML = '<div class="slide"><p>Erreur de chargement des produits</p></div>';
      initSlider();
    }
  }

  // Load slider if on home page
  if (document.getElementById('sliderContainer')) {
    loadSliderProducts();
  }

  // Background gallery (images rotate, random order, min 7s each)
  (function initBgGallery() {
    const gallery = document.querySelector('.bg-gallery');
    if (!gallery) return;
    const images = [
      'Images/img1.png',
      'Images/img2.png',
      'Images/img3.png',
      'Images/img4.png',
      'Images/img5.png'
    ];

    // shuffle images
    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }

    const slides = images.map((src) => {
      const el = document.createElement('div');
      el.className = 'bg-slide';
      el.style.backgroundImage = `url("${src}")`;
      gallery.appendChild(el);
      return el;
    });

    let idx = 0;
    if (slides.length) slides[0].classList.add('show');
    const intervalMs = 3000; // 5 seconds per image (>=7s)
    setInterval(() => {
      slides[idx].classList.remove('show');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('show');
    }, intervalMs);
  })();
});
