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
  offsetCents: number; // Offset compared to standard (Bolahenk/Yerinden)
  notes: TuningNote[];
}

export interface CommaDefinition {
  commaIndex: number; // 0 to 53
  name: string;       // Turkish Music Perde Name
  westernName: string; // Approximate Western Note Name
  cents: number;      // Position in cents (commaIndex * 1200 / 53)
  accidental: 'none' | 'flat' | 'sharp' | 'koma-flat' | 'koma-sharp' | 'bakiye-flat' | 'bakiye-sharp' | 'kucuk-flat' | 'kucuk-sharp';
}

// Complete 53-comma division of the octave (0 = Rast/Sol, 53 = Gerdaniye/Sol octave)
// Frequencies are calculated relative to Rast Sol3 (D3 = 146.83 Hz) in standard Bolahenk
export const COMMA_SCALE: CommaDefinition[] = [
  { commaIndex: 0, name: 'Rast', westernName: 'D3', cents: 0, accidental: 'none' },
  { commaIndex: 1, name: 'Geveşt Diyezi', westernName: 'D#3 (1k)', cents: 22.64, accidental: 'koma-sharp' },
  { commaIndex: 2, name: 'Dik Geveşt Diyezi', westernName: 'D#3 (2k)', cents: 45.28, accidental: 'koma-sharp' },
  { commaIndex: 3, name: 'Kaba Hicaz Bemolü', westernName: 'D#3 (3k)', cents: 67.92, accidental: 'koma-flat' },
  { commaIndex: 4, name: 'Nim Geveşt', westernName: 'D#3 (4k)', cents: 90.57, accidental: 'bakiye-flat' },
  { commaIndex: 5, name: 'Geveşt', westernName: 'D#3 (5k)', cents: 113.21, accidental: 'kucuk-flat' },
  { commaIndex: 6, name: 'Dik Geveşt', westernName: 'D#3 (6k)', cents: 135.85, accidental: 'none' },
  { commaIndex: 7, name: 'Zirgüle Bemolü', westernName: 'D#3 (7k)', cents: 158.49, accidental: 'flat' },
  { commaIndex: 8, name: 'Kaba Dik Kürdi', westernName: 'E3 (1k flat)', cents: 181.13, accidental: 'koma-flat' },
  { commaIndex: 9, name: 'Dügâh', westernName: 'E3', cents: 203.77, accidental: 'none' },
  { commaIndex: 10, name: 'Dik Kürdî', westernName: 'E#3 (1k)', cents: 226.42, accidental: 'koma-sharp' },
  { commaIndex: 11, name: 'Dik Dügâh Diyezi', westernName: 'E#3 (2k)', cents: 249.06, accidental: 'koma-sharp' },
  { commaIndex: 12, name: 'Segâh Bemolü', westernName: 'F3 (4k flat)', cents: 271.70, accidental: 'bakiye-flat' },
  { commaIndex: 13, name: 'Segâh', westernName: 'F#3 (5k flat)', cents: 294.34, accidental: 'kucuk-flat' },
  { commaIndex: 14, name: 'Uşşak', westernName: 'F#3 (4k flat)', cents: 316.98, accidental: 'bakiye-flat' },
  { commaIndex: 15, name: 'Dik Segâh', westernName: 'F#3 (3k flat)', cents: 339.62, accidental: 'koma-flat' },
  { commaIndex: 16, name: 'Kaba Buselik Bemolü', westernName: 'F#3 (2k flat)', cents: 362.26, accidental: 'koma-flat' },
  { commaIndex: 17, name: 'Nim Bûselik', westernName: 'F#3 (1k flat)', cents: 384.91, accidental: 'koma-flat' },
  { commaIndex: 18, name: 'Bûselik', westernName: 'F#3', cents: 407.55, accidental: 'none' },
  { commaIndex: 19, name: 'Dik Bûselik', westernName: 'G3 (1k)', cents: 430.19, accidental: 'koma-sharp' },
  { commaIndex: 20, name: 'Sabâ Bemolü', westernName: 'G3 (2k)', cents: 452.83, accidental: 'koma-flat' },
  { commaIndex: 21, name: 'Nim Sabâ', westernName: 'G3 (3k)', cents: 475.47, accidental: 'koma-flat' },
  { commaIndex: 22, name: 'Çârgâh', westernName: 'G3', cents: 498.11, accidental: 'none' },
  { commaIndex: 23, name: 'Dik Çârgâh', westernName: 'G#3 (1k)', cents: 520.75, accidental: 'koma-sharp' },
  { commaIndex: 24, name: 'Çargâh Diyezi', westernName: 'G#3 (2k)', cents: 543.40, accidental: 'koma-sharp' },
  { commaIndex: 25, name: 'Nim Hicaz', westernName: 'G#3 (4k)', cents: 588.68, accidental: 'bakiye-flat' },
  { commaIndex: 26, name: 'Hicaz', westernName: 'G#3 (5k)', cents: 611.32, accidental: 'kucuk-sharp' },
  { commaIndex: 27, name: 'Dik Hicaz', westernName: 'A3 (4k flat)', cents: 633.96, accidental: 'bakiye-flat' },
  { commaIndex: 28, name: 'Nim Nevâ Bemolü', westernName: 'A3 (3k flat)', cents: 656.60, accidental: 'koma-flat' },
  { commaIndex: 29, name: 'Dik Sabâ Diyezi', westernName: 'A3 (2k flat)', cents: 679.25, accidental: 'koma-flat' },
  { commaIndex: 30, name: 'Nim Nevâ', westernName: 'A3 (1k flat)', cents: 701.89, accidental: 'koma-flat' },
  { commaIndex: 31, name: 'Nevâ', westernName: 'A3', cents: 724.53, accidental: 'none' },
  { commaIndex: 32, name: 'Dik Nevâ', westernName: 'A#3 (1k)', cents: 747.17, accidental: 'koma-sharp' },
  { commaIndex: 33, name: 'Nevâ Diyezi', westernName: 'A#3 (2k)', cents: 769.81, accidental: 'koma-sharp' },
  { commaIndex: 34, name: 'Hisar Bemolü', westernName: 'A#3 (3k)', cents: 792.45, accidental: 'koma-flat' },
  { commaIndex: 35, name: 'Nim Hisar', westernName: 'A#3 (4k)', cents: 815.09, accidental: 'bakiye-flat' },
  { commaIndex: 36, name: 'Hisar', westernName: 'A#3 (5k)', cents: 837.74, accidental: 'kucuk-sharp' },
  { commaIndex: 37, name: 'Dik Hisar', westernName: 'B3 (4k flat)', cents: 860.38, accidental: 'bakiye-flat' },
  { commaIndex: 38, name: 'Hüseynî Bemolü', westernName: 'B3 (3k flat)', cents: 883.02, accidental: 'koma-flat' },
  { commaIndex: 39, name: 'Nim Hüseynî', westernName: 'B3 (1k flat)', cents: 905.66, accidental: 'koma-flat' },
  { commaIndex: 40, name: 'Hüseynî', westernName: 'B3', cents: 928.30, accidental: 'none' },
  { commaIndex: 41, name: 'Dik Hüseynî', westernName: 'C4 (1k)', cents: 950.94, accidental: 'koma-sharp' },
  { commaIndex: 42, name: 'Acem Bemolü', westernName: 'C4 (2k flat)', cents: 973.58, accidental: 'koma-flat' },
  { commaIndex: 43, name: 'Nim Acem', westernName: 'C4 (3k flat)', cents: 996.23, accidental: 'koma-flat' },
  { commaIndex: 44, name: 'Acem', westernName: 'C4', cents: 1018.87, accidental: 'none' },
  { commaIndex: 45, name: 'Dik Acem', westernName: 'C#4 (1k)', cents: 1041.51, accidental: 'koma-sharp' },
  { commaIndex: 46, name: 'Acem Diyezi', westernName: 'C#4 (2k)', cents: 1064.15, accidental: 'koma-sharp' },
  { commaIndex: 47, name: 'Eviç Bemolü', westernName: 'C#4 (4k flat)', cents: 1086.79, accidental: 'bakiye-flat' },
  { commaIndex: 48, name: 'Eviç', westernName: 'C#4 (5k flat)', cents: 1109.43, accidental: 'kucuk-flat' },
  { commaIndex: 49, name: 'Mahur', westernName: 'C#4 (4k flat)', cents: 1132.08, accidental: 'bakiye-flat' },
  { commaIndex: 50, name: 'Dik Eviç', westernName: 'C#4 (3k flat)', cents: 1154.72, accidental: 'koma-flat' },
  { commaIndex: 51, name: 'Gerdaniye Bemolü', westernName: 'D4 (2k flat)', cents: 1177.36, accidental: 'koma-flat' },
  { commaIndex: 52, name: 'Nim Gerdaniye', westernName: 'D4 (1k flat)', cents: 1200, accidental: 'koma-flat' },
  { commaIndex: 53, name: 'Gerdaniye', westernName: 'D4', cents: 1200, accidental: 'none' }
];

