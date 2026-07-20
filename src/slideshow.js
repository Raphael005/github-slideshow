/**
 * GitHub Slideshow - Interactive Slide Presentation
 */

class Slideshow {
  constructor(options = {}) {
    this.slides = document.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    this.currentSlide = 1;

    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.counter = document.querySelector('.slide-counter');
    this.dotsContainer = document.getElementById('progressDots');

    // Autoplay settings
    this.autoplayInterval = options.autoplayInterval || 3000;
    this.autoplayTimer = null;
    this.isPlaying = false;
    this.autoplayBtn = document.getElementById('autoplayBtn');

    // Theme settings
    this.themeToggleBtn = document.getElementById('themeToggle');
    this.currentTheme = this.getSavedTheme() || this.getSystemTheme();

    this.init();
  }

  init() {
    this.createDots();
    this.applyTheme(this.currentTheme);
    this.bindEvents();
    this.updateUI();
  }

  createDots() {
    for (let i = 1; i <= this.totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.dataset.slide = i;
      if (i === 1) dot.classList.add('active');
      this.dotsContainer.appendChild(dot);
    }
  }

  bindEvents() {
    // Button clicks
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    // Autoplay button
    if (this.autoplayBtn) {
      this.autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
    }

    // Theme toggle button
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Dot clicks
    this.dotsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('dot')) {
        this.goTo(parseInt(e.target.dataset.slide));
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          this.next();
          break;
        case 'Home':
          this.goTo(1);
          break;
        case 'End':
          this.goTo(this.totalSlides);
          break;
      }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  prev() {
    if (this.currentSlide > 1) {
      this.goTo(this.currentSlide - 1);
    }
  }

  next() {
    if (this.currentSlide < this.totalSlides) {
      this.goTo(this.currentSlide + 1);
    }
  }

  goTo(slideNumber) {
    if (slideNumber < 1 || slideNumber > this.totalSlides) return;
    if (slideNumber === this.currentSlide) return;

    // Update slides
    this.slides.forEach((slide) => slide.classList.remove('active'));
    this.slides[slideNumber - 1].classList.add('active');

    this.currentSlide = slideNumber;
    this.updateUI();
  }

  updateUI() {
    // Update counter
    this.counter.textContent = `${this.currentSlide} / ${this.totalSlides}`;

    // Update buttons
    this.prevBtn.disabled = this.currentSlide === 1;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides;

    // Update dots
    const dots = this.dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index + 1 === this.currentSlide);
    });

    // Update autoplay button text
    if (this.autoplayBtn) {
      this.autoplayBtn.textContent = this.isPlaying ? '⏸ Pause' : '▶ Play';
      this.autoplayBtn.setAttribute('aria-pressed', this.isPlaying);
    }
  }

  startAutoplay() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.autoplayTimer = setInterval(() => {
      if (this.currentSlide < this.totalSlides) {
        this.next();
      } else {
        // Loop back to first slide
        this.goTo(1);
      }
    }, this.autoplayInterval);
    this.updateUI();
  }

  stopAutoplay() {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
    this.updateUI();
  }

  toggleAutoplay() {
    if (this.isPlaying) {
      this.stopAutoplay();
    } else {
      this.startAutoplay();
    }
  }

  setAutoplayInterval(interval) {
    if (interval < 500) return; // Minimum 500ms
    this.autoplayInterval = interval;

    // Restart autoplay with new interval if currently playing
    if (this.isPlaying) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  // Theme methods
  getSavedTheme() {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('slideshow-theme');
    }
    return null;
  }

  getSystemTheme() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Update toggle button icon
    if (this.themeToggleBtn) {
      this.themeToggleBtn.textContent = theme === 'light' ? '☀️' : '🌙';
      this.themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
    }

    // Save preference
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('slideshow-theme', theme);
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.applyTheme(theme);
    }
  }
}

// Initialize slideshow when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Slideshow();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Slideshow;
}
