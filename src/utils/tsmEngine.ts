// TSM & AEÜ Frequency Engine

export interface TuningNote {
  name: string;      // Turkish Music Perde Name (e.g. Gerdaniye)
  westernNote: string; // Western Note Name (e.g. G4)
  frequency: number;  // Standard target frequency in Hz
}

export interface TuningPreset {
  id: string;
  name: string;
  description: string;
  offsetCents: number; // Offset compared to standard (Mansur/Yerinden in Western pitch)
  notes: TuningNote[];
}

// AEÜ 53-comma division data for one octave (starting from Sol/Rast to Gerdaniye)
export interface CommaDefinition {
  commaIndex: number; // 0 to 52
  name: string;       // Turkish Music Perde Name
  westernName: string; // Approximate Western Note Name
  cents: number;      // Position in cents (commaIndex * 1200 / 53)
  accidental: 'none' | 'flat' | 'sharp' | 'koma-flat' | 'koma-sharp';
}

// 53-comma division of the octave (0 = Rast/Sol, 53 = Gerdaniye)
// Note names are always shown in Turkish Music terminology, while Western letters show actual tuner pitches (transposed +5 semitones)
export const COMMA_SCALE: CommaDefinition[] = [
  { commaIndex: 0, name: 'Rast (Sol)', westernName: 'D3', cents: 0, accidental: 'none' },
  { commaIndex: 1, name: 'Kaba Geveşt Diyez', westernName: 'D#3 (1k)', cents: 22.64, accidental: 'koma-sharp' },
  { commaIndex: 4, name: 'Nim Zirgüle', westernName: 'D#3 (4k)', cents: 90.57, accidental: 'flat' },
  { commaIndex: 5, name: 'Zirgüle', westernName: 'D#3 (5k)', cents: 113.21, accidental: 'sharp' },
  { commaIndex: 8, name: 'Kürdî (Ref)', westernName: 'E3 (1k flat)', cents: 181.13, accidental: 'koma-flat' },
  { commaIndex: 9, name: 'Dügâh (La)', westernName: 'E3', cents: 203.77, accidental: 'none' },
  { commaIndex: 10, name: 'Dik Kürdî', westernName: 'E#3 (1k)', cents: 226.42, accidental: 'koma-sharp' },
  { commaIndex: 13, name: 'Segâh', westernName: 'F#3 (5k flat)', cents: 294.34, accidental: 'koma-flat' },
  { commaIndex: 14, name: 'Uşşak', westernName: 'F#3 (4k flat)', cents: 316.98, accidental: 'flat' },
  { commaIndex: 17, name: 'Nim Bûselik', westernName: 'F#3 (1k flat)', cents: 384.91, accidental: 'koma-flat' },
  { commaIndex: 18, name: 'Bûselik (Si)', westernName: 'F#3', cents: 407.55, accidental: 'none' },
  { commaIndex: 22, name: 'Çârgâh (Do)', westernName: 'G3', cents: 498.11, accidental: 'none' },
  { commaIndex: 23, name: 'Dik Çârgâh', westernName: 'G#3 (1k)', cents: 520.75, accidental: 'koma-sharp' },
  { commaIndex: 26, name: 'Nim Hicaz', westernName: 'G#3 (4k)', cents: 588.68, accidental: 'flat' },
  { commaIndex: 27, name: 'Hicaz', westernName: 'G#3 (5k)', cents: 611.32, accidental: 'sharp' },
  { commaIndex: 30, name: 'Dik Hicaz', westernName: 'A3 (1k flat)', cents: 679.25, accidental: 'koma-flat' },
  { commaIndex: 31, name: 'Nevâ (Re)', westernName: 'A3', cents: 701.89, accidental: 'none' },
  { commaIndex: 32, name: 'Dik Nevâ', westernName: 'A#3 (1k)', cents: 724.53, accidental: 'koma-sharp' },
  { commaIndex: 35, name: 'Nim Hisar', westernName: 'A#3 (4k)', cents: 792.45, accidental: 'flat' },
  { commaIndex: 36, name: 'Hisar', westernName: 'A#3 (5k)', cents: 815.09, accidental: 'sharp' },
  { commaIndex: 39, name: 'Dik Hisar', westernName: 'B3 (1k flat)', cents: 883.02, accidental: 'koma-flat' },
  { commaIndex: 40, name: 'Hüseynî (Mi)', westernName: 'B3', cents: 905.66, accidental: 'none' },
  { commaIndex: 44, name: 'Acem (Fa)', westernName: 'C4', cents: 996.23, accidental: 'none' },
  { commaIndex: 45, name: 'Dik Acem', westernName: 'C#4 (1k)', cents: 1018.87, accidental: 'koma-sharp' },
  { commaIndex: 48, name: 'Eviç', westernName: 'C#4 (5k flat)', cents: 1086.79, accidental: 'koma-flat' },
  { commaIndex: 49, name: 'Mahur', westernName: 'C#4 (4k flat)', cents: 1109.43, accidental: 'flat' },
  { commaIndex: 52, name: 'Nim Gerdaniye', westernName: 'D4 (1k flat)', cents: 1177.36, accidental: 'koma-flat' },
  { commaIndex: 53, name: 'Gerdaniye (Sol)', westernName: 'D4', cents: 1200, accidental: 'none' }
];

