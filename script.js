// ============================================================
// XTRA TIME HERBS - MAIN INTERACTIVE SCRIPT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. GLOBAL PHONE NUMBER CONFIGURATION ---
  // Aap yaha apna phone number change kar sakte hain, puri website par automatically update ho jayega!
  const PHONE_NUMBER = "07313131313";          // Dialing number (bina space ke)
  const PHONE_DISPLAY = "07 31 31 31 31 3";    // Header me display hone wala format

  // Sync phone number across all call links & badges
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.setAttribute('href', `tel:${PHONE_NUMBER}`);
  });

  const headerPhoneBadge = document.querySelector('.top-header-phone-badge');
  if (headerPhoneBadge && headerPhoneBadge.textContent.includes('xx')) {
    headerPhoneBadge.textContent = PHONE_DISPLAY;
  }

  // --- 2. EXPERT VIEWS CAROUSEL LOGIC ---
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');
  const carouselContainer = document.querySelector('.carousel-container');

  let currentIndex = 0;
  let autoSlideInterval = null;

  function updateCarousel(index) {
    if (!slides.length) return;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    if (track) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCarousel(currentIndex - 1);
      resetAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCarousel(currentIndex + 1);
      resetAutoSlide();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCarousel(i);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      updateCarousel(currentIndex + 1);
    }, 4500);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Pause carousel on hover
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);

    // Touch Swipe Support for Mobile
    let startX = 0;
    let endX = 0;

    carouselContainer.addEventListener('touchstart', e => {
      startX = e.changedTouches[0].screenX;
      stopAutoSlide();
    }, { passive: true });

    carouselContainer.addEventListener('touchend', e => {
      endX = e.changedTouches[0].screenX;
      const diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          updateCarousel(currentIndex + 1);
        } else {
          updateCarousel(currentIndex - 1);
        }
      }
      startAutoSlide();
    }, { passive: true });
  }

  startAutoSlide();

  // --- 3. VIDEO LIGHTBOX / MODAL LOGIC ---
  const modal = document.getElementById('videoModal');
  const modalPlayer = document.getElementById('modalVideoPlayer');
  const closeBtn = document.getElementById('modalCloseBtn');
  const videoCards = document.querySelectorAll('.video-card');

  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const videoUrl = card.getAttribute('data-video');
      if (videoUrl && modal && modalPlayer) {
        stopAutoSlide();
        modalPlayer.src = videoUrl;
        modal.classList.add('active');
        modalPlayer.currentTime = 0;
        const playPromise = modalPlayer.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log('Autoplay requires user interaction:', err);
          });
        }
      }
    });
  });

  function closeModal() {
    if (modal && modalPlayer) {
      modal.classList.remove('active');
      modalPlayer.pause();
      modalPlayer.removeAttribute('src');
      modalPlayer.load();
      startAutoSlide();
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // --- 4. FAQ ACCORDION LOGIC ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all other active items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.toggle('active', !isActive);
        questionBtn.setAttribute('aria-expanded', String(!isActive));
      });
    }
  });

});
