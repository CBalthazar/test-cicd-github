(() => {
  const lootPile = document.getElementById('loot-pile');
  const stealBtn = document.getElementById('steal-btn');
  const scenes = document.querySelectorAll('.scene');

  const dentureSVG = `<svg class="loot-denture" viewBox="0 0 55 28" style="--r: {{rot}}">
    <path d="M3 26 Q5 2 10 2 Q15 2 18 8 Q20 2 25 2 Q30 2 35 8 Q38 2 43 2 Q48 2 50 8 Q52 2 52 8" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M3 18 Q5 26 10 26 Q15 26 18 20 Q20 26 25 26 Q30 26 35 20 Q38 26 43 26 Q48 26 50 20 Q52 26 52 20" stroke="currentColor" stroke-width="1.5" fill="none"/>
  </svg>`;

  const specialDentures = [
    { class: 'gold', count: 5 },
    { class: 'diamond', count: 1 },
    { class: 'ivory', count: 2 }
  ];

  function generateLoot() {
    const total = 847;
    const fragment = document.createDocumentFragment();
    let specialIndex = 0;
    let specialCount = 0;

    for (let i = 0; i < total; i++) {
      const div = document.createElement('div');
      let classes = 'loot-denture';
      let rot = Math.floor(Math.random() * 30) - 15;

      if (specialIndex < specialDentures.length && specialCount >= specialDentures[specialIndex].count) {
        specialIndex++;
        specialCount = 0;
      }

      if (specialIndex < specialDentures.length && Math.random() < 0.015) {
        classes += ` ${specialDentures[specialIndex].class}`;
        specialCount++;
      }

      div.className = classes;
      div.style.setProperty('--r', rot);
      div.innerHTML = dentureSVG.replace('{{rot}}', rot);
      div.style.animationDelay = `${Math.random() * 0.5}s`;
      fragment.appendChild(div);
    }

    lootPile.appendChild(fragment);
  }

  function setupParallax() {
    const floatingElements = document.querySelectorAll('.float-1, .float-2, .float-3, .fd-1, .fd-2, .mini-denture');

    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      floatingElements.forEach((el, i) => {
        const factor = (i % 3 + 1) * 15;
        el.style.transform += ` translate(${x * factor}px, ${y * factor}px)`;
      });
    });
  }

  function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    scenes.forEach(scene => observer.observe(scene));
  }

  function setupKonami() {
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let index = 0;

    document.addEventListener('keydown', (e) => {
      if (e.key === konami[index]) {
        index++;
        if (index === konami.length) {
          triggerRainbowShower();
          index = 0;
        }
      } else {
        index = 0;
      }
    });
  }

  function triggerRainbowShower() {
    const colors = ['#ff2d95','#bc13fe','#b8ff33','#ffd700','#00ffff','#ff6b6b'];
    const count = 50;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const denture = document.createElement('div');
        denture.className = 'loot-denture rainbow-denture';
        denture.style.cssText = `
          position: fixed;
          left: ${Math.random() * 100}vw;
          top: -50px;
          z-index: 9999;
          pointer-events: none;
          color: ${colors[Math.floor(Math.random() * colors.length)]};
          filter: drop-shadow(0 0 15px currentColor);
          animation: rainbowFall ${2 + Math.random() * 2}s ease-in forwards;
          --r: ${Math.floor(Math.random() * 60) - 30};
        `;
        denture.innerHTML = dentureSVG.replace('{{rot}}', Math.floor(Math.random() * 60) - 30);
        document.body.appendChild(denture);

        setTimeout(() => denture.remove(), 4000);
      }, i * 50);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbowFall {
        to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
      .rainbow-denture { animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; }
    `;
    document.head.appendChild(style);
    setTimeout(() => style.remove(), 5000);
  }

  function setupStealButton() {
    stealBtn.addEventListener('click', () => {
      const dentures = lootPile.querySelectorAll('.loot-denture:not(.gold):not(.diamond):not(.ivory)');
      if (dentures.length === 0) return;

      const target = dentures[Math.floor(Math.random() * dentures.length)];
      target.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.5s ease';
      target.style.transform = 'translateY(-300px) rotate(360deg) scale(0)';
      target.style.opacity = '0';

      setTimeout(() => target.remove(), 500);

      stealBtn.textContent = 'Stolen! 🦷';
      stealBtn.style.background = 'linear-gradient(135deg, #b8ff33, #00ff88)';
      stealBtn.style.borderColor = '#b8ff33';
      stealBtn.style.color = '#1a0a2e';

      setTimeout(() => {
        stealBtn.textContent = 'Steal One?';
        stealBtn.style.background = '';
        stealBtn.style.borderColor = '';
        stealBtn.style.color = '';
      }, 2000);
    });
  }

  function init() {
    generateLoot();
    setupParallax();
    setupScrollReveal();
    setupKonami();
    setupStealButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();