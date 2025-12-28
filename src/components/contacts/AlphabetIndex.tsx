import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  letters: string[];
  hasLetter: (l: string) => boolean;
  onPressLetter: (l: string) => void;

  // Keep fixed when keyboard opens
  keyboardHeight: number;
};

function AlphabetIndex(props: Readonly<Props>): React.ReactElement {
  const insets = useSafeAreaInsets();

  // larger + fixed: we anchor top/bottom to safe area + keyboard height
  const bottom = 14 + (props.keyboardHeight || 0) + insets.bottom;
  const top = 140 + insets.top;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { top, bottom }]}>
      <View style={styles.rail}>
        {props.letters.map(l => {
          const enabled = props.hasLetter(l);

          return (
            <Pressable
              key={l}
              onPress={() => enabled && props.onPressLetter(l)}
              hitSlop={8}
              style={({ pressed }) => [
                styles.item,
                pressed && enabled ? styles.itemPressed : null,
                !enabled ? styles.itemDisabled : null,
              ]}
            >
              <Text style={[styles.text, !enabled ? styles.textDisabled : null]}>{l}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
  },

  rail: {
    width: 26,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#E5E7EB', // gray-200
    alignItems: 'center',
  },

  item: {
    width: 18,
    height: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
  },
  itemPressed: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  itemDisabled: {
    opacity: 0.35,
  },

  text: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280', // gray-500
  },
  textDisabled: {
    color: '#9CA3AF',
  },
});

export default AlphabetIndex;
