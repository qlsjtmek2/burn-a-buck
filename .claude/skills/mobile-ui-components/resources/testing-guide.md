# React Native 컴포넌트 테스팅 가이드

React Native 컴포넌트를 테스트하는 다양한 방법과 모범 사례를 제공합니다.

## React Native Testing Library

React Native Testing Library는 사용자 중심의 테스트를 작성할 수 있도록 도와줍니다.

### 설치

```bash
npm install --save-dev @testing-library/react-native
npm install --save-dev @testing-library/jest-native
```

### Jest 설정

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
};
```

---

## 기본 컴포넌트 테스팅

### 렌더링 테스트

```typescript
import { render } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('버튼이 올바르게 렌더링됨', () => {
    const { getByText } = render(<Button title="클릭" />);

    expect(getByText('클릭')).toBeTruthy();
  });

  it('children이 올바르게 렌더링됨', () => {
    const { getByText } = render(
      <Button>
        <Text>버튼 텍스트</Text>
      </Button>
    );

    expect(getByText('버튼 텍스트')).toBeTruthy();
  });
});
```

### 이벤트 테스팅

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button Events', () => {
  it('버튼 클릭 시 onPress 호출', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button onPress={mockOnPress}>클릭</Button>
    );

    fireEvent.press(getByText('클릭'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태에서는 클릭 불가', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button onPress={mockOnPress} disabled>
        클릭
      </Button>
    );

    // disabled 버튼을 클릭해도 onPress가 호출되지 않음을 확인
    fireEvent.press(getByText('클릭'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
```

### 상태 변경 테스팅

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Counter } from './Counter';

describe('Counter', () => {
  it('초기 카운트가 0', () => {
    const { getByText } = render(<Counter />);

    expect(getByText('Count: 0')).toBeTruthy();
  });

  it('증가 버튼 클릭 시 카운트 증가', () => {
    const { getByText, getByTestId } = render(<Counter />);

    const incrementButton = getByTestId('increment-button');
    fireEvent.press(incrementButton);

    expect(getByText('Count: 1')).toBeTruthy();
  });

  it('감소 버튼 클릭 시 카운트 감소', () => {
    const { getByText, getByTestId } = render(<Counter initialCount={5} />);

    const decrementButton = getByTestId('decrement-button');
    fireEvent.press(decrementButton);

    expect(getByText('Count: 4')).toBeTruthy();
  });
});
```

---

## Query 메서드

### getBy* (동기)

요소를 즉시 찾습니다. 찾지 못하면 에러를 던집니다.

```typescript
const { getByText, getByTestId, getByRole } = render(<Component />);

// 텍스트로 찾기
const element = getByText('Hello');

// testID로 찾기
const button = getByTestId('submit-button');

// role로 찾기
const heading = getByRole('header');
```

### queryBy* (동기)

요소를 즉시 찾습니다. 찾지 못하면 `null`을 반환합니다.

```typescript
const { queryByText } = render(<Component />);

// 요소가 없을 때 null 반환
const element = queryByText('Not Found');
expect(element).toBeNull();

// 요소가 존재하지 않음을 확인
expect(queryByText('Missing')).not.toBeTruthy();
```

### findBy* (비동기)

요소를 비동기적으로 찾습니다. Promise를 반환합니다.

```typescript
import { render, waitFor } from '@testing-library/react-native';

const { findByText } = render(<AsyncComponent />);

// 비동기 렌더링 대기
const element = await findByText('Loaded Data');
expect(element).toBeTruthy();
```

### getAllBy*, queryAllBy*, findAllBy*

여러 요소를 찾습니다.

```typescript
const { getAllByRole } = render(<List items={items} />);

// 모든 버튼 찾기
const buttons = getAllByRole('button');
expect(buttons).toHaveLength(3);
```

---

## 비동기 테스팅

### waitFor

조건이 충족될 때까지 대기합니다.

```typescript
import { render, waitFor } from '@testing-library/react-native';

