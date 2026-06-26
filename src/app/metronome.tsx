import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Square, Plus, Minus, RefreshCw, Volume2 } from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/theme';
import { playMetronomeClick } from '@/utils/audioPlayer';

interface Beat {
  type: 'dum' | 'tek' | 'silent';
  duration: number; // in eighth notes
}

interface RhythmPreset {
  id: string;
  name: string;
  timeSignature: string;
  beats: Beat[];
  description: string;
}

const RHYTHM_PRESETS: RhythmPreset[] = [
  {
    id: 'sofyan',
    name: 'Sofyan',
    timeSignature: '4/4',
    description: 'Klasik Türk müziğinin en temel 4 zamanlı usulüdür. Şarkı ve ilahilerde çok sık kullanılır.',
    beats: [
      { type: 'dum', duration: 2 },
      { type: 'tek', duration: 1 },
      { type: 'tek', duration: 1 },
    ],
  },
  {
    id: 'semai',
    name: 'Semai',
    timeSignature: '3/4',
    description: '3 zamanlı klasik usul. Saz semailerinin dördüncü hanelerinde ve oyun havalarında görülür.',
    beats: [
      { type: 'dum', duration: 2 },
      { type: 'tek', duration: 1 },
    ],
  },
  {
    id: 'duyek',
    name: 'Düyek',
    timeSignature: '8/8',
    description: '8 zamanlı en popüler usullerden biridir. Klasik peşrevlerden şarkılara kadar geniş bir yelpazede kullanılır.',
    beats: [
      { type: 'dum', duration: 2 },
      { type: 'tek', duration: 1 },
      { type: 'tek', duration: 1 },
      { type: 'dum', duration: 2 },
      { type: 'tek', duration: 2 },
    ],
  },
  {
    id: 'aksak',
    name: 'Aksak',
    timeSignature: '9/8',
    description: '9 zamanlı aksak usul. Türk halk ve sanat müziğinin en karakteristik ritmik yapılarındandır.',
    beats: [
      { type: 'dum', duration: 2 },
      { type: 'tek', duration: 2 },
      { type: 'dum', duration: 2 },
      { type: 'tek', duration: 3 },
    ],
  },
  {
    id: 'turk_aksagi',
    name: 'Türk Aksağı',
    timeSignature: '5/8',
    description: '5 zamanlı hızlı ve kıvrak usul. Rumeli ve Anadolu halk danslarında sıkça rastlanır.',
    beats: [
      { type: 'dum', duration: 2 },
      { type: 'tek', duration: 3 },
    ],
  },
  {
    id: 'yuruk_semai',
    name: 'Yürük Semai',
    timeSignature: '6/8',
    description: '6 zamanlı hareketli usul. Mevlevi ayinleri ve klasik yürük semai şarkı formlarının temelidir.',
    beats: [
      { type: 'dum', duration: 3 },
      { type: 'tek', duration: 1 },
      { type: 'tek', duration: 2 },
    ],
  },
];

const screenWidth = Dimensions.get('window').width;

