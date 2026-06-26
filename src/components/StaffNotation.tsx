import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import Svg, { Line, Ellipse, Path, Text as SvgText, G } from 'react-native-svg';
import { Colors, Fonts } from '@/constants/theme';
import { COMMA_SCALE } from '@/utils/tsmEngine';

interface StaffNotationProps {
  durak: string;
  scaleNotes: string[];
  scaleCommas: number[];
  activeIndex?: number | null;
}

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
  if (name.includes('yegâh') || name.includes('yegah')) return 31 - 53;
  if (name.includes('irak')) return 48 - 53;
  return 9;
}

// Precise SVG vector path definitions for Arel-Ezgi-Uzdilek accidentals
// Centered around (0, 0)
const AccidentalPaths: Record<string, string> = {
  // Koma Flat (1k): flat loop + a backward diagonal line through the upper stem
  'koma-flat': 'M 0 5 L 0 -13 M 0 -2 C 2.2 -2, 3.8 0.5, 3.8 2.5 C 3.8 4.5, 2.2 6.5, 0 5 M -3.5 -8 L 3.5 -5',
  
  // Bakiye Flat (4k): flat loop + a forward diagonal slash through the loop
  'bakiye-flat': 'M 0 5 L 0 -13 M 0 -2 C 2.2 -2, 3.8 0.5, 3.8 2.5 C 3.8 4.5, 2.2 6.5, 0 5 M -2.5 -4 L 3.5 -7',
  
  // Küçük Mücennep Flat (5k): standard flat symbol
  'kucuk-flat': 'M 0 5 L 0 -13 M 0 -2 C 2.2 -2, 3.8 0.5, 3.8 2.5 C 3.8 4.5, 2.2 6.5, 0 5',
  'flat': 'M 0 5 L 0 -13 M 0 -2 C 2.2 -2, 3.8 0.5, 3.8 2.5 C 3.8 4.5, 2.2 6.5, 0 5',
  
  // Koma Sharp (1k): sharp with one vertical line and two diagonal crossbars
  'koma-sharp': 'M 0 -9 L 0 9 M -4 -3 L 4 -1 M -4 2 L 4 4',
  
  // Bakiye Sharp (4k): standard sharp with one tilted crossbar
  'bakiye-sharp': 'M -2 -9 L -2 9 M 2 -9 L 2 9 M -5 -3 L 5 0 M -5 1 L 5 4',
  
  // Küçük Mücennep Sharp (5k): standard sharp (two verticals, two horizontals)
  'kucuk-sharp': 'M -2 -9 L -2 9 M 2 -9 L 2 9 M -5 -3 L 5 -1 M -5 2 L 5 4',
  'sharp': 'M -2 -9 L -2 9 M 2 -9 L 2 9 M -5 -3 L 5 -1 M -5 2 L 5 4',
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

  const getNoteY = (pos: number) => {
    return 70 - (pos - 2) * 5;
  };

  const staffLines = [50, 60, 70, 80, 90]; // Line 5 (F5) to Line 1 (E4)

  const numNotes = scaleNotes.length;
  const startX = 88; // Leave room for clef and accidental
  const endX = 352;
  const stepX = numNotes > 1 ? (endX - startX) / (numNotes - 1) : 40;

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundElement, borderColor: 'rgba(111, 70, 31, 0.12)' }]}>
      <Svg width="100%" height={140} viewBox="0 0 380 140" style={styles.svg}>
        {/* Draw 5 Staff Lines */}
        {staffLines.map((y, idx) => (
          <Line
            key={idx}
            x1={15}
            y1={y}
            x2={365}
            y2={y}
            stroke={colors.text}
            strokeWidth={1}
            opacity={0.25}
          />
        ))}

        {/* Draw G-Clef (Treble Clef) */}
        <SvgText
          x={18}
          y={93}
          fontSize={72}
          fontFamily="serif"
          fill={colors.primary}
          opacity={0.85}
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
          const absComma = (baseComma + relativeComma + 106) % 53;
          
          const commaDef = COMMA_SCALE.find((c) => c.commaIndex === absComma);
          const accidental = commaDef ? commaDef.accidental : 'none';

          // Determine ledger lines
          const ledgerLines: number[] = [];
          
          if (y >= 100) {
            for (let ly = 100; ly <= y; ly += 10) {
              ledgerLines.push(ly);
            }
          }
          if (y <= 40) {
            for (let ly = 40; ly >= y; ly -= 10) {
              ledgerLines.push(ly);
            }
          }

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

              {/* Accidental positioned at x - 18 for breathing room */}
              {accidental && accidental !== 'none' && AccidentalPaths[accidental] && (
                <Path
                  d={AccidentalPaths[accidental]}
                  transform={`translate(${x - 18}, ${y}) scale(1.05)`}
                  fill="none"
                  stroke={isActive ? colors.secondary : colors.text}
                  strokeWidth={1.8}
                />
              )}

              {/* Note Stem */}
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
