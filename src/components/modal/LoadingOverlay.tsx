import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { Spinner } from '@/components/ui/spinner';
import { colors } from '@/src/constant/theme';
import MaterialIcons from '@react-native-vector-icons/material-icons';

type MaterialName = React.ComponentProps<typeof MaterialIcons>['name'];

interface LoadingOverlayProps {
  visible: boolean;
  title?: string;
  messageLine1?: string;
  messageLine2?: string;
  iconName?: MaterialName;
}

/* ===== dots ===== */
type Dot = {
  x: number;
  y: number;
  size: number;
  opacity: number;
};

function makeRingDots(opts: {
  count?: number;
  centerX: number;
  centerY: number;
  innerR: number;
  outerR: number;
  boundsW: number;
  boundsH: number;
}) {
  const {
    count = 8,
    centerX,
    centerY,
    innerR,
    outerR,
    boundsW,
    boundsH,
  } = opts;

  const dots: Dot[] = [];
  let guard = 0;

  while (dots.length < count && guard < 2000) {
    guard++;

    const angle = (dots.length / count) * Math.PI * 2;
    const radius = innerR + Math.random() * (outerR - innerR);
    const size = 10 + Math.random() * 20;

    const x = centerX + radius * Math.cos(angle) - size / 2;
    const y = centerY + radius * Math.sin(angle) - size / 2;

    if (x < 0 || y < 0 || x + size > boundsW || y + size > boundsH) continue;

    dots.push({
      x,
      y,
      size,
      opacity: 0.55 + Math.random() * 0.35,
    });
  }

  return dots;
}

/* ===== layout ===== */
const CARD_W = 300;
const CIRCLE_D = 128;
const PT = 80;
const centerX = CARD_W / 2;
const centerY = PT + CIRCLE_D / 2;
const TOP_AREA_H = PT + CIRCLE_D + 40;

export default function LoadingOverlay({
  visible,
  title,
  messageLine1,
  messageLine2,
  iconName,
}: Readonly<LoadingOverlayProps>) {
  const dots = useMemo(
    () =>
      makeRingDots({
        centerX,
        centerY,
        innerR: CIRCLE_D / 2 + 16,
        outerR: CIRCLE_D / 2 + 36,
        boundsW: CARD_W,
        boundsH: TOP_AREA_H,
      }),
    [],
  );

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="auto">
      <View style={styles.overlay}>
        <View style={styles.cardShadow}>
          <View style={styles.cardInner}>
            {/* dots */}
            <View style={styles.dotsLayer} pointerEvents="none">
              {dots.map((d, i) => (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    left: d.x,
                    top: d.y,
                    width: d.size,
                    height: d.size,
                    borderRadius: d.size / 2,
                    backgroundColor: colors.primary,
                    opacity: d.opacity,
                  }}
                />
              ))}
            </View>

            {/* icon */}
            <View style={{ alignItems: 'center' }}>
              <View style={styles.bigCircle}>
                {iconName && (
                              <MaterialIcons
                                name={iconName}
                                size={44}
                                color="#111"
                              />
                )}
              </View>
            </View>

            <Text style={styles.title}>{title ?? 'Loading'}</Text>

            <Text style={styles.sub}>Please wait...</Text>
            <Text style={styles.sub}>
              {`${messageLine1 ?? ''} ${messageLine2 ?? ''}`}
            </Text>

            <View style={styles.spinnerWrap}>
              <Spinner size={54} color={colors.primary} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ===== styles ===== */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardShadow: {
    width: CARD_W,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 12,
  },
  cardInner: {
    width: CARD_W,
    borderRadius: 24,
    backgroundColor: '#fff',
    overflow: 'hidden',
    paddingTop: PT,
    paddingBottom: 16,
  },
  dotsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CARD_W,
    height: TOP_AREA_H,
  },
  bigCircle: {
    width: CIRCLE_D,
    height: CIRCLE_D,
    borderRadius: 9999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 60,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
  },
  sub: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 13,
    color: '#444',
  },
  spinnerWrap: {
    marginTop: 24,
    alignItems: 'center',
    paddingBottom: 16,
  },
});