// Open string references for different traditional ahenks
export const TUNING_PRESETS: TuningPreset[] = [
  {
    id: 'bolahenk',
    name: 'Bolahenk (Yerinden)',
    description: 'Klasik Türk Musikisi yerinden (standart) akort düzeni. Gerdaniye D4 (293.66 Hz).',
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
    id: 'mustear',
    name: 'Müstear Ahengi',
    description: 'Bolahenk düzeninden 1 yarım ses tiz akort düzeni. Gerdaniye D#4 (311.13 Hz).',
    offsetCents: 100,
    notes: [
      { name: 'Gerdaniye (Sol)', westernNote: 'D#4', frequency: 311.13 },
      { name: 'Nevâ (Re)', westernNote: 'A#3', frequency: 233.08 },
      { name: 'Dügâh (La)', westernNote: 'F3', frequency: 174.61 },
      { name: 'Hüseynî Aşîran (Mi)', westernNote: 'C3', frequency: 130.81 },
      { name: 'Kaba Bûselik (Si)', westernNote: 'G2', frequency: 98.00 },
      { name: 'Kaba Geveşt (Fa# / Bam)', westernNote: 'D2', frequency: 73.42 }
    ]
  },
  {
    id: 'kiz',
    name: 'Kız Ahengi',
    description: 'Bolahenk düzeninden 1 tam ses tiz akort düzeni. Gerdaniye E4 (329.63 Hz).',
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
    description: 'Bolahenk düzeninden 1 tam ses pes akort düzeni. Gerdaniye C4 (261.63 Hz).',
    offsetCents: -200,
    notes: [
      { name: 'Gerdaniye (Sol)', westernNote: 'C4', frequency: 261.63 },
      { name: 'Nevâ (Re)', westernNote: 'G3', frequency: 196.00 },
      { name: 'Dügâh (La)', westernNote: 'D3', frequency: 146.83 },
      { name: 'Hüseynî Aşîran (Mi)', westernNote: 'A2', frequency: 110.00 },
      { name: 'Kaba Bûselik (Si)', westernNote: 'E2', frequency: 82.41 },
      { name: 'Kaba Geveşt (Fa# / Bam)', westernNote: 'B1', frequency: 61.74 }
    ]
  },
  {
    id: 'supurde',
    name: 'Süpürde Ahengi',
    description: 'Bolahenk düzeninden 5 yarım ses tiz akort düzeni. Gerdaniye G4 (392.00 Hz).',
    offsetCents: 500,
    notes: [
      { name: 'Gerdaniye (Sol)', westernNote: 'G4', frequency: 392.00 },
      { name: 'Nevâ (Re)', westernNote: 'D4', frequency: 293.66 },
      { name: 'Dügâh (La)', westernNote: 'A3', frequency: 220.00 },
      { name: 'Hüseynî Aşîran (Mi)', westernNote: 'E3', frequency: 164.81 },
      { name: 'Kaba Bûselik (Si)', westernNote: 'B2', frequency: 123.47 },
      { name: 'Kaba Geveşt (Fa# / Bam)', westernNote: 'F#2', frequency: 92.50 }
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

// Transpose a scale's comma offsets to actual frequencies under a specific preset (offset)
export function getTransposedScaleFrequencies(scaleCommas: number[], preset: TuningPreset): number[] {
  // Dügâh (La) = 9 commas in our scale. Let's find its base frequency (164.81 Hz in standard)
  // Standard La3 = 220 Hz, Dügâh is written as La3 but plays E3 (164.81 Hz) under Bolahenk.
  const dugahTuningNote = preset.notes[2]; // 3rd string is Dügâh (La)
  const dugahFrequency = dugahTuningNote.frequency;
  
  // Calculate each note relative to Dügâh (which is step 9 in COMMA_SCALE)
  return scaleCommas.map((comma) => {
    const commaDiff = comma - 9; // relative to Dügâh (La)
    return komasToHz(commaDiff, dugahFrequency);
  });
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

// Map a frequency to the closest microtonal perde in the 53-comma scale
export function getClosestMicrotonalPerde(frequency: number, preset: TuningPreset): {
  perde: CommaDefinition;
  centsDeviation: number;
  komaDeviation: number;
  targetFrequency: number;
} {
  const dugahTuningNote = preset.notes[2]; // 3rd string is Dügâh
  const dugahFrequency = dugahTuningNote.frequency;
  
  let closestPerde = COMMA_SCALE[0];
  let minDiff = Infinity;
  let closestTargetFreq = 0;
  
  for (let i = 0; i < COMMA_SCALE.length; i++) {
    const perde = COMMA_SCALE[i];
    const commaDiff = perde.commaIndex - 9; // relative to Dügâh
    const targetFreq = komasToHz(commaDiff, dugahFrequency);
    const diff = Math.abs(frequency - targetFreq);
    
    if (diff < minDiff) {
      minDiff = diff;
      closestPerde = perde;
      closestTargetFreq = targetFreq;
    }
  }
  
  const centsDeviation = hzToCents(frequency, closestTargetFreq);
  const komaDeviation = hzToKomas(frequency, closestTargetFreq);
  
  return {
    perde: closestPerde,
    centsDeviation,
    komaDeviation,
    targetFrequency: closestTargetFreq
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
