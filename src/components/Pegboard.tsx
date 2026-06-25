import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { TuningNote } from '../utils/tsmEngine';
import { playUdPluck } from '../utils/audioPlayer';
import { useAppStore } from '../store/useAppStore';

interface PegboardProps {
  notes: TuningNote[];
}

const { width } = Dimensions.get('window');

export const Pegboard: React.FC<PegboardProps> = ({ notes }) => {
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

    // Get the base sample and the required playback rate
    // Sample Mapping logic based on notes frequencies:
    // We map note target frequencies to the closest synthesised sample
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
      // Check if another peg wasn't pressed in the meantime
      if (useAppStore.getState().activePegIndex === index) {
        setActivePegIndex(null);
      }
    }, 3000);
  };

  // Helper to split notes into left and right pegs
  // Left pegs: 6th (Bam), 5th, 4th (from low to high)
  // Right pegs: 3rd, 2nd, 1st (from low to high)
  const leftPegIndexes = [5, 4, 3];
  const rightPegIndexes = [2, 1, 0];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>REFERANS SESLER & TELLER</Text>
      
      {/* Pegboard / Headstock Section */}
      <View style={styles.headstockContainer}>
        {/* Left Pegs */}
        <View style={styles.pegsColumn}>
          {leftPegIndexes.map((idx) => {
            const note = notes[idx];
            const isActive = activePegIndex === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.pegButton, styles.pegLeft, isActive && styles.pegActive]}
                onPress={() => handleStringPress(idx)}
                activeOpacity={0.7}
              >
                <View style={styles.pegNodeLeft} />
                <View style={styles.pegLabelContainer}>
                  <Text style={[styles.pegName, isActive && styles.pegTextActive]}>{note.name.split(' ')[0]}</Text>
                  <Text style={styles.pegWestern}>{note.westernNote}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Headstock center neck */}
        <View style={styles.neckStub}>
          <View style={styles.nut} />
        </View>

        {/* Right Pegs */}
        <View style={styles.pegsColumn}>
          {rightPegIndexes.map((idx) => {
            const note = notes[idx];
            const isActive = activePegIndex === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.pegButton, styles.pegRight, isActive && styles.pegActive]}
                onPress={() => handleStringPress(idx)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }} />
                <View style={styles.pegLabelContainerRight}>
                  <Text style={[styles.pegName, isActive && styles.pegTextActive]}>{note.name.split(' ')[0]}</Text>
                  <Text style={styles.pegWestern}>{note.westernNote}</Text>
                </View>
                <View style={styles.pegNodeRight} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Strings Plucking Fretboard Section */}
      <View style={styles.fretboardContainer}>
        {notes.map((note, idx) => {
          const isActive = activePegIndex === idx;
          const animTranslationX = stringAnimations[idx];

          // Thick values: Bam string is thicker, Gerdaniye is thinner
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
                <View style={[styles.stringGlow, { width: stringWidth + 12 }]} />
              )}
              {/* Animated string wire */}
              <Animated.View
                style={[
                  styles.stringWire,
                  {
                    width: stringWidth,
                    backgroundColor: isActive ? '#D4AF37' : '#555',
                    transform: [{ translateX: animTranslationX }],
                  },
                ]}
              />
              {/* String label on bottom */}
              <Text style={[styles.stringLabel, isActive && styles.stringLabelActive]}>
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
    color: '#666',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 15,
  },
  headstockContainer: {
    flexDirection: 'row',
    height: 170,
    width: width * 0.85,
    backgroundColor: '#161616',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222',
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
    backgroundColor: '#0a0a0a',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#1d1d1d',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  nut: {
    width: '100%',
    height: 12,
    backgroundColor: '#D4AF37', // Gold bone nut
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  pegButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 8,
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#2e2e2e',
    paddingHorizontal: 8,
  },
  pegLeft: {
    marginRight: 6,
  },
  pegRight: {
    marginLeft: 6,
  },
  pegActive: {
    backgroundColor: 'rgba(128, 128, 0, 0.15)',
    borderColor: '#808000',
  },
  pegNodeLeft: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#555',
    marginRight: 8,
  },
  pegNodeRight: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#555',
    marginLeft: 8,
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
    fontWeight: 'bold',
    color: '#ccc',
  },
  pegTextActive: {
    color: '#D4AF37',
  },
  pegWestern: {
    fontSize: 9,
    color: '#666',
  },
  fretboardContainer: {
    flexDirection: 'row',
    width: width * 0.9,
    height: 180,
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e1e1e',
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
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  stringGlow: {
    position: 'absolute',
    height: '80%',
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderRadius: 10,
    top: 12,
  },
  stringLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#444',
  },
  stringLabelActive: {
    color: '#D4AF37',
  },
});
