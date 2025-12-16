// Audio URLs (Using reliable CDN sources for demo purposes)
const SOUND_URLS = {
  SPIN: 'https://assets.mixkit.co/sfx/preview/mixkit-ferris-wheel-spinning-1563.mp3', // Continuous spinning sound
  CORRECT: 'https://assets.mixkit.co/sfx/preview/mixkit-game-show-correct-answer-notification-947.mp3', // Ding
  WRONG: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3', // Buzzer
  WIN: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3', // Fanfare
  BANKRUPT: 'https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3', // Fail sound
  CLICK: 'https://assets.mixkit.co/sfx/preview/mixkit-single-classic-click-1116.mp3' // UI Click
};

type SoundType = keyof typeof SOUND_URLS;

class SoundManager {
  private sounds: Record<string, HTMLAudioElement> = {};
  private isMuted: boolean = false;

  constructor() {
    // Preload sounds
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.volume = 0.5; // Default volume 50%
      this.sounds[key] = audio;
    });

    // Loop the spin sound specifically
    if (this.sounds.SPIN) {
        this.sounds.SPIN.loop = true;
    }
  }

  play(type: SoundType) {
    if (this.isMuted) return;
    
    const audio = this.sounds[type];
    if (audio) {
      audio.currentTime = 0; // Reset to start
      audio.play().catch(e => console.warn("Audio play failed (interaction required):", e));
    }
  }

  stop(type: SoundType) {
    const audio = this.sounds[type];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();