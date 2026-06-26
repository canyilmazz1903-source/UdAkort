import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import Svg, { Line, Ellipse, Path, Text as SvgText, G } from 'react-native-svg';
import { Colors } from '@/constants/theme';
import { COMMA_SCALE } from '@/utils/tsmEngine';

interface StaffNotationProps {
  durak: string;
  scaleNotes: string[];
  scaleCommas: number[];
  activeIndex?: number | null;
}

// Map a perde name to a starting diatonic position on the treble staff (Rast Sol4 = 0)
// G4 (Rast) is on the second line of the treble staff (index 0)
// F4 is in the space below (index -1)
// E4 is on the first line (index -2)
// D4 (Yegah/Neva standard relative) is in the space below the first line (index -3)
function getTonicDiatonicPosition(durakName: string): number {
  const name = durakName.toLowerCase();
  if (name.includes('rast') || name.includes('(sol')) return 0;
  if (name.includes('dügâh') || name.includes('dügah') || name.includes('(la')) return 1;
  if (name.includes('segâh') || name.includes('segah') || name.includes('(si')) return 2;
  if (name.includes('çârgâh') || name.includes('cargah') || name.includes('(do')) return 3;
  if (name.includes('nevâ') || name.includes('neva') || name.includes('(re')) return 4;
  if (name.includes('hüseynî') || name.includes('huseyni') || name.includes('(mi')) return 5;
  if (name.includes('acem') || name.includes('eviç') || name.includes('evic') || name.includes('(fa')) return 6;
  if (name.includes('yegâh') || name.includes('yegah')) return -3;
  if (name.includes('irak')) return -1;
  return 1; // Default to Dügâh (La4)
}

// Find base comma index in the absolute 53-comma scale for the tonic note
function getTonicBaseComma(durakName: string): number {
  const name = durakName.toLowerCase();
  if (name.includes('rast')) return 0;
  if (name.includes('dügâh') || name.includes('dügah')) return 9;
  if (name.includes('segâh') || name.includes('segah')) return 13;
  if (name.includes('çârgâh') || name.includes('cargah')) return 22;
  if (name.includes('nevâ') || name.includes('neva')) return 31;
  if (name.includes('hüseynî') || name.includes('huseyni')) return 40;
  if (name.includes('acem')) return 44;
  if (name.includes('eviç') || name.includes('evic')) return 48;
  if (name.includes('yegâh') || name.includes('yegah')) return 31 - 53; // Yegâh is 1 octave below Nevâ (31)
  if (name.includes('irak')) return 48 - 53; // Irak is 1 octave below Eviç (48)
  return 9; // Default to Dügâh (9)
}

// Render paths for traditional Turkish Classical Music accidentals
// Coordinates are centered around (0, 0)
const AccidentalPaths: Record<string, string> = {
  // Koma Flat (1 comma flat): flat symbol with a small slash leaning down-left
  'koma-flat': 'M 0 5 L 0 -15 M 0 -3 C 2.5 -3, 4 0, 4 2.5 C 4 5, 2.5 7, 0 5 M -3.5 -9 L 2.5 -5',
  
  // Bakiye Flat (4 commas flat): flat with a backward slash leaning down-right
  'bakiye-flat': 'M 0 5 L 0 -15 M 0 -3 C 2.5 -3, 4 0, 4 2.5 C 4 5, 2.5 7, 0 5 M -2.5 -5 L 3.5 -9',
  
  // Küçük Mücennep Flat (5 commas flat): standard flat symbol
  'kucuk-flat': 'M 0 5 L 0 -15 M 0 -3 C 2.5 -3, 4 0, 4 2.5 C 4 5, 2.5 7, 0 5',
  'flat': 'M 0 5 L 0 -15 M 0 -3 C 2.5 -3, 4 0, 4 2.5 C 4 5, 2.5 7, 0 5',
  
  // Koma Sharp (1 comma sharp): sharp with only one vertical stem and two crossbars
  'koma-sharp': 'M 0 -10 L 0 10 M -4 -4 L 4 -2 M -4 2 L 4 4',
  
  // Bakiye Sharp (4 commas sharp): standard sharp with one tilted crossbar or custom cross
  'bakiye-sharp': 'M -2 -10 L -2 10 M 2 -10 L 2 10 M -5 -3 L 5 1',
  
  // Küçük Mücennep Sharp (5 commas sharp): standard sharp
  'kucuk-sharp': 'M -2 -10 L -2 10 M 2 -10 L 2 10 M -5 -3 L 5 -1 M -5 2 L 5 4',
  'sharp': 'M -2 -10 L -2 10 M 2 -10 L 2 10 M -5 -3 L 5 -1 M -5 2 L 5 4',
};

