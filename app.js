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
