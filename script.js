// Mobile menu toggle
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mobileMenu.classList.toggle('open');
    burgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu if user clicks outside
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
      mobileMenu.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      burgerBtn.focus();
    }
  });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero terminal typing sequence (home page only)
const termBody = document.getElementById('termBody');
if (termBody) {
  const lines = [
    { type: 'prompt', text: '$ whoami' },
    { type: 'out', text: 'Sumsodduha Shawon' },
    { type: 'prompt', text: '$ cat focus.txt' },
    { type: 'out', text: 'Systems Programming' },
    { type: 'out', text: 'Defensive Cybersecurity' },
    { type: 'out', text: 'Software Engineering' },
    { type: 'prompt', text: '$ cat status.txt' },
    { type: 'comment', text: '# 3rd year CSE @ University of Asia Pacific' },
    { type: 'comment', text: '# building things that need to hold up' },
  ];

  function renderStatic() {
    termBody.innerHTML = lines.map(l => {
      const cls = l.type === 'prompt' ? 'prompt' : (l.type === 'out' ? 'out' : 'comment');
      return `<div class="ln"><span class="${cls}">${l.text}</span></div>`;
    }).join('') + '<div class="ln"><span class="caret"></span></div>';
  }

  if (reduceMotion) {
    renderStatic();
  } else {
    let li = 0;
    const caret = document.createElement('span');
    caret.className = 'caret';

    function typeLine() {
      if (li >= lines.length) {
        return;
      }
      const l = lines[li];
      const cls = l.type === 'prompt' ? 'prompt' : (l.type === 'out' ? 'out' : 'comment');
      const div = document.createElement('div');
      div.className = 'ln';
      const span = document.createElement('span');
      span.className = cls;
      div.appendChild(span);
      div.appendChild(caret);
      termBody.appendChild(div);

      let ci = 0;
      const speed = l.type === 'prompt' ? 34 : 16;
      const iv = setInterval(() => {
        span.textContent = l.text.slice(0, ci + 1);
        ci++;
        if (ci >= l.text.length) {
          clearInterval(iv);
          li++;
          setTimeout(typeLine, l.type === 'prompt' ? 200 : 100);
        }
      }, speed);
    }
    typeLine();
  }
}

// Reveal content blocks on scroll
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }
}

// Skill bar fill on scroll into view (skills page only)
const skillGroups = document.querySelectorAll('.skill-group');
const skillFills = document.querySelectorAll('.skill-fill');

if (skillFills.length) {
  const fillBars = (container) => {
    const fills = container ? container.querySelectorAll('.skill-fill') : skillFills;
    fills.forEach(f => {
      if (f.dataset.level && !f.dataset.filled) {
        f.style.width = f.dataset.level + '%';
        f.dataset.filled = 'true';
      }
    });
  };

  if ('IntersectionObserver' in window && !reduceMotion) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fillBars(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (skillGroups.length) {
      skillGroups.forEach(g => obs.observe(g));
    } else {
      skillFills.forEach(f => obs.observe(f));
    }
  } else {
    fillBars();
  }
}
