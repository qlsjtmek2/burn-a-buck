# React Native 접근성 (Accessibility) 가이드

모든 사용자가 앱을 사용할 수 있도록 접근성을 고려한 컴포넌트를 작성하는 방법을 제공합니다.

## 접근성이 중요한 이유

- **포용성**: 시각, 청각, 운동 장애가 있는 사용자도 앱 사용 가능
- **법적 준수**: 많은 국가에서 접근성은 법적 요구사항
- **더 나은 UX**: 접근성 개선은 모든 사용자에게 도움
- **SEO 및 검색**: 웹에서 접근성은 검색 엔진 최적화에도 도움

---

## 필수 접근성 Props

### accessible

컴포넌트를 스크린 리더가 인식할 수 있는 단일 요소로 만듭니다.

```typescript
import { View, Text } from 'react-native';

// ✅ Good - 스크린 리더가 인식
<View accessible={true}>
  <Text>사용자 이름</Text>
  <Text>user@example.com</Text>
</View>
// 스크린 리더: "사용자 이름, user@example.com"

// ❌ Bad - 각각 별도로 읽힘
<View>
  <Text>사용자 이름</Text>
  <Text>user@example.com</Text>
</View>
// 스크린 리더: "사용자 이름" (정지) "user@example.com"
```

### accessibilityLabel

스크린 리더가 읽을 텍스트를 지정합니다.

```typescript
import { Pressable, Image } from 'react-native';

// ✅ Good - 아이콘 버튼에 레이블 제공
<Pressable
  accessible={true}
  accessibilityLabel="프로필 편집"
  onPress={handleEdit}
>
  <Image source={editIcon} />
</Pressable>

// ✅ Good - 약어나 기호 설명
<Text accessible={true} accessibilityLabel="가격: 1만 원">
  ₩10,000
</Text>

// ❌ Bad - 레이블 없는 이미지 버튼
<Pressable onPress={handleEdit}>
  <Image source={editIcon} />
</Pressable>
```

### accessibilityHint

요소의 동작이나 결과를 설명합니다.

```typescript
<Pressable
  accessible={true}
  accessibilityLabel="프로필 편집"
  accessibilityHint="프로필 수정 화면으로 이동합니다"
  onPress={handleEdit}
>
  <Text>편집</Text>
</Pressable>

<TextInput
  accessible={true}
  accessibilityLabel="이메일 주소"
  accessibilityHint="로그인에 사용할 이메일을 입력하세요"
  placeholder="email@example.com"
/>
```

**규칙:**
- ✅ **Label**: "무엇인가" (명사)
- ✅ **Hint**: "무엇을 하는가" (동사/문장)

### accessibilityRole

요소의 역할을 지정합니다.

```typescript
import { Pressable, Text, View } from 'react-native';

// 버튼
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="제출"
  onPress={handleSubmit}
>
  <Text>제출</Text>
</Pressable>

// 헤더
<Text accessible={true} accessibilityRole="header">
  제목
</Text>

// 링크
<Pressable
  accessible={true}
  accessibilityRole="link"
  onPress={openLink}
>
  <Text>더 알아보기</Text>
</Pressable>

// 이미지
<Image
  accessible={true}
  accessibilityRole="image"
  accessibilityLabel="프로필 사진"
  source={profileImage}
/>

// 체크박스
<Pressable
  accessible={true}
  accessibilityRole="checkbox"
  accessibilityState={{ checked: isChecked }}
  onPress={toggle}
>
  <View style={[styles.checkbox, isChecked && styles.checked]} />
</Pressable>
```

**사용 가능한 역할:**

- `button` - 버튼
- `link` - 링크
- `header` - 헤더
- `image` - 이미지
- `imagebutton` - 이미지 버튼
- `checkbox` - 체크박스
- `radio` - 라디오 버튼
- `switch` - 스위치
- `text` - 정적 텍스트
- `search` - 검색 필드
- `adjustable` - 조정 가능한 요소 (슬라이더)
- `menu` - 메뉴
- `menubar` - 메뉴바
- `menuitem` - 메뉴 항목
- `progressbar` - 진행률 표시줄
- `tab` - 탭
- `tablist` - 탭 목록
- `timer` - 타이머
- `toolbar` - 툴바