// Open string references for different traditional ahenks
export const TUNING_PRESETS: TuningPreset[] = [
  {
    id: 'bolahenk',
    name: 'Bolahenk (Yerinden)',
    description: 'Klasik Türk Müziği standart akort düzeni (Sol-Re-La-Mi-Si-Fa#).',
    offsetCents: 0,
    notes: [
      { name: 'Gerdaniye (Sol)', westernNote: 'D4', frequency: 293.66 },
      { name: 'Nevâ (Re)', westernNote: 'A3', frequency: 220.00 },
      { name: 'Dügâh (La)', westernNote: 'E3', frequency: 164.81 },
      { name: 'Hüseynî Aşîran (Mi)', westernNote: 'B2', frequency: 123.47 },
      { name: 'Kaba Bûselik (Si)', westernNote: 'F#2', frequency: 92.50 },
      { name: 'Kaba Geveşt (Fa# / Bam)', westernNote: 'C#2', frequency: 69.30 }
    ]
  },
  {
    id: 'kiz',
    name: 'Kız Ahengi',
    description: 'Bolahenk düzeninden 1 tam ses (2 yarım ses) tiz akort düzeni.',
    offsetCents: 200,
    notes: [
      { name: 'Gerdaniye (Sol)', westernNote: 'E4', frequency: 329.63 },
      { name: 'Nevâ (Re)', westernNote: 'B3', frequency: 246.94 },
      { name: 'Dügâh (La)', westernNote: 'F#3', frequency: 185.00 },
      { name: 'Hüseynî Aşîran (Mi)', westernNote: 'C#3', frequency: 138.59 },
      { name: 'Kaba Bûselik (Si)', westernNote: 'G#2', frequency: 103.83 },
      { name: 'Kaba Geveşt (Fa# / Bam)', westernNote: 'D#2', frequency: 77.78 }
    ]
  },
  {
    id: 'mansur',
    name: 'Mansur Ahengi',
    description: 'Bolahenk düzeninden 1 tam ses (2 yarım ses) pes akort düzeni.',
    offsetCents: -200,
    notes: [
      { name: 'Gerdaniye (Sol)', westernNote: 'C4', frequency: 261.63 },
      { name: 'Nevâ (Re)', westernNote: 'G3', frequency: 196.00 },
      { name: 'Dügâh (La)', westernNote: 'D3', frequency: 146.83 },
      { name: 'Hüseynî Aşîran (Mi)', westernNote: 'A2', frequency: 110.00 },
      { name: 'Kaba Bûselik (Si)', westernNote: 'E2', frequency: 82.41 },
      { name: 'Kaba Geveşt (Fa# / Bam)', westernNote: 'B1', frequency: 61.74 }
    ]
  }
];

// Helper to convert Hz to cents
export function hzToCents(hz: number, refHz: number): number {
  if (hz <= 0 || refHz <= 0) return 0;
  return 1200 * Math.log2(hz / refHz);
}

// Helper to convert cents to Hz
export function centsToHz(cents: number, refHz: number): number {
  return refHz * Math.pow(2, cents / 1200);
}

// Convert Hz to Komas
export function hzToKomas(hz: number, refHz: number): number {
  if (hz <= 0 || refHz <= 0) return 0;
  return 53 * Math.log2(hz / refHz);
}

// Convert Komas to Hz
export function komasToHz(komas: number, refHz: number): number {
  return refHz * Math.pow(2, komas / 53);
}

// Map a frequency (Hz) to the closest note in the current tuning preset
export function getClosestTuningNote(frequency: number, preset: TuningPreset): {
  note: TuningNote;
  centsDeviation: number;
  komaDeviation: number;
} {
  let closestNote = preset.notes[0];
  let minDiff = Math.abs(frequency - closestNote.frequency);

  for (let i = 1; i < preset.notes.length; i++) {
    const diff = Math.abs(frequency - preset.notes[i].frequency);
    if (diff < minDiff) {
      minDiff = diff;
      closestNote = preset.notes[i];
    }
  }

  // Calculate deviations
  const centsDeviation = hzToCents(frequency, closestNote.frequency);
  const komaDeviation = hzToKomas(frequency, closestNote.frequency);

  return {
    note: closestNote,
    centsDeviation,
    komaDeviation
  };
}

// Get the corresponding frequency in Hz for a given base note (e.g. A3) and rate offset
export function getFrequencyFromBaseSample(sampleName: string, rate: number): number {
  const baseFreqs: Record<string, number> = {
    'cs2': 69.30,
    'fs2': 92.50,
    'b2': 123.47,
    'e3': 164.81,
    'a3': 220.00,
    'd4': 293.66,
    'g4': 392.00
  };
  const baseFreq = baseFreqs[sampleName.toLowerCase()] || 220.00;
  return baseFreq * rate;
}

// Get the best base sample name and playback rate to play any arbitrary frequency
export function getPlaybackRateForFrequency(targetFreq: number): {
  sampleName: string;
  rate: number;
} {
  const samples = [
    { name: 'cs2', freq: 69.30 },
    { name: 'fs2', freq: 92.50 },
    { name: 'b2', freq: 123.47 },
    { name: 'e3', freq: 164.81 },
    { name: 'a3', freq: 220.00 },
    { name: 'd4', freq: 293.66 },
    { name: 'g4', freq: 392.00 }
  ];

  // Find sample with closest log ratio (pitch distance) to avoid large pitch shifts
  let bestSample = samples[0];
  let minRatioDiff = Math.abs(Math.log2(targetFreq / bestSample.freq));

  for (let i = 1; i < samples.length; i++) {
    const ratioDiff = Math.abs(Math.log2(targetFreq / samples[i].freq));
    if (ratioDiff < minRatioDiff) {
      minRatioDiff = ratioDiff;
      bestSample = samples[i];
    }
  }

  const rate = targetFreq / bestSample.freq;
  return {
    sampleName: bestSample.name,
    rate
  };
}
