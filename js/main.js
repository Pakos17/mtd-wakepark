// ============================================
// MTD WAKE PARK — Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. NAVIGATION MOBILE
  // ============================================
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = mobileMenu?.querySelectorAll('a');

  function toggleMobileMenu() {
    document.body.classList.toggle('menu-open');
    mobileMenu?.classList.toggle('open');
  }

  function closeMobileMenu() {
    document.body.classList.remove('menu-open');
    mobileMenu?.classList.remove('open');
  }

  hamburger?.addEventListener('click', toggleMobileMenu);

  mobileLinks?.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeLightbox();
    }
  });

  // ============================================
  // 2. HEADER SHRINK AU SCROLL
  // ============================================
  const mainHeader = document.querySelector('.main-header');
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      mainHeader?.classList.add('header--scrolled');
    } else {
      mainHeader?.classList.remove('header--scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ============================================
  // 3. BANDEAU INFO HIDE/SHOW
  // ============================================
  const topBar = document.querySelector('.top-bar');
  let prevScrollY = 0;

  function handleTopBar() {
    const scrollY = window.scrollY;

    if (scrollY > prevScrollY && scrollY > 100) {
      topBar?.classList.add('hidden');
    } else {
      topBar?.classList.remove('hidden');
    }

    prevScrollY = scrollY;
  }

  window.addEventListener('scroll', handleTopBar, { passive: true });

  // ============================================
  // 4. SMOOTH SCROLL POUR ANCRES
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = mainHeader?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // 5. NAVIGATION ACTIVE STATE
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  // ============================================
  // 6. ANIMATIONS AU SCROLL
  // ============================================
  const animatedElements = document.querySelectorAll('[data-animate]');

  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('animate-in');
        }, delay * 1000);
        animateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => animateObserver.observe(el));

  // ============================================
  // 7. CARROUSEL ÉVÉNEMENTS
  // ============================================
  const carousel = document.querySelector('.events-carousel');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');

  function updateCarouselButtons() {
    if (!carousel) return;
    const { scrollLeft, scrollWidth, clientWidth } = carousel;
    prevBtn?.classList.toggle('hidden', scrollLeft <= 10);
    nextBtn?.classList.toggle('hidden', scrollLeft >= scrollWidth - clientWidth - 10);
  }

  prevBtn?.addEventListener('click', () => {
    carousel?.scrollBy({ left: -320, behavior: 'smooth' });
  });

  nextBtn?.addEventListener('click', () => {
    carousel?.scrollBy({ left: 320, behavior: 'smooth' });
  });

  carousel?.addEventListener('scroll', updateCarouselButtons, { passive: true });
  updateCarouselButtons();

  // ============================================
  // 8. LIGHTBOX GALERIE
  // ============================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let currentImageIndex = 0;
  const galleryImages = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) galleryImages.push(img.src);

    item.addEventListener('click', () => {
      currentImageIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = galleryImages[currentImageIndex];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    if (lightboxImg) lightboxImg.src = galleryImages[currentImageIndex];
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    if (lightboxImg) lightboxImg.src = galleryImages[currentImageIndex];
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', prevImage);
  lightboxNext?.addEventListener('click', nextImage);

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // ============================================
  // 9. FAQ ACCORDÉON
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ============================================
  // 10. FORMULAIRE DE CONTACT
  // ============================================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('.btn-submit');

    try {
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        contactForm.reset();
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.hidden = false;
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      submitBtn.textContent = 'Erreur — Réessayer';
      submitBtn.disabled = false;
      console.error('Form error:', error);
    }
  });

});
