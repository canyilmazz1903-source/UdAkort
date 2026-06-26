import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform, useColorScheme } from 'react-native';
import { TuningNote } from '../utils/tsmEngine';
import { playUdPluck } from '../utils/audioPlayer';
import { useAppStore } from '../store/useAppStore';
import { Colors, Fonts } from '@/constants/theme';

interface PegboardProps {
  notes: TuningNote[];
}

const { width } = Dimensions.get('window');

export const Pegboard: React.FC<PegboardProps> = ({ notes }) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const activePegIndex = useAppStore((state) => state.activePegIndex);
  const setActivePegIndex = useAppStore((state) => state.setActivePegIndex);

  // Animated values for 6 strings
  const stringAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // Triggers the physical pluck vibration animation
  const animateString = (index: number) => {
    const anim = stringAnimations[index];
    anim.setValue(0);
    
    // Create decay oscillation (vibration)
    Animated.sequence([
      Animated.timing(anim, { toValue: 12, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 8, duration: 70, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -6, duration: 70, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 4, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -2, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 90, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // String tap handler
  const handleStringPress = async (index: number) => {
    const targetNote = notes[index];
    setActivePegIndex(index);
    animateString(index);

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

  const leftPegIndexes = [5, 4, 3];
  const rightPegIndexes = [2, 1, 0];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>REFERANS SESLER & TELLER</Text>
      
      {/* Pegboard / Headstock Section */}
      <View style={[styles.headstockContainer, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111, 70, 31, 0.15)' }]}>
        {/* Left Pegs */}
        <View style={styles.pegsColumn}>
          {leftPegIndexes.map((idx) => {
            const note = notes[idx];
            const isActive = activePegIndex === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.pegButton,
                  styles.pegLeft,
                  { backgroundColor: colors.background, borderColor: colors.backgroundElement },
                  isActive && { backgroundColor: 'rgba(115, 92, 0, 0.08)', borderColor: colors.secondary }
                ]}
                onPress={() => handleStringPress(idx)}
                activeOpacity={0.7}
              >
                <View style={[styles.pegNodeLeft, { backgroundColor: colors.textSecondary }]} />
                <View style={styles.pegLabelContainer}>
                  <Text style={[
                    styles.pegName, 
                    { color: colors.text },
                    isActive && { color: colors.secondary, fontFamily: Fonts.sansBold }
                  ]}>
                    {note.name.split(' ')[0]}
                  </Text>
                  <Text style={[styles.pegWestern, { color: colors.textSecondary }]}>{note.westernNote}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Headstock center neck */}
        <View style={[styles.neckStub, { backgroundColor: colors.background, borderColor: colors.backgroundElement }]}>
          <View style={[styles.nut, { backgroundColor: colors.secondary }]} />
        </View>

        {/* Right Pegs */}
        <View style={styles.pegsColumn}>
          {rightPegIndexes.map((idx) => {
            const note = notes[idx];
            const isActive = activePegIndex === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.pegButton,
                  styles.pegRight,
                  { backgroundColor: colors.background, borderColor: colors.backgroundElement },
                  isActive && { backgroundColor: 'rgba(115, 92, 0, 0.08)', borderColor: colors.secondary }
                ]}
                onPress={() => handleStringPress(idx)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }} />
                <View style={styles.pegLabelContainerRight}>
                  <Text style={[
                    styles.pegName, 
                    { color: colors.text },
                    isActive && { color: colors.secondary, fontFamily: Fonts.sansBold }
                  ]}>
                    {note.name.split(' ')[0]}
                  </Text>
                  <Text style={[styles.pegWestern, { color: colors.textSecondary }]}>{note.westernNote}</Text>
                </View>
                <View style={[styles.pegNodeRight, { backgroundColor: colors.textSecondary }]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Strings Plucking Fretboard Section */}
      <View style={[styles.fretboardContainer, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111, 70, 31, 0.15)' }]}>
        {notes.map((note, idx) => {
          const isActive = activePegIndex === idx;
          const animTranslationX = stringAnimations[idx];
          const stringWidth = 1 + (5 - idx) * 0.6; 

          return (
            <TouchableOpacity
              key={idx}
              style={styles.stringTouchZone}
              onPress={() => handleStringPress(idx)}
              activeOpacity={0.8}
            >
              {/* String shadow/glow when active */}
              {isActive && (
                <View style={[styles.stringGlow, { width: stringWidth + 12, backgroundColor: 'rgba(115, 92, 0, 0.12)' }]} />
              )}
              {/* Animated string wire */}
              <Animated.View
                style={[
                  styles.stringWire,
                  {
                    width: stringWidth,
                    backgroundColor: isActive ? colors.secondary : colors.textSecondary,
                    transform: [{ translateX: animTranslationX }],
                    opacity: isActive ? 1.0 : 0.4,
                  },
                ]}
              />
              {/* String label on bottom */}
              <Text style={[
                styles.stringLabel, 
                { color: colors.textSecondary },
                isActive && { color: colors.secondary, fontFamily: Fonts.sansBold }
              ]}>
                {note.westernNote}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.sansBold,
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  headstockContainer: {
    flexDirection: 'row',
    height: 170,
    width: width * 0.85,
    borderRadius: 4,
    borderWidth: 1,
    padding: 10,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
  },
  pegsColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  neckStub: {
    width: 34,
    height: '100%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  nut: {
    width: '100%',
    height: 12,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  pegButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  pegLeft: {
    marginRight: 6,
  },
  pegRight: {
    marginLeft: 6,
  },
  pegNodeLeft: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    opacity: 0.5,
  },
  pegNodeRight: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    opacity: 0.5,
  },
  pegLabelContainer: {
    flex: 1,
  },
  pegLabelContainerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  pegName: {
    fontSize: 11,
  },
  pegWestern: {
    fontSize: 9,
    fontFamily: Fonts.mono,
    marginTop: 1,
  },
  fretboardContainer: {
    flexDirection: 'row',
    width: width * 0.9,
    height: 180,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 20,
    overflow: 'hidden',
  },
  stringTouchZone: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    position: 'relative',
  },
  stringWire: {
    height: '80%',
    borderRadius: 2,
  },
  stringGlow: {
    position: 'absolute',
    height: '80%',
    borderRadius: 4,
    top: 12,
  },
  stringLabel: {
    fontSize: 10,
    fontFamily: Fonts.sansBold,
  },
});
