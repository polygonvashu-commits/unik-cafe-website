// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  // Loading screen
  const loadingScreen = document.querySelector('.loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 800);
  });

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ===== MOBILE MENU =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
    });
  });

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== COUNTER ANIMATION =====
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';

    function update() {
      start += increment;
      if (start < target) {
        element.textContent = prefix + Math.floor(start) + suffix;
        requestAnimationFrame(update);
      } else {
        element.textContent = prefix + target + suffix;
      }
    }
    update();
  }

  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const target = parseInt(entry.target.dataset.count);
        animateCounter(entry.target, target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ===== MENU CAROUSEL =====
  const menuData = {
    all: [
      { name: 'Classic Cappuccino', desc: 'Rich espresso with steamed milk foam', price: '₹149', rating: '4.9', tag: 'Bestseller', image: 'images/coffee.png', category: 'coffee' },
      { name: 'Cold Coffee Shake', desc: 'Chilled coffee blended with ice cream', price: '₹179', rating: '4.8', tag: 'Popular', image: 'images/cold-coffee.png', category: 'beverages' },
      { name: 'Crispy Samosa', desc: 'Golden fried pastry with spiced potato filling', price: '₹49', rating: '4.7', tag: '', image: 'images/samosa.png', category: 'snacks' },
      { name: 'Gourmet Burger', desc: 'Juicy patty with cheese, lettuce & fries', price: '₹249', rating: '4.9', tag: 'Chef Special', image: 'images/burger.png', category: 'main' },
      { name: 'Paneer Butter Masala', desc: 'Creamy tomato gravy with soft paneer cubes', price: '₹219', rating: '4.8', tag: 'Must Try', image: 'images/paneer.png', category: 'main' },
      { name: 'Chocolate Brownie', desc: 'Warm brownie with vanilla ice cream & fudge', price: '₹159', rating: '4.9', tag: 'Popular', image: 'images/brownie.png', category: 'desserts' },
      { name: 'Masala Chai', desc: 'Traditional spiced tea brewed to perfection', price: '₹39', rating: '4.8', tag: '', image: 'images/coffee.png', category: 'beverages' },
      { name: 'Veg Momos', desc: 'Steamed dumplings with spicy chutney', price: '₹89', rating: '4.6', tag: '', image: 'images/samosa.png', category: 'snacks' },
      { name: 'Pasta Alfredo', desc: 'Creamy white sauce pasta with herbs', price: '₹199', rating: '4.7', tag: '', image: 'images/burger.png', category: 'main' },
      { name: 'Hazelnut Latte', desc: 'Smooth latte with hazelnut syrup', price: '₹189', rating: '4.8', tag: 'New', image: 'images/coffee.png', category: 'coffee' },
    ]
  };

  const carousel = document.querySelector('.menu-carousel');
  const catBtns = document.querySelectorAll('.menu-cat-btn');
  let currentCategory = 'all';
  let carouselPos = 0;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  function createMenuCard(item) {
    const starSvg = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    return `
      <div class="menu-card" data-category="${item.category}">
        <div class="menu-card-image">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          <div class="menu-card-overlay"></div>
          ${item.tag ? `<span class="menu-card-tag">${item.tag}</span>` : ''}
        </div>
        <div class="menu-card-body">
          <h3 class="menu-card-name">${item.name}</h3>
          <p class="menu-card-desc">${item.desc}</p>
          <div class="menu-card-footer">
            <span class="menu-card-price">${item.price}</span>
            <span class="menu-card-rating">${starSvg} ${item.rating}</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderMenu(category) {
    const items = category === 'all'
      ? menuData.all
      : menuData.all.filter(item => item.category === category);

    carousel.style.opacity = '0';
    carousel.style.transform = 'translateX(20px)';

    setTimeout(() => {
      carousel.innerHTML = items.map(createMenuCard).join('');
      carouselPos = 0;
      carousel.style.transform = 'translateX(0)';
      carousel.style.opacity = '1';
    }, 300);
  }

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderMenu(currentCategory);
    });
  });

  // Carousel drag
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carouselPos;
    carousel.style.cursor = 'grabbing';
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselPos = scrollLeft + walk;

    const maxScroll = -(carousel.scrollWidth - carousel.parentElement.offsetWidth);
    carouselPos = Math.max(maxScroll, Math.min(0, carouselPos));
    carousel.style.transform = `translateX(${carouselPos}px)`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    if (carousel) carousel.style.cursor = 'grab';
  });

  // Touch support
  carousel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollLeft = carouselPos;
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselPos = scrollLeft + walk;

    const maxScroll = -(carousel.scrollWidth - carousel.parentElement.offsetWidth);
    carouselPos = Math.max(maxScroll, Math.min(0, carouselPos));
    carousel.style.transform = `translateX(${carouselPos}px)`;
  }, { passive: true });

  carousel.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Arrow navigation
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const cardWidth = 324; // card width + gap

  prevBtn.addEventListener('click', () => {
    carouselPos = Math.min(0, carouselPos + cardWidth);
    carousel.style.transform = `translateX(${carouselPos}px)`;
  });

  nextBtn.addEventListener('click', () => {
    const maxScroll = -(carousel.scrollWidth - carousel.parentElement.offsetWidth);
    carouselPos = Math.max(maxScroll, carouselPos - cardWidth);
    carousel.style.transform = `translateX(${carouselPos}px)`;
  });

  // Initialize menu
  renderMenu('all');

  // ===== WHATSAPP WIDGET =====
  const waBtn = document.querySelector('.whatsapp-btn');
  const waPopup = document.querySelector('.whatsapp-popup');
  const waClose = document.querySelector('.whatsapp-popup-close');
  const waBadge = document.querySelector('.whatsapp-badge');
  let waOpen = false;

  // Auto-show popup after 5 seconds
  setTimeout(() => {
    if (!waOpen) {
      waPopup.classList.add('active');
      waOpen = true;
    }
  }, 5000);

  waBtn.addEventListener('click', () => {
    waOpen = !waOpen;
    waPopup.classList.toggle('active', waOpen);
    if (waBadge) waBadge.style.display = 'none';
  });

  waClose.addEventListener('click', () => {
    waOpen = false;
    waPopup.classList.remove('active');
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== DESKTOP-ONLY EFFECTS (skip on touch devices) =====
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (isDesktop) {
    // Parallax subtle on mouse move
    const heroBg = document.querySelector('.hero-bg img');
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      if (heroBg) {
        heroBg.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
      }
    });

    // Tilt effect on menu cards
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.menu-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const distX = e.clientX - cardCenterX;
        const distY = e.clientY - cardCenterY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 300) {
          const rotateX = (distY / 300) * -5;
          const rotateY = (distX / 300) * 5;
          card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
          card.style.transform = '';
        }
      });
    });

    // Magnetic button effect
    const magneticBtns = document.querySelectorAll('.btn-primary');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translateY(-3px) translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ===== CURRENT YEAR =====
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
