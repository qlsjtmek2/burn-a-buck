# React Native 컴포넌트 패턴

재사용 가능하고 성능이 우수한 React Native 컴포넌트를 작성하는 패턴과 모범 사례를 제공합니다.

## 기본 컴포넌트 구조

### TypeScript 컴포넌트 템플릿

```typescript
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CardProps {
  title: string;
  description: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  onPress,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  description: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});
```

### Props 타입 정의 모범 사례

```typescript
// ✅ Good - 명확한 타입과 선택적 props
interface ButtonProps {
  title: string;                    // 필수
  onPress: () => void;              // 필수
  variant?: 'primary' | 'secondary'; // 선택적, 제한된 값
  disabled?: boolean;               // 선택적
  loading?: boolean;                // 선택적
  icon?: string;                    // 선택적
  style?: ViewStyle;                // 선택적
}

// ✅ Good - children 타입
interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

// ✅ Good - 이벤트 핸들러
interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}
```

---

## 리스트 컴포넌트 (FlatList)

### 기본 FlatList 패턴

```typescript
import { FlatList, View, Text, StyleSheet } from 'react-native';

interface Item {
  id: string;
  title: string;
  subtitle?: string;
}

interface ItemListProps {
  items: Item[];
  onItemPress?: (item: Item) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ items, onItemPress }) => {
  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onItemPress?.(item)}
    >
      <Text style={styles.itemTitle}>{item.title}</Text>
      {item.subtitle && (
        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
      )}
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text>항목이 없습니다</Text>
    </View>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={renderSeparator}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  item: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  separator: {
    height: 8,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
});
```

### FlatList 최적화

```typescript
import { FlatList, View, Text } from 'react-native';
import { useCallback, memo } from 'react';

// 1. Item 컴포넌트 메모이제이션
const ListItem = memo<{ item: Item; onPress: (item: Item) => void }>(
  ({ item, onPress }) => (
    <TouchableOpacity onPress={() => onPress(item)}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  )
);

export const OptimizedList = ({ items, onItemPress }) => {
  // 2. renderItem 콜백 메모이제이션
  const renderItem = useCallback(
    ({ item }) => <ListItem item={item} onPress={onItemPress} />,
    [onItemPress]
  );

  // 3. keyExtractor 메모이제이션
  const keyExtractor = useCallback((item: Item) => item.id, []);

  // 4. getItemLayout 사용 (고정 높이일 때)
  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      // 5. 추가 최적화 props
      removeClippedSubviews={true}      // 화면 밖 뷰 제거 (긴 리스트)
      maxToRenderPerBatch={10}          // 배치당 렌더링 개수
      windowSize={5}                    // 뷰포트 크기 (기본 21)
      initialNumToRender={10}           // 초기 렌더링 개수
      updateCellsBatchingPeriod={50}    // 배치 업데이트 주기 (ms)
    />
  );
};

const ITEM_HEIGHT = 80; // 고정 높이
```

### 무한 스크롤 패턴

```typescript
import { FlatList, ActivityIndicator } from 'react-native';
import { useState } from 'react';

export const InfiniteScrollList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchItems(page);
      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
      setHasMore(newItems.length > 0);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ padding: 16 }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}  // 50% 남았을 때 로드
      ListFooterComponent={renderFooter}
    />
  );
};
```

---

## 폼 컴포넌트

### TextInput 모범 사례

```typescript
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoComplete?: 'email' | 'password' | 'username' | 'name';
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoComplete,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: '#007AFF',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  error: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});
```

### 로그인 폼 예제

```typescript
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

export const LoginForm = () => {
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

  const handleSubmit = () => {
    if (validate()) {
      // 로그인 로직
      console.log('Login:', { email, password });
    }
  };

  return (
    <View style={styles.form}>
      <FormInput
        label="이메일"
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        keyboardType="email-address"
        autoComplete="email"
        error={errors.email}
      />

      <FormInput
        label="비밀번호"
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호 입력"
        secureTextEntry
        autoComplete="password"
        error={errors.password}
      />

      <Button title="로그인" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 16,
  },
});
```

---

## 터치 가능한 컴포넌트

### TouchableOpacity vs Pressable

```typescript
import { TouchableOpacity, Pressable, Text, StyleSheet } from 'react-native';

// 1. TouchableOpacity - 간단한 피드백
export const SimpleButton = ({ title, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={styles.button}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// 2. Pressable - 고급 피드백과 상태 기반 스타일링
export const AdvancedButton = ({ title, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      pressed && styles.buttonPressed
    ]}
  >
    {({ pressed }) => (
      <Text style={[
        styles.buttonText,
        pressed && styles.buttonTextPressed
      ]}>
        {title}
      </Text>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#0056B3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPressed: {
    opacity: 0.8,
  },
});
```

### Pressable 고급 기능

