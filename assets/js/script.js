const petals = document.querySelector('.petals');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js'));
}

let installPrompt;
const installButton = document.querySelector('#install-button');
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
installButton.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
});

for (let i = 0; i < 20; i++) {
  const petal = document.createElement('span');
  petal.className = 'petal';
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.animationDuration = `${7 + Math.random() * 9}s`;
  petal.style.animationDelay = `${-Math.random() * 15}s`;
  petal.style.setProperty('--drift', `${-100 + Math.random() * 200}px`);
  petal.style.transform = `rotate(${Math.random() * 180}deg)`;
  petals.appendChild(petal);
}

const smoothScrollTo = (selector) => {
  const target = document.querySelector(selector);
  const start = window.scrollY;
  const destination = start + target.getBoundingClientRect().top;
  const duration = 1100;
  const startedAt = performance.now();
  const easeInOut = (progress) => progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - ((-2 * progress + 2) ** 3) / 2;

  const scrollToTarget = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    window.scrollTo(0, start + (destination - start) * easeInOut(progress));
    if (progress < 1) requestAnimationFrame(scrollToTarget);
  };

  requestAnimationFrame(scrollToTarget);
};

document.querySelectorAll('a[href="#message"], a[href="#game"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    smoothScrollTo(link.getAttribute('href'));
  });
});

document.querySelector('.gift-link').addEventListener('click', (event) => {
  event.preventDefault();
  const surpriseUrl = event.currentTarget.href;
  event.currentTarget.classList.add('opening');
  document.body.classList.add('opening-surprise');
  setTimeout(() => { window.location.href = surpriseUrl; }, 620);
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  menuToggle.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navLinks.classList.remove('is-open');
  menuToggle.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const themeToggle = document.querySelector('#theme-toggle');
const heroEyebrow = document.querySelector('#hero-eyebrow');
const heroTitle = document.querySelector('#hero-title');
const heroIntro = document.querySelector('#hero-intro');
const heroButtonText = document.querySelector('#hero-button-text');
const gameEyebrow = document.querySelector('#game-eyebrow');
const gameTitle = document.querySelector('#game-title');
const gameDescription = document.querySelector('#game-description');
const setMonthsaryTheme = (enabled) => {
  document.body.classList.toggle('monthsary-theme', enabled);
  themeToggle.setAttribute('aria-checked', enabled);
  heroEyebrow.textContent = enabled ? 'A special day for us' : 'A garden made just for you, Haruka';
  heroTitle.innerHTML = enabled
    ? 'Happy 31st<br /><em>Monthsary, Lang.</em>'
    : 'You make my<br /><em>world bloom.</em>';
  heroIntro.textContent = enabled
    ? 'Celebrating us, our memories, and every beautiful day we choose each other.'
    : 'Every ordinary day feels softer, brighter, and a little more beautiful with you in it.';
  heroButtonText.textContent = enabled ? 'Celebrate us' : 'Open my heart';
  gameEyebrow.textContent = enabled ? 'A tiny monthsary question for Haruka' : 'A tiny question for Haruka';
  gameTitle.textContent = enabled ? 'Do you still remember our 2 ducky babies?' : 'Where did we first meet?';
  gameDescription.textContent = enabled
    ? 'Answer correctly to unlock your monthsary surprise.'
    : 'Answer correctly to unlock your special message.';
  localStorage.setItem('monthsary-theme', enabled ? 'on' : 'off');
};

setMonthsaryTheme(localStorage.getItem('monthsary-theme') === 'on');
themeToggle.addEventListener('click', () => {
  setMonthsaryTheme(!document.body.classList.contains('monthsary-theme'));
});

const game = document.querySelector('.game');
const questionForm = document.querySelector('#question-form');
const answer = document.querySelector('#answer');
const gameStatus = document.querySelector('#game-status');

questionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const response = answer.value.trim().toLowerCase();
  const isMonthsaryTheme = gameTitle.textContent.includes('ducky babies');
  const monthsaryAnswer = response.replace(/[\s,]+/g, '').replace(/and/g, '');
  const validMonthsaryAnswers = ['b1b2', 'b2b1', 'b1b2b3'];
  const isCorrect = isMonthsaryTheme ? validMonthsaryAnswers.includes(monthsaryAnswer) : response === 'naga';

  if (isCorrect) {
    game.classList.remove('failed');
    game.classList.add('success');
    gameStatus.textContent = 'Correct!';
    answer.disabled = true;
    questionForm.querySelector('button').disabled = true;
    setTimeout(() => {
      window.location.href = isMonthsaryTheme ? 'pages/memories.html' : 'pages/love.html';
    }, 850);
    return;
  }

  game.classList.add('failed');
  gameStatus.textContent = 'Not quite — try again, my love.';
  answer.value = '';
  answer.focus();
});
