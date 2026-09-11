let audioContext;
let noteIndex = 0;
let musicTimer;
let musicPlaying = false;
let musicEnabled = localStorage.getItem('romantic-music') !== 'off';

const getAudioContext = () => {
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) return null;
  audioContext ??= new AudioEngine();
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
};

const playMusicNote = (frequency, delay, duration, volume) => {
  const context = getAudioContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime + delay;
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
};

const playRomanticPhrase = () => {
  const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 659.25, 698.46, 587.33];
  melody.forEach((note, index) => playMusicNote(note, index * 0.46, 0.66, 0.022));
  [130.81, 174.61, 146.83, 196].forEach((note, index) => playMusicNote(note, index * 0.92, 1.35, 0.011));
};

const startMusic = () => {
  if (!musicEnabled || musicPlaying) return;
  if (!getAudioContext()) return;
  musicPlaying = true;
  playRomanticPhrase();
  musicTimer = window.setInterval(playRomanticPhrase, 3680);
};

const stopMusic = () => {
  musicPlaying = false;
  window.clearInterval(musicTimer);
};

const musicButton = document.createElement('button');
musicButton.className = 'music-control';
musicButton.type = 'button';
musicButton.setAttribute('aria-label', 'Turn background music off');
musicButton.setAttribute('title', 'Background music');
(document.querySelector('#nav-links') || document.body).appendChild(musicButton);

const updateMusicButton = () => {
  musicButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12M9 18a3 3 0 1 1-2-2.83M19 16a3 3 0 1 1-2-2.83M9 9l10-2" /></svg>';
  musicButton.setAttribute('aria-pressed', musicEnabled);
  musicButton.setAttribute('aria-label', musicEnabled ? 'Turn background music off' : 'Turn background music on');
  musicButton.classList.toggle('is-muted', !musicEnabled);
};
updateMusicButton();
musicButton.addEventListener('click', (event) => {
  event.stopPropagation();
  musicEnabled = !musicEnabled;
  localStorage.setItem('romantic-music', musicEnabled ? 'on' : 'off');
  if (musicEnabled) startMusic(); else stopMusic();
  updateMusicButton();
});

const playTapSound = () => {
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const notes = [523.25, 587.33, 659.25, 783.99];
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(notes[noteIndex++ % notes.length], now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.17);
};

document.addEventListener('click', (event) => {
  if (event.target.closest('button, a')) {
    startMusic();
    playTapSound();
  }
});
