import { create } from 'zustand';
import { TuningPreset, TUNING_PRESETS, TuningNote } from '../utils/tsmEngine';

interface AppState {
  // Tuner State
  currentPreset: TuningPreset;
  detectedFrequency: number;
  closestNote: TuningNote | null;
  centsDeviation: number;
  komaDeviation: number;
  activePegIndex: number | null; // index of the active peg playing (0 to 5)
  isListening: boolean;
  hasMicPermission: boolean;
  
  // Makam Guide State
  selectedMakamId: string;
  isScalePlaying: boolean;
  currentPlayingNoteIndex: number | null; // index of the note currently sounding in "Diziyi Çal"
  
  // Actions
  setPreset: (presetId: string) => void;
  setDetectedFrequency: (hz: number, closest: TuningNote | null, cents: number, komas: number) => void;
  setActivePegIndex: (index: number | null) => void;
  setIsListening: (listening: boolean) => void;
  setHasMicPermission: (granted: boolean) => void;
  setSelectedMakamId: (id: string) => void;
  setIsScalePlaying: (playing: boolean) => void;
  setCurrentPlayingNoteIndex: (index: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Tuner Default State
  currentPreset: TUNING_PRESETS[0], // Bolahenk (Yerinden)
  detectedFrequency: 0,
  closestNote: null,
  centsDeviation: 0,
  komaDeviation: 0,
  activePegIndex: null,
  isListening: false,
  hasMicPermission: false,

  // Makam Default State
  selectedMakamId: 'rast',
  isScalePlaying: false,
  currentPlayingNoteIndex: null,

  // Actions
  setPreset: (presetId) => set(() => {
    const preset = TUNING_PRESETS.find(p => p.id === presetId) || TUNING_PRESETS[0];
    return { currentPreset: preset, closestNote: null, detectedFrequency: 0, centsDeviation: 0, komaDeviation: 0 };
  }),
  setDetectedFrequency: (hz, closest, cents, komas) => set({
    detectedFrequency: hz,
    closestNote: closest,
    centsDeviation: cents,
    komaDeviation: komas
  }),
  setActivePegIndex: (index) => set({ activePegIndex: index }),
  setIsListening: (listening) => set({ isListening: listening }),
  setHasMicPermission: (granted) => set({ hasMicPermission: granted }),
  setSelectedMakamId: (id) => set({ selectedMakamId: id }),
  setIsScalePlaying: (playing) => set({ isScalePlaying: playing }),
  setCurrentPlayingNoteIndex: (index) => set({ currentPlayingNoteIndex: index })
}));
