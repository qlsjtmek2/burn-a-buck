# React Native 스타일링 패턴

React Native에서 UI를 스타일링하는 다양한 패턴과 모범 사례를 제공합니다.

## StyleSheet 사용 (기본)

### 기본 패턴

```typescript
import { StyleSheet, View, Text } from 'react-native';

const ProfileCard = ({ name, email }) => (
  <View style={styles.container}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.email}>{email}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
});
```

### StyleSheet 규칙

- ✅ **컴포넌트 하단에 배치**: `StyleSheet.create()`는 컴포넌트 정의 하단에 배치
- ✅ **정적 vs 동적 분리**: 동적 스타일은 인라인, 정적 스타일은 StyleSheet
- ✅ **플랫폼별 스타일**: `Platform.select()` 사용
- ✅ **Android shadow**: `elevation` 속성 사용
- ✅ **iOS shadow**: `shadow*` 속성 사용 (shadowColor, shadowOffset, shadowOpacity, shadowRadius)

### 동적 스타일 예제

```typescript
const Card = ({ isActive }) => (
  <View style={[
    styles.card,
    isActive && styles.cardActive,  // 조건부 스타일
    { marginTop: isActive ? 20 : 10 }  // 동적 값
  ]}>
    <Text>카드</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fff',
  },
  cardActive: {
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
});
```

---

## 반응형 디자인

### useWindowDimensions Hook

```typescript
import { useWindowDimensions, View, Text } from 'react-native';

const ResponsiveCard = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isLandscape = width > height;

  return (
    <View style={[
      styles.card,
      {
        width: isTablet ? width * 0.5 : width - 32,
        flexDirection: isLandscape ? 'row' : 'column'
      }
    ]}>
      <Text style={{ fontSize: isTablet ? 20 : 16 }}>
        반응형 텍스트
      </Text>
    </View>
  );
};
```

### Breakpoints 가이드

```typescript
// breakpoints.ts
export const BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
};

export const useBreakpoint = () => {
  const { width } = useWindowDimensions();

  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'phone';
};

// 사용 예제
const MyComponent = () => {
  const breakpoint = useBreakpoint();

  return (
    <View style={{
      padding: breakpoint === 'phone' ? 16 : 32,
      flexDirection: breakpoint === 'phone' ? 'column' : 'row',
    }}>
      {/* 컨텐츠 */}
    </View>
  );
};
```

### 반응형 Grid 레이아웃

```typescript
const ResponsiveGrid = ({ items }) => {
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 3 : 2;

  return (
    <FlatList
      data={items}
      numColumns={numColumns}
      key={numColumns}  // numColumns 변경 시 강제 리렌더
      renderItem={({ item }) => <GridItem item={item} />}
    />
  );
};
```

---

## 다크모드 지원

### useColorScheme Hook

```typescript
import { useColorScheme, View, Text } from 'react-native';

const ThemedCard = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[
      styles.card,
      { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
    ]}>
      <Text style={{ color: isDark ? '#ffffff' : '#000000' }}>
        테마 적용된 텍스트
      </Text>
    </View>
  );
};
```

### 테마 시스템 (Context API 사용)

```typescript
// theme.ts
export const lightTheme = {
  colors: {
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#007AFF',
    secondary: '#5856D6',
    error: '#FF3B30',
    success: '#34C759',
    border: '#E5E5EA',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};

export const darkTheme = {
  colors: {
    background: '#000000',
    surface: '#1c1c1e',
    text: '#ffffff',
    textSecondary: '#98989d',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    error: '#FF453A',
    success: '#32D74B',
    border: '#38383a',
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
};

export type Theme = typeof lightTheme;

// ThemeContext.tsx
import { createContext, useContext, ReactNode } from 'react';

const ThemeContext = createContext<Theme>(lightTheme);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### 테마 사용 예제

```typescript
import { useTheme } from './ThemeContext';

const ThemedButton = ({ title, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 16 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

---

## 플랫폼별 스타일

### Platform.select() 사용

```typescript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  text: {
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
});
```

### Platform.OS 체크

```typescript
const Card = () => (
  <View style={[
    styles.card,
    Platform.OS === 'ios' && styles.cardIOS,
    Platform.OS === 'android' && styles.cardAndroid,
  ]}>
    <Text>플랫폼별 스타일</Text>
  </View>
);
```

### 플랫폼별 파일 분리

```
components/
├── Button.ios.tsx
├── Button.android.tsx
└── Button.tsx  // 공통 인터페이스
```

React Native는 자동으로 `.ios.tsx` 또는 `.android.tsx` 파일을 선택합니다.

---

## UI 라이브러리 테마 설정

### React Native Paper 테마

```typescript
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007AFF',
    secondary: '#5856D6',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#0A84FF',
    secondary: '#5E5CE6',
  },
};

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <YourApp />
    </PaperProvider>
  );
}
```

### NativeBase 테마

```typescript
import { NativeBaseProvider, extendTheme } from 'native-base';

const customTheme = extendTheme({
  colors: {
    primary: {
      50: '#E3F2FD',
      500: '#007AFF',
      600: '#0056B3',
    },
  },
  config: {
    initialColorMode: 'light',
  },
});

export default function App() {
  return (
    <NativeBaseProvider theme={customTheme}>
      <YourApp />
    </NativeBaseProvider>
  );
}
```

---

## 성능 최적화

### 이미지 최적화

```typescript
import { Image } from 'react-native';

<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  resizeMode="cover"
  progressiveRenderingEnabled  // Android: 점진적 렌더링
  fadeDuration={300}           // Android: 페이드 인 시간
  loadingIndicatorSource={require('./placeholder.png')}  // 로딩 플레이스홀더
/>
```

### 스타일 최적화

```typescript
// ❌ Bad - 매 렌더마다 새 객체 생성
<View style={{ padding: 16, backgroundColor: '#fff' }}>

// ✅ Good - StyleSheet 사용
<View style={styles.container}>

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
});
```

### 조건부 스타일 최적화

```typescript
// ❌ Bad - 불필요한 객체 생성
<View style={[styles.card, isActive ? { backgroundColor: '#f00' } : {}]}>

// ✅ Good - 조건부로 스타일 추가
<View style={[styles.card, isActive && styles.cardActive]}>

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  cardActive: {
    backgroundColor: '#f00',
  },
});
```

---

## 일반적인 실수

### ❌ 피해야 할 패턴

**1. 인라인 스타일 남용**
```typescript
// Bad
<View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
```

**2. 플랫폼별 shadow 무시**
```typescript
// Bad - Android에서 그림자 안 보임
const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
});
```

**3. 불필요한 중첩**
```typescript
// Bad
<View>
  <View>
    <View>
      <Text>텍스트</Text>
    </View>
  </View>
</View>

// Good
<Text>텍스트</Text>
```

### ✅ 권장 패턴

**1. StyleSheet 사용**
```typescript
// Good
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});

<View style={styles.container}>
```

**2. 플랫폼별 스타일 올바르게 사용**
```typescript
// Good
const styles = StyleSheet.create({
  card: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
```

---

## 참고 자료

- [React Native StyleSheet API](https://reactnative.dev/docs/stylesheet)
- [React Native Paper Theming](https://callstack.github.io/react-native-paper/theming.html)
- [NativeBase Theme](https://docs.nativebase.io/customizing-theme)
- [Platform Specific Code](https://reactnative.dev/docs/platform-specific-code)
