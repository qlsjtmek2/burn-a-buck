# React Native 애니메이션 가이드

React Native에서 부드럽고 성능이 우수한 애니메이션을 구현하는 방법을 제공합니다.

## Animated API (기본)

React Native 내장 Animated API는 선언적이고 성능이 우수한 애니메이션을 제공합니다.

### 기본 Fade In 애니메이션

```typescript
import { Animated } from 'react-native';
import { useRef, useEffect } from 'react';

const FadeInView = ({ children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,  // ⭐ 항상 true 사용!
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};
```

### useNativeDriver의 중요성

**항상 `useNativeDriver: true` 사용**

```typescript
// ✅ Good - 네이티브 스레드에서 실행 (60fps)
Animated.timing(value, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true,
}).start();

// ❌ Bad - JS 스레드에서 실행 (느림, 끊김)
Animated.timing(value, {
  toValue: 1,
  duration: 500,
  useNativeDriver: false,
}).start();
```

**useNativeDriver를 사용할 수 있는 속성:**
- ✅ `opacity`
- ✅ `transform` (scale, rotate, translate)
- ❌ `width`, `height` (레이아웃 속성 불가)
- ❌ `backgroundColor` (색상 속성 불가)

---

## 기본 애니메이션 유형

### 1. Timing (시간 기반)

```typescript
import { Animated } from 'react-native';

Animated.timing(animatedValue, {
  toValue: 100,
  duration: 500,
  useNativeDriver: true,
}).start();
```

### 2. Spring (물리 기반)

```typescript
Animated.spring(animatedValue, {
  toValue: 100,
  friction: 7,        // 마찰력 (기본값: 7)
  tension: 40,        // 장력 (기본값: 40)
  useNativeDriver: true,
}).start();
```

### 3. Decay (감속)

```typescript
Animated.decay(animatedValue, {
  velocity: 0.5,      // 초기 속도
  deceleration: 0.997, // 감속 비율 (기본값: 0.997)
  useNativeDriver: true,
}).start();
```

---

## 복잡한 애니메이션

### Slide + Fade 조합

```typescript
import { Animated } from 'react-native';
import { useRef, useEffect } from 'react';

const SlideAndFade = ({ children }) => {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // parallel: 동시 실행
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
      }}
    >
      {children}
    </Animated.View>
  );
};
```

### 순차 애니메이션 (Sequence)

```typescript
const SequenceAnimation = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // sequence: 순차 실행
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        transform: [
          { scale },
          { rotate: rotateInterpolate },
        ],
      }}
    >
      <Text>애니메이션</Text>
    </Animated.View>
  );
};
```

### 반복 애니메이션 (Loop)

```typescript
const PulseAnimation = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // loop: 무한 반복
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Text>Pulse</Text>
    </Animated.View>
  );
};
```

---

## Interpolation (값 변환)

### 기본 Interpolation

```typescript
const animatedValue = useRef(new Animated.Value(0)).current;

// 0 → 1을 0deg → 360deg로 변환
const rotateInterpolate = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});

// 0 → 1을 #ff0000 → #00ff00로 변환 (색상은 useNativeDriver 불가)
const colorInterpolate = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['rgb(255, 0, 0)', 'rgb(0, 255, 0)'],
});

<Animated.View
  style={{
    transform: [{ rotate: rotateInterpolate }],
    backgroundColor: colorInterpolate,
  }}
/>
```

### 다중 값 Interpolation

```typescript
const scrollY = useRef(new Animated.Value(0)).current;

// 스크롤 위치에 따른 헤더 크기 변화
const headerHeight = scrollY.interpolate({
  inputRange: [0, 100, 200],
  outputRange: [200, 150, 100],
  extrapolate: 'clamp',  // 범위 밖 값 제한
});

// 스크롤 위치에 따른 투명도 변화
const headerOpacity = scrollY.interpolate({
  inputRange: [0, 100, 200],
  outputRange: [1, 0.8, 0.5],
  extrapolate: 'clamp',
});

<Animated.View
  style={{
    height: headerHeight,
    opacity: headerOpacity,
  }}
>
  <Text>Header</Text>
</Animated.View>
```

---

## 제스처 애니메이션

### PanResponder로 드래그 구현

```typescript
import { Animated, PanResponder } from 'react-native';
import { useRef } from 'react';

const DraggableView = () => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }  // ValueXY는 useNativeDriver 불가
      ),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
      }}
      {...panResponder.panHandlers}
    >
      <View style={styles.box}>
        <Text>드래그하세요</Text>
      </View>
    </Animated.View>
  );
};
```

### React Native Gesture Handler (권장)

