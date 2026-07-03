# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-07-03

### Added
- **Autoplay feature** for automatic slide advancement
  - `startAutoplay()` - Begin automatic slide advancement
  - `stopAutoplay()` - Pause autoplay
  - `toggleAutoplay()` - Toggle between play and pause
  - `setAutoplayInterval(ms)` - Change timing dynamically (minimum 500ms)
- Configurable autoplay interval via constructor options
- Optional `autoplayBtn` element with automatic play/pause UI updates
- `aria-pressed` attribute on autoplay button for accessibility
- Looping behavior - returns to first slide after last slide
- 21 new tests covering all autoplay functionality (46 total tests)
- Autoplay documentation in README

## [1.0.0] - 2026-06-27

### Added
- Initial release
- 5 interactive slides covering GitHub basics
- Keyboard navigation (← → Space Home End)
- Touch swipe support for mobile devices
- Progress dots for quick navigation
- GitHub dark theme with responsive design
- Jest test suite with 25 tests
- GitHub Actions CI/CD pipeline
- Automatic deployment to GitHub Pages
