import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, useColorScheme } from 'react-native';
import { COMMA_SCALE, CommaDefinition, getPlaybackRateForFrequency } from '../utils/tsmEngine';
import { playUdPluck } from '../utils/audioPlayer';
import { Colors, Fonts } from '@/constants/theme';

const { width } = Dimensions.get('window');
const FRET_WIDTH = 55; // width of each fret column in the scroll view
const ROOT_FREQ = 146.83; // Rast (Sol3) = 146.83 Hz

export const CommaRibbon: React.FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [selectedComma, setSelectedComma] = useState<CommaDefinition>(COMMA_SCALE[0]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Play a specific comma note
  const handleFretPress = async (commaDef: CommaDefinition) => {
    setSelectedComma(commaDef);

    // Calculate exact frequency based on AEÜ 53-comma formula:
    // f = RootFreq * 2 ^ (commaIndex / 53)
    const targetFreq = ROOT_FREQ * Math.pow(2, commaDef.commaIndex / 53);

    const { sampleName, rate } = getPlaybackRateForFrequency(targetFreq);
    await playUdPluck(sampleName, rate);
  };

  const frets: CommaDefinition[] = [];
  for (let i = 0; i <= 53; i++) {
    const defined = COMMA_SCALE.find((c) => c.commaIndex === i);
    if (defined) {
      frets.push(defined);
    } else {
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
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>İNTERAKTİF AEÜ PERDE ŞERİDİ (53 KOMA)</Text>
      
      {/* Selected Note Inspector */}
      <View style={[styles.inspectorContainer, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111, 70, 31, 0.15)' }]}>
        <View style={[styles.inspectorLabelRow, { borderBottomColor: colors.backgroundSelected }]}>
          <Text style={[styles.inspectorTitle, { color: colors.secondary, fontFamily: Fonts.serifBold }]}>{selectedComma.name}</Text>
          <Text style={[styles.inspectorCents, { color: colors.textSecondary }]}>{selectedComma.cents.toFixed(1)} sent</Text>
        </View>
        <View style={styles.inspectorDetailRow}>
          <Text style={[styles.inspectorLabel, { color: colors.textSecondary }]}>Koma İndeksi: <Text style={[styles.inspectorValue, { color: colors.text }]}>{selectedComma.commaIndex} / 53</Text></Text>
          <Text style={[styles.inspectorLabel, { color: colors.textSecondary }]}>Batı Karşılığı: <Text style={[styles.inspectorValue, { color: colors.text }]}>{selectedComma.westernName}</Text></Text>
          <Text style={[styles.inspectorLabel, { color: colors.textSecondary }]}>Frekans: <Text style={[styles.inspectorValue, { color: colors.text }]}>{(ROOT_FREQ * Math.pow(2, selectedComma.commaIndex / 53)).toFixed(2)} Hz</Text></Text>
        </View>
      </View>

      {/* Scrollable Ribbon */}
      <View style={[styles.ribbonWrapper, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111, 70, 31, 0.15)' }]}>
        {/* Nut (fretboard start) */}
        <View style={[styles.ribbonNut, { backgroundColor: colors.secondary }]} />
        
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.scrollContainer}
        >
          {frets.map((fret) => {
            const isSelected = selectedComma.commaIndex === fret.commaIndex;
            const isNamedPerde = COMMA_SCALE.some((c) => c.commaIndex === fret.commaIndex);
            
            // Render colors from active theme
            let dotColor: string = colors.backgroundSelected;
            if (isSelected) dotColor = colors.secondary; // Altın Gold
            else if (isNamedPerde) dotColor = colors.primary; // Ceviz Brown

            return (
              <TouchableOpacity
                key={fret.commaIndex}
                style={[
                  styles.fretColumn,
                  { borderRightColor: colors.backgroundSelected },
                  isSelected && { backgroundColor: 'rgba(115, 92, 0, 0.08)' },
                  isNamedPerde && { backgroundColor: 'rgba(111, 70, 31, 0.04)' }
                ]}
                onPress={() => handleFretPress(fret)}
                activeOpacity={0.8}
              >
                {/* Microtonal Fret Line */}
                <View style={[styles.fretLine, { backgroundColor: colors.backgroundSelected }]} />
                
                {/* String visual running horizontally across fretboard */}
                <View style={[styles.stringWire, { backgroundColor: colors.textSecondary, opacity: 0.3 }]} />
                
                {/* Pitch marker dot */}
                <View style={[styles.fretMarker, { backgroundColor: dotColor }]} />

                {/* Perde name / index */}
                <Text style={[
                  styles.fretName,
                  { color: colors.textSecondary },
                  isSelected && { color: colors.secondary, fontFamily: Fonts.sansBold },
                  isNamedPerde && !isSelected && { color: colors.primary }
                ]}>
                  {isNamedPerde ? fret.name : `k${fret.commaIndex}`}
                </Text>
                
                <Text style={[styles.fretCents, { color: colors.textSecondary }]}>
                  {fret.commaIndex}k
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Text style={[styles.tipText, { color: colors.textSecondary }]}>Koma perdelerini dinlemek için şerit üzerinde kaydırın ve dokunun.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.sansBold,
    letterSpacing: 1.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  inspectorContainer: {
    borderRadius: 4,
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
  },
  inspectorLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 8,
  },
  inspectorTitle: {
    fontSize: 20,
  },
  inspectorCents: {
    fontSize: 13,
    fontFamily: Fonts.mono,
  },
  inspectorDetailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inspectorLabel: {
    fontSize: 12,
    marginRight: 10,
    marginVertical: 3,
    fontFamily: Fonts.sans,
  },
  inspectorValue: {
    fontWeight: '600',
    fontFamily: Fonts.sansBold,
  },
  ribbonWrapper: {
    flexDirection: 'row',
    height: 120,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  ribbonNut: {
    width: 8,
    height: '100%',
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
    position: 'relative',
  },
  fretLine: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 1,
  },
  stringWire: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '45%',
    height: 1.5,
  },
  fretMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 10,
  },
  fretName: {
    fontSize: 10,
    textAlign: 'center',
    height: 28,
    fontFamily: Fonts.sans,
  },
  fretCents: {
    fontSize: 9,
    fontFamily: Fonts.mono,
  },
  tipText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    fontFamily: Fonts.sans,
  },
});
