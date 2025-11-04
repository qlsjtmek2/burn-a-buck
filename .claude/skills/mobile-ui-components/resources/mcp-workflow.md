# MCP 워크플로우 가이드

Magic MCP와 Context7 MCP를 활용하여 React Native UI 컴포넌트를 효율적으로 개발하는 워크플로우를 제공합니다.

## Magic MCP 개요

Magic MCP는 21st.dev 패턴 라이브러리에서 최신 UI 컴포넌트를 생성합니다.

### 사용 가능한 도구

1. **mcp__magic__21st_magic_component_builder** - 새 UI 컴포넌트 생성
2. **mcp__magic__21st_magic_component_refiner** - 기존 컴포넌트 개선
3. **mcp__magic__21st_magic_component_inspiration** - 디자인 영감

---

## Magic MCP 워크플로우

### 1단계: 요구사항 분석

사용자 요청을 분석하여 어떤 UI 컴포넌트가 필요한지 파악합니다.

**트리거 시나리오:**
- ✅ "로그인 폼 컴포넌트를 만들어줘"
- ✅ "프로필 카드 디자인해줘"
- ✅ "설정 화면의 스위치 리스트 만들어줘"
- ✅ "결제 화면 UI 구현"
- ✅ "상품 목록 카드 만들기"

### 2단계: Magic MCP 호출

#### mcp__magic__21st_magic_component_builder 사용

```typescript
// 도구 호출 예시 (Claude가 자동으로 수행)
mcp__magic__21st_magic_component_builder({
  message: "로그인 폼 컴포넌트를 만들어줘",
  searchQuery: "login form",
  absolutePathToCurrentFile: "/path/to/LoginScreen.tsx",
  absolutePathToProjectDirectory: "/path/to/project",
  standaloneRequestQuery: "이메일과 비밀번호 입력 필드, 로그인 버튼이 있는 폼"
})
```

**반환 결과:**
```typescript
// Magic MCP가 반환한 코드 (예시)
import { VStack, Input, Button } from 'native-base';

export const LoginForm = () => {
  return (
    <VStack space={4}>
      <Input placeholder="이메일" />
      <Input placeholder="비밀번호" type="password" />
      <Button>로그인</Button>
    </VStack>
  );
};
```

### 3단계: 코드 통합

반환된 코드를 프로젝트에 통합합니다.

```typescript
// 1. Magic MCP 코드를 기반으로 프로젝트 구조에 맞게 조정
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useState } from 'react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 로그인 로직
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### 4단계: 커스터마이징

프로젝트 요구사항에 맞게 조정합니다.

**추가 항목:**
- ✅ 타입 정의 (TypeScript)
- ✅ 상태 관리 (useState, useReducer)
- ✅ 유효성 검사
- ✅ 에러 처리
- ✅ 로딩 상태
- ✅ 접근성 props
- ✅ 테스트 작성

```typescript
// 완성된 컴포넌트 예시
interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async () => {
    if (validate()) {
      await onSubmit(email, password);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        accessible={true}
        accessibilityLabel="이메일 입력"
        accessibilityHint="로그인에 사용할 이메일을 입력하세요"
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        accessible={true}
        accessibilityLabel="비밀번호 입력"
        accessibilityHint="계정 비밀번호를 입력하세요"
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="로그인"
        accessibilityState={{ disabled: loading }}
      >
        <Text style={styles.buttonText}>
          {loading ? '로그인 중...' : '로그인'}
        </Text>
      </Pressable>
    </View>
  );
};
```

---

## Magic MCP 컴포넌트 개선

### mcp__magic__21st_magic_component_refiner 사용

기존 컴포넌트를 개선할 때 사용합니다.

**사용 시나리오:**
- ✅ UI 디자인 개선
- ✅ 레이아웃 조정
- ✅ 스타일링 향상
- ✅ 반응형 디자인 추가

```typescript
// 도구 호출 예시
mcp__magic__21st_magic_component_refiner({
  userMessage: "이 버튼을 더 현대적으로 디자인해줘",
  absolutePathToRefiningFile: "/path/to/Button.tsx",
  context: "현재 버튼이 너무 평범해 보입니다. 그라디언트와 그림자 효과를 추가하고 싶습니다."
})
```

---

## Context7 MCP 개요

Context7 MCP는 최신 라이브러리 문서를 조회합니다.

### 사용 가능한 도구

1. **mcp__context7__resolve-library-id** - 라이브러리 ID 확인
2. **mcp__context7__get-library-docs** - 라이브러리 문서 조회

---

## Context7 MCP 워크플로우

### 1단계: 라이브러리 ID 확인

```typescript
// 도구 호출 예시
mcp__context7__resolve-library-id({
  libraryName: "react-native-paper"
})

// 반환 결과
{
  libraryId: "/callstack/react-native-paper",
  description: "Material Design for React Native",
  versions: ["5.12.0", "5.11.0", ...]
}
```

### 2단계: 문서 조회

```typescript
// 도구 호출 예시
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/callstack/react-native-paper",
  topic: "Button",  // 선택적
  tokens: 5000      // 선택적 (기본값: 5000)
})

// 반환 결과
{
  docs: "# Button\n\nButton component...",
  examples: [...],
  api: {...}
}
```

### 3단계: 문서 기반 코드 작성

조회한 문서를 참조하여 최신 API를 사용합니다.

```typescript
// Context7에서 조회한 React Native Paper Button API 사용
import { Button } from 'react-native-paper';

export const PrimaryButton = ({ onPress, children }) => (
  <Button
    mode="contained"          // mode prop (최신 API)
    onPress={onPress}
    buttonColor="#007AFF"     // buttonColor (v5+)
    textColor="#fff"          // textColor (v5+)
    rippleColor="rgba(0,0,0,0.1)"  // rippleColor
    contentStyle={{ height: 48 }}  // 높이 조정
  >
    {children}
  </Button>
);
```

---

## 통합 워크플로우 예시

### 시나리오: 프로필 편집 화면 구현

#### 1단계: Magic MCP로 기본 구조 생성

```typescript
// 사용자 요청: "프로필 편집 화면을 만들어줘. 프로필 사진, 이름, 이메일, 자기소개를 입력할 수 있어야 해"

mcp__magic__21st_magic_component_builder({
  message: "프로필 편집 화면을 만들어줘",
  searchQuery: "profile edit form",
  absolutePathToCurrentFile: "/path/to/ProfileEditScreen.tsx",
  absolutePathToProjectDirectory: "/path/to/project",
  standaloneRequestQuery: "프로필 사진 업로드, 이름/이메일/자기소개 입력 필드"
})

// Magic MCP 반환 코드 (간략화)
<VStack space={4}>
  <Avatar size="xl" source={profileImage} />
  <Input placeholder="이름" />
  <Input placeholder="이메일" />
  <TextArea placeholder="자기소개" />
  <Button>저장</Button>
</VStack>
```

#### 2단계: Context7로 라이브러리 API 확인

```typescript
// React Native Paper의 Avatar와 TextInput API 확인
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/callstack/react-native-paper",
  topic: "Avatar TextInput"
})

// Expo ImagePicker API 확인
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/expo/expo",
  topic: "ImagePicker"
})
```

#### 3단계: 통합 및 커스터마이징

```typescript
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

interface ProfileEditScreenProps {
  initialProfile: {
    name: string;
    email: string;
    bio: string;
    profileImage?: string;
  };
  onSave: (profile: any) => Promise<void>;
}

