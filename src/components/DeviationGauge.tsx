import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, useColorScheme, Animated } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Colors, Fonts } from '@/constants/theme';

interface DeviationGaugeProps {
  frequency: number;
  noteName: string;
  westernNote: string;
  centsDeviation: number;
  komaDeviation: number;
  isListening: boolean;
}

const { width } = Dimensions.get('window');
const GAUGE_SIZE = width * 0.75;
const RADIUS = (GAUGE_SIZE - 20) / 2;
const CENTER_X = GAUGE_SIZE / 2;
const CENTER_Y = GAUGE_SIZE / 2;

export const DeviationGauge: React.FC<DeviationGaugeProps> = ({
  frequency,
  noteName,
  westernNote,
  centsDeviation,
  komaDeviation,
  isListening
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  // Smooth Cents transition using Animated API to avoid jumpy needle movements
  const [smoothCents, setSmoothCents] = useState(0);
  const animatedCents = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const listenerId = animatedCents.addListener(({ value }) => {
      setSmoothCents(value);
    });
    return () => {
      animatedCents.removeListener(listenerId);
    };
  }, []);

  useEffect(() => {
    Animated.timing(animatedCents, {
      toValue: isListening && frequency > 0 ? centsDeviation : 0,
      duration: 140, // glides smoothly over 140ms
      useNativeDriver: false,
    }).start();
  }, [centsDeviation, frequency, isListening]);

  // Map cents deviation (-50 to +50) to angle (-120 to +120 degrees)
  const clampedCents = Math.max(-50, Math.min(50, smoothCents));
  const angleDeg = (clampedCents / 50) * 120;
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;

  // Pointer tip coordinates
  const pointerLength = RADIUS - 15;
  const pointerX = CENTER_X + pointerLength * Math.cos(angleRad);
  const pointerY = CENTER_Y + pointerLength * Math.sin(angleRad);

  const inTune = Math.abs(centsDeviation) <= 4; // within 4 cents is in tune
  // Pointer colors matching Makam & Rezen: Altın Gold if in tune, Ceviz Brown if off
  const activeColor = inTune ? colors.secondary : colors.primary;

  // Generate ticks for gauge
  const ticks = [];
  for (let i = -50; i <= 50; i += 10) {
    const tickAngle = (i / 50) * 120 - 90;
    const tickAngleRad = (tickAngle * Math.PI) / 180;
    const innerR = RADIUS - 10;
    const outerR = RADIUS;
    const x1 = CENTER_X + innerR * Math.cos(tickAngleRad);
    const y1 = CENTER_Y + innerR * Math.sin(tickAngleRad);
    const x2 = CENTER_X + outerR * Math.cos(tickAngleRad);
    const y2 = CENTER_Y + outerR * Math.sin(tickAngleRad);
    
    // Label offset
    const labelR = RADIUS - 22;
    const lx = CENTER_X + labelR * Math.cos(tickAngleRad);
    const ly = CENTER_Y + labelR * Math.sin(tickAngleRad) + 4;

    ticks.push(
      <React.Fragment key={i}>
        <Line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={i === 0 ? colors.secondary : colors.textSecondary}
          strokeWidth={i === 0 ? 3 : 1.2}
          opacity={i === 0 ? 1 : 0.4}
        />
        {i % 20 === 0 && (
          <SvgText
            x={lx}
            y={ly}
            fill={colors.textSecondary}
            fontSize="10"
            fontFamily={Fonts.mono}
            textAnchor="middle"
            alignmentBaseline="middle"
            opacity={0.7}
          >
            {i > 0 ? `+${i}` : i}
          </SvgText>
        )}
      </React.Fragment>
    );
  }

  // Draw Arc Path
  const startAngleRad = ((-120 - 90) * Math.PI) / 180;
  const endAngleRad = ((120 - 90) * Math.PI) / 180;
  const startX = CENTER_X + RADIUS * Math.cos(startAngleRad);
  const startY = CENTER_Y + RADIUS * Math.sin(startAngleRad);
  const endX = CENTER_X + RADIUS * Math.cos(endAngleRad);
  const endY = CENTER_Y + RADIUS * Math.sin(endAngleRad);
  const arcPath = `M ${startX} ${startY} A ${RADIUS} ${RADIUS} 0 1 1 ${endX} ${endY}`;

  return (
    <View style={styles.container}>
      <View style={styles.gaugeWrapper}>
        <Svg width={GAUGE_SIZE} height={GAUGE_SIZE}>
          {/* Background Arc */}
          <Path
            d={arcPath}
            fill="none"
            stroke={colors.backgroundElement}
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Center Hub */}
          <Circle cx={CENTER_X} cy={CENTER_Y} r="8" fill={colors.secondary} />
          
          {/* Ticks */}
          {ticks}

          {/* Active pointer line */}
          {isListening && frequency > 0 && (
            <Line
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={pointerX}
              y2={pointerY}
              stroke={activeColor}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
        </Svg>

        {/* Center Text overlays */}
        <View style={styles.textOverlay}>
          {isListening && frequency > 0 ? (
            <>
              <Text style={[styles.westernNote, { color: colors.textSecondary }]}>{westernNote}</Text>
              <Text style={[styles.noteName, { color: activeColor, fontFamily: Fonts.serifBold }]}>{noteName}</Text>
              <Text style={[styles.frequency, { color: colors.textSecondary }]}>{frequency.toFixed(2)} Hz</Text>
              
              <View style={styles.deviationRow}>
                <Text style={[styles.deviationText, { color: activeColor }]}>
                  {centsDeviation > 0 ? `+${centsDeviation.toFixed(1)}` : centsDeviation.toFixed(1)} sent
                </Text>
                <Text style={[styles.separator, { color: colors.backgroundSelected }]}>|</Text>
                <Text style={[styles.deviationText, { color: activeColor }]}>
                  {komaDeviation > 0 ? `+${komaDeviation.toFixed(2)}` : komaDeviation.toFixed(2)} koma
                </Text>
              </View>

              {inTune && (
                <View style={[styles.inTuneBadge, { borderColor: colors.secondary, backgroundColor: 'rgba(115, 92, 0, 0.12)' }]}>
                  <Text style={[styles.inTuneText, { color: colors.secondary }]}>AKORT TAMAM</Text>
                </View>
              )}
            </>
          ) : (
            <>
              <Text style={[styles.idleText, { color: colors.textSecondary }]}>
                {isListening ? 'Ses bekleniyor...' : 'Dinleme kapalı'}
              </Text>
              <Text style={[styles.idleSubText, { color: colors.textSecondary }]}>
                {isListening ? 'Telinize vurun' : 'Cihazı dinlemek için Başlatın'}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  gaugeWrapper: {
    width: GAUGE_SIZE,
    height: GAUGE_SIZE,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textOverlay: {
    position: 'absolute',
    top: GAUGE_SIZE / 2.3,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteName: {
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  westernNote: {
    fontSize: 16,
    letterSpacing: 1.5,
    marginBottom: -4,
    fontFamily: Fonts.sansBold,
  },
  frequency: {
    fontSize: 13,
    fontFamily: Fonts.mono,
    marginTop: 2,
  },
  deviationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  deviationText: {
    fontSize: 12,
    fontFamily: Fonts.monoBold,
  },
  separator: {
    marginHorizontal: 8,
  },
  inTuneBadge: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 10,
  },
  inTuneText: {
    fontSize: 10,
    fontFamily: Fonts.sansBold,
    letterSpacing: 1,
  },
  idleText: {
    fontSize: 16,
    fontFamily: Fonts.sansBold,
  },
  idleSubText: {
    fontSize: 12,
    fontFamily: Fonts.sans,
    marginTop: 4,
    opacity: 0.7,
  },
});
