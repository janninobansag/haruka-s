const petals = document.querySelector('.petals');

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

const game = document.querySelector('.game');
const questionForm = document.querySelector('#question-form');
const answer = document.querySelector('#answer');
const gameStatus = document.querySelector('#game-status');

questionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const response = answer.value.trim().toLowerCase();

  if (response === 'naga') {
    game.classList.remove('failed');
    game.classList.add('success');
    gameStatus.textContent = 'Correct!';
    answer.disabled = true;
    questionForm.querySelector('button').disabled = true;
    setTimeout(() => { window.location.href = 'love.html'; }, 850);
    return;
  }

  game.classList.add('failed');
  gameStatus.textContent = 'Not quite — try again, my love.';
  answer.value = '';
  answer.focus();
});