export const StaffNotation: React.FC<StaffNotationProps> = ({
  durak,
  scaleNotes,
  scaleCommas,
  activeIndex = null,
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const startDiatonicPos = getTonicDiatonicPosition(durak);
  const baseComma = getTonicBaseComma(durak);

  // SVG height is 140. Staff lines are spaced by 10px.
  // Center line (Line 3 / B4 / pos = 2) is at y = 70.
  // Y-coordinate formula: y = 70 - (diatonicPos - 2) * 5
  const getNoteY = (pos: number) => {
    return 70 - (pos - 2) * 5;
  };

  // Staff lines y-positions
  const staffLines = [50, 60, 70, 80, 90]; // Line 5 (F5) to Line 1 (E4)

  const numNotes = scaleNotes.length;
  const startX = 85; // Leave room for the clef
  const endX = 350;
  const stepX = numNotes > 1 ? (endX - startX) / (numNotes - 1) : 40;

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      <Svg width="100%" height={140} viewBox="0 0 380 140" style={styles.svg}>
        {/* Draw 5 Staff Lines */}
        {staffLines.map((y, idx) => (
          <Line
            key={idx}
            x1={15}
            y1={y}
            x2={365}
            y2={y}
            stroke={colors.textSecondary}
            strokeWidth={1}
            opacity={0.4}
          />
        ))}

        {/* Draw G-Clef (Treble Clef) */}
        {/* We place it such that its loop wraps around the G4 line (y = 80) */}
        <SvgText
          x={18}
          y={93}
          fontSize={72}
          fontFamily="serif"
          fill={colors.primary}
          opacity={0.9}
        >
          𝄞
        </SvgText>

        {/* Render scale notes */}
        {scaleNotes.map((noteName, idx) => {
          const diatonicPos = startDiatonicPos + idx;
          const y = getNoteY(diatonicPos);
          const x = startX + idx * stepX;
          const isActive = activeIndex === idx;

          // Calculate absolute comma to determine accidental
          const relativeComma = scaleCommas[idx] || 0;
          const absComma = (baseComma + relativeComma + 106) % 53; // ensure positive modulo
          
          // Check if there is an accidental
          const commaDef = COMMA_SCALE.find((c) => c.commaIndex === absComma);
          const accidental = commaDef ? commaDef.accidental : 'none';

          // Determine ledger lines
          const ledgerLines: number[] = [];
          
          // E4 is at y = 90. If y >= 100, draw ledger lines below.
          if (y >= 100) {
            for (let ly = 100; ly <= y; ly += 10) {
              ledgerLines.push(ly);
            }
          }
          // F5 is at y = 50. If y <= 40, draw ledger lines above.
          if (y <= 40) {
            for (let ly = 40; ly >= y; ly -= 10) {
              ledgerLines.push(ly);
            }
          }

          // Clean note label (strip parenthetical details for clean notation)
          const cleanName = noteName.split(' ')[0];

          return (
            <G key={idx}>
              {/* Ledger lines */}
              {ledgerLines.map((ly, lIdx) => (
                <Line
                  key={lIdx}
                  x1={x - 12}
                  y1={ly}
                  x2={x + 12}
                  y2={ly}
                  stroke={colors.text}
                  strokeWidth={1.5}
                />
              ))}

              {/* Accidental */}
              {accidental && accidental !== 'none' && AccidentalPaths[accidental] && (
                <Path
                  d={AccidentalPaths[accidental]}
                  transform={`translate(${x - 16}, ${y}) scale(1)`}
                  fill="none"
                  stroke={isActive ? colors.secondary : colors.text}
                  strokeWidth={1.8}
                />
              )}

              {/* Note Stem */}
              {/* Draw stem going up if note is low, down if note is high */}
              <Line
                x1={diatonicPos >= 2 ? x - 6.5 : x + 6.5}
                y1={y}
                x2={diatonicPos >= 2 ? x - 6.5 : x + 6.5}
                y2={diatonicPos >= 2 ? y + 28 : y - 28}
                stroke={isActive ? colors.secondary : colors.text}
                strokeWidth={1.5}
              />

              {/* Note Head */}
              <Ellipse
                cx={x}
                cy={y}
                rx={6.5}
                ry={4.5}
                transform={`rotate(-20, ${x}, ${y})`}
                fill={isActive ? colors.secondary : colors.text}
              />

              {/* Note Label */}
              <SvgText
                x={x}
                y={120}
                fontSize={10}
                fontFamily="HankenGrotesk_600SemiBold"
                fill={isActive ? colors.secondary : colors.text}
                textAnchor="middle"
              >
                {cleanName}
              </SvgText>

              {/* Comma Deviation Indicator */}
              <SvgText
                x={x}
                y={132}
                fontSize={9}
                fontFamily="JetBrainsMono_400Regular"
                fill={isActive ? colors.secondary : colors.textSecondary}
                textAnchor="middle"
                opacity={0.8}
              >
                {relativeComma}k
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    paddingVertical: 10,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(111, 70, 31, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  svg: {
    alignSelf: 'center',
  },
});
