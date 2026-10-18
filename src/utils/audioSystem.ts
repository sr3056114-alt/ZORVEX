import { Howl, Howler } from 'howler';

const SFX_URLS = {
  click: 'https://assets.mixkit.co/sfx/preview/mixkit-click-melodic-1101.mp3',
  win: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chime-2064.mp3',
  lose: 'https://assets.mixkit.co/sfx/preview/mixkit-funny-fail-low-tone-2856.mp3',
  betPlaced: 'https://assets.mixkit.co/sfx/preview/mixkit-plastic-bubble-click-1124.mp3',
  
  // Aviator / Crash
  planeTakeoff: 'https://assets.mixkit.co/sfx/preview/mixkit-fast-rocket-whoosh-1714.mp3',
  engineRising: 'https://assets.mixkit.co/sfx/preview/mixkit-spaceship-engine-hum-2020.mp3', 
  crash: 'https://assets.mixkit.co/sfx/preview/mixkit-explosion-hit-1704.mp3',
  cashout: 'https://assets.mixkit.co/sfx/preview/mixkit-video-game-win-2016.mp3',
  
  // Cards
  cardDeal: 'https://assets.mixkit.co/sfx/preview/mixkit-playing-cards-falling-2025.mp3',
  chipPlace: 'https://assets.mixkit.co/sfx/preview/mixkit-poker-chip-stack-clink-2028.mp3',
  cardShuffle: 'https://assets.mixkit.co/sfx/preview/mixkit-card-deck-shuffling-1996.mp3',
  
  // Mines
  tileClick: 'https://assets.mixkit.co/sfx/preview/mixkit-mouse-click-close-1113.mp3',
  gemReveal: 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3',
  bomb: 'https://assets.mixkit.co/sfx/preview/mixkit-explosion-hit-1704.mp3',
  minesCashout1: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chime-2064.mp3',
  minesCashout2: 'https://assets.mixkit.co/sfx/preview/mixkit-video-game-win-2016.mp3',
  minesCashout3: 'https://assets.mixkit.co/sfx/preview/mixkit-slot-machine-win-1928.mp3',
  
  // Wheel / Slots
  spinWheel: 'https://assets.mixkit.co/sfx/preview/mixkit-spinning-roulette-wheel-1811.mp3',
  tick: 'https://assets.mixkit.co/sfx/preview/mixkit-lock-click-1065.mp3',
  slotSpin: 'https://assets.mixkit.co/sfx/preview/mixkit-slot-machine-win-1928.mp3', 
  reelStop: 'https://assets.mixkit.co/sfx/preview/mixkit-typewriter-soft-click-1125.mp3',
  jackpot: 'https://assets.mixkit.co/sfx/preview/mixkit-slot-machine-win-alert-1931.mp3',
  
  // Plinko
  ballDrop: 'https://assets.mixkit.co/sfx/preview/mixkit-mouse-click-close-1113.mp3', 
  pegHit: 'https://assets.mixkit.co/sfx/preview/mixkit-wood-hard-hit-2182.mp3',
  ballLand: 'https://assets.mixkit.co/sfx/preview/mixkit-coins-handling-2039.mp3',
  
  // Coin Flip
  coinFlipSpin: 'https://assets.mixkit.co/active_storage/sfx/2019/2019.wav',
  coinLand: 'https://assets.mixkit.co/sfx/preview/mixkit-coins-handling-2039.mp3',
  
  // Fruit Cutter
  fruitSlice: 'https://assets.mixkit.co/sfx/preview/mixkit-sword-strikes-armor-2765.mp3',
  comboSlice: 'https://assets.mixkit.co/sfx/preview/mixkit-swift-sword-strike-2166.mp3',
  
  // Chicken
  chickenJump: 'https://assets.mixkit.co/sfx/preview/mixkit-player-jumping-in-a-video-game-2043.mp3',
  dangerFail: 'https://assets.mixkit.co/sfx/preview/mixkit-funny-fail-low-tone-2856.mp3'
};

const BG_URLS: Record<string, string> = {
  default: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  crash: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  casino: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  arcade: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  joyful: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  focus: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  royal: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  minesBg: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
  none: ''
};

