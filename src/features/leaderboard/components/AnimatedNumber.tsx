import React, { useEffect, useState } from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import {
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  style?: TextStyle | TextStyle[];
  prefix?: string;
  suffix?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 700,
  style,
  prefix = '',
  suffix = '',
}) => {
  const [displayText, setDisplayText] = useState(`${prefix}${value}${suffix}`);
  const animatedValue = useSharedValue(value);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.quad),
    });
  }, [value, duration]);

  useAnimatedReaction(
    () => Math.floor(animatedValue.value),
    (current) => {
      runOnJS(setDisplayText)(`${prefix}${current}${suffix}`);
    }
  );

  return <Text style={style}>{displayText}</Text>;
};
