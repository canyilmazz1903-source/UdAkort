const fs = require('fs');
const path = require('path');

// Ensure output directory exists
const soundsDir = path.join(__dirname, '..', 'assets', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

const SAMPLE_RATE = 44100;
const DURATION = 3.0; // seconds

// 16-bit WAV writer helper
function createWavBuffer(samples) {
  const buffer = Buffer.alloc(44 + samples.length * 2);

  // RIFF identifier
  buffer.write('RIFF', 0);
  // file length minus RIFF identifier length
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  // RIFF type
  buffer.write('WAVE', 8);
  // format chunk identifier
  buffer.write('fmt ', 12);
  // format chunk length
  buffer.writeUInt32LE(16, 16);
  // sample format (raw)
  buffer.writeUInt16LE(1, 20);
  // channel count
  buffer.writeUInt16LE(1, 22);
  // sample rate
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  // byte rate = sampleRate * channels * bitsPerSample / 8
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  // block align = channels * bitsPerSample / 8
  buffer.writeUInt16LE(2, 32);
  // bits per sample
  buffer.writeUInt16LE(16, 34);
  // data chunk identifier
  buffer.write('data', 36);
  // data chunk length
  buffer.writeUInt32LE(samples.length * 2, 40);

  // Write PCM audio samples
  for (let i = 0; i < samples.length; i++) {
    const val = Math.max(-1, Math.min(1, samples[i]));
    const pcm = val < 0 ? val * 0x8000 : val * 0x7fff;
    buffer.writeInt16LE(pcm, 44 + i * 2);
  }

  return buffer;
}

// Karplus-Strong Plucked String Synthesis
function generatePluck(frequency) {
  const totalSamples = SAMPLE_RATE * DURATION;
  const samples = new Float32Array(totalSamples);

  // Define two slightly detuned strings to simulate double courses of the Ud
  const f1 = frequency;
  const f2 = frequency * 1.0025; // Detuned course

  const N1 = Math.round(SAMPLE_RATE / f1);
  const N2 = Math.round(SAMPLE_RATE / f2);

  const delayLine1 = new Float32Array(N1);
  const delayLine2 = new Float32Array(N2);

  // Initialize delay lines with white noise (pluck strike)
  for (let i = 0; i < N1; i++) delayLine1[i] = Math.random() * 2.0 - 1.0;
  for (let i = 0; i < N2; i++) delayLine2[i] = Math.random() * 2.0 - 1.0;

  // Add low-pass strike simulation: smooth the initial noise buffer slightly
  for (let i = 1; i < N1; i++) {
    delayLine1[i] = 0.5 * (delayLine1[i] + delayLine1[i - 1]);
  }
  for (let i = 1; i < N2; i++) {
    delayLine2[i] = 0.5 * (delayLine2[i] + delayLine2[i - 1]);
  }

  // Base decay rate based on frequency to make higher notes decay faster
  // Q-factor simulation for Ud string (shorter, woody decay)
  const baseDecay = 0.996 - (frequency / 2000) * 0.008;

  // Generate samples
  for (let i = 0; i < totalSamples; i++) {
    const val1 = delayLine1[i % N1];
    const val2 = delayLine2[i % N2];

    // Karplus-Strong feedback update with averaging
    const nextVal1 = 0.5 * (val1 + delayLine1[(i + 1) % N1]) * baseDecay;
    const nextVal2 = 0.5 * (val2 + delayLine2[(i + 1) % N2]) * baseDecay;

    delayLine1[i % N1] = nextVal1;
    delayLine2[i % N2] = nextVal2;

    // Combine courses (50/50 mix)
    let mixedVal = 0.5 * (val1 + val2);

    // Apply overall amplitude envelope (slight fade-out at the very end to prevent clicks)
    if (i > totalSamples - 1000) {
      const fade = (totalSamples - i) / 1000;
      mixedVal *= fade;
    }

    samples[i] = mixedVal;
  }

  // Normalize samples to peak at 0.95 to prevent clipping
  let peak = 0;
  for (let i = 0; i < totalSamples; i++) {
    const abs = Math.abs(samples[i]);
    if (abs > peak) peak = abs;
  }
  if (peak > 0) {
    const norm = 0.95 / peak;
    for (let i = 0; i < totalSamples; i++) {
      samples[i] *= norm;
    }
  }

  return samples;
}

// 7 base notes covering the full Ud pitch range
const baseNotes = {
  'cs2': 69.30,  // C#2 (Mansur lowest string)
  'fs2': 92.50,  // F#2 (Standard lowest string)
  'b2': 123.47,  // B2
  'e3': 164.81,  // E3
  'a3': 220.00,  // A3 (Dügah - standard tuning reference)
  'd4': 293.66,  // D4 (Neva)
  'g4': 392.00   // G4 (Gerdaniye - highest string)
};

console.log('Generating Ud plucked string sound assets...');

Object.entries(baseNotes).forEach(([name, freq]) => {
  console.log(`Synthesizing ${name.toUpperCase()} (${freq.toFixed(2)} Hz)...`);
  const samples = generatePluck(freq);
  const buffer = createWavBuffer(samples);
  const filepath = path.join(soundsDir, `${name}.wav`);
  fs.writeFileSync(filepath, buffer);
});

// Helper for normalization
function normalize(samples) {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const abs = Math.abs(samples[i]);
    if (abs > peak) peak = abs;
  }
  if (peak > 0) {
    const norm = 0.95 / peak;
    for (let i = 0; i < samples.length; i++) {
      samples[i] *= norm;
    }
  }
  return samples;
}

// Synthesizes a deep "Düm" percussion sound (bass drum pitch slide + decay)
function generateDum() {
  const totalSamples = SAMPLE_RATE * 1.0;
  const samples = new Float32Array(totalSamples);
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 60 + 25 * Math.exp(-t * 20);
    const phase = 2 * Math.PI * freq * t;
    let val = Math.sin(phase);
    
    const noise = Math.max(0, 0.4 * (1.0 - t * 50));
    val += (Math.random() * 2.0 - 1.0) * noise;
    
    const amp = Math.exp(-t * 5.0);
    samples[i] = val * amp;
  }
  return normalize(samples);
}

// Synthesizes a crisp "Tek" percussion sound (wood block / high-pitch strike)
function generateTek() {
  const totalSamples = SAMPLE_RATE * 0.4;
  const samples = new Float32Array(totalSamples);
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 650;
    const phase = 2 * Math.PI * freq * t;
    let val = Math.sin(phase);
    
    const noise = Math.max(0, 0.7 * (1.0 - t * 80));
    val += (Math.random() * 2.0 - 1.0) * noise;
    
    const amp = Math.exp(-t * 25.0);
    samples[i] = val * amp;
  }
  return normalize(samples);
}

console.log('Generating metronome sound assets...');

console.log('Synthesizing DÜM (dum.wav)...');
const dumSamples = generateDum();
fs.writeFileSync(path.join(soundsDir, 'dum.wav'), createWavBuffer(dumSamples));

console.log('Synthesizing TEK (tek.wav)...');
const tekSamples = generateTek();
fs.writeFileSync(path.join(soundsDir, 'tek.wav'), createWavBuffer(tekSamples));

console.log('Sound assets successfully generated in assets/sounds/');
