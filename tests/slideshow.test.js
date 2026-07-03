/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Slideshow', () => {
  let Slideshow;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div class="slideshow-container">
        <span class="slide-counter">1 / 3</span>
        <div class="slide active" data-slide="1">Slide 1</div>
        <div class="slide" data-slide="2">Slide 2</div>
        <div class="slide" data-slide="3">Slide 3</div>
        <button id="prevBtn">Previous</button>
        <div id="progressDots"></div>
        <button id="nextBtn">Next</button>
      </div>
    `;

    // Clear module cache and require fresh
    jest.resetModules();
    Slideshow = require('../src/slideshow.js');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('initialization', () => {
    test('should initialize with first slide active', () => {
      const slideshow = new Slideshow();
      expect(slideshow.currentSlide).toBe(1);
    });

    test('should count total slides correctly', () => {
      const slideshow = new Slideshow();
      expect(slideshow.totalSlides).toBe(3);
    });

    test('should create progress dots for each slide', () => {
      new Slideshow();
      const dots = document.querySelectorAll('.dot');
      expect(dots.length).toBe(3);
    });

    test('should disable prev button on first slide', () => {
      new Slideshow();
      const prevBtn = document.getElementById('prevBtn');
      expect(prevBtn.disabled).toBe(true);
    });

    test('should enable next button on first slide', () => {
      new Slideshow();
      const nextBtn = document.getElementById('nextBtn');
      expect(nextBtn.disabled).toBe(false);
    });
  });

  describe('next()', () => {
    test('should advance to next slide', () => {
      const slideshow = new Slideshow();
      slideshow.next();
      expect(slideshow.currentSlide).toBe(2);
    });

    test('should update active class on slides', () => {
      const slideshow = new Slideshow();
      slideshow.next();
      
      const slides = document.querySelectorAll('.slide');
      expect(slides[0].classList.contains('active')).toBe(false);
      expect(slides[1].classList.contains('active')).toBe(true);
    });

    test('should not advance past last slide', () => {
      const slideshow = new Slideshow();
      slideshow.goTo(3);
      slideshow.next();
      expect(slideshow.currentSlide).toBe(3);
    });

    test('should disable next button on last slide', () => {
      const slideshow = new Slideshow();
      slideshow.goTo(3);
      
      const nextBtn = document.getElementById('nextBtn');
      expect(nextBtn.disabled).toBe(true);
    });
  });

  describe('prev()', () => {
    test('should go to previous slide', () => {
      const slideshow = new Slideshow();
      slideshow.goTo(2);
      slideshow.prev();
      expect(slideshow.currentSlide).toBe(1);
    });

    test('should not go before first slide', () => {
      const slideshow = new Slideshow();
      slideshow.prev();
      expect(slideshow.currentSlide).toBe(1);
    });

    test('should enable prev button when not on first slide', () => {
      const slideshow = new Slideshow();
      slideshow.next();
      
      const prevBtn = document.getElementById('prevBtn');
      expect(prevBtn.disabled).toBe(false);
    });
  });

  describe('goTo()', () => {
    test('should jump to specific slide', () => {
      const slideshow = new Slideshow();
      slideshow.goTo(3);
      expect(slideshow.currentSlide).toBe(3);
    });

    test('should ignore invalid slide numbers (too low)', () => {
      const slideshow = new Slideshow();
      slideshow.goTo(0);
      expect(slideshow.currentSlide).toBe(1);
    });

    test('should ignore invalid slide numbers (too high)', () => {
      const slideshow = new Slideshow();
      slideshow.goTo(10);
      expect(slideshow.currentSlide).toBe(1);
    });

    test('should ignore going to current slide', () => {
      const slideshow = new Slideshow();
      const initialSlide = slideshow.currentSlide;
      slideshow.goTo(1);
      expect(slideshow.currentSlide).toBe(initialSlide);
    });

    test('should update slide counter text', () => {
      const slideshow = new Slideshow();
      slideshow.goTo(2);
      
      const counter = document.querySelector('.slide-counter');
      expect(counter.textContent).toBe('2 / 3');
    });

    test('should update active dot', () => {
      const slideshow = new Slideshow();
      slideshow.goTo(2);
      
      const dots = document.querySelectorAll('.dot');
      expect(dots[0].classList.contains('active')).toBe(false);
      expect(dots[1].classList.contains('active')).toBe(true);
    });
  });

  describe('handleSwipe()', () => {
    test('should go to next slide on left swipe', () => {
      const slideshow = new Slideshow();
      slideshow.handleSwipe(200, 100); // swipe left
      expect(slideshow.currentSlide).toBe(2);
    });

    test('should go to previous slide on right swipe', () => {
      const slideshow = new Slideshow();
      slideshow.goTo(2);
      slideshow.handleSwipe(100, 200); // swipe right
      expect(slideshow.currentSlide).toBe(1);
    });

    test('should ignore small swipes below threshold', () => {
      const slideshow = new Slideshow();
      slideshow.handleSwipe(100, 120); // small movement
      expect(slideshow.currentSlide).toBe(1);
    });
  });

  describe('keyboard navigation', () => {
    test('should navigate with ArrowRight key', () => {
      const slideshow = new Slideshow();
      
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(slideshow.currentSlide).toBe(2);
    });

    test('should navigate with ArrowLeft key', () => {
      const slideshow = new Slideshow();
      slideshow.goTo(2);
      
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(slideshow.currentSlide).toBe(1);
    });

    test('should go to first slide with Home key', () => {
      const slideshow = new Slideshow();
      slideshow.goTo(3);
      
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      expect(slideshow.currentSlide).toBe(1);
    });

    test('should go to last slide with End key', () => {
      const slideshow = new Slideshow();
      
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      expect(slideshow.currentSlide).toBe(3);
    });
  });

  describe('autoplay', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should initialize with autoplay disabled', () => {
      const slideshow = new Slideshow();
      expect(slideshow.isPlaying).toBe(false);
      expect(slideshow.autoplayTimer).toBeNull();
    });

    test('should use default autoplay interval of 3000ms', () => {
      const slideshow = new Slideshow();
      expect(slideshow.autoplayInterval).toBe(3000);
    });

    test('should accept custom autoplay interval via options', () => {
      const slideshow = new Slideshow({ autoplayInterval: 5000 });
      expect(slideshow.autoplayInterval).toBe(5000);
    });

    test('startAutoplay() should set isPlaying to true', () => {
      const slideshow = new Slideshow();
      slideshow.startAutoplay();
      expect(slideshow.isPlaying).toBe(true);
    });

    test('startAutoplay() should create a timer', () => {
      const slideshow = new Slideshow();
      slideshow.startAutoplay();
      expect(slideshow.autoplayTimer).not.toBeNull();
    });

    test('startAutoplay() should advance slides after interval', () => {
      const slideshow = new Slideshow({ autoplayInterval: 1000 });
      slideshow.startAutoplay();
      
      expect(slideshow.currentSlide).toBe(1);
      jest.advanceTimersByTime(1000);
      expect(slideshow.currentSlide).toBe(2);
      jest.advanceTimersByTime(1000);
      expect(slideshow.currentSlide).toBe(3);
    });

    test('startAutoplay() should loop back to first slide after last', () => {
      const slideshow = new Slideshow({ autoplayInterval: 1000 });
      slideshow.goTo(3);
      slideshow.startAutoplay();
      
      jest.advanceTimersByTime(1000);
      expect(slideshow.currentSlide).toBe(1);
    });

    test('startAutoplay() should not start if already playing', () => {
      const slideshow = new Slideshow();
      slideshow.startAutoplay();
      const firstTimer = slideshow.autoplayTimer;
      
      slideshow.startAutoplay();
      expect(slideshow.autoplayTimer).toBe(firstTimer);
    });

    test('stopAutoplay() should set isPlaying to false', () => {
      const slideshow = new Slideshow();
      slideshow.startAutoplay();
      slideshow.stopAutoplay();
      expect(slideshow.isPlaying).toBe(false);
    });

    test('stopAutoplay() should clear the timer', () => {
      const slideshow = new Slideshow();
      slideshow.startAutoplay();
      slideshow.stopAutoplay();
      expect(slideshow.autoplayTimer).toBeNull();
    });

    test('stopAutoplay() should stop slide advancement', () => {
      const slideshow = new Slideshow({ autoplayInterval: 1000 });
      slideshow.startAutoplay();
      jest.advanceTimersByTime(1000);
      expect(slideshow.currentSlide).toBe(2);
      
      slideshow.stopAutoplay();
      jest.advanceTimersByTime(2000);
      expect(slideshow.currentSlide).toBe(2); // Should not advance
    });

    test('stopAutoplay() should do nothing if not playing', () => {
      const slideshow = new Slideshow();
      expect(() => slideshow.stopAutoplay()).not.toThrow();
      expect(slideshow.isPlaying).toBe(false);
    });

    test('toggleAutoplay() should start when stopped', () => {
      const slideshow = new Slideshow();
      slideshow.toggleAutoplay();
      expect(slideshow.isPlaying).toBe(true);
    });

    test('toggleAutoplay() should stop when playing', () => {
      const slideshow = new Slideshow();
      slideshow.startAutoplay();
      slideshow.toggleAutoplay();
      expect(slideshow.isPlaying).toBe(false);
    });

    test('setAutoplayInterval() should update interval', () => {
      const slideshow = new Slideshow();
      slideshow.setAutoplayInterval(5000);
      expect(slideshow.autoplayInterval).toBe(5000);
    });

    test('setAutoplayInterval() should reject intervals below 500ms', () => {
      const slideshow = new Slideshow({ autoplayInterval: 3000 });
      slideshow.setAutoplayInterval(100);
      expect(slideshow.autoplayInterval).toBe(3000);
    });

    test('setAutoplayInterval() should restart autoplay with new interval if playing', () => {
      const slideshow = new Slideshow({ autoplayInterval: 1000 });
      slideshow.startAutoplay();
      
      jest.advanceTimersByTime(500);
      slideshow.setAutoplayInterval(2000);
      
      // Old timer should be cleared, new one started
      expect(slideshow.isPlaying).toBe(true);
      expect(slideshow.autoplayInterval).toBe(2000);
      
      // Slide shouldn't advance after 1000ms (old interval)
      jest.advanceTimersByTime(1000);
      expect(slideshow.currentSlide).toBe(1);
      
      // Should advance after 2000ms total from setAutoplayInterval
      jest.advanceTimersByTime(1000);
      expect(slideshow.currentSlide).toBe(2);
    });
  });

  describe('autoplay button', () => {
    beforeEach(() => {
      // Add autoplay button to DOM
      const btn = document.createElement('button');
      btn.id = 'autoplayBtn';
      document.body.appendChild(btn);
      
      jest.useFakeTimers();
      jest.resetModules();
      Slideshow = require('../src/slideshow.js');
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should update button text to Pause when playing', () => {
      const slideshow = new Slideshow();
      slideshow.startAutoplay();
      
      const btn = document.getElementById('autoplayBtn');
      expect(btn.textContent).toBe('⏸ Pause');
    });

    test('should update button text to Play when stopped', () => {
      const slideshow = new Slideshow();
      slideshow.startAutoplay();
      slideshow.stopAutoplay();
      
      const btn = document.getElementById('autoplayBtn');
      expect(btn.textContent).toBe('▶ Play');
    });

    test('should set aria-pressed attribute', () => {
      const slideshow = new Slideshow();
      const btn = document.getElementById('autoplayBtn');
      
      slideshow.startAutoplay();
      expect(btn.getAttribute('aria-pressed')).toBe('true');
      
      slideshow.stopAutoplay();
      expect(btn.getAttribute('aria-pressed')).toBe('false');
    });

    test('should toggle autoplay on button click', () => {
      const slideshow = new Slideshow();
      const btn = document.getElementById('autoplayBtn');
      
      btn.click();
      expect(slideshow.isPlaying).toBe(true);
      
      btn.click();
      expect(slideshow.isPlaying).toBe(false);
    });
  });
});
