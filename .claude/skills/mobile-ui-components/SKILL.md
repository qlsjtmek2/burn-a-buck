---
name: mobile-ui-components
description: React Native UI component development with Magic MCP and Context7 integration. Create mobile UI components, forms, cards, lists, buttons using Magic MCP 21st.dev patterns. Style with StyleSheet, responsive design, dark mode themes. Ensure accessibility with proper props. Add animations with Animated API. Test components with React Native Testing Library. Use Magic MCP for component generation, Context7 for library documentation (React Native Paper, NativeBase, Expo). Build mobile apps, styling patterns, component patterns, accessibility, animations, testing mobile UI.
version: 2.0.0
type: domain
tags:
  - react-native
  - ui-components
  - styling
  - theming
  - accessibility
  - magic-mcp
  - context7
---

# React Native Mobile UI Components

React Native 환경에서 재사용 가능하고 접근성이 높은 UI 컴포넌트를 빠르게 개발하는 종합 가이드입니다.

## Purpose

React Native 앱 개발 시 UI 컴포넌트를 효율적으로 생성하고, 스타일링하며, 테스트하는 방법을 제공합니다. Magic MCP와 Context7 MCP를 활용하여 최신 패턴과 API를 빠르게 적용할 수 있습니다.

## When to Use

이 스킬은 다음과 같은 상황에서 자동으로 활성화됩니다:

- ✅ 새로운 UI 컴포넌트 생성 (버튼, 카드, 폼, 리스트 등)
- ✅ React Native 스타일링 (StyleSheet, 반응형, 다크모드)
- ✅ 컴포넌트 패턴 구현 (FlatList, 폼, 터치 컴포넌트)
- ✅ 접근성(Accessibility) 구현
- ✅ 애니메이션 추가 (Animated API, Reanimated)
- ✅ 컴포넌트 테스팅 (React Native Testing Library)
- ✅ UI 라이브러리 사용 (React Native Paper, NativeBase)
- ✅ Magic MCP로 UI 생성
- ✅ Context7 MCP로 라이브러리 문서 조회

---

## Navigation Guide

작업에 따라 적절한 리소스를 참고하세요:

| 원하는 작업 | 참고할 리소스 | 설명 |
|------------|--------------|------|
| **스타일링** | [styling-patterns.md](resources/styling-patterns.md) | StyleSheet 사용법, 반응형 디자인, 다크모드 지원, 플랫폼별 스타일, 테마 시스템, 성능 최적화 |
| **컴포넌트 구조** | [component-patterns.md](resources/component-patterns.md) | 기본 컴포넌트 구조, FlatList 최적화, 폼 컴포넌트, 터치 컴포넌트, UI 라이브러리 사용법, 성능 최적화 |
| **접근성** | [accessibility-guide.md](resources/accessibility-guide.md) | 필수 접근성 Props, accessibilityLabel/Hint/Role, 접근성 상태, 커스텀 액션, 스크린 리더 테스팅, WCAG 준수 |
| **애니메이션** | [animation-guide.md](resources/animation-guide.md) | Animated API, useNativeDriver, 복잡한 애니메이션, 제스처 애니메이션, Reanimated, Moti, 성능 최적화 |
| **테스팅** | [testing-guide.md](resources/testing-guide.md) | React Native Testing Library, 이벤트 테스팅, 비동기 테스팅, 스냅샷 테스팅, Mock, 접근성 테스팅, E2E (Detox) |
| **MCP 워크플로우** | [mcp-workflow.md](resources/mcp-workflow.md) | Magic MCP 사용법, Context7 MCP 사용법, UI 컴포넌트 생성 프로세스, 라이브러리 문서 조회, 통합 워크플로우 |

---

## 핵심 원칙

### 1. Magic MCP 활용 우선

새로운 UI 컴포넌트가 필요할 때 **Magic MCP를 먼저 사용**하여 최신 패턴으로 빠르게 생성합니다.

```typescript
// Magic MCP 도구
mcp__magic__21st_magic_component_builder  // 새 컴포넌트 생성
mcp__magic__21st_magic_component_refiner  // 기존 컴포넌트 개선
mcp__magic__21st_magic_component_inspiration  // 디자인 영감
```

