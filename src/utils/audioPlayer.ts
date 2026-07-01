import { createAudioPlayer, setAudioModeAsync, preload } from 'expo-audio';

// Static asset mapping because React Native / Metro does not support dynamic requires
const soundAssets: Record<string, any> = {
  'cs2': require('../../assets/sounds/cs2.wav'),
  'fs2': require('../../assets/sounds/fs2.wav'),
  'b2': require('../../assets/sounds/b2.wav'),
  'e3': require('../../assets/sounds/e3.wav'),
  'a3': require('../../assets/sounds/a3.wav'),
  'd4': require('../../assets/sounds/d4.wav'),
  'g4': require('../../assets/sounds/g4.wav'),
  'dum': require('../../assets/sounds/dum.wav'),
  'tek': require('../../assets/sounds/tek.wav')
};

let playerInstance: ReturnType<typeof createAudioPlayer> | null = null;
let dumPlayer: ReturnType<typeof createAudioPlayer> | null = null;
let tekPlayer: ReturnType<typeof createAudioPlayer> | null = null;

// Configures Audio Category for Playback (ensures sound plays even in Silent Mode on iOS)
export async function configureAudioForPlayback(allowsRecording: boolean = false) {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: allowsRecording,
      shouldRouteThroughEarpiece: false, // Force audio to speaker
    });
  } catch (e) {
    console.warn('Failed to configure audio mode', e);
  }
}

// Initial audio engine setup called on app startup
export async function initAudioEngine() {
  try {
    // 1. Initial audio mode configuration
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
      shouldRouteThroughEarpiece: false,
    });
    
    // 2. Preload all sound assets to memory
    for (const key of Object.keys(soundAssets)) {
      preload(soundAssets[key]);
    }
    console.log('Audio engine initialized and assets preloaded.');
  } catch (error) {
    console.error('Failed to initialize audio engine:', error);
  }
}

export async function playMetronomeClick(type: 'dum' | 'tek') {
  try {
    await configureAudioForPlayback();

    const asset = soundAssets[type];
    if (!asset) {
      console.warn(`Sound asset not found for metronome: ${type}`);
      return;
    }

    // Reuse static player instances to avoid allocating new player objects (which leak native resources)
    if (type === 'dum') {
      if (!dumPlayer) {
        dumPlayer = createAudioPlayer(asset, { downloadFirst: true });
        dumPlayer.shouldCorrectPitch = false;
        dumPlayer.volume = 1.0;
      }
      await dumPlayer.seekTo(0);
      dumPlayer.play();
    } else {
      if (!tekPlayer) {
        tekPlayer = createAudioPlayer(asset, { downloadFirst: true });
        tekPlayer.shouldCorrectPitch = false;
        tekPlayer.volume = 1.0;
      }
      await tekPlayer.seekTo(0);
      tekPlayer.play();
    }
  } catch (error) {
    console.error('Error playing metronome click:', error);
  }
}

export async function playUdPluck(sampleName: string, rate: number = 1.0) {
  try {
    await configureAudioForPlayback();

    const asset = soundAssets[sampleName.toLowerCase()];
    if (!asset) {
      console.warn(`Sound asset not found for sample: ${sampleName}`);
      return;
    }

    // Stop and release previous player instance to avoid native memory leaks
    if (playerInstance) {
      try {
        playerInstance.pause();
        playerInstance.release();
      } catch (e) {
        // Ignore
      }
      playerInstance = null;
    }

    // Pass downloadFirst: true to ensure Metro bundler assets are cached locally before playback
    const player = createAudioPlayer(asset, { downloadFirst: true });
    player.shouldCorrectPitch = false;
    player.playbackRate = rate;
    player.volume = 1.0;

    playerInstance = player;
    player.play();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

export async function stopCurrentSound() {
  if (playerInstance) {
    try {
      playerInstance.pause();
      playerInstance.release();
    } catch (e) {
      // Ignore
    }
    playerInstance = null;
  }
}
