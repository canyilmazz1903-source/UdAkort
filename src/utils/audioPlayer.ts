import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

// Static asset mapping because React Native / Metro does not support dynamic requires
const soundAssets: Record<string, any> = {
  'cs2': require('../../assets/sounds/cs2.wav'),
  'fs2': require('../../assets/sounds/fs2.wav'),
  'b2': require('../../assets/sounds/b2.wav'),
  'e3': require('../../assets/sounds/e3.wav'),
  'a3': require('../../assets/sounds/a3.wav'),
  'd4': require('../../assets/sounds/d4.wav'),
  'g4': require('../../assets/sounds/g4.wav')
};

let playerInstance: ReturnType<typeof createAudioPlayer> | null = null;

// Configures Audio Category for Playback (ensures sound plays even in Silent Mode on iOS)
export async function configureAudioForPlayback() {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: true, // Needs to allow recording so tuner + player can work together
    });
  } catch (e) {
    console.warn('Failed to configure audio mode', e);
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

    if (!playerInstance) {
      playerInstance = createAudioPlayer(asset);
    } else {
      playerInstance.replace(asset);
    }

    playerInstance.shouldCorrectPitch = false;
    playerInstance.playbackRate = rate;
    playerInstance.volume = 1.0;
    playerInstance.play();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

export async function stopCurrentSound() {
  if (playerInstance) {
    try {
      playerInstance.pause();
      playerInstance.currentTime = 0;
    } catch (e) {
      // Ignore
    }
  }
}
