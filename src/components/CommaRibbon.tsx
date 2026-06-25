import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { COMMA_SCALE, CommaDefinition, getPlaybackRateForFrequency } from '../utils/tsmEngine';
import { playUdPluck } from '../utils/audioPlayer';

const { width } = Dimensions.get('window');
const FRET_WIDTH = 55; // width of each fret column in the scroll view
const ROOT_FREQ = 146.83; // Rast (Sol3) = 146.83 Hz

export const CommaRibbon: React.FC = () => {
  const [selectedComma, setSelectedComma] = useState<CommaDefinition>(COMMA_SCALE[0]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Play a specific comma note
  const handleFretPress = async (commaDef: CommaDefinition) => {
    setSelectedComma(commaDef);

    // Calculate exact frequency based on AEÜ 53-comma formula:
    // f = RootFreq * 2 ^ (commaIndex / 53)
    const targetFreq = ROOT_FREQ * Math.pow(2, commaDef.commaIndex / 53);

    // Map to sample and rate
    const { sampleName, rate } = getPlaybackRateForFrequency(targetFreq);
    await playUdPluck(sampleName, rate);
  };

  // Build the complete list of 54 frets (0 to 53 inclusive)
  // Fill in named perdes from COMMA_SCALE, and auto-generate unnamed commas
  const frets: CommaDefinition[] = [];
  for (let i = 0; i <= 53; i++) {
    const defined = COMMA_SCALE.find((c) => c.commaIndex === i);
    if (defined) {
      frets.push(defined);
    } else {
      // Unnamed microtonal intermediate comma
      frets.push({
        commaIndex: i,
        name: `Koma ${i}`,
        westernName: `G+${i}k`,
        cents: (i * 1200) / 53,
        accidental: 'none'
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>İNTERAKTİF AEÜ PERDE ŞERİDİ (53 KOMA)</Text>
      
      {/* Selected Note Inspector */}
      <View style={styles.inspectorContainer}>
        <View style={styles.inspectorLabelRow}>
          <Text style={styles.inspectorTitle}>{selectedComma.name}</Text>
          <Text style={styles.inspectorCents}>{selectedComma.cents.toFixed(1)} sent</Text>
        </View>
        <View style={styles.inspectorDetailRow}>
          <Text style={styles.inspectorLabel}>Koma İndeksi: <Text style={styles.inspectorValue}>{selectedComma.commaIndex} / 53</Text></Text>
          <Text style={styles.inspectorLabel}>Batı Karşılığı: <Text style={styles.inspectorValue}>{selectedComma.westernName}</Text></Text>
          <Text style={styles.inspectorLabel}>Frekans: <Text style={styles.inspectorValue}>{(ROOT_FREQ * Math.pow(2, selectedComma.commaIndex / 53)).toFixed(2)} Hz</Text></Text>
        </View>
      </View>

      {/* Scrollable Ribbon */}
      <View style={styles.ribbonWrapper}>
        {/* Nut (fretboard start) */}
        <View style={styles.ribbonNut} />
        
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.scrollContainer}
        >
          {frets.map((fret) => {
            const isSelected = selectedComma.commaIndex === fret.commaIndex;
            
            // Check if this is a traditionally named perde
            const isNamedPerde = COMMA_SCALE.some((c) => c.commaIndex === fret.commaIndex);
            
            // Render different colors based on type
            let dotColor = '#333';
            if (isSelected) dotColor = '#D4AF37'; // Active Gold
            else if (isNamedPerde) dotColor = '#808000'; // Named Perde Olive

            return (
              <TouchableOpacity
                key={fret.commaIndex}
                style={[
                  styles.fretColumn,
                  isSelected && styles.fretSelected,
                  isNamedPerde && styles.fretNamed
                ]}
                onPress={() => handleFretPress(fret)}
                activeOpacity={0.8}
              >
                {/* Microtonal Fret Line */}
                <View style={styles.fretLine} />
                
                {/* String visual running horizontally across fretboard */}
                <View style={styles.stringWire} />
                
                {/* Pitch marker dot */}
                <View style={[styles.fretMarker, { backgroundColor: dotColor }]} />

                {/* Perde name / index */}
                <Text style={[
                  styles.fretName, 
                  isSelected && styles.textSelected,
                  isNamedPerde && !isSelected && styles.textNamed
                ]}>
                  {isNamedPerde ? fret.name : `k${fret.commaIndex}`}
                </Text>
                
                <Text style={styles.fretCents}>
                  {fret.commaIndex}k
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Text style={styles.tipText}>Koma perdelerini dinlemek için şerit üzerinde kaydırın ve dokunun.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    letterSpacing: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  inspectorContainer: {
    backgroundColor: '#161616',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#222',
    padding: 15,
    marginBottom: 15,
  },
  inspectorLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
    paddingBottom: 8,
    marginBottom: 8,
  },
  inspectorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37', // Gold
  },
  inspectorCents: {
    fontSize: 13,
    color: '#888',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  inspectorDetailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inspectorLabel: {
    fontSize: 12,
    color: '#777',
    marginRight: 10,
    marginVertical: 3,
  },
  inspectorValue: {
    color: '#eee',
    fontWeight: '600',
  },
  ribbonWrapper: {
    flexDirection: 'row',
    height: 120,
    backgroundColor: '#0f0f0f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    overflow: 'hidden',
  },
  ribbonNut: {
    width: 8,
    height: '100%',
    backgroundColor: '#D4AF37', // Gold bone nut start
  },
  scrollContainer: {
    paddingRight: 30,
  },
  fretColumn: {
    width: FRET_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#1a1a1a',
    position: 'relative',
  },
  fretSelected: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  fretNamed: {
    backgroundColor: 'rgba(128, 128, 0, 0.04)',
  },
  fretLine: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#222',
  },
  stringWire: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '45%',
    height: 1.5,
    backgroundColor: '#444',
  },
  fretMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 10,
  },
  fretName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
    height: 28,
  },
  textSelected: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  textNamed: {
    color: '#A2B574',
  },
  fretCents: {
    fontSize: 9,
    color: '#444',
  },
  tipText: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
