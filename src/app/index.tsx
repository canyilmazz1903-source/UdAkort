import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, SafeAreaView } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { TUNING_PRESETS } from '../utils/tsmEngine';
import { startTuning, stopTuning, checkMicrophonePermission } from '../utils/tunerService';
import { DeviationGauge } from '../components/DeviationGauge';
import { Pegboard } from '../components/Pegboard';
import { Play, Square, Mic, MicOff, Info } from 'lucide-react-native';

export default function HomeScreen() {
  const {
    currentPreset,
    detectedFrequency,
    closestNote,
    centsDeviation,
    komaDeviation,
    isListening,
    hasMicPermission,
    setPreset
  } = useAppStore();

  useEffect(() => {
    // Check permission on mount
    checkMicrophonePermission();
    
    // Stop listening when leaving the screen
    return () => {
      stopTuning();
    };
  }, []);

  const handleToggleListening = async () => {
    if (isListening) {
      await stopTuning();
    } else {
      await startTuning();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>UdAkort <Text style={styles.versionText}>2.0</Text></Text>
          <Text style={styles.appSubtitle}>Türk Musikisi Akort Sistemi (AEÜ)</Text>
        </View>

        {/* Ahenk / Düzen Seçici (Segmented Control) */}
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>AHENK DÜZENİ</Text>
          <View style={styles.segmentedControl}>
            {TUNING_PRESETS.map((preset) => {
              const isSelected = currentPreset.id === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  style={[
                    styles.segmentButton,
                    isSelected && styles.segmentButtonActive
                  ]}
                  onPress={() => setPreset(preset.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.segmentText,
                    isSelected && styles.segmentTextActive
                  ]}>
                    {preset.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.presetDescription}>{currentPreset.description}</Text>
        </View>

        {/* Real-time Tuner Gauge */}
        <DeviationGauge
          frequency={detectedFrequency}
          noteName={closestNote ? closestNote.name : ''}
          westernNote={closestNote ? closestNote.westernNote : ''}
          centsDeviation={centsDeviation}
          komaDeviation={komaDeviation}
          isListening={isListening}
        />

        {/* Listening Toggle Button */}
        <TouchableOpacity
          style={[
            styles.micButton,
            isListening ? styles.micButtonActive : styles.micButtonInactive
          ]}
          onPress={handleToggleListening}
          activeOpacity={0.8}
        >
          {isListening ? (
            <>
              <MicOff size={18} color="#fff" style={styles.btnIcon} />
              <Text style={styles.micButtonText}>Dinlemeyi Durdur</Text>
            </>
          ) : (
            <>
              <Mic size={18} color="#D4AF37" style={styles.btnIcon} />
              <Text style={[styles.micButtonText, { color: '#D4AF37' }]}>Dinlemeyi Başlat</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Pegboard & String Interaction */}
        <Pegboard notes={currentPreset.notes} />

        {/* Simulator mode info badge */}
        {!hasMicPermission && isListening && (
          <View style={styles.infoCard}>
            <Info size={16} color="#888" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Mikrofon erişimi olmadığından demo simülatör modu çalışıyor. Telleri tınlatarak ibreyi görebilirsiniz.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Solid rich black
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
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  versionText: {
    fontSize: 14,
    color: '#808000', // Olive Green accent
    fontWeight: 'normal',
  },
  appSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  selectorContainer: {
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1d1d1d',
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  selectorLabel: {
    fontSize: 10,
    color: '#555',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 2,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: '#1a1a1a',
    borderWidth: 0.5,
    borderColor: '#2e2e2e',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  segmentTextActive: {
    color: '#D4AF37', // Gold active
  },
  presetDescription: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  micButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    marginVertical: 15,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  micButtonActive: {
    backgroundColor: '#B22222', // Red stop button
    borderColor: '#8b0000',
  },
  micButtonInactive: {
    backgroundColor: '#111', // Dark button with gold border
    borderColor: '#808000', // Olive Green
  },
  micButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  btnIcon: {
    marginRight: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    marginTop: 10,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 10,
    color: '#666',
    lineHeight: 14,
  },
});