export default function MetronomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [selectedRhythm, setSelectedRhythm] = useState<RhythmPreset>(RHYTHM_PRESETS[0]);
  const [bpm, setBpm] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBeatIndex, setCurrentBeatIndex] = useState<number>(-1);

  const timerRef = useRef<any>(null);
  const tapTimesRef = useRef<number[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMetronome();
    };
  }, []);

  // Update metronome loop if BPM or selected rhythm changes while playing
  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  }, [bpm, selectedRhythm]);

  const startMetronome = () => {
    setIsPlaying(true);
    let beatIdx = 0;
    setCurrentBeatIndex(0);

    const playLoop = () => {
      const currentBeat = selectedRhythm.beats[beatIdx];
      
      // Play audio click asynchronously
      if (currentBeat.type === 'dum' || currentBeat.type === 'tek') {
        playMetronomeClick(currentBeat.type);
      }

      // Calculate time to next beat based on duration (in eighth notes)
      // 1 eighth note = 30000 / BPM milliseconds
      const eighthNoteMs = 30000 / bpm;
      const beatDurationMs = currentBeat.duration * eighthNoteMs;

      timerRef.current = setTimeout(() => {
        beatIdx = (beatIdx + 1) % selectedRhythm.beats.length;
        setCurrentBeatIndex(beatIdx);
        playLoop();
      }, beatDurationMs);
    };

    playLoop();
  };

  const stopMetronome = () => {
    setIsPlaying(false);
    setCurrentBeatIndex(-1);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  const adjustBpm = (amount: number) => {
    setBpm((prev) => Math.min(240, Math.max(60, prev + amount)));
  };

  // Tap Tempo handler
  const handleTapTempo = () => {
    const now = Date.now();
    const tapTimes = tapTimesRef.current;
    
    // Clear taps if last tap was more than 2 seconds ago
    if (tapTimes.length > 0 && now - tapTimes[tapTimes.length - 1] > 2000) {
      tapTimesRef.current = [];
    }

    tapTimesRef.current.push(now);

    if (tapTimesRef.current.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
      }
      const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / averageInterval);
      
      if (calculatedBpm >= 60 && calculatedBpm <= 240) {
        setBpm(calculatedBpm);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>Metronom & Ritim</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Düm-Tek Geleneksel Ritim Rehberi
          </Text>
        </View>

        {/* Pulsing Beat Visualizer */}
        <View style={[styles.visualizerContainer, { backgroundColor: colors.backgroundElement }]}>
          <View style={styles.dotsRow}>
            {selectedRhythm.beats.map((beat, idx) => {
              const isActive = currentBeatIndex === idx;
              const isDum = beat.type === 'dum';
              
              // Colors for Düm and Tek dots
              let dotColor = 'rgba(128, 128, 128, 0.2)';
              if (isActive) {
                dotColor = isDum ? colors.primary : colors.secondary;
              } else {
                dotColor = isDum ? 'rgba(111, 70, 31, 0.3)' : 'rgba(115, 92, 0, 0.3)';
              }

              return (
                <View key={idx} style={styles.dotWrapper}>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: dotColor,
                        transform: [{ scale: isActive ? 1.3 : 1.0 }],
                        borderColor: isActive ? colors.text : 'transparent',
                        borderWidth: isActive ? 1 : 0,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.dotLabel,
                      {
                        color: isActive ? colors.text : colors.textSecondary,
                        fontFamily: isActive ? Fonts.sansBold : Fonts.sans,
                        opacity: isActive ? 1 : 0.6,
                      },
                    ]}
                  >
                    {beat.type.toUpperCase()}
                  </Text>
                  <Text style={[styles.dotDuration, { color: colors.textSecondary }]}>
                    {beat.duration}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text style={[styles.rhythmInfoText, { color: colors.textSecondary }]}>
            {selectedRhythm.name} - {selectedRhythm.timeSignature}
          </Text>
        </View>

        {/* BPM Selector */}
        <View style={styles.bpmContainer}>
          <View style={styles.bpmRow}>
            <TouchableOpacity
              onPress={() => adjustBpm(-10)}
              style={[styles.bpmAdjustBtn, { backgroundColor: colors.backgroundElement }]}
            >
              <Text style={[styles.bpmFastText, { color: colors.text }]}>-10</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => adjustBpm(-1)}
              style={[styles.bpmAdjustBtn, { backgroundColor: colors.backgroundElement }]}
            >
              <Minus size={20} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.bpmText, { color: colors.text }]}>{bpm}</Text>

            <TouchableOpacity
              onPress={() => adjustBpm(1)}
              style={[styles.bpmAdjustBtn, { backgroundColor: colors.backgroundElement }]}
            >
              <Plus size={20} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => adjustBpm(10)}
              style={[styles.bpmAdjustBtn, { backgroundColor: colors.backgroundElement }]}
            >
              <Text style={[styles.bpmFastText, { color: colors.text }]}>+10</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Primary Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            onPress={togglePlay}
            style={[
              styles.playButton,
              { backgroundColor: isPlaying ? '#bf360c' : colors.primary },
            ]}
          >
            {isPlaying ? (
              <>
                <Square size={22} color="#fff" fill="#fff" />
                <Text style={styles.playButtonText}>Durdur</Text>
              </>
            ) : (
              <>
                <Play size={22} color="#fff" fill="#fff" />
                <Text style={styles.playButtonText}>Başlat</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleTapTempo}
            style={[styles.tapButton, { borderColor: colors.secondary }]}
          >
            <RefreshCw size={18} color={colors.secondary} style={styles.tapIcon} />
            <Text style={[styles.tapButtonText, { color: colors.secondary }]}>Tap Tempo</Text>
          </TouchableOpacity>
        </View>

        {/* Rhythm Presets List */}
        <View style={styles.presetsSection}>
          <Text style={[styles.presetsSectionTitle, { color: colors.primary }]}>
            Geleneksel Usul Seçimi
          </Text>
          
          <View style={styles.presetsGrid}>
            {RHYTHM_PRESETS.map((preset) => {
              const isSelected = selectedRhythm.id === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  onPress={() => setSelectedRhythm(preset)}
                  style={[
                    styles.presetCard,
                    {
                      backgroundColor: colors.backgroundElement,
                      borderColor: isSelected ? colors.secondary : 'transparent',
                    },
                  ]}
                >
                  <View style={styles.presetCardHeader}>
                    <Text
                      style={[
                        styles.presetName,
                        {
                          color: colors.text,
                          fontFamily: isSelected ? Fonts.sansBold : Fonts.sans,
                        },
                      ]}
                    >
                      {preset.name}
                    </Text>
                    <View
                      style={[
                        styles.timeSigBadge,
                        { backgroundColor: isSelected ? colors.secondary : 'rgba(0, 0, 0, 0.05)' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.timeSigText,
                          { color: isSelected ? '#1b1c1c' : colors.textSecondary },
                        ]}
                      >
                        {preset.timeSignature}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.presetDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                    {preset.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 120,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.serifBold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    letterSpacing: 0.5,
  },
  visualizerContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  dotWrapper: {
    alignItems: 'center',
    width: 50,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 6,
  },
  dotLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  dotDuration: {
    fontSize: 8,
    fontFamily: Fonts.mono,
    marginTop: 2,
    opacity: 0.6,
  },
  rhythmInfoText: {
    fontSize: 12,
    fontFamily: Fonts.monoBold,
    letterSpacing: 1,
  },
  bpmContainer: {
    marginBottom: 28,
    alignItems: 'center',
  },
  bpmLabel: {
    fontSize: 12,
    fontFamily: Fonts.monoBold,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  bpmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 12,
  },
  bpmText: {
    fontSize: 64,
    fontFamily: Fonts.monoBold,
    lineHeight: 70,
  },
  bpmAdjustBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpmFastText: {
    fontSize: 12,
    fontFamily: Fonts.monoBold,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 4,
    gap: 8,
    flex: 1,
    maxWidth: 200,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.sansBold,
  },
  tapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    flex: 1,
    maxWidth: 160,
  },
  tapIcon: {
    marginRight: 6,
  },
  tapButtonText: {
    fontSize: 14,
    fontFamily: Fonts.sansBold,
  },
  presetsSection: {
    marginTop: 8,
  },
  presetsSectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.serifBold,
    marginBottom: 16,
  },
  presetsGrid: {
    gap: 12,
  },
  presetCard: {
    borderRadius: 4,
    padding: 14,
    borderWidth: 1.5,
  },
  presetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  presetName: {
    fontSize: 16,
  },
  timeSigBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  timeSigText: {
    fontSize: 10,
    fontFamily: Fonts.monoBold,
  },
  presetDesc: {
    fontSize: 12,
    fontFamily: Fonts.sans,
    lineHeight: 16,
  },
});