```typescript
import { Pressable, Text } from 'react-native';

export const InteractiveCard = ({ title, onPress, onLongPress }) => {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => console.log('Press started')}
      onPressOut={() => console.log('Press ended')}
      delayLongPress={500}  // Long press 지연 시간 (ms)
      hitSlop={8}           // 터치 영역 확장
      pressRetentionOffset={20}  // 손가락 이동 허용 범위
      style={({ pressed, hovered }) => [
        styles.card,
        pressed && styles.cardPressed,
        hovered && styles.cardHovered,  // Web only
      ]}
    >
      {({ pressed }) => (
        <Text style={styles.title}>
          {pressed ? '눌림 ✓' : title}
        </Text>
      )}
    </Pressable>
  );
};
```

### 터치 컴포넌트 선택 가이드

| 컴포넌트 | 사용 시기 | 특징 |
|---------|---------|------|
| `TouchableOpacity` | 간단한 터치 피드백 | 투명도 변경, 사용 간편 |
| `Pressable` | 복잡한 상태 기반 스타일링 | pressed/hovered 상태, 고급 제어 |
| `TouchableHighlight` | 배경 하이라이트 효과 | 눌렀을 때 배경색 변경 |
| `TouchableWithoutFeedback` | 피드백 없는 터치 | 드물게 사용, 접근성 고려 |

---

## UI 라이브러리 컴포넌트 사용

### React Native Paper

```typescript
import { Button, Card, TextInput, Chip } from 'react-native-paper';

export const PaperExample = () => (
  <>
    <Button mode="contained" onPress={() => {}}>
      Contained Button
    </Button>

    <Button mode="outlined" onPress={() => {}}>
      Outlined Button
    </Button>

    <Card>
      <Card.Title title="Card Title" subtitle="Card Subtitle" />
      <Card.Content>
        <TextInput
          label="Email"
          mode="outlined"
          keyboardType="email-address"
        />
      </Card.Content>
      <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions>
    </Card>

    <Chip icon="information" onPress={() => {}}>
      Chip Component
    </Chip>
  </>
);
```

### NativeBase

```typescript
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Select,
} from 'native-base';

export const NativeBaseExample = () => (
  <Box p={4}>
    <VStack space={4}>
      <Text fontSize="lg" fontWeight="bold">
        NativeBase Components
      </Text>

      <Input
        placeholder="Enter text"
        variant="outline"
        size="md"
      />

      <Select placeholder="Choose option">
        <Select.Item label="Option 1" value="1" />
        <Select.Item label="Option 2" value="2" />
      </Select>

      <HStack space={2}>
        <Button colorScheme="primary" flex={1}>
          Primary
        </Button>
        <Button colorScheme="secondary" flex={1}>
          Secondary
        </Button>
      </HStack>
    </VStack>
  </Box>
);
```

---

## 성능 최적화

### React.memo 사용

```typescript
import React, { memo } from 'react';

interface CardProps {
  title: string;
  description: string;
}

// ✅ props가 변경되지 않으면 리렌더링 방지
export const Card = memo<CardProps>(({ title, description }) => {
  console.log('Card rendered');

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
});

// 커스텀 비교 함수 사용
export const CardWithCustomCompare = memo<CardProps>(
  ({ title, description }) => {
    // 컴포넌트 로직
  },
  (prevProps, nextProps) => {
    // true 반환 시 리렌더링 방지
    return prevProps.title === nextProps.title &&
           prevProps.description === nextProps.description;
  }
);
```

### useMemo와 useCallback

```typescript
import { useMemo, useCallback } from 'react';

export const OptimizedComponent = ({ items, filter }) => {
  // 1. 비용이 큰 계산 메모이제이션
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item => item.category === filter);
  }, [items, filter]);

  // 2. 함수 메모이제이션
  const handlePress = useCallback((id: string) => {
    console.log('Pressed:', id);
  }, []);

  // 3. 객체 메모이제이션
  const config = useMemo(() => ({
    showBorder: true,
    borderColor: '#ddd',
  }), []);

  return (
    <FlatList
      data={filteredItems}
      renderItem={({ item }) => (
        <Item item={item} onPress={handlePress} config={config} />
      )}
      keyExtractor={item => item.id}
    />
  );
};
```

### 일반적인 성능 이슈

```typescript
// ❌ Bad - 매 렌더마다 새 함수 생성
<FlatList
  data={items}
  renderItem={(item) => <Item {...item} />}
/>

// ✅ Good - useCallback으로 함수 메모이제이션
const renderItem = useCallback((item) => <Item {...item} />, []);
<FlatList data={items} renderItem={renderItem} />

// ❌ Bad - 매 렌더마다 새 배열 생성
<View style={[styles.container, { marginTop: 10 }]}>

// ✅ Good - 스타일 분리
const dynamicStyles = useMemo(() => ({ marginTop: 10 }), []);
<View style={[styles.container, dynamicStyles]}>

// ❌ Bad - 불필요한 중첩
<View>
  <View>
    <Text>Text</Text>
  </View>
</View>

// ✅ Good - 간결한 구조
<Text>Text</Text>
```

---

## 참고 자료

- [React Native Core Components](https://reactnative.dev/docs/components-and-apis)
- [FlatList Optimization](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [React Native Paper Components](https://callstack.github.io/react-native-paper/docs/components/ActivityIndicator/)
- [NativeBase Components](https://docs.nativebase.io/components)
- [Performance Optimization](https://reactnative.dev/docs/performance)