class AudioSystem {
  private sfx: Record<string, Howl> = {};
  private currentBg: Howl | null = null;
  private currentBgName: string | null = null;
  private stopTimeout: any = null;
  private _isMuted: boolean = false;
  private _volume: number = 0.5;

  constructor() {
    this.init();
  }

  private init() {
    // Preload SFX
    for (const [key, url] of Object.entries(SFX_URLS)) {
      this.sfx[key] = new Howl({
        src: [url],
        volume: this._volume,
        preload: true
      });
    }

    Howler.volume(this._volume);
    Howler.mute(this._isMuted);
  }

  get isMuted() {
    return this._isMuted;
  }

  get volume() {
    return this._volume;
  }

  setVolume(vol: number) {
    this._volume = vol;
    Howler.volume(vol);
  }

  toggleMute() {
    this._isMuted = !this._isMuted;
    Howler.mute(this._isMuted);
    return this._isMuted;
  }

  play(name: string, options?: { loop?: boolean, volume?: number, rate?: number }) {
    // Handling aliases that were used in old code
    if (name === 'takeoff') name = 'planeTakeoff';
    
    // Typecast to keyof typeof SFX_URLS, ignore if invalid just in case
    return this.playSound(name as keyof typeof SFX_URLS, options);
  }

  playSound(name: keyof typeof SFX_URLS, options?: { loop?: boolean, volume?: number, rate?: number }) {
    const sound = this.sfx[name];
    if (sound) {
      if (!Howler.ctx) {
        console.warn("Howler context locked, trying to play:", name);
      }
      const id = sound.play();
      if (options?.loop !== undefined) sound.loop(options.loop, id);
      if (options?.volume !== undefined) sound.volume(options.volume, id);
      if (options?.rate !== undefined) sound.rate(options.rate, id);
      return id;
    } else {
      console.warn('Sound not found in SFX_URLS:', name);
    }
    return null;
  }

  stopSound(name: keyof typeof SFX_URLS, id?: number) {
    const sound = this.sfx[name];
    if (sound) {
      if (id !== undefined) {
        sound.stop(id);
      } else {
        sound.stop();
      }
    }
  }

  playBgMusic(gameName: string) {
    let url = BG_URLS['default'];
    if (['Jet X', 'GoCrash'].includes(gameName)) url = BG_URLS['crash'];
    else if (['Andar Bahar', 'Teen Patti', 'Rummy'].includes(gameName)) url = BG_URLS['casino'];
    else if (['Chicken Road', 'Fruit Cutter'].includes(gameName)) url = BG_URLS['arcade'];
    else if (['Lucky777', 'Spin Wheel', 'Plinko', '77 Royal Wheel'].includes(gameName)) url = BG_URLS['joyful'];
    else if (['Coin Flip'].includes(gameName)) url = BG_URLS['crash']; 
    else if (gameName === 'Trading') url = '';
    else if (gameName === 'Mines') url = BG_URLS['minesBg'];
    else if (gameName === 'Mines_NO_BG') {
      url = ''; 
    }

    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    if (this.currentBgName === gameName && this.currentBg) {
      // If it's already the active track, do absolutely nothing.
      // This prevents interrupting the loading or playback state.
      this.currentBg.volume(this._volume * 0.3);
      return;
    }

    // Stop old track unconditionally and immediately
    if (this.currentBg) {
      this.currentBg.stop();
      this.currentBg.unload();
      this.currentBg = null;
    }

    this.currentBgName = gameName;
    if (!url) return;

    this.currentBg = new Howl({
      src: [url],
      volume: this._volume * 0.3, 
      loop: true,
      html5: true, // required for big bg tracks
      onplayerror: function() {
        this.once('unlock', function() {
          this.play();
        });
      }
    });

    this.currentBg.play();
  }

  stopBgMusic() {
    // We defer stopping for 1 second ONLY to prevent React Strict Mode unmount/remount glitches
    if (this.stopTimeout) clearTimeout(this.stopTimeout);
    this.stopTimeout = setTimeout(() => {
      if (this.currentBg) {
        this.currentBg.stop();
        this.currentBg.unload();
        this.currentBg = null;
        this.currentBgName = null;
      }
    }, 1000);
  }
}

export const audioManager = new AudioSystem();