---

## 접근성 상태

### accessibilityState

요소의 현재 상태를 나타냅니다.

```typescript
import { Pressable, Text } from 'react-native';

// 체크박스
<Pressable
  accessible={true}
  accessibilityRole="checkbox"
  accessibilityState={{
    checked: isChecked,
    disabled: isDisabled,
  }}
  onPress={toggle}
>
  <Text>{isChecked ? '☑' : '☐'} 동의합니다</Text>
</Pressable>

// 버튼
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityState={{
    disabled: isLoading,
    busy: isLoading,
  }}
  onPress={handleSubmit}
>
  <Text>{isLoading ? '로딩 중...' : '제출'}</Text>
</Pressable>

// 탭
<Pressable
  accessible={true}
  accessibilityRole="tab"
  accessibilityState={{
    selected: isActive,
  }}
  onPress={() => setActiveTab(tabId)}
>
  <Text>{tabTitle}</Text>
</Pressable>

// 토글 스위치
<Pressable
  accessible={true}
  accessibilityRole="switch"
  accessibilityState={{
    checked: isEnabled,
  }}
  onPress={toggle}
>
  <View style={[styles.switch, isEnabled && styles.switchOn]} />
</Pressable>
```

**상태 속성:**

- `checked` - 체크 여부 (boolean, undefined, "mixed")
- `disabled` - 비활성화 여부 (boolean)
- `selected` - 선택 여부 (boolean)
- `busy` - 로딩 중 (boolean)
- `expanded` - 확장 여부 (boolean)

---

## 접근성 값

### accessibilityValue

슬라이더, 프로그레스 바 등 조정 가능한 요소의 현재 값을 제공합니다.

```typescript
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

// 슬라이더
<Slider
  accessible={true}
  accessibilityRole="adjustable"
  accessibilityLabel="볼륨"
  accessibilityValue={{
    min: 0,
    max: 100,
    now: volume,
    text: `${volume}%`,
  }}
  value={volume}
  onValueChange={setVolume}
  minimumValue={0}
  maximumValue={100}
/>

// 프로그레스 바
<View
  accessible={true}
  accessibilityRole="progressbar"
  accessibilityValue={{
    min: 0,
    max: 100,
    now: progress,
    text: `${progress}% 완료`,
  }}
>
  <ProgressBar progress={progress} />
</View>

// 페이지 인디케이터
<View
  accessible={true}
  accessibilityLabel="페이지"
  accessibilityValue={{
    min: 1,
    max: totalPages,
    now: currentPage,
    text: `${currentPage} / ${totalPages}`,
  }}
>
  <PageIndicator current={currentPage} total={totalPages} />
</View>
```

---

## 커스텀 접근성 동작

### accessibilityActions

스크린 리더에서 사용할 수 있는 커스텀 액션을 정의합니다.

```typescript
import { View, Text } from 'react-native';

<View
  accessible={true}
  accessibilityLabel="메시지"
  accessibilityActions={[
    { name: 'activate', label: '읽기' },
    { name: 'delete', label: '삭제' },
    { name: 'archive', label: '보관' },
  ]}
  onAccessibilityAction={(event) => {
    switch (event.nativeEvent.actionName) {
      case 'activate':
        handleRead();
        break;
      case 'delete':
        handleDelete();
        break;
      case 'archive':
        handleArchive();
        break;
    }
  }}
>
  <Text>메시지 내용</Text>
</View>
```

### 커스텀 액션 예제: 스와이프 가능한 리스트 아이템

