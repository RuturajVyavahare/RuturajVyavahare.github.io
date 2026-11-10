/* ==========================================================================
   RV / SILICON INTERFACE — MAIN ENTRY POINT
   High-performance modular architecture with selective tree-shaking & lazy-loading
   ========================================================================== */

import './css/base.css';
import './css/layout.css';
import './css/components.css';
import './css/animations.css';
import './css/responsive.css';

// Selective Lucide Icon Tree-Shaking (only the 20 used icons imported)
import {
  createIcons,
  Activity,
  ArrowRight,
  CheckCircle,
  CheckSquare,
  ChevronUp,
  Code,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Layers,
  Linkedin,
  Navigation,
  ShieldCheck,
  Sliders,
  Terminal,
  X
} from 'lucide';

import { initNavigation } from './js/navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Critical Path UI Systems
  createIcons({
    icons: {
      Activity,
      ArrowRight,
      CheckCircle,
      CheckSquare,
      ChevronUp,
      Code,
      Copy,
      Cpu,
      Download,
      ExternalLink,
      FileText,
      Github,
      Globe,
      Layers,
      Linkedin,
      Navigation,
      ShieldCheck,
      Sliders,
      Terminal,
      X
    }
  });

  initNavigation();

  // Helper: Load module when element enters viewport
  function lazyLoadOnVisible(selector, importFn, rootMargin = '250px') {
    const el = document.querySelector(selector);
    if (!el) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            obs.unobserve(entry.target);
            importFn();
          }
        });
      }, { rootMargin });
      observer.observe(el);
    } else {
      setTimeout(importFn, 500);
    }
  }

  // 2. Three.js Hero 3D Scene (Deferred to Idle)
  // Ensures initial text, portrait, and layout render immediately with zero delay
  const init3DDeferred = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    import('./js/hero-3d.js')
      .then(m => m.initHero3D())
      .catch(err => console.warn('Hero 3D lazy load skipped:', err));
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(init3DDeferred, { timeout: 1500 });
  } else {
    window.addEventListener('load', () => setTimeout(init3DDeferred, 300));
  }

  // 3. Dynamically Load 4-bit ALU Playground
  lazyLoadOnVisible('#alu-interactive-panel', () => {
    import('./js/alu-playground.js')
      .then(m => m.initAluPlayground())
      .catch(err => console.error('ALU load error:', err));
  });

  // 4. Dynamically Load Traffic Controller Visualizer
  lazyLoadOnVisible('#traffic-interactive-panel', () => {
    import('./js/traffic-demo.js')
      .then(m => m.initTrafficVisualizer())
      .catch(err => console.error('Traffic visualizer load error:', err));
  });

  // 5. Dynamically Load Smart Digital Lock Simulator
  lazyLoadOnVisible('#lock-interactive-panel', () => {
    import('./js/lock-demo.js')
      .then(m => m.initLockDemo())
      .catch(err => console.error('Lock demo load error:', err));
  });

  // 6. Dynamically Load The Signal Lab (Oscilloscope & Logic Gates)
  lazyLoadOnVisible('#signal-lab-console', () => {
    import('./js/signal-lab.js')
      .then(m => m.initSignalLab())
      .catch(err => console.error('Signal Lab load error:', err));
  });

  // 7. Dynamically Load RV Terminal & Command Palette
  let terminalLoaded = false;
  function loadTerminal() {
    if (terminalLoaded) return;
    terminalLoaded = true;
    import('./js/terminal.js')
      .then(m => m.initTerminalAndPalette())
      .catch(err => console.error('Terminal load error:', err));
  }

  document.querySelectorAll('.trigger-command-palette').forEach(btn => {
    btn.addEventListener('click', loadTerminal, { once: true });
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      loadTerminal();
    }
  }, { once: true });

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => setTimeout(loadTerminal, 2500));
  } else {
    setTimeout(loadTerminal, 3500);
  }

  // 8. Dynamically Load Image Lightbox
  let lightboxLoaded = false;
  function loadLightbox() {
    if (lightboxLoaded) return;
    lightboxLoaded = true;
    import('./js/lightbox.js')
      .then(m => m.initLightbox())
      .catch(err => console.error('Lightbox load error:', err));
  }

  document.querySelectorAll('.zoomable-image').forEach(el => {
    el.addEventListener('click', loadLightbox, { once: true });
  });

  // Telemetry Console Log
  console.log('%c RV / SILICON INTERFACE v1.2 [HIGH-PERFORMANCE] ', 'background: #FF4B1F; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 2px;');
  console.log('%c Aspiring VLSI Design Engineer | Ruturaj Vyavahare ', 'color: #00D9FF; font-family: monospace;');
});
