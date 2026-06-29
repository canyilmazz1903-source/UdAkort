import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, useColorScheme, Linking } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { CommaRibbon } from '../components/CommaRibbon';
import { StaffNotation } from '../components/StaffNotation';
import { playUdPluck, stopCurrentSound } from '../utils/audioPlayer';
import { getPlaybackRateForFrequency, TUNING_PRESETS, TuningPreset } from '../utils/tsmEngine';
import { Music, Play, Square, ArrowRight, BookOpen, Compass, Award, Sliders, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/theme';

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

interface MelodyNote {
  noteIndex: number;
  durationMs: number;
}

// Procedural and hand-crafted melody generator for Seyir Training
function getSeyirMelody(makamId: string, scaleLength: number): MelodyNote[] {
  const defaultDesc = [
    { noteIndex: 0, durationMs: 600 },
    { noteIndex: 1, durationMs: 400 },
    { noteIndex: 2, durationMs: 400 },
    { noteIndex: 3, durationMs: 600 },
    { noteIndex: 2, durationMs: 400 },
    { noteIndex: 4, durationMs: 800 },
    { noteIndex: 5, durationMs: 400 },
    { noteIndex: 6, durationMs: 400 },
    { noteIndex: 7, durationMs: 800 },
    { noteIndex: 5, durationMs: 400 },
    { noteIndex: 4, durationMs: 600 },
    { noteIndex: 3, durationMs: 400 },
    { noteIndex: 2, durationMs: 400 },
    { noteIndex: 1, durationMs: 600 },
    { noteIndex: 0, durationMs: 1200 },
  ];

  if (makamId === 'rast') {
    return [
      { noteIndex: 0, durationMs: 600 },
      { noteIndex: 1, durationMs: 300 },
      { noteIndex: 2, durationMs: 300 },
      { noteIndex: 3, durationMs: 600 },
      { noteIndex: 4, durationMs: 900 },
      { noteIndex: 5, durationMs: 450 },
      { noteIndex: 6, durationMs: 450 },
      { noteIndex: 7, durationMs: 900 },
      { noteIndex: 6, durationMs: 300 },
      { noteIndex: 5, durationMs: 300 },
      { noteIndex: 4, durationMs: 600 },
      { noteIndex: 3, durationMs: 450 },
      { noteIndex: 2, durationMs: 450 },
      { noteIndex: 1, durationMs: 600 },
      { noteIndex: 0, durationMs: 1200 },
    ];
  }
  
  if (makamId === 'ussak') {
    return [
      { noteIndex: 0, durationMs: 600 },
      { noteIndex: 2, durationMs: 400 },
      { noteIndex: 1, durationMs: 400 },
      { noteIndex: 3, durationMs: 600 },
      { noteIndex: 2, durationMs: 400 },
      { noteIndex: 4, durationMs: 800 },
      { noteIndex: 3, durationMs: 400 },
      { noteIndex: 5, durationMs: 400 },
      { noteIndex: 4, durationMs: 400 },
      { noteIndex: 3, durationMs: 600 },
      { noteIndex: 2, durationMs: 400 },
      { noteIndex: 1, durationMs: 600 },
      { noteIndex: 0, durationMs: 1200 },
    ];
  }

  if (makamId === 'hicaz') {
    return [
      { noteIndex: 0, durationMs: 600 },
      { noteIndex: 1, durationMs: 300 },
      { noteIndex: 2, durationMs: 300 },
      { noteIndex: 3, durationMs: 600 },
      { noteIndex: 4, durationMs: 900 },
      { noteIndex: 3, durationMs: 450 },
      { noteIndex: 5, durationMs: 450 },
      { noteIndex: 6, durationMs: 450 },
      { noteIndex: 7, durationMs: 900 },
      { noteIndex: 5, durationMs: 300 },
      { noteIndex: 4, durationMs: 300 },
      { noteIndex: 3, durationMs: 600 },
      { noteIndex: 2, durationMs: 450 },
      { noteIndex: 1, durationMs: 450 },
      { noteIndex: 0, durationMs: 1200 },
    ];
  }

  return defaultDesc.map(note => ({
    noteIndex: Math.min(note.noteIndex, scaleLength - 1),
    durationMs: note.durationMs
  }));
}

export default function MakamScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const selectedMakamId = useAppStore((state) => state.selectedMakamId);
  const setSelectedMakamId = useAppStore((state) => state.setSelectedMakamId);
  const isScalePlaying = useAppStore((state) => state.isScalePlaying);
  const setIsScalePlaying = useAppStore((state) => state.setIsScalePlaying);
  const currentPlayingNoteIndex = useAppStore((state) => state.currentPlayingNoteIndex);
  const setCurrentPlayingNoteIndex = useAppStore((state) => state.setCurrentPlayingNoteIndex);

  // Selector menu collapsible state
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Preset state for transposition (Şed)
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bolahenk');
  const selectedPreset: TuningPreset = TUNING_PRESETS.find(p => p.id === selectedPresetId) || TUNING_PRESETS[0];

  // Seyir meşki training player state
  const [isSeyirPlaying, setIsSeyirPlaying] = useState<boolean>(false);
  const seyirTimerRef = useRef<any>(null);

  const selectedMakam: Makam = makamData.find((m: any) => m.id === selectedMakamId) || makamData[0];

  useEffect(() => {
    return () => {
      stopCurrentSound();
      stopSeyirMelody();
    };
  }, [selectedMakamId, selectedPresetId]);

  const stopSeyirMelody = () => {
    setIsSeyirPlaying(false);
    setCurrentPlayingNoteIndex(null);
    if (seyirTimerRef.current) {
      clearTimeout(seyirTimerRef.current);
      seyirTimerRef.current = null;
    }
  };

  // Helper to determine the tonic frequency (karar perdesi) of the selected makam
  const getTonicFrequency = (id: string): number => {
    if (id === 'rast' || id === 'nihavend') return 146.83; // Rast Sol3 (sounds like D3)
    if (id === 'segah' || id === 'huzzam') return 173.88; // Segah Si3 (5k flat)
    return 164.81; // Dügah La3 (sounds like E3)
  };

  const handleFindNotation = (title: string, composer: string) => {
    const query = `TRT nota arsivi ${title} ${composer}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    Linking.openURL(url).catch((err) => console.warn("Failed to open URL", err));
  };

  // Play a single note from the makam scale under selected transposition
  const playScaleNote = async (index: number) => {
    const baseTonicFreq = getTonicFrequency(selectedMakam.id);
    const tonicFreq = baseTonicFreq * Math.pow(2, selectedPreset.offsetCents / 1200);
    const commaShift = selectedMakam.scaleCommas[index];
    const targetFreq = tonicFreq * Math.pow(2, commaShift / 53);

    const { sampleName, rate } = getPlaybackRateForFrequency(targetFreq);
    await playUdPluck(sampleName, rate);
  };

  // Automated playback of the entire scale
  const handlePlayScale = async () => {
    stopSeyirMelody();
    if (isScalePlaying) {
      setIsScalePlaying(false);
      setCurrentPlayingNoteIndex(null);
      await stopCurrentSound();
      return;
    }

    setIsScalePlaying(true);
    let noteIndex = 0;

    const playNext = async () => {
      if (!useAppStore.getState().isScalePlaying) return;

      if (noteIndex < selectedMakam.scaleNotes.length) {
        setCurrentPlayingNoteIndex(noteIndex);
        await playScaleNote(noteIndex);
        noteIndex++;
        seyirTimerRef.current = setTimeout(playNext, 750);
      } else {
        setIsScalePlaying(false);
        setCurrentPlayingNoteIndex(null);
      }
    };

    playNext();
  };

  // Play Seyir Meşki training melody
  const handlePlaySeyir = async () => {
    setIsScalePlaying(false);
    if (isSeyirPlaying) {
      stopSeyirMelody();
      await stopCurrentSound();
      return;
    }

    setIsSeyirPlaying(true);
    const melody = getSeyirMelody(selectedMakam.id, selectedMakam.scaleNotes.length);
    let stepIdx = 0;

    const playStep = async () => {
      if (stepIdx < melody.length) {
        const currentNote = melody[stepIdx];
        setCurrentPlayingNoteIndex(currentNote.noteIndex);
        await playScaleNote(currentNote.noteIndex);
        stepIdx++;
        seyirTimerRef.current = setTimeout(playStep, currentNote.durationMs);
      } else {
        stopSeyirMelody();
      }
    };

    playStep();
  };

  const renderDirectionIcon = (direction: 'up' | 'down' | 'flat') => {
    if (direction === 'up') return <Text style={[styles.arrowText, { color: colors.secondary }]}>↗</Text>;
    if (direction === 'down') return <Text style={[styles.arrowText, { color: '#bf360c' }]}>↘</Text>;
    return <Text style={[styles.arrowText, { color: colors.textSecondary }]}>→</Text>;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: colors.primary, fontFamily: Fonts.serifBold }]}>Makam Rehberi</Text>
          <Text style={[styles.screenSubtitle, { color: colors.textSecondary }]}>Klasik Türk Musikisi Dizi ve Seyirleri</Text>
        </View>

        {/* Collapsible Dropdown Selector Menu */}
        <View style={styles.dropdownSection}>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111, 70, 31, 0.15)' }
            ]}
            onPress={() => setIsMenuOpen(!isMenuOpen)}
            activeOpacity={0.8}
          >
            <View style={styles.dropdownLeft}>
              <BookOpen size={18} color={colors.primary} style={styles.dropdownIcon} />
              <Text style={[styles.dropdownLabel, { color: colors.textSecondary }]}>
                Makam Seçin:{' '}
                <Text style={[styles.dropdownSelectedValue, { color: colors.secondary, fontFamily: Fonts.serifBold }]}>
                  {selectedMakam.name}
                </Text>
              </Text>
            </View>
            {isMenuOpen ? (
              <ChevronUp size={18} color={colors.secondary} />
            ) : (
              <ChevronDown size={18} color={colors.secondary} />
            )}
          </TouchableOpacity>

          {isMenuOpen && (
            <View style={[styles.verticalMenuList, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111, 70, 31, 0.15)' }]}>
              <ScrollView
                style={styles.menuScroll}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {makamData.map((makam: Makam) => {
                  const isSelected = selectedMakamId === makam.id;
                  return (
                    <TouchableOpacity
                      key={makam.id}
                      style={[
                        styles.menuItem,
                        { borderBottomColor: colors.background },
                        isSelected && { backgroundColor: 'rgba(115, 92, 0, 0.08)' }
                      ]}
                      onPress={() => {
                        setSelectedMakamId(makam.id);
                        setIsMenuOpen(false);
                        setIsScalePlaying(false);
                        stopSeyirMelody();
                      }}
                    >
                      <Text style={[
                        styles.menuItemName,
                        { color: colors.text },
                        isSelected && { color: colors.secondary, fontFamily: Fonts.sansBold }
                      ]}>
                        {makam.name}
                      </Text>
                      <Text style={[styles.menuItemSub, { color: colors.textSecondary }]}>
                        {makam.seyirType}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Selected Makam Detail Card */}
        <View style={[styles.detailContainer, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111,70,31,0.1)' }]}>
          <View style={styles.detailHeader}>
            <View>
              <Text style={[styles.makamTitle, { color: colors.text, fontFamily: Fonts.serifBold }]}>{selectedMakam.name} Makamı</Text>
              <Text style={[styles.makamInfoSub, { color: colors.textSecondary }]}>Seyir: {selectedMakam.seyirType}</Text>
            </View>
            <BookOpen size={24} color={colors.primary} />
          </View>

          {/* Quick Info Grid */}
          <View style={styles.infoGrid}>
            <View style={[styles.infoGridItem, { backgroundColor: colors.background, borderColor: 'rgba(0,0,0,0.04)' }]}>
              <Text style={[styles.infoGridLabel, { color: colors.textSecondary }]}>Durak (Karar)</Text>
              <Text style={[styles.infoGridValue, { color: colors.text }]}>{selectedMakam.durak}</Text>
            </View>
            <View style={[styles.infoGridItem, { backgroundColor: colors.background, borderColor: 'rgba(0,0,0,0.04)' }]}>
              <Text style={[styles.infoGridLabel, { color: colors.textSecondary }]}>Güçlü (Miyane)</Text>
              <Text style={[styles.infoGridValue, { color: colors.text }]}>{selectedMakam.guclu}</Text>
            </View>
            <View style={[styles.infoGridItem, { backgroundColor: colors.background, borderColor: 'rgba(0,0,0,0.04)' }]}>
              <Text style={[styles.infoGridLabel, { color: colors.textSecondary }]}>Yeden (Tonik Altı)</Text>
              <Text style={[styles.infoGridValue, { color: colors.text }]}>{selectedMakam.yeden}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.makamDescription, { color: colors.text }]}>{selectedMakam.history}</Text>
        </View>

        {/* Interactive Scale Notes Player */}
        <View style={[styles.scaleContainer, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111,70,31,0.1)' }]}>
          <View style={styles.scaleHeader}>
            <Text style={[styles.scaleTitle, { color: colors.textSecondary }]}>MAKAM DİZİSİ (NOTALAR)</Text>
            
            {/* Play Scale Button */}
            <TouchableOpacity
              style={[
                styles.playScaleButton,
                { borderColor: colors.secondary, backgroundColor: colors.background },
                isScalePlaying && { backgroundColor: '#bf360c', borderColor: '#8b0000' }
              ]}
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
                  <Play size={14} color={colors.secondary} style={styles.scalePlayIcon} fill={colors.secondary} />
                  <Text style={[styles.scalePlayText, { color: colors.secondary }]}>Diziyi Çal</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Musical Staff (Porte) Rendering */}
          <StaffNotation
            durak={selectedMakam.durak}
            scaleNotes={selectedMakam.scaleNotes}
            scaleCommas={selectedMakam.scaleCommas}
            activeIndex={currentPlayingNoteIndex}
          />

          {/* Note Buttons Row */}
          <View style={styles.notesRow}>
            {selectedMakam.scaleNotes.map((note, index) => {
              const isSounding = currentPlayingNoteIndex === index && !isSeyirPlaying;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.noteNodeButton,
                    { backgroundColor: colors.background, borderColor: 'rgba(0,0,0,0.03)' },
                    isSounding && { backgroundColor: 'rgba(115, 92, 0, 0.12)', borderColor: colors.secondary }
                  ]}
                  onPress={() => playScaleNote(index)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.noteNodeLabel,
                    { color: colors.text },
                    isSounding && { color: colors.secondary, fontFamily: Fonts.sansBold }
                  ]}>
                    {note.split(' ')[0]}
                  </Text>
                  <Text style={[styles.noteNodeCommas, { color: colors.textSecondary }]}>
                    {selectedMakam.scaleCommas[index]}k
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Transposition (Şed) Selector & Seyir Training Card */}
        <View style={[styles.detailContainer, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111,70,31,0.1)' }]}>
          {/* Şed Selector */}
          <View style={styles.sedHeader}>
            <View style={styles.sectionHeaderNoMargin}>
              <Sliders size={18} color={colors.primary} />
              <Text style={[styles.sedTitle, { color: colors.text, fontFamily: Fonts.serifBold }]}>Ahenk & Transpoze (Şed)</Text>
            </View>
          </View>
          <Text style={[styles.sedDesc, { color: colors.textSecondary }]}>
            Enstrüman ses perdesini ahenk düzenlerine göre transpoze edin.
          </Text>

          {/* Preset Buttons Grid */}
          <View style={styles.presetGrid}>
            {TUNING_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  style={[
                    styles.presetCard,
                    { backgroundColor: colors.background, borderColor: 'rgba(0,0,0,0.03)' },
                    isSelected && { borderColor: colors.secondary, backgroundColor: 'rgba(115, 92, 0, 0.08)' }
                  ]}
                  onPress={() => setSelectedPresetId(preset.id)}
                >
                  <Text style={[
                    styles.presetCardName,
                    { color: colors.text },
                    isSelected && { color: colors.secondary, fontFamily: Fonts.sansBold }
                  ]}>
                    {preset.name.split(' ')[0]}
                  </Text>
                  <Text style={[styles.presetCardOffset, { color: colors.textSecondary }]}>
                    {preset.offsetCents > 0 ? `+${preset.offsetCents}c` : `${preset.offsetCents}c`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* Seyir Meşki Audio Player */}
          <View style={styles.seyirHeader}>
            <Text style={[styles.scaleTitle, { color: colors.textSecondary }]}>SEYİR MEŞKİ (EĞİTİM)</Text>
            <TouchableOpacity
              style={[
                styles.playScaleButton,
                { borderColor: colors.primary, backgroundColor: colors.background },
                isSeyirPlaying && { backgroundColor: '#bf360c', borderColor: '#8b0000' }
              ]}
              onPress={handlePlaySeyir}
              activeOpacity={0.8}
            >
              {isSeyirPlaying ? (
                <>
                  <Square size={14} color="#fff" style={styles.scalePlayIcon} />
                  <Text style={styles.scalePlayText}>Durdur</Text>
                </>
              ) : (
                <>
                  <Play size={14} color={colors.primary} style={styles.scalePlayIcon} fill={colors.primary} />
                  <Text style={[styles.scalePlayText, { color: colors.primary }]}>Melodiyi Dinle</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <Text style={[styles.sedDesc, { color: colors.textSecondary }]}>
            Makamın melodik karakterini (çıkıcı/inici seyrini) geleneksel bir etüt cümlesiyle dinleyerek çalışın.
          </Text>
        </View>

        {/* Seyir Steps Flowchart */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Compass size={18} color={colors.secondary} />
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SEYİR AKIŞ REHBERİ</Text>
          </View>

          <View style={styles.flowchartContainer}>
            {selectedMakam.seyirSteps.map((step, idx) => (
              <View key={idx} style={styles.flowStepWrapper}>
                <View style={[styles.flowStepCard, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111,70,31,0.06)' }]}>
                  <View style={styles.flowStepHeader}>
                    <Text style={[styles.flowStepNumber, { color: colors.primary }]}>ADIM {idx + 1}</Text>
                    {renderDirectionIcon(step.direction)}
                  </View>
                  <Text style={[styles.flowStepText, { color: colors.text }]}>{step.text}</Text>
                </View>
                {idx < selectedMakam.seyirSteps.length - 1 && (
                  <View style={styles.flowConnector}>
                    <ArrowRight size={16} color={colors.textSecondary} />
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
            <Award size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>İMZA ESERLER ARŞİVİ</Text>
          </View>

          <View style={[styles.notationInfoBox, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111,70,31,0.1)' }]}>
            <Text style={[styles.notationInfoTitle, { color: colors.primary, fontFamily: Fonts.serifBold }]}>Nota Arşivleri Hakkında</Text>
            <Text style={[styles.notationInfoDesc, { color: colors.textSecondary }]}>
              Klasik eserlerin resmi TRT ve Neyzen notasyonlarına ulaşmak için "Notayı Bul" butonuna basarak Google üzerinde aratabilir ve PDF dosyalarını indirebilirsiniz. Ayrıca popüler arşiv sitelerini ziyaret edebilirsiniz:
            </Text>
            <View style={styles.archiveLinksRow}>
              <TouchableOpacity onPress={() => Linking.openURL('http://www.trtnotaarsivi.com')} style={styles.archiveLinkBtn}>
                <Text style={[styles.archiveLinkText, { color: colors.secondary, fontFamily: Fonts.sansBold }]}>TRT Not Arşivi</Text>
              </TouchableOpacity>
              <Text style={{ color: colors.textSecondary }}>•</Text>
              <TouchableOpacity onPress={() => Linking.openURL('http://www.neyzen.com')} style={styles.archiveLinkBtn}>
                <Text style={[styles.archiveLinkText, { color: colors.secondary, fontFamily: Fonts.sansBold }]}>Neyzen.com</Text>
              </TouchableOpacity>
              <Text style={{ color: colors.textSecondary }}>•</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://divanmakam.com')} style={styles.archiveLinkBtn}>
                <Text style={[styles.archiveLinkText, { color: colors.secondary, fontFamily: Fonts.sansBold }]}>Dîvân Makam</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.compositionsGrid}>
            {selectedMakam.compositions.map((comp, idx) => (
              <View key={idx} style={[styles.compositionCard, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111,70,31,0.06)' }]}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Music size={18} color={colors.textSecondary} style={styles.compIcon} />
                  <View style={styles.compInfo}>
                    <Text style={[styles.compTitle, { color: colors.text }]}>{comp.title}</Text>
                    <Text style={[styles.compComposer, { color: colors.textSecondary }]}>{comp.composer} ({comp.form})</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.findNotationButton, { backgroundColor: colors.background, borderColor: colors.backgroundSelected }]}
                  onPress={() => handleFindNotation(comp.title, comp.composer)}
                  activeOpacity={0.7}
                >
                  <Compass size={14} color={colors.secondary} />
                  <Text style={[styles.findNotationText, { color: colors.secondary, fontFamily: Fonts.sansBold }]}>Notayı Bul</Text>
                </TouchableOpacity>
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
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 10,
    paddingBottom: Platform.OS === 'ios' ? 100 : 120,
    alignItems: 'stretch',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 26,
    letterSpacing: 0.5,
  },
  screenSubtitle: {
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 0.5,
    fontFamily: Fonts.sans,
  },
  dropdownSection: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 999,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownLabel: {
    fontSize: 14,
    fontFamily: Fonts.sans,
  },
  dropdownSelectedValue: {
    fontSize: 14.5,
  },
  verticalMenuList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    maxHeight: 240,
    borderRadius: 4,
    borderWidth: 1.5,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  menuScroll: {
    padding: 4,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemName: {
    fontSize: 14,
    fontFamily: Fonts.sans,
  },
  menuItemSub: {
    fontSize: 10,
    fontFamily: Fonts.sans,
    opacity: 0.7,
  },
  detailContainer: {
    borderRadius: 4,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(111,70,31,0.08)',
    paddingBottom: 10,
    marginBottom: 12,
  },
  makamTitle: {
    fontSize: 20,
  },
  makamInfoSub: {
    fontSize: 11,
    fontFamily: Fonts.sans,
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
    borderRadius: 4,
    borderWidth: 1,
    padding: 8,
  },
  infoGridLabel: {
    fontSize: 9,
    fontFamily: Fonts.sansBold,
    letterSpacing: 0.5,
  },
  infoGridValue: {
    fontSize: 11,
    fontFamily: Fonts.sansBold,
    marginTop: 4,
  },
  makamDescription: {
    fontSize: 12,
    fontFamily: Fonts.sans,
    lineHeight: 18,
  },
  scaleContainer: {
    borderRadius: 4,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  scaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scaleTitle: {
    fontSize: 11,
    fontFamily: Fonts.sansBold,
    letterSpacing: 1.5,
  },
  playScaleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  scalePlayIcon: {
    marginRight: 6,
  },
  scalePlayText: {
    fontSize: 11,
    fontFamily: Fonts.sansBold,
    color: '#fff',
  },
  notesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: 6,
  },
  noteNodeButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteNodeLabel: {
    fontSize: 10,
    fontFamily: Fonts.sans,
  },
  noteNodeCommas: {
    fontSize: 8,
    fontFamily: Fonts.mono,
    marginTop: 4,
  },
  sedHeader: {
    marginBottom: 6,
  },
  sectionHeaderNoMargin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sedTitle: {
    fontSize: 16,
  },
  sedDesc: {
    fontSize: 12,
    fontFamily: Fonts.sans,
    marginBottom: 12,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  presetCard: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
  },
  presetCardName: {
    fontSize: 12,
    fontFamily: Fonts.sans,
  },
  presetCardOffset: {
    fontSize: 9,
    fontFamily: Fonts.mono,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(111,70,31,0.08)',
    marginVertical: 16,
  },
  seyirHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
    fontFamily: Fonts.sansBold,
    letterSpacing: 1.5,
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
    borderWidth: 1,
    borderRadius: 4,
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
    fontFamily: Fonts.sansBold,
    letterSpacing: 1,
  },
  arrowText: {
    fontSize: 16,
    fontFamily: Fonts.sansBold,
  },
  flowStepText: {
    fontSize: 11,
    fontFamily: Fonts.sans,
    lineHeight: 15,
  },
  flowConnector: {
    alignItems: 'center',
    marginVertical: 4,
    transform: [{ rotate: '90deg' }],
  },
  compositionsGrid: {
    gap: 8,
  },
  compositionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
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
    fontFamily: Fonts.sansBold,
  },
  compComposer: {
    fontSize: 10,
    fontFamily: Fonts.sans,
    marginTop: 2,
  },
  notationInfoBox: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 14,
    marginBottom: 12,
  },
  notationInfoTitle: {
    fontSize: 14,
    marginBottom: 6,
  },
  notationInfoDesc: {
    fontSize: 11,
    fontFamily: Fonts.sans,
    lineHeight: 16,
  },
  archiveLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  archiveLinkBtn: {
    paddingVertical: 2,
  },
  archiveLinkText: {
    fontSize: 11,
  },
  findNotationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
  },
  findNotationText: {
    fontSize: 10,
  },
});