```typescript
const SwipeableListItem = ({ item, onDelete, onArchive }) => {
  return (
    <View
      accessible={true}
      accessibilityLabel={item.title}
      accessibilityHint="스와이프하여 삭제하거나 보관할 수 있습니다"
      accessibilityActions={[
        { name: 'delete', label: '삭제' },
        { name: 'archive', label: '보관' },
      ]}
      onAccessibilityAction={(event) => {
        switch (event.nativeEvent.actionName) {
          case 'delete':
            onDelete(item.id);
            break;
          case 'archive':
            onArchive(item.id);
            break;
        }
      }}
    >
      <Text>{item.title}</Text>
    </View>
  );
};
```

---

## 접근성 포커스 제어

### accessibilityElementsHidden

자식 요소들을 스크린 리더에서 숨깁니다.

```typescript
import { View, Modal } from 'react-native';

export const AppWithModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {/* 모달이 열려있을 때 메인 컨텐츠 숨기기 */}
      <View accessibilityElementsHidden={modalVisible}>
        <MainContent />
      </View>

      <Modal visible={modalVisible}>
        <ModalContent onClose={() => setModalVisible(false)} />
      </Modal>
    </>
  );
};
```

### importantForAccessibility (Android)

Android에서 접근성 중요도를 제어합니다.

```typescript
<View importantForAccessibility="no-hide-descendants">
  {/* 이 뷰와 자식들은 스크린 리더에서 무시됨 */}
</View>

<View importantForAccessibility="yes">
  {/* 이 뷰는 스크린 리더에서 중요 */}
</View>
```

**값:**
- `auto` - 자동 (기본값)
- `yes` - 중요
- `no` - 무시
- `no-hide-descendants` - 자신과 자식 모두 무시

---

## 접근성 실전 예제

### 접근 가능한 폼

```typescript
import { View, Text, TextInput, Pressable } from 'react-native';

export const AccessibleForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <View>
      {/* 폼 헤더 */}
      <Text
        accessible={true}
        accessibilityRole="header"
        style={styles.header}
      >
        로그인
      </Text>

      {/* 이메일 입력 */}
      <View style={styles.inputGroup}>
        <Text
          accessible={true}
          accessibilityRole="text"
          nativeID="email-label"
        >
          이메일
        </Text>
        <TextInput
          accessible={true}
          accessibilityLabel="이메일 주소"
          accessibilityHint="로그인에 사용할 이메일을 입력하세요"
          accessibilityLabelledBy="email-label"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
        />
      </View>

      {/* 비밀번호 입력 */}
      <View style={styles.inputGroup}>
        <Text
          accessible={true}
          accessibilityRole="text"
          nativeID="password-label"
        >
          비밀번호
        </Text>
        <TextInput
          accessible={true}
          accessibilityLabel="비밀번호"
          accessibilityHint="계정 비밀번호를 입력하세요"
          accessibilityLabelledBy="password-label"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />
      </View>

      {/* 체크박스 */}
      <Pressable
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityLabel="이용약관 동의"
        accessibilityHint="이용약관에 동의하려면 활성화하세요"
        accessibilityState={{ checked: agreedToTerms }}
        onPress={() => setAgreedToTerms(!agreedToTerms)}
        style={styles.checkbox}
      >
        <View style={[styles.checkboxBox, agreedToTerms && styles.checked]}>
          {agreedToTerms && <Text>✓</Text>}
        </View>
        <Text>이용약관에 동의합니다</Text>
      </Pressable>

      {/* 제출 버튼 */}
      <Pressable
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="로그인"
        accessibilityHint="로그인하려면 활성화하세요"
        accessibilityState={{
          disabled: !email || !password || !agreedToTerms
        }}
        onPress={handleLogin}
        style={styles.button}
        disabled={!email || !password || !agreedToTerms}
      >
        <Text style={styles.buttonText}>로그인</Text>
      </Pressable>
    </View>
  );
};
```

### 접근 가능한 카드 리스트