export const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({
  initialProfile,
  onSave,
}) => {
  const [name, setName] = useState(initialProfile.name);
  const [email, setEmail] = useState(initialProfile.email);
  const [bio, setBio] = useState(initialProfile.bio);
  const [profileImage, setProfileImage] = useState(initialProfile.profileImage);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ name, email, bio, profileImage });
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={120}
          source={{ uri: profileImage || 'https://via.placeholder.com/120' }}
        />
        <Button
          mode="outlined"
          onPress={pickImage}
          style={styles.changePhotoButton}
        >
          사진 변경
        </Button>
      </View>

      <TextInput
        label="이름"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="이메일"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="자기소개"
        value={bio}
        onChangeText={setBio}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={styles.saveButton}
      >
        저장
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  changePhotoButton: {
    marginTop: 12,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 24,
  },
});
```

---

## 지원 라이브러리 (Context7)

### React Native Paper

```typescript
// Library ID 확인
mcp__context7__resolve-library-id("react-native-paper")
// → "/callstack/react-native-paper"

// 문서 조회
mcp__context7__get-library-docs("/callstack/react-native-paper", { topic: "Button" })
```

**주요 컴포넌트:**
- Button, IconButton, FAB
- TextInput
- Card
- Chip
- Dialog, Portal
- List
- Checkbox, RadioButton, Switch
- Avatar
- Badge
- Snackbar

### NativeBase

```typescript
mcp__context7__resolve-library-id("nativebase")
// → "/nativebase/nativebase"

mcp__context7__get-library-docs("/nativebase/nativebase", { topic: "Box VStack" })
```

**주요 컴포넌트:**
- Box, VStack, HStack, ZStack
- Text, Heading
- Button, IconButton
- Input, TextArea, Select
- Checkbox, Radio, Switch
- Modal, AlertDialog
- Toast
- Badge, Tag

### React Navigation

```typescript
mcp__context7__resolve-library-id("react-navigation")
// → "/react-navigation/react-navigation"

mcp__context7__get-library-docs("/react-navigation/react-navigation", { topic: "Stack Navigator" })
```

### Expo

```typescript
mcp__context7__resolve-library-id("expo")
// → "/expo/expo"

mcp__context7__get-library-docs("/expo/expo", { topic: "ImagePicker" })
```

**주요 모듈:**
- ImagePicker
- Camera
- Location
- Notifications
- FileSystem
- MediaLibrary

---

## 모범 사례

### ✅ Do

1. **Magic MCP 먼저 사용**
   - 새 컴포넌트는 Magic MCP로 빠르게 프로토타입
   - 반환된 코드를 기반으로 커스터마이징

2. **Context7로 최신 API 확인**
   - 라이브러리 사용 전 문서 조회
   - 최신 버전의 props와 옵션 확인

3. **단계별 개발**
   - Magic MCP → Context7 → 통합 → 커스터마이징
   - 각 단계에서 코드 검증

4. **프로젝트 패턴 유지**
   - Magic MCP 코드를 프로젝트 스타일에 맞게 조정
   - TypeScript 타입 추가
   - 접근성 props 추가

### ❌ Don't

1. **Magic MCP 코드 그대로 사용 금지**
   - 항상 프로젝트 요구사항에 맞게 조정

2. **오래된 API 사용 금지**
   - Context7로 최신 문서 확인

3. **과도한 의존 금지**
   - MCP는 시작점, 최종 구현은 직접 작성

---

## 트러블슈팅

### Magic MCP 반환 코드가 프로젝트와 맞지 않음

**문제:** Magic MCP가 NativeBase 코드를 반환했지만 프로젝트는 React Native Paper 사용

**해결:**
1. Magic MCP 코드의 구조와 레이아웃 참고
2. Context7로 React Native Paper 문서 조회
3. 동일한 구조를 Paper 컴포넌트로 재작성

### Context7 문서 조회가 너무 광범위함

**문제:** 너무 많은 문서가 반환되어 혼란스러움

**해결:**
- `topic` 파라미터로 특정 컴포넌트/API만 조회
- `tokens` 파라미터 조정 (기본값: 5000)

```typescript
// 특정 주제만 조회
mcp__context7__get-library-docs(
  "/callstack/react-native-paper",
  { topic: "Button", tokens: 2000 }
)
```

---

## 참고 자료

- [Magic MCP Documentation](https://21st.dev)
- [Context7 MCP Documentation](https://context7.com)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [NativeBase](https://nativebase.io/)
- [Expo](https://docs.expo.dev/)