**사용 시나리오:**
- "로그인 폼 컴포넌트를 만들어줘"
- "프로필 카드 디자인해줘"
- "설정 화면의 스위치 리스트 만들어줘"

### 2. Context7 MCP로 최신 문서 조회

라이브러리 사용법이 불확실하거나 최신 API가 필요할 때 **Context7 MCP를 사용**합니다.

```typescript
// Context7 MCP 도구
mcp__context7__resolve-library-id    // 라이브러리 ID 확인
mcp__context7__get-library-docs       // 문서 조회
```

**지원 라이브러리:**
- React Native Paper: `/callstack/react-native-paper`
- NativeBase: `/nativebase/nativebase`
- React Navigation: `/react-navigation/react-navigation`
- Expo: `/expo/expo`

### 3. Progressive Disclosure

- **SKILL.md**: 개요, 원칙, Navigation Guide (현재 파일)
- **Resources**: 상세 구현, 예제, 베스트 프랙티스 (resources/ 디렉토리)

---

## Quick Start

### 기본 컴포넌트 생성

```typescript
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary'
}) => {
  return (
    <Pressable
      style={[
        styles.button,
        variant === 'secondary' && styles.buttonSecondary
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#5856D6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### Magic MCP로 컴포넌트 생성

```typescript
// 사용자 요청: "로그인 폼을 만들어줘"
// → Magic MCP가 기본 구조 생성
// → 프로젝트에 맞게 커스터마이징

<VStack space={4}>
  <Input placeholder="이메일" />
  <Input placeholder="비밀번호" type="password" />
  <Button>로그인</Button>
</VStack>

// ↓ 커스터마이징

<View style={styles.form}>
  <TextInput
    style={styles.input}
    placeholder="이메일"
    keyboardType="email-address"
    autoComplete="email"
  />
  <TextInput
    style={styles.input}
    placeholder="비밀번호"
    secureTextEntry
    autoComplete="password"
  />
  <Button title="로그인" onPress={handleLogin} />
</View>
```

### Context7로 라이브러리 문서 조회

```typescript
// 1. 라이브러리 ID 확인
mcp__context7__resolve-library-id("react-native-paper")
// → "/callstack/react-native-paper"

// 2. 문서 조회
mcp__context7__get-library-docs("/callstack/react-native-paper", { topic: "Button" })
// → Button의 최신 props, 예제 코드 반환

// 3. 최신 API 사용
import { Button } from 'react-native-paper';

<Button
  mode="contained"
  onPress={handlePress}
  buttonColor="#007AFF"
  textColor="#fff"
>
  클릭
</Button>
```

---

## UI 라이브러리 개요

### React Native Paper (권장)

Material Design 기반의 크로스플랫폼 컴포넌트 라이브러리

**장점:**
- Material Design 3 지원
- 커스터마이징 가능한 테마
- TypeScript 완벽 지원
- 접근성 내장

**주요 컴포넌트:**
- Button, IconButton, FAB
- TextInput, Card
- List, Dialog, Snackbar

```typescript
import { Button, Card } from 'react-native-paper';

<Card>
  <Card.Title title="제목" />
  <Card.Content>
    <Text>내용</Text>
  </Card.Content>
  <Card.Actions>
    <Button>취소</Button>
    <Button>확인</Button>
  </Card.Actions>
</Card>
```

### NativeBase

Utility-first 스타일의 크로스플랫폼 컴포넌트

**장점:**
- 빠른 프로토타이핑
- 반응형 props (base, sm, md, lg)
- 다크모드 쉽게 구현
- Accessibility props 내장

**주요 컴포넌트:**
- Box, VStack, HStack
- Button, Input, Select
- Modal, Toast, Badge

```typescript
import { Box, VStack, Button } from 'native-base';

<Box p={4}>
  <VStack space={4}>
    <Button colorScheme="primary">Primary</Button>
    <Button colorScheme="secondary">Secondary</Button>
  </VStack>
