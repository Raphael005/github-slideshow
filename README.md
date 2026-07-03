# GitHub Slideshow

[![Test](https://github.com/Raphael005/github-slideshow/actions/workflows/test.yml/badge.svg)](https://github.com/Raphael005/github-slideshow/actions/workflows/test.yml)
[![Deploy to GitHub Pages](https://github.com/Raphael005/github-slideshow/actions/workflows/deploy.yml/badge.svg)](https://github.com/Raphael005/github-slideshow/actions/workflows/deploy.yml)

An interactive slideshow application for learning GitHub workflows and collaboration.

**🚀 [View Live Demo](https://raphael005.github.io/github-slideshow/)**

## Features

- 📖 5 interactive slides covering GitHub basics
- ⌨️ Keyboard navigation (← → Space Home End)
- 👆 Touch swipe support for mobile
- 🎨 GitHub dark theme with responsive design
- 📍 Progress dots for quick navigation
- ▶️ Autoplay with configurable interval

## Getting Started

### View Online

Visit the live site: https://raphael005.github.io/github-slideshow/

### Run Locally

```bash
# Clone the repository
git clone https://github.com/Raphael005/github-slideshow.git
cd github-slideshow

# Open in browser
open src/index.html
```

### Run Tests

```bash
# Install dependencies
yarn install

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage
```

## Autoplay

The slideshow supports automatic slide advancement with play/pause controls.

### Basic Usage

```javascript
const slideshow = new Slideshow();
slideshow.startAutoplay();  // Start with default 3-second interval
slideshow.stopAutoplay();   // Pause autoplay
slideshow.toggleAutoplay(); // Toggle play/pause
```

### Custom Interval

```javascript
// Set interval at initialization (in milliseconds)
const slideshow = new Slideshow({ autoplayInterval: 5000 });

// Or change interval dynamically (minimum 500ms)
slideshow.setAutoplayInterval(2000);
```

### Autoplay Button

Add an autoplay button to your HTML:

```html
<button id="autoplayBtn">▶ Play</button>
```

The button text and `aria-pressed` attribute update automatically.

## Project Structure

```
github-slideshow/
├── src/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styles and theme
│   └── slideshow.js    # Navigation logic
├── tests/
│   └── slideshow.test.js
├── docs/
│   └── getting-started.md
└── .github/workflows/
    └── deploy.yml      # GitHub Pages deployment
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
