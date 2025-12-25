import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spinner } from '@/components/ui/spinner';
import { colors } from '../constant/theme';
import FontAwesome from '@react-native-vector-icons/fontawesome';
type FontAwesomeName = React.ComponentProps<typeof FontAwesome>['name'];

interface LoadingProps {
  isLoading: boolean;
  title?: string;
  messageLine1?: string;
  messageLine2?: string;
  iconName?: FontAwesomeName;
}

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
  minSize?: number;
  maxSize?: number;
  boundsW: number;
  boundsH: number;
  jitter?: number; // 0..1
}): Dot[] {
  const {
    count = 14,
    centerX,
    centerY,
    innerR,
    outerR,
    minSize = 3,
    maxSize = 14,
    boundsW,
    boundsH,
    jitter = 0.45,
  } = opts;

  const dots: Dot[] = [];
  let guard = 0;

  while (dots.length < count && guard < 2000) {
    guard++;
    const i = dots.length;

    // đều quanh vòng tròn: chia đều góc + jitter nhẹ
    const base = (i / count) * Math.PI * 2;
    const angle = base + (Math.random() - 0.5) * jitter;

    // radius có “độ dày” trong [innerR, outerR]
    const radius = innerR + Math.random() * (outerR - innerR);

    // size bias về nhỏ (nhiều chấm nhỏ hơn)
    const s = Math.random();
    const size = Math.round(minSize + (maxSize - minSize) * (s * s * s));

    const x = centerX + radius * Math.cos(angle) - size / 2;
    const y = centerY + radius * Math.sin(angle) - size / 2;

    // không cho vượt biên
    if (x < 0 || y < 0 || x + size > boundsW || y + size > boundsH) continue;

    const opacity = 0.55 + Math.random() * 0.35;
    dots.push({ x, y, size, opacity });
  }

  return dots;
}

// === Layout constants ===
const CARD_W = 300;
const CIRCLE_D = 128;
const PT = 80; // paddingTop để chừa chỗ cho vòng tròn lớn

// tâm vòng tròn lớn phải tính theo paddingTop
const centerX = CARD_W / 2;
const centerY = PT + CIRCLE_D / 2;

// vùng phía trên chứa vòng tròn + dots (đủ rộng để dots không bị cắt)
const TOP_AREA_H = PT + CIRCLE_D + 40;

export default function LoadingModal({
  isLoading,
  title,
  messageLine1,
  messageLine2,
  iconName,
}: Readonly<LoadingProps>) {
  const dots = useMemo(
    () =>
      makeRingDots({
        count: 8,
        centerX,
        centerY,
        innerR: CIRCLE_D / 2 + 16,
        outerR: CIRCLE_D / 2 + 36, // tạo vòng dày đẹp
        minSize: 10,
        maxSize: 30,
        boundsW: CARD_W,
        boundsH: TOP_AREA_H,
        jitter: 0.5,
      }),
    [],
  );

  if (!isLoading) return null;

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/30">
      {/* OUTER: giữ shadow */}
      <View style={styles.cardShadow}>
        {/* INNER: clip để dots không tràn */}
        <View style={styles.cardInner} className="relative bg-white px-6">
          {/* dots layer (chỉ vùng phía trên) */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: CARD_W,
              height: TOP_AREA_H,
            }}
          >
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

          {/* Big circle */}
          <View className="items-center">
            <View
              style={{
                width: CIRCLE_D,
                height: CIRCLE_D,
                borderRadius: 9999,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesome name={iconName!} size={44} color="#111" />
            </View>
          </View>

          {/* title + message */}
          <Text
            className="text-center text-[20px] font-semibold text-[#111]"
            style={{ marginTop: 60 }}
          >
            {title}
          </Text>

          <Text className="mt-3 text-center text-[13px] text-[#444]">
            Please wait...
          </Text>
          <Text className="mt-1 text-center text-[13px] text-[#444]">
            {`${messageLine1} ${messageLine2}`}
          </Text>

          {/* spinner */}
          <View className="mt-6 items-center justify-center pb-10">
            <Spinner size={54} color={colors.primary} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    width: CARD_W,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
    backgroundColor: 'transparent',
  },
  cardInner: {
    width: CARD_W,
    borderRadius: 24,
    overflow: 'hidden',
    paddingTop: PT,
    paddingBottom: 10,
  },
});