it('데이터 로딩 후 표시', async () => {
  const { getByText, queryByText } = render(<DataComponent />);

  // 로딩 텍스트 표시 확인
  expect(getByText('Loading...')).toBeTruthy();

  // 데이터가 로드될 때까지 대기
  await waitFor(() => {
    expect(queryByText('Loading...')).toBeNull();
  });

  // 로드된 데이터 확인
  expect(getByText('Loaded Data')).toBeTruthy();
});
```

### waitForElementToBeRemoved

요소가 제거될 때까지 대기합니다.

```typescript
import { render, waitForElementToBeRemoved } from '@testing-library/react-native';

it('로딩 인디케이터가 사라짐', async () => {
  const { getByTestId } = render(<Component />);

  const loadingIndicator = getByTestId('loading');

  await waitForElementToBeRemoved(() => getByTestId('loading'));

  // 로딩이 끝난 후 테스트
});
```

---

## 스냅샷 테스팅

### 기본 스냅샷

```typescript
import { render } from '@testing-library/react-native';
import { Card } from './Card';

it('Card 스냅샷 일치', () => {
  const { toJSON } = render(
    <Card title="제목" description="설명" />
  );

  expect(toJSON()).toMatchSnapshot();
});
```

### 스냅샷 업데이트

```bash
# 스냅샷 업데이트
jest --updateSnapshot

# 또는
jest -u
```

### 인라인 스냅샷

```typescript
it('버튼 텍스트 확인', () => {
  const { getByText } = render(<Button>클릭</Button>);

  expect(getByText('클릭')).toMatchInlineSnapshot(`
    <Text>
      클릭
    </Text>
  `);
});
```

---

## Mock과 Spy

### 함수 Mock

```typescript
const mockOnPress = jest.fn();

it('버튼 클릭 시 mock 함수 호출', () => {
  const { getByText } = render(
    <Button onPress={mockOnPress}>클릭</Button>
  );

  fireEvent.press(getByText('클릭'));

  expect(mockOnPress).toHaveBeenCalled();
  expect(mockOnPress).toHaveBeenCalledTimes(1);
});
```

### 모듈 Mock

```typescript
// __mocks__/AsyncStorage.js
export default {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Test file
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

it('데이터를 AsyncStorage에 저장', async () => {
  AsyncStorage.setItem.mockResolvedValue(null);

  await saveData('key', 'value');

  expect(AsyncStorage.setItem).toHaveBeenCalledWith('key', 'value');
});
```

### Navigation Mock

```typescript
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
};

it('버튼 클릭 시 네비게이션', () => {
  const { getByText } = render(
    <Screen navigation={mockNavigation} />
  );

  fireEvent.press(getByText('다음'));

  expect(mockNavigation.navigate).toHaveBeenCalledWith('NextScreen');
});
```

---

## 폼 테스팅

### TextInput 테스팅

```typescript
import { render, fireEvent } from '@testing-library/react-native';