</Box>
```

---

## 개발 워크플로우

### 1. Magic MCP로 시작

새 컴포넌트는 Magic MCP로 빠르게 프로토타입을 생성합니다.

### 2. Context7로 API 확인

사용할 라이브러리의 최신 문서를 조회하여 올바른 API를 확인합니다.

### 3. 통합 및 커스터마이징

생성된 코드를 프로젝트 요구사항에 맞게 조정합니다:
- ✅ TypeScript 타입 추가
- ✅ 상태 관리 구현
- ✅ 유효성 검사 추가
- ✅ 접근성 props 추가
- ✅ 에러 처리 구현
- ✅ 테스트 작성

### 4. 검증 및 최적화

- 스타일링 확인 (반응형, 다크모드)
- 접근성 테스팅 (VoiceOver, TalkBack)
- 성능 최적화 (React.memo, useCallback)
- 단위 테스트 작성

---

## 주요 패턴

### 스타일링

```typescript
// StyleSheet 사용 (권장)
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
});

// 플랫폼별 스타일
const styles = StyleSheet.create({
  shadow: {
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

### 접근성

```typescript
<Pressable
  accessible={true}
  accessibilityLabel="프로필 편집"
  accessibilityHint="프로필 수정 화면으로 이동합니다"
  accessibilityRole="button"
  onPress={handleEdit}
>
  <Text>편집</Text>
</Pressable>
```

### 애니메이션

```typescript
import { Animated } from 'react-native';

const fadeAnim = useRef(new Animated.Value(0)).current;

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true,  // ⭐ 항상 true 사용!
}).start();

<Animated.View style={{ opacity: fadeAnim }}>
  {children}
</Animated.View>
```

### 테스팅

```typescript
import { render, fireEvent } from '@testing-library/react-native';

it('버튼 클릭 시 onPress 호출', () => {
  const mockOnPress = jest.fn();
  const { getByText } = render(
    <Button onPress={mockOnPress}>클릭</Button>
  );

  fireEvent.press(getByText('클릭'));

  expect(mockOnPress).toHaveBeenCalledTimes(1);
});
```

---

## 일반적인 실수와 해결책

### ❌ 피해야 할 패턴

**인라인 스타일 남용**
```typescript
// Bad
<View style={{ padding: 16, backgroundColor: '#fff' }}>
```

**플랫폼별 shadow 무시**
```typescript
// Bad - Android에서 그림자 안 보임
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
```

**접근성 누락**
```typescript
// Bad - 스크린 리더가 읽을 수 없음
<Pressable onPress={handleEdit}>
  <Image source={editIcon} />
</Pressable>
```

### ✅ 권장 패턴

**StyleSheet 사용**
```typescript
// Good
const styles = StyleSheet.create({ container: { padding: 16 } });
<View style={styles.container}>
```

**플랫폼별 스타일**
```typescript
// Good
...Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.1 },
  android: { elevation: 3 },
})
```

**접근성 추가**
```typescript
// Good
<Pressable
  accessible={true}
  accessibilityLabel="편집"
  accessibilityRole="button"
  onPress={handleEdit}
>
  <Image source={editIcon} />
</Pressable>
```

---

## 참고 자료

### Resource Files (상세 가이드)

- [styling-patterns.md](resources/styling-patterns.md) - StyleSheet, 반응형, 다크모드, 테마
- [component-patterns.md](resources/component-patterns.md) - 컴포넌트 구조, FlatList, 폼, 터치
- [accessibility-guide.md](resources/accessibility-guide.md) - 접근성 Props, 스크린 리더, WCAG
- [animation-guide.md](resources/animation-guide.md) - Animated API, Reanimated, 제스처
- [testing-guide.md](resources/testing-guide.md) - Testing Library, Mock, E2E
- [mcp-workflow.md](resources/mcp-workflow.md) - Magic MCP, Context7 MCP 사용법

### MCP Tools

**Magic MCP:**
- `mcp__magic__21st_magic_component_builder` - UI 컴포넌트 생성
- `mcp__magic__21st_magic_component_refiner` - 컴포넌트 개선
- `mcp__magic__21st_magic_component_inspiration` - 디자인 영감

**Context7 MCP:**
- `mcp__context7__resolve-library-id` - 라이브러리 ID 확인
- `mcp__context7__get-library-docs` - 문서 조회

### External Resources

- [React Native Documentation](https://reactnative.dev/docs/components-and-apis)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [NativeBase](https://nativebase.io/)
- [Accessibility Guidelines](https://reactnative.dev/docs/accessibility)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

---

**이 스킬은 React Native UI 컴포넌트 개발을 가속화하고 품질을 높이기 위해 MCP 서버와 Progressive Disclosure 패턴을 적극 활용합니다.**
