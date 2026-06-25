import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';

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
  // Map cents deviation (-50 to +50) to angle (-120 to +120 degrees)
  const clampedCents = Math.max(-50, Math.min(50, centsDeviation));
  const angleDeg = (clampedCents / 50) * 120;
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;

  // Pointer tip coordinates
  const pointerLength = RADIUS - 15;
  const pointerX = CENTER_X + pointerLength * Math.cos(angleRad);
  const pointerY = CENTER_Y + pointerLength * Math.sin(angleRad);

  const inTune = Math.abs(centsDeviation) <= 5;
  const activeColor = inTune ? '#808000' : centsDeviation > 5 ? '#D4AF37' : '#B22222'; // Olive Green / Gold / Firebrick Red

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
    const ly = CENTER_Y + labelR * Math.sin(tickAngleRad) + 4; // Adjust vertical centering

    ticks.push(
      <React.Fragment key={i}>
        <Line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={i === 0 ? '#808000' : '#444'}
          strokeWidth={i === 0 ? 3 : 1.5}
        />
        {i % 20 === 0 && (
          <SvgText
            x={lx}
            y={ly}
            fill="#888"
            fontSize="10"
            textAnchor="middle"
            alignmentBaseline="middle"
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
            stroke="#2a2a2a"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Center Hub */}
          <Circle cx={CENTER_X} cy={CENTER_Y} r="8" fill="#D4AF37" />
          
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
              <Text style={styles.westernNote}>{westernNote}</Text>
              <Text style={[styles.noteName, { color: activeColor }]}>{noteName}</Text>
              <Text style={styles.frequency}>{frequency.toFixed(2)} Hz</Text>
              
              <View style={styles.deviationRow}>
                <Text style={[styles.deviationText, { color: activeColor }]}>
                  {clampedCents > 0 ? `+${clampedCents.toFixed(1)}` : clampedCents.toFixed(1)} sent
                </Text>
                <Text style={styles.separator}>|</Text>
                <Text style={[styles.deviationText, { color: activeColor }]}>
                  {komaDeviation > 0 ? `+${komaDeviation.toFixed(2)}` : komaDeviation.toFixed(2)} koma
                </Text>
              </View>

              {inTune && (
                <View style={styles.inTuneBadge}>
                  <Text style={styles.inTuneText}>AKORT TAMAM</Text>
                </View>
              )}
            </>
          ) : (
            <>
              <Text style={styles.idleText}>
                {isListening ? 'Ses bekleniyor...' : 'Dinleme kapalı'}
              </Text>
              <Text style={styles.idleSubText}>
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
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'sans-serif-condensed',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  westernNote: {
    fontSize: 16,
    color: '#888',
    letterSpacing: 1.5,
    marginBottom: -4,
  },
  frequency: {
    fontSize: 14,
    color: '#aaa',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
  deviationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  deviationText: {
    fontSize: 13,
    fontWeight: '600',
  },
  separator: {
    color: '#333',
    marginHorizontal: 8,
  },
  inTuneBadge: {
    backgroundColor: 'rgba(128, 128, 0, 0.2)',
    borderColor: '#808000',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  inTuneText: {
    color: '#A2B574',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  idleText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  idleSubText: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
});
