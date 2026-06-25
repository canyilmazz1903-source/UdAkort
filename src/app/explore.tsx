import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { CommaRibbon } from '../components/CommaRibbon';
import { playUdPluck, stopCurrentSound } from '../utils/audioPlayer';
import { getPlaybackRateForFrequency } from '../utils/tsmEngine';
import { Music, Play, Square, ArrowRight, BookOpen, Compass, Award } from 'lucide-react-native';

// Import makam database
const makamData = require('../data/makams.json');

interface Makam {
  id: string;
  name: string;
  durak: string;
  guclu: string;
  yeden: string;
  seyirType: string;
  history: string;
  intervals: number[];
  scaleNotes: string[];
  scaleCommas: number[];
  compositions: { title: string; form: string; composer: string }[];
  seyirSteps: { text: string; direction: 'up' | 'down' | 'flat' }[];
}

export default function MakamScreen() {
  const selectedMakamId = useAppStore((state) => state.selectedMakamId);
  const setSelectedMakamId = useAppStore((state) => state.setSelectedMakamId);
  const isScalePlaying = useAppStore((state) => state.isScalePlaying);
  const setIsScalePlaying = useAppStore((state) => state.setIsScalePlaying);
  const currentPlayingNoteIndex = useAppStore((state) => state.currentPlayingNoteIndex);
  const setCurrentPlayingNoteIndex = useAppStore((state) => state.setCurrentPlayingNoteIndex);

  const selectedMakam: Makam = makamData.find((m: any) => m.id === selectedMakamId) || makamData[0];

  useEffect(() => {
    // Stop any playing sound on leave
    return () => {
      stopCurrentSound();
    };
  }, [selectedMakamId]);

  // Helper to determine the tonic frequency (karar perdesi) of the selected makam
  const getTonicFrequency = (id: string): number => {
    if (id === 'rast' || id === 'nihavend') return 146.83; // Rast Sol3 (sounds like D3)
    if (id === 'segah' || id === 'huzzam') return 173.88; // Segah Si3 (5k flat)
    return 164.81; // Dügah La3 (sounds like E3)
  };

  // Play a single note from the makam scale
  const playScaleNote = async (index: number) => {
    const tonicFreq = getTonicFrequency(selectedMakam.id);
    const commaShift = selectedMakam.scaleCommas[index];
    const targetFreq = tonicFreq * Math.pow(2, commaShift / 53);

    const { sampleName, rate } = getPlaybackRateForFrequency(targetFreq);
    await playUdPluck(sampleName, rate);
  };

  // Automated playback of the entire scale
  const handlePlayScale = async () => {
    if (isScalePlaying) {
      setIsScalePlaying(false);
      setCurrentPlayingNoteIndex(null);
      await stopCurrentSound();
      return;
    }

    setIsScalePlaying(true);
    let noteIndex = 0;

    const playNext = async () => {
      // Check if user clicked stop
      if (!useAppStore.getState().isScalePlaying) return;

      if (noteIndex < selectedMakam.scaleNotes.length) {
        setCurrentPlayingNoteIndex(noteIndex);
        await playScaleNote(noteIndex);
        noteIndex++;
        // Play next note after 700ms
        setTimeout(playNext, 700);
      } else {
        // Finished playing scale
        setIsScalePlaying(false);
        setCurrentPlayingNoteIndex(null);
      }
    };

    playNext();
  };

  const renderDirectionIcon = (direction: 'up' | 'down' | 'flat') => {
    if (direction === 'up') return <Text style={[styles.arrowText, { color: '#D4AF37' }]}>↗</Text>;
    if (direction === 'down') return <Text style={[styles.arrowText, { color: '#B22222' }]}>↘</Text>;
    return <Text style={[styles.arrowText, { color: '#808000' }]}>→</Text>;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Makam Rehberi</Text>
          <Text style={styles.screenSubtitle}>Klasik Türk Musikisi Dizi ve Seyirleri</Text>
        </View>

        {/* Makam Horizontal Selector List */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.makamSelectorScroll}
          contentContainerStyle={styles.makamSelectorContainer}
        >
          {makamData.map((makam: Makam) => {
            const isSelected = selectedMakamId === makam.id;
            return (
              <TouchableOpacity
                key={makam.id}
                style={[
                  styles.makamCard,
                  isSelected && styles.makamCardActive
                ]}
                onPress={() => {
                  setSelectedMakamId(makam.id);
                  setIsScalePlaying(false);
                  setCurrentPlayingNoteIndex(null);
                }}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.makamCardName,
                  isSelected && styles.makamCardNameActive
                ]}>
                  {makam.name}
                </Text>
                <Text style={styles.makamCardSub}>{makam.seyirType}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Makam Detail Card */}
        <View style={styles.detailContainer}>
          <View style={styles.detailHeader}>
            <View>
              <Text style={styles.makamTitle}>{selectedMakam.name} Makamı</Text>
              <Text style={styles.makamInfoSub}>Seyir: {selectedMakam.seyirType}</Text>
            </View>
            <BookOpen size={24} color="#808000" />
          </View>

          {/* Quick Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoGridLabel}>Durak (Karar)</Text>
              <Text style={styles.infoGridValue}>{selectedMakam.durak}</Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoGridLabel}>Güçlü (Miyane)</Text>
              <Text style={styles.infoGridValue}>{selectedMakam.guclu}</Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoGridLabel}>Yeden (Tonik Altı)</Text>
              <Text style={styles.infoGridValue}>{selectedMakam.yeden}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.makamDescription}>{selectedMakam.history}</Text>
        </View>

        {/* Interactive Scale Notes Player */}
        <View style={styles.scaleContainer}>
          <View style={styles.scaleHeader}>
            <Text style={styles.scaleTitle}>MAKAM DİZİSİ (NOTALAR)</Text>
            
            {/* Play Scale Button */}
            <TouchableOpacity
              style={[styles.playScaleButton, isScalePlaying && styles.playScaleButtonActive]}
              onPress={handlePlayScale}
              activeOpacity={0.8}
            >
              {isScalePlaying ? (
                <>
                  <Square size={14} color="#fff" style={styles.scalePlayIcon} />
                  <Text style={styles.scalePlayText}>Durdur</Text>
                </>
              ) : (
                <>
                  <Play size={14} color="#D4AF37" style={styles.scalePlayIcon} fill="#D4AF37" />
                  <Text style={[styles.scalePlayText, { color: '#D4AF37' }]}>Diziyi Çal</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Note Buttons Row */}
          <View style={styles.notesRow}>
            {selectedMakam.scaleNotes.map((note, index) => {
              const isSounding = currentPlayingNoteIndex === index;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.noteNodeButton,
                    isSounding && styles.noteNodeButtonPlaying
                  ]}
                  onPress={() => playScaleNote(index)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.noteNodeLabel,
                    isSounding && styles.noteNodeLabelPlaying
                  ]}>
                    {note}
                  </Text>
                  <Text style={styles.noteNodeCommas}>
                    {selectedMakam.scaleCommas[index]}k
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Seyir Steps Flowchart */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Compass size={18} color="#D4AF37" />
            <Text style={styles.sectionTitle}>SEYİR AKIŞ ŞEMASI</Text>
          </View>

          <View style={styles.flowchartContainer}>
            {selectedMakam.seyirSteps.map((step, idx) => (
              <View key={idx} style={styles.flowStepWrapper}>
                <View style={styles.flowStepCard}>
                  <View style={styles.flowStepHeader}>
                    <Text style={styles.flowStepNumber}>ADIM {idx + 1}</Text>
                    {renderDirectionIcon(step.direction)}
                  </View>
                  <Text style={styles.flowStepText}>{step.text}</Text>
                </View>
                {idx < selectedMakam.seyirSteps.length - 1 && (
                  <View style={styles.flowConnector}>
                    <ArrowRight size={16} color="#333" />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Interactive AEÜ 53-comma fretboard component */}
        <CommaRibbon />

        {/* Masterpieces Archive */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Award size={18} color="#808000" />
            <Text style={styles.sectionTitle}>İMZA ESERLER ARŞİVİ</Text>
          </View>

          <View style={styles.compositionsGrid}>
            {selectedMakam.compositions.map((comp, idx) => (
              <View key={idx} style={styles.compositionCard}>
                <Music size={18} color="#444" style={styles.compIcon} />
                <View style={styles.compInfo}>
                  <Text style={styles.compTitle}>{comp.title}</Text>
                  <Text style={styles.compComposer}>{comp.composer} ({comp.form})</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 10,
    paddingBottom: 40,
    alignItems: 'stretch',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  makamSelectorScroll: {
    marginBottom: 20,
    marginHorizontal: -20,
  },
  makamSelectorContainer: {
    paddingHorizontal: 20,
    gap: 10,
    height: 58,
  },
  makamCard: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1d1d1d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  makamCardActive: {
    borderColor: '#808000', // Olive Green border
    backgroundColor: 'rgba(128, 128, 0, 0.12)',
  },
  makamCardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
  },
  makamCardNameActive: {
    color: '#D4AF37', // Gold name
  },
  makamCardSub: {
    fontSize: 9,
    color: '#444',
    marginTop: 2,
  },
  detailContainer: {
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1d1d1d',
    padding: 16,
    marginBottom: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingBottom: 10,
    marginBottom: 12,
  },
  makamTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  makamInfoSub: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  infoGridItem: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    padding: 8,
  },
  infoGridLabel: {
    fontSize: 9,
    color: '#444',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  infoGridValue: {
    fontSize: 11,
    color: '#ccc',
    fontWeight: 'bold',
    marginTop: 4,
  },
  makamDescription: {
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
  scaleContainer: {
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1d1d1d',
    padding: 16,
    marginBottom: 20,
  },
  scaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  scaleTitle: {
    fontSize: 11,
    color: '#555',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  playScaleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#808000',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  playScaleButtonActive: {
    backgroundColor: '#B22222',
    borderColor: '#8b0000',
  },
  scalePlayIcon: {
    marginRight: 6,
  },
  scalePlayText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  notesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  noteNodeButton: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#1e1e1e',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteNodeButtonPlaying: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: '#D4AF37',
  },
  noteNodeLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#888',
  },
  noteNodeLabelPlaying: {
    color: '#D4AF37',
  },
  noteNodeCommas: {
    fontSize: 8,
    color: '#444',
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  flowchartContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 8,
  },
  flowStepWrapper: {
    alignItems: 'stretch',
  },
  flowStepCard: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1d1d1d',
    borderRadius: 10,
    padding: 12,
  },
  flowStepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  flowStepNumber: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#808000',
    letterSpacing: 1,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  flowStepText: {
    fontSize: 11,
    color: '#999',
    lineHeight: 15,
  },
  flowConnector: {
    alignItems: 'center',
    marginVertical: 4,
    transform: [{ rotate: '90deg' }], // rotate arrow down
  },
  compositionsGrid: {
    gap: 8,
  },
  compositionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1d1d1d',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  compIcon: {
    opacity: 0.6,
  },
  compInfo: {
    flex: 1,
  },
  compTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#eee',
  },
  compComposer: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
});