```typescript
export const AccessibleCardList = ({ items }) => {
  const renderItem = ({ item, index }) => (
    <Pressable
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.subtitle}`}
      accessibilityHint="상세 정보를 보려면 활성화하세요"
      accessibilityActions={[
        { name: 'favorite', label: '즐겨찾기 추가' },
        { name: 'share', label: '공유' },
      ]}
      onAccessibilityAction={(event) => {
        switch (event.nativeEvent.actionName) {
          case 'favorite':
            handleFavorite(item.id);
            break;
          case 'share':
            handleShare(item.id);
            break;
        }
      }}
      onPress={() => handlePress(item)}
      style={styles.card}
    >
      <Text accessible={false} style={styles.title}>
        {item.title}
      </Text>
      <Text accessible={false} style={styles.subtitle}>
        {item.subtitle}
      </Text>
    </Pressable>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      accessible={false}  // 개별 아이템이 접근 가능하므로 리스트는 숨김
    />
  );
};
```

---

## 스크린 리더 테스팅

### iOS VoiceOver 테스트

1. **설정 > 손쉬운 사용 > VoiceOver** 켜기
2. 또는 **Siri**에게 "VoiceOver 켜줘" 요청
3. **세 손가락 두 번 탭**: 읽기 시작/중지
4. **한 손가락 왼쪽/오른쪽 스와이프**: 이전/다음 요소
5. **두 번 탭**: 요소 활성화

### Android TalkBack 테스트

1. **설정 > 접근성 > TalkBack** 켜기
2. **한 손가락 왼쪽/오른쪽 스와이프**: 이전/다음 요소
3. **두 번 탭**: 요소 활성화
4. **두 손가락 스와이프 아래**: 읽기 시작

### 자동 테스팅

```typescript
import { render } from '@testing-library/react-native';

describe('Accessibility', () => {
  it('button has correct accessibility props', () => {
    const { getByRole } = render(
      <Pressable
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="제출"
      >
        <Text>제출</Text>
      </Pressable>
    );

    const button = getByRole('button');
    expect(button).toHaveAccessibilityState({ disabled: false });
    expect(button.props.accessibilityLabel).toBe('제출');
  });
});
```

---

## WCAG 가이드라인 준수

### WCAG 2.1 레벨 AA 기준

**1. 인식 가능 (Perceivable)**
- ✅ 모든 이미지에 대체 텍스트 제공
- ✅ 색상만으로 정보 전달 금지
- ✅ 충분한 명암 대비 (4.5:1 이상)

**2. 조작 가능 (Operable)**
- ✅ 모든 기능 키보드로 접근 가능
- ✅ 충분한 터치 영역 (최소 44x44 포인트)
- ✅ 명확한 포커스 표시

**3. 이해 가능 (Understandable)**
- ✅ 명확한 레이블과 힌트
- ✅ 일관된 네비게이션
- ✅ 에러 메시지 제공

**4. 견고함 (Robust)**
- ✅ 올바른 접근성 역할 사용
- ✅ 상태 변경 알림

---

## 일반적인 실수

### ❌ 피해야 할 패턴

**1. 의미 없는 레이블**
```typescript
// Bad
<Pressable accessibilityLabel="버튼">
```

**2. 중첩된 접근 가능 요소**
```typescript
// Bad
<Pressable accessible={true}>
  <Text accessible={true}>클릭</Text>
</Pressable>
```

**3. 이미지 버튼에 레이블 누락**
```typescript
// Bad
<Pressable onPress={handleEdit}>
  <Image source={editIcon} />
</Pressable>
```

### ✅ 권장 패턴

**1. 명확한 레이블**
```typescript
// Good
<Pressable accessibilityLabel="프로필 편집">
```

**2. 단일 접근 가능 요소**
```typescript
// Good
<Pressable accessible={true} accessibilityLabel="클릭">
  <Text accessible={false}>클릭</Text>
</Pressable>
```

**3. 이미지 버튼에 레이블 제공**
```typescript
// Good
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="프로필 편집"
  onPress={handleEdit}
>
  <Image source={editIcon} />
</Pressable>
```

---

## 참고 자료

- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [iOS Accessibility](https://developer.apple.com/accessibility/)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/)
