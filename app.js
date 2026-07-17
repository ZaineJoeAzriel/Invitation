const { createApp } = Vue;

createApp({
  data() {
    return {
      party: {
        childName: "Luna",
        date: "Sunday, September 5, 2026",
        time: "1:00 PM – 5:00 PM",
        location: "The Log Pose has spoken!(TBA)",
        formUrl: "https://forms.gle/PUhJ86Gtadodh9UD7",
        formEmbedUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfkPlrUZIZewxNXG-dUznCXAB_Mtx2YxPyrkO6PpqY59A_Wmg/viewform?embedded=true"
      }
    };
  },
  methods: {
    openForm() {
      window.open(this.party.formUrl, "_blank", "noopener,noreferrer");
    }
  },
  mounted() {
    document.title = `Set Sail for ${this.party.childName}'s 1st Birthday!`;
    initializePreloadOverlay();
  }
}).mount("#app");

function initializePreloadOverlay() {
  const overlay = document.getElementById('preload-overlay');
  const route = document.getElementById('preloadRoute');
  const ship = document.getElementById('preloadShip');
  const fill = document.getElementById('preloadFill');
  const pct = document.getElementById('preloadPct');
  const status = document.getElementById('preloadStatus');
  const needle = document.getElementById('preloadNeedle');
  if (!overlay || !route || !ship || !fill || !pct || !status || !needle) return;

  const pathLength = route.getTotalLength();
  const duration = 2200;
  const messages = [
    'Setting sail',
    'Charting the reefs',
    'Following the map',
    'Digging near the X',
    'Loot in sight'
  ];
  const start = performance.now();
  let needleTime = 0;

  function update(value) {
    fill.style.width = value + '%';
    pct.textContent = Math.round(value) + '%';
    const idx = Math.min(messages.length - 1, Math.floor((value / 100) * messages.length));
    status.textContent = messages[idx];
    const point = route.getPointAtLength((pathLength * value) / 100);
    ship.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${value * 0.18 - 10})`);
  }

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / duration);
    const value = progress * 100;
    update(value);
    needleTime += 0.03;
    needle.style.transform = `rotate(${Math.sin(needleTime) * 18}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      overlay.classList.add('preload-hidden');
      setTimeout(() => overlay.remove(), 320);
    }
  }

  requestAnimationFrame(animate);
}

/* Dynamic preview carousel: previous/next buttons show live previews */
(function initCarouselPreview(){
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const items = Array.from(track.querySelectorAll('.carousel-item'));
  if (items.length === 0) return;

  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const prevImg = prevBtn ? prevBtn.querySelector('.carousel-btn-icon') : null;
  const nextImg = nextBtn ? nextBtn.querySelector('.carousel-btn-icon') : null;

  let currentIndex = 0;
  let autoplay = true;
  let timer = null;
  const AUTOPLAY_MS = 3000;

  const clampIndex = (i) => ((i % items.length) + items.length) % items.length;

  function updatePreviewImages() {
    const prevIndex = clampIndex(currentIndex - 1);
    const nextIndex = clampIndex(currentIndex + 1);
    if (prevImg) {
      prevImg.src = items[prevIndex].src;
      prevImg.alt = items[prevIndex].alt || `slide ${prevIndex + 1}`;
    }
    if (nextImg) {
      nextImg.src = items[nextIndex].src;
      nextImg.alt = items[nextIndex].alt || `slide ${nextIndex + 1}`;
    }
  }

  function show(index) {
    currentIndex = clampIndex(index);
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updatePreviewImages();
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => { if (autoplay) show(currentIndex + 1); }, AUTOPLAY_MS);
  }
  function stopAutoplay() { if (timer) { clearInterval(timer); timer = null; } }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', () => { show(currentIndex - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { show(currentIndex + 1); startAutoplay(); });

  // Pause autoplay when the user interacts
  const viewport = document.querySelector('.carousel-viewport');
  if (viewport) {
    viewport.addEventListener('mouseenter', () => { autoplay = false; stopAutoplay(); });
    viewport.addEventListener('mouseleave', () => { autoplay = true; startAutoplay(); });
  }

  // Initialize
  show(0);
  startAutoplay();

  // Expose for debugging (optional)
  window.__carousel = { show, items };
})();
