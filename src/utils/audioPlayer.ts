import { Audio } from 'expo-av';

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

let soundInstance: Audio.Sound | null = null;

// Configures Audio Category for Playback (ensures sound plays even in Silent Mode on iOS)
export async function configureAudioForPlayback() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: true, // Needs to allow recording so tuner + player can work together
      staysActiveInBackground: false,
      playThroughEarpieceAndroid: false
    });
  } catch (e) {
    console.warn('Failed to configure audio mode', e);
  }
}

export async function playUdPluck(sampleName: string, rate: number = 1.0) {
  try {
    await configureAudioForPlayback();

    // Stop and unload previous sound if it is playing
    if (soundInstance) {
      try {
        await soundInstance.unloadAsync();
      } catch (e) {
        // Already unloaded
      }
      soundInstance = null;
    }

    const asset = soundAssets[sampleName.toLowerCase()];
    if (!asset) {
      console.warn(`Sound asset not found for sample: ${sampleName}`);
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      asset,
      {
        shouldPlay: true,
        rate: rate,
        shouldCorrectPitch: false, // Natural pitch-shifting (sampler style)
        volume: 1.0
      }
    );

    soundInstance = sound;

    // Clean up when playback finishes
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
        if (soundInstance === sound) {
          soundInstance = null;
        }
      }
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

export async function stopCurrentSound() {
  if (soundInstance) {
    try {
      await soundInstance.stopAsync();
      await soundInstance.unloadAsync();
    } catch (e) {
      // Ignore
    }
    soundInstance = null;
  }
}
