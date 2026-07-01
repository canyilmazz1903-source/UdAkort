import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, SafeAreaView, useColorScheme, AppState } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAppStore } from '../store/useAppStore';
import { useFocusEffect } from 'expo-router';
import { TUNING_PRESETS, COMMA_SCALE } from '../utils/tsmEngine';
import { startTuning, stopTuning, checkMicrophonePermission } from '../utils/tunerService';
import { DeviationGauge } from '../components/DeviationGauge';
import { Info, Sliders, Music, Radio, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/theme';
import { playUdPluck } from '../utils/audioPlayer';

const SeljukPattern = ({ strokeColor }: { strokeColor: string }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%" viewBox="0 0 100 100" style={styles.seljukSvg} opacity={0.035}>
      {/* Central Seljuk Medallion (8-pointed star & nested geometries) */}
      <Path
        d="M 50 10 L 62 38 L 90 50 L 62 62 L 50 90 L 38 62 L 10 50 L 38 38 Z"
        fill="none"
        stroke={strokeColor}
        strokeWidth={1}
      />
      <Path
        d="M 50 20 L 59 41 L 80 50 L 59 59 L 50 80 L 41 59 L 20 50 L 41 41 Z"
        fill="none"
        stroke={strokeColor}
        strokeWidth={0.8}
      />
      <Path
        d="M 50 30 L 56 44 L 70 50 L 56 56 L 50 70 L 44 56 L 30 50 L 44 44 Z"
        fill="none"
        stroke={strokeColor}
        strokeWidth={0.6}
      />
      {/* Cross intersecting lines */}
      <Path
        d="M 50 0 L 50 100 M 0 50 L 100 50 M 15 15 L 85 85 M 15 85 L 85 15"
        fill="none"
        stroke={strokeColor}
        strokeWidth={0.3}
      />
      {/* Outer border details */}
      <Path
        d="M 5 5 L 95 5 L 95 95 L 5 95 Z M 8 8 L 92 8 L 92 92 L 8 92 Z"
        fill="none"
        stroke={strokeColor}
        strokeWidth={0.5}
      />
    </Svg>
  </View>
);

export default function HomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [isKomaMenuOpen, setIsKomaMenuOpen] = useState<boolean>(false);

  const {
    currentPreset,
    detectedFrequency,
    closestNote,
    centsDeviation,
    komaDeviation,
    isListening,
    hasMicPermission,
    tunerMode,
    selectedPerdeIndex,
    activePegIndex,
    setPreset,
    setTunerMode,
    setSelectedPerdeIndex,
    setActivePegIndex,
  } = useAppStore();

  // Manage tuner lifecycle based on tab focus and app active state
  useFocusEffect(
    React.useCallback(() => {
      let isFocused = true;

      const initTuning = async () => {
        if (!isFocused) return;
        await checkMicrophonePermission();
        await startTuning();
      };
      
      initTuning();

      // Listen to AppState changes (e.g. background/foreground)
      const handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          stopTuning();
        } else if (nextAppState === 'active' && isFocused) {
          initTuning();
        }
      };

      const appStateSub = AppState.addEventListener('change', handleAppStateChange);

      return () => {
        isFocused = false;
        stopTuning();
        appStateSub.remove();
      };
    }, [tunerMode, selectedPerdeIndex]) // Restart if mode/perde changes while focused
  );

  const activePerde = COMMA_SCALE[selectedPerdeIndex];

  const handleStringPress = async (index: number) => {
    const targetNote = currentPreset.notes[index];
    setActivePegIndex(index);

    const targetFreq = targetNote.frequency;
    
    // Find closest base sample
    const samples = [
      { name: 'cs2', freq: 69.30 },
      { name: 'fs2', freq: 92.50 },
      { name: 'b2', freq: 123.47 },
      { name: 'e3', freq: 164.81 },
      { name: 'a3', freq: 220.00 },
      { name: 'd4', freq: 293.66 },
      { name: 'g4', freq: 392.00 }
    ];

    let bestSample = samples[0];
    let minRatioDiff = Math.abs(Math.log2(targetFreq / bestSample.freq));

    for (let i = 1; i < samples.length; i++) {
      const ratioDiff = Math.abs(Math.log2(targetFreq / samples[i].freq));
      if (ratioDiff < minRatioDiff) {
        minRatioDiff = ratioDiff;
        bestSample = samples[i];
      }
    }

    const playbackRate = targetFreq / bestSample.freq;

    // Play the synthesised Ud sample with pitch rate adjustment
    await playUdPluck(bestSample.name, playbackRate);

    // Reset active peg visual highlight after 3 seconds (when sound fades)
    setTimeout(() => {
      if (useAppStore.getState().activePegIndex === index) {
        setActivePegIndex(null);
      }
    }, 3000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Seljuk geometric background */}
      <SeljukPattern strokeColor={colors.primary} />

      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.appTitle, { color: colors.primary, fontFamily: Fonts.serifBold }]}>
            UdAkort <Text style={[styles.versionText, { color: colors.secondary }]}>2.2</Text>
          </Text>
          <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
            Türk Musikisi Akort Sistemi (AEÜ)
          </Text>
        </View>

        {/* Mode Segmented Control: Standart vs Koma */}
        <View style={[styles.modeSelectorContainer, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111,70,31,0.1)' }]}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              tunerMode === 'standard' && [styles.modeButtonActive, { backgroundColor: colors.background, borderColor: 'rgba(0,0,0,0.03)' }]
            ]}
            onPress={() => setTunerMode('standard')}
          >
            <Radio size={16} color={tunerMode === 'standard' ? colors.secondary : colors.textSecondary} style={styles.modeIcon} />
            <Text style={[
              styles.modeButtonText,
              { color: colors.textSecondary },
              tunerMode === 'standard' && { color: colors.secondary, fontFamily: Fonts.sansBold }
            ]}>
              Standart Akort
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              tunerMode === 'koma' && [styles.modeButtonActive, { backgroundColor: colors.background, borderColor: 'rgba(0,0,0,0.03)' }]
            ]}
            onPress={() => setTunerMode('koma')}
          >
            <Sliders size={16} color={tunerMode === 'koma' ? colors.secondary : colors.textSecondary} style={styles.modeIcon} />
            <Text style={[
              styles.modeButtonText,
              { color: colors.textSecondary },
              tunerMode === 'koma' && { color: colors.secondary, fontFamily: Fonts.sansBold }
            ]}>
              Koma Akort (AEÜ)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Ahenk Selector (only for Standard Mode) */}
        {tunerMode === 'standard' && (
          <View style={[styles.selectorContainer, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111,70,31,0.1)' }]}>
            <Text style={[styles.selectorLabel, { color: colors.textSecondary }]}>AHENK DÜZENİ</Text>
            <View style={styles.segmentedControl}>
              {TUNING_PRESETS.map((preset) => {
                const isSelected = currentPreset.id === preset.id;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    style={[
                      styles.segmentButton,
                      isSelected && [styles.segmentButtonActive, { backgroundColor: colors.background, borderColor: 'rgba(0,0,0,0.02)' }]
                    ]}
                    onPress={() => setPreset(preset.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.segmentText,
                      { color: colors.textSecondary },
                      isSelected && { color: colors.secondary, fontFamily: Fonts.sansBold }
                    ]}>
                      {preset.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={[styles.presetDescription, { color: colors.textSecondary }]}>{currentPreset.description}</Text>
          </View>
        )}

        {/* Microtonal Perde Picker (only for Koma Mode) */}
        {tunerMode === 'koma' && (
          <View style={[styles.selectorContainer, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111,70,31,0.15)', zIndex: 999 }]}>
            <Text style={[styles.selectorLabel, { color: colors.textSecondary }]}>HEDEF KOMA PERDESİ SEÇİN</Text>
            
            <View style={[styles.dropdownSection, { width: '100%' }]}>
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  { backgroundColor: colors.background, borderColor: 'rgba(111,70,31,0.15)' }
                ]}
                onPress={() => setIsKomaMenuOpen(!isKomaMenuOpen)}
                activeOpacity={0.8}
              >
                <View style={styles.dropdownLeft}>
                  <Sliders size={18} color={colors.primary} style={styles.dropdownIcon} />
                  <Text style={[styles.dropdownLabel, { color: colors.textSecondary }]}>
                    Perde:{' '}
                    <Text style={[styles.dropdownSelectedValue, { color: colors.secondary, fontFamily: Fonts.serifBold }]}>
                      {activePerde.name}
                    </Text>
                  </Text>
                </View>
                {isKomaMenuOpen ? (
                  <ChevronUp size={18} color={colors.secondary} />
                ) : (
                  <ChevronDown size={18} color={colors.secondary} />
                )}
              </TouchableOpacity>

              {isKomaMenuOpen && (
                <View style={[styles.verticalMenuList, { backgroundColor: colors.background, borderColor: 'rgba(111,70,31,0.15)', position: 'absolute', top: 50, left: 0, right: 0, maxHeight: 200, zIndex: 9999 }]}>
                  <ScrollView
                    style={styles.menuScroll}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                  >
                    {COMMA_SCALE.map((perde, index) => {
                      const isSelected = selectedPerdeIndex === index;
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.menuItem,
                            { borderBottomColor: colors.backgroundElement },
                            isSelected && { backgroundColor: 'rgba(115, 92, 0, 0.08)' }
                          ]}
                          onPress={() => {
                            setSelectedPerdeIndex(index);
                            setIsKomaMenuOpen(false);
                          }}
                        >
                          <Text style={[
                            styles.menuItemName,
                            { color: colors.text },
                            isSelected && { color: colors.secondary, fontFamily: Fonts.sansBold }
                          ]}>
                            {perde.name}
                          </Text>
                          <Text style={[styles.menuItemSub, { color: colors.textSecondary }]}>
                            {perde.westernName} | {perde.commaIndex}k
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>

            <Text style={[styles.presetDescription, { color: colors.textSecondary, marginTop: 10 }]}>
              Dügâh (La) referansına göre {activePerde.commaIndex} koma kaydırılmıştır.
            </Text>
          </View>
        )}

        {/* Real-time Tuner Gauge */}
        <DeviationGauge
          frequency={detectedFrequency}
          noteName={tunerMode === 'koma' ? activePerde.name : (closestNote ? closestNote.name : '')}
          westernNote={tunerMode === 'koma' ? activePerde.westernName : (closestNote ? closestNote.westernNote : '')}
          centsDeviation={centsDeviation}
          komaDeviation={komaDeviation}
          isListening={isListening}
        />

        {/* Pegboard replacement: Row of Plucking Buttons (Standard Mode) or Reference Player (Koma Mode) */}
        {tunerMode === 'standard' ? (
          <View style={styles.stringButtonsRow}>
            {currentPreset.notes.slice().reverse().map((note, revIdx) => {
              const idx = currentPreset.notes.length - 1 - revIdx;
              const isSelected = activePegIndex === idx;
              const isDetected = closestNote && closestNote.westernNote === note.westernNote;
              const isActive = isSelected || isDetected;
              
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.stringButton,
                    { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111,70,31,0.15)' },
                    isActive && { backgroundColor: 'rgba(115, 92, 0, 0.12)', borderColor: colors.secondary }
                  ]}
                  onPress={() => handleStringPress(idx)}
                  activeOpacity={0.8}
                >
                  {isDetected && (
                    <View style={[styles.lockIndicator, { backgroundColor: colors.secondary }]} />
                  )}
                  <Text style={[
                    styles.stringButtonName,
                    { color: colors.text },
                    isActive && { color: colors.secondary, fontFamily: Fonts.sansBold }
                  ]}>
                    {note.name.split(' ')[0]}
                  </Text>
                  <Text style={[
                    styles.stringButtonWestern,
                    { color: colors.textSecondary },
                    isActive && { color: colors.secondary }
                  ]}>
                    {note.westernNote}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={[styles.komaHelperContainer, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111,70,31,0.1)' }]}>
            <View style={styles.komaHelperHeader}>
              <Music size={18} color={colors.primary} />
              <Text style={[styles.komaHelperTitle, { color: colors.text, fontFamily: Fonts.serifBold }]}>Referans Tonu Çal</Text>
            </View>
            <Text style={[styles.komaHelperDesc, { color: colors.textSecondary }]}>
              Seçili perdenin tam frekans referans sesini dinlemek için aşağıdaki butona basın.
            </Text>
            <TouchableOpacity
              style={[styles.playReferenceButton, { backgroundColor: colors.primary }]}
              onPress={async () => {
                // Calculate target frequency for reference play
                const targetFreq = currentPreset.notes[2].frequency * Math.pow(2, (activePerde.commaIndex - 9) / 53);
                // Use audio synthesis player rate
                const baseNoteFreq = 164.81; // Dügâh standard E3
                const rate = targetFreq / baseNoteFreq;
                await playUdPluck('e3', rate);
              }}
            >
              <Music size={16} color="#fff" style={styles.playRefIcon} />
              <Text style={styles.playRefText}>Referans Ses Çal</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Simulator mode info badge */}
        {!hasMicPermission && isListening && (
          <View style={[styles.infoCard, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111,70,31,0.1)' }]}>
            <Info size={16} color={colors.textSecondary} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Mikrofon erişimi olmadığından demo simülatör modu çalışıyor. Telleri tınlatarak ibreyi görebilirsiniz.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  seljukSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 26,
    letterSpacing: 0.5,
  },
  versionText: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  appSubtitle: {
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 0.5,
    fontFamily: Fonts.sans,
  },
  modeSelectorContainer: {
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1,
    padding: 3,
    marginBottom: 15,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modeButtonActive: {
    borderWidth: 1,
  },
  modeIcon: {
    marginRight: 6,
  },
  modeButtonText: {
    fontSize: 13,
    fontFamily: Fonts.sans,
  },
  selectorContainer: {
    borderRadius: 4,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  dropdownSection: {
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
    borderRadius: 4,
    borderWidth: 1.5,
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
  selectorLabel: {
    fontSize: 10,
    fontFamily: Fonts.sansBold,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 4,
    padding: 2,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  segmentButtonActive: {
    borderWidth: 1,
  },
  segmentText: {
    fontSize: 12,
    fontFamily: Fonts.sans,
  },
  presetDescription: {
    fontSize: 10,
    fontFamily: Fonts.sans,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  perdePickerScroll: {
    width: '100%',
    marginBottom: 8,
  },
  perdePickerContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  perdeCard: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  perdeCardName: {
    fontSize: 13,
    fontFamily: Fonts.sans,
  },
  perdeCardSub: {
    fontSize: 9,
    fontFamily: Fonts.mono,
    marginTop: 2,
  },
  komaHelperContainer: {
    borderRadius: 4,
    borderWidth: 1,
    padding: 16,
    marginTop: 10,
  },
  komaHelperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  komaHelperTitle: {
    fontSize: 15,
  },
  komaHelperDesc: {
    fontSize: 12,
    fontFamily: Fonts.sans,
    marginBottom: 12,
    lineHeight: 16,
  },
  playReferenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 4,
    width: '100%',
  },
  playRefIcon: {
    marginRight: 6,
  },
  playRefText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.sansBold,
  },
  infoCard: {
    flexDirection: 'row',
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    marginTop: 10,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 10,
    fontFamily: Fonts.sans,
    lineHeight: 14,
  },
  stringButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 6,
    marginTop: 15,
  },
  stringButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stringButtonName: {
    fontSize: 12,
    fontFamily: Fonts.sans,
  },
  stringButtonWestern: {
    fontSize: 9,
    fontFamily: Fonts.mono,
    marginTop: 2,
  },
  lockIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