it('텍스트 입력 시 상태 업데이트', () => {
  const { getByTestId, getByText } = render(<LoginForm />);

  const emailInput = getByTestId('email-input');
  const passwordInput = getByTestId('password-input');

  fireEvent.changeText(emailInput, 'test@example.com');
  fireEvent.changeText(passwordInput, 'password123');

  expect(emailInput.props.value).toBe('test@example.com');
  expect(passwordInput.props.value).toBe('password123');
});
```

### 폼 제출 테스팅

```typescript
it('폼 제출 시 올바른 데이터 전송', async () => {
  const mockSubmit = jest.fn();
  const { getByTestId, getByText } = render(
    <LoginForm onSubmit={mockSubmit} />
  );

  fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
  fireEvent.changeText(getByTestId('password-input'), 'password123');

  fireEvent.press(getByText('로그인'));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

### 유효성 검사 테스팅

```typescript
it('빈 이메일 시 에러 메시지 표시', async () => {
  const { getByTestId, getByText, findByText } = render(<LoginForm />);

  const submitButton = getByText('로그인');
  fireEvent.press(submitButton);

  // 에러 메시지가 나타날 때까지 대기
  const errorMessage = await findByText('이메일을 입력해주세요');
  expect(errorMessage).toBeTruthy();
});
```

---

## 리스트 컴포넌트 테스팅

### FlatList 테스팅

```typescript
it('리스트 아이템 렌더링', () => {
  const items = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
  ];

  const { getByText } = render(<ItemList items={items} />);

  expect(getByText('Item 1')).toBeTruthy();
  expect(getByText('Item 2')).toBeTruthy();
  expect(getByText('Item 3')).toBeTruthy();
});

it('빈 리스트 처리', () => {
  const { getByText } = render(<ItemList items={[]} />);

  expect(getByText('항목이 없습니다')).toBeTruthy();
});
```

### 무한 스크롤 테스팅

```typescript
it('스크롤 시 추가 아이템 로드', async () => {
  const { getByTestId, findByText } = render(<InfiniteScrollList />);

  const flatList = getByTestId('item-list');

  // 스크롤 이벤트 시뮬레이션
  fireEvent.scroll(flatList, {
    nativeEvent: {
      contentOffset: { y: 1000 },
      contentSize: { height: 2000 },
      layoutMeasurement: { height: 500 },
    },
  });

  // 새 아이템이 로드될 때까지 대기
  const newItem = await findByText('Item 20');
  expect(newItem).toBeTruthy();
});
```

---

## 접근성 테스팅

### accessibilityRole 테스팅

```typescript
it('버튼에 올바른 접근성 role', () => {
  const { getByRole } = render(<Button>클릭</Button>);

  const button = getByRole('button');
  expect(button).toBeTruthy();
});
```

### accessibilityLabel 테스팅

```typescript
it('이미지 버튼에 접근성 레이블', () => {
  const { getByLabelText } = render(
    <IconButton accessibilityLabel="프로필 편집" />
  );

  const button = getByLabelText('프로필 편집');
  expect(button).toBeTruthy();
});
```

### accessibilityState 테스팅

```typescript
it('체크박스 상태 접근성', () => {
  const { getByRole } = render(
    <Checkbox checked={true} label="동의" />
  );

  const checkbox = getByRole('checkbox');
  expect(checkbox).toHaveAccessibilityState({ checked: true });
});
```

---

## E2E 테스팅 (Detox)

### Detox 설치

```bash
npm install --save-dev detox
```

### Detox 설정

```javascript
// .detoxrc.js
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/YourApp.app',
      build: 'xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug'
    }
  }
};
```

### E2E 테스트 작성

```typescript
// e2e/login.e2e.ts
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('로그인 성공', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    await expect(element(by.text('Welcome'))).toBeVisible();
  });

  it('잘못된 비밀번호 시 에러', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('wrong');
    await element(by.id('login-button')).tap();

    await expect(element(by.text('Invalid password'))).toBeVisible();
  });
});
```

---

## 테스트 커버리지

### Jest Coverage 설정

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.test.{ts,tsx}",
      "!src/**/*.stories.{ts,tsx}"
    ],
    "coverageThresholds": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### 커버리지 확인

```bash
npm run test:coverage

# 결과 예시:
# File      | % Stmts | % Branch | % Funcs | % Lines
# Button.tsx|   100   |   100    |   100   |   100
# Card.tsx  |   95.5  |   88.9   |   100   |   95
```

---

## 모범 사례

### ✅ Do

1. **사용자 중심 테스트 작성**
   ```typescript
   // Good - 사용자 관점
   expect(getByText('로그인')).toBeTruthy();

   // Bad - 구현 세부사항
   expect(component.state.isLoggedIn).toBe(false);
   ```

2. **testID 사용**
   ```typescript
   <TextInput testID="email-input" />

   // Test
   const input = getByTestId('email-input');
   ```

3. **비동기 테스트에 waitFor 사용**
   ```typescript
   await waitFor(() => {
     expect(getByText('Loaded')).toBeTruthy();
   });
   ```

### ❌ Don't

1. **구현 세부사항에 의존하지 말기**
   ```typescript
   // Bad
   expect(component.instance().handleSubmit).toBeDefined();
   ```

2. **너무 많은 스냅샷 테스트**
   ```typescript
   // Bad - 무분별한 스냅샷
   expect(toJSON()).toMatchSnapshot();
   ```

3. **테스트 간 의존성**
   ```typescript
   // Bad - 테스트가 순서에 의존
   it('test 1', () => { /* sets global state */ });
   it('test 2', () => { /* depends on test 1 */ });
   ```

---

## 참고 자료

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest](https://jestjs.io/)
- [Detox](https://wix.github.io/Detox/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