```bash
npm install react-native-gesture-handler
```

```typescript
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const DraggableWithGesture = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <Text>드래그하세요</Text>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
```

---

## React Native Reanimated (고급)

React Native Reanimated는 더 강력하고 유연한 애니메이션을 제공합니다.

### 설치

```bash
npm install react-native-reanimated
```

### 기본 사용

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

const ReanimatedExample = () => {
  const width = useSharedValue(100);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const handlePress = () => {
    width.value = withSpring(width.value + 50);
  };

  return (
    <>
      <Animated.View style={[styles.box, animatedStyle]} />
      <Button title="Expand" onPress={handlePress} />
    </>
  );
};
```

### Layout Animations (Reanimated 2)

```typescript
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';

const AnimatedList = ({ items }) => {
  return (
    <View>
      {items.map((item) => (
        <Animated.View
          key={item.id}
          entering={FadeIn}
          exiting={FadeOut}
          layout={Layout.springify()}
        >
          <Text>{item.title}</Text>
        </Animated.View>
      ))}
    </View>
  );
};
```

---

## Moti (간편한 애니메이션)

Moti는 Reanimated를 기반으로 한 간단한 API를 제공합니다.

### 설치

```bash
npm install moti
```

### 기본 사용

```typescript
import { MotiView } from 'moti';

const MotiExample = () => (
  <MotiView
    from={{
      opacity: 0,
      scale: 0.5,
    }}
    animate={{
      opacity: 1,
      scale: 1,
    }}
    transition={{
      type: 'timing',
      duration: 500,
    }}
  >
    <Text>Hello Moti</Text>
  </MotiView>
);
```

### 호버 애니메이션

```typescript
import { MotiPressable } from 'moti/interactions';

const HoverButton = () => (
  <MotiPressable
    animate={({ hovered, pressed }) => {
      'worklet';

      return {
        scale: hovered ? 1.1 : pressed ? 0.95 : 1,
        opacity: pressed ? 0.8 : 1,
      };
    }}
    transition={{
      type: 'spring',
    }}
  >
    <View style={styles.button}>
      <Text>Hover Me</Text>
    </View>
  </MotiPressable>
);
```

---

## 성능 최적화

### 1. useNativeDriver 사용

```typescript
// ✅ Good
Animated.timing(value, {
  toValue: 1,
  useNativeDriver: true,  // 네이티브 스레드에서 실행
}).start();

// ❌ Bad
Animated.timing(value, {
  toValue: 1,
  useNativeDriver: false,  // JS 스레드에서 실행 (느림)
}).start();
```

### 2. 애니메이션 종료 후 정리

```typescript
useEffect(() => {
  const animation = Animated.timing(value, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  });

  animation.start();

  return () => {
    animation.stop();  // 컴포넌트 언마운트 시 애니메이션 중지
  };
}, []);
```

### 3. 복잡한 애니메이션은 Reanimated 사용

Reanimated는 JS 스레드를 차단하지 않고 복잡한 애니메이션을 처리할 수 있습니다.

```typescript
// Animated API: JS 스레드 의존
const animatedValue = useRef(new Animated.Value(0)).current;

// Reanimated: UI 스레드에서 실행
const sharedValue = useSharedValue(0);
```

---

## 실전 예제

### 1. 로딩 인디케이터

```typescript
const LoadingIndicator = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        width: 40,
        height: 40,
        borderWidth: 4,
        borderColor: '#007AFF',
        borderRadius: 20,
        borderTopColor: 'transparent',
        transform: [{ rotate: rotateInterpolate }],
      }}
    />
  );
};
```

### 2. 카드 플립 애니메이션

```typescript
const FlipCard = ({ front, back }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <View>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ rotateY: frontInterpolate }],
              opacity: frontOpacity,
            },
          ]}
        >
          {front}
        </Animated.View>
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              transform: [{ rotateY: backInterpolate }],
              opacity: backOpacity,
            },
          ]}
        >
          {back}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};
```

### 3. 스크롤 헤더 애니메이션

```typescript
const ScrollableHeaderView = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [150, 80],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  return (
    <>
      <Animated.View
        style={[
          styles.header,
          { height: headerHeight, opacity: headerOpacity },
        ]}
      >
        <Text style={styles.headerText}>Header</Text>
      </Animated.View>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }  // height는 useNativeDriver 불가
        )}
        scrollEventThrottle={16}
      >
        <View style={{ height: 1000 }}>
          <Text>Scrollable Content</Text>
        </View>
      </Animated.ScrollView>
    </>
  );
};
```

---

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [Moti](https://moti.fyi/)
- [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native)
