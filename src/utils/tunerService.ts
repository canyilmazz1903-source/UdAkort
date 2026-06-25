import { getRecordingPermissionsAsync, requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';
import { Platform } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { getClosestTuningNote } from './tsmEngine';

let PitchDetection: any = null;

try {
  PitchDetection = require('@techoptio/react-native-live-pitch-detection').default;
} catch (e) {
  console.warn('Native PitchDetection module not available, using Simulator fallback');
}

let subscription: any = null;
let simulationInterval: any = null;

export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const { status } = await requestRecordingPermissionsAsync();
    const granted = status === 'granted';
    useAppStore.getState().setHasMicPermission(granted);
    return granted;
  } catch (error) {
    console.error('Error requesting microphone permission:', error);
    return false;
  }
}

export async function checkMicrophonePermission(): Promise<boolean> {
  try {
    const { status } = await getRecordingPermissionsAsync();
    const granted = status === 'granted';
    useAppStore.getState().setHasMicPermission(granted);
    return granted;
  } catch (error) {
    console.error('Error checking microphone permission:', error);
    return false;
  }
}

export async function startTuning() {
  const store = useAppStore.getState();
  if (store.isListening) return;

  const hasPermission = await checkMicrophonePermission();
  if (!hasPermission) {
    const granted = await requestMicrophonePermission();
    if (!granted) {
      console.warn('Microphone permission denied');
      return;
    }
  }

  // Configure Audio Session for recording and playback (routing through speaker)
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: true,
      shouldRouteThroughEarpiece: false,
    });
  } catch (e) {
    console.warn('Failed to configure audio mode for tuning', e);
  }

  store.setIsListening(true);

  // Check if native module is available
  if (PitchDetection && PitchDetection.startListening && Platform.OS !== 'web') {
    try {
      // Configure options (standard for pitch detection)
      if (PitchDetection.setOptions) {
        PitchDetection.setOptions({
          bufferSize: 4096,
          minVolume: -30.0,
          updateIntervalMs: 150,
        });
      }

      await PitchDetection.startListening();
      
      subscription = PitchDetection.addListener((event: { frequency: number }) => {
        const freq = event.frequency;
        if (freq > 40 && freq < 1000) { // Limit to Ud frequency range
          const preset = useAppStore.getState().currentPreset;
          const { note, centsDeviation, komaDeviation } = getClosestTuningNote(freq, preset);
          
          useAppStore.getState().setDetectedFrequency(
            freq,
            note,
            centsDeviation,
            komaDeviation
          );
        }
      });
      return;
    } catch (e) {
      console.warn('Failed to start native pitch detection, falling back to simulator:', e);
    }
  }

  // Simulator Fallback (for Expo Go, simulators, and web)
  startSimulatorTuning();
}

export async function stopTuning() {
  const store = useAppStore.getState();
  if (!store.isListening) return;

  store.setIsListening(false);
  store.setDetectedFrequency(0, null, 0, 0);

  // Stop native module
  if (PitchDetection && PitchDetection.stopListening && Platform.OS !== 'web') {
    try {
      await PitchDetection.stopListening();
      if (subscription && subscription.remove) {
        subscription.remove();
      }
      subscription = null;
    } catch (e) {
      console.error('Error stopping native pitch detection:', e);
    }
  }

  // Stop simulator
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

// Simulates real-time microphone input for testing in Expo Go
function startSimulatorTuning() {
  if (simulationInterval) clearInterval(simulationInterval);

  let angle = 0;
  simulationInterval = setInterval(() => {
    const store = useAppStore.getState();
    if (!store.isListening) return;

    // Get active peg or default to Dügah (A3 = 220Hz)
    const preset = store.currentPreset;
    const targetNote = store.activePegIndex !== null 
      ? preset.notes[store.activePegIndex] 
      : preset.notes[2]; // Default to 3rd string (Dügah)
    
    const targetFreq = targetNote.frequency;

    // Simulate minor pitch fluctuations around the target frequency
    // Creates a nice wavy gauge behavior that settles near the target
    const noise = Math.sin(angle) * 1.5 + Math.cos(angle * 2.5) * 0.5;
    const simulatedFreq = targetFreq + noise;
    angle += 0.15;

    const { note, centsDeviation, komaDeviation } = getClosestTuningNote(simulatedFreq, preset);

    store.setDetectedFrequency(
      simulatedFreq,
      note,
      centsDeviation,
      komaDeviation
    );
  }, 150);
}
