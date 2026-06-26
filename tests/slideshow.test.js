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
});
