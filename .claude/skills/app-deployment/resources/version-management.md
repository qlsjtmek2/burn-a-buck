# 버전 관리 가이드

React Native 앱의 버전 번호를 효과적으로 관리하는 가이드입니다.

## Semantic Versioning

**Semantic Versioning (SemVer):**
- 소프트웨어 버전 번호를 체계적으로 관리하는 표준
- 형식: `MAJOR.MINOR.PATCH`

```
1.2.3
│ │ │
│ │ └─ PATCH: 버그 수정 (하위 호환)
│ └─── MINOR: 새 기능 추가 (하위 호환)
└───── MAJOR: Breaking changes (하위 비호환)
```

### 버전 증가 규칙

#### MAJOR (주 버전)
**언제 증가:**
- API 변경으로 하위 버전과 호환되지 않음
- 대규모 리팩토링
- 완전히 새로운 기능으로 재설계

**예시:**
- `1.9.5` → `2.0.0`
- 사용자 인터페이스 완전 개편
- 데이터 구조 변경으로 기존 데이터 마이그레이션 필요

#### MINOR (부 버전)
**언제 증가:**
- 새 기능 추가 (하위 호환)
- 기존 기능 개선
- Deprecated 마킹 (다음 메이저 버전에서 제거 예정)

**예시:**
- `1.2.5` → `1.3.0`
- 새로운 필터 기능 추가
- 다크 모드 지원

#### PATCH (수 버전)
**언제 증가:**
- 버그 수정
- 성능 개선
- 문서 업데이트
- 내부 리팩토링 (기능 변경 없음)

**예시:**
- `1.2.3` → `1.2.4`
- 로그인 버그 수정
- 앱 크래시 수정

### 특수 버전

#### 0.x.y (초기 개발)
- 아직 안정 버전이 아님
- 빠르게 변경 가능
- `0.x.y` → `1.0.0` (첫 안정 버전)

#### 1.0.0 (첫 안정 버전)
- 프로덕션에 사용 가능한 첫 버전
- Public API가 안정됨

## app.json 버전 설정

### iOS 버전

```json
{
  "expo": {
    "version": "1.2.3",
    "ios": {
      "buildNumber": "12"
    }
  }
}
```

**필드 설명:**
- `version` - 사용자에게 보이는 버전 (Marketing Version)
  - 형식: `MAJOR.MINOR.PATCH`
  - App Store에 표시
- `buildNumber` - 빌드 번호 (Build Version)
  - 형식: 정수 또는 문자열
  - TestFlight 제출마다 증가해야 함
  - 같은 버전에서도 빌드 번호는 달라야 함

**예시:**
| Version | Build Number | 설명 |
|---------|--------------|------|
| 1.0.0 | 1 | 첫 제출 |
| 1.0.0 | 2 | 버그 수정 (같은 버전, TestFlight 재제출) |
| 1.0.1 | 3 | 버그 수정 버전 (새 버전, 빌드 번호 증가) |
| 1.1.0 | 4 | 새 기능 추가 |

### Android 버전

```json
{
  "expo": {
    "version": "1.2.3",
    "android": {
      "versionCode": 12
    }
  }
}
```

**필드 설명:**
- `version` - 사용자에게 보이는 버전 (Version Name)
  - 형식: `MAJOR.MINOR.PATCH`
  - Google Play에 표시
- `versionCode` - 버전 코드 (Version Code)
  - 형식: 정수
  - Google Play 제출마다 증가해야 함
  - 내부적으로 버전 비교에 사용

**예시:**
| Version | Version Code | 설명 |
|---------|--------------|------|
| 1.0.0 | 1 | 첫 제출 |
| 1.0.1 | 2 | 버그 수정 |
| 1.1.0 | 3 | 새 기능 |
| 2.0.0 | 4 | 대규모 업데이트 |

### 버전 증가 예시

**시나리오 1: 버그 수정**
```json
// Before
{
  "version": "1.0.0",
  "ios": { "buildNumber": "1" },
  "android": { "versionCode": 1 }
}

// After
{
  "version": "1.0.1",
  "ios": { "buildNumber": "2" },
  "android": { "versionCode": 2 }
}
```

**시나리오 2: 새 기능 추가**
```json
// Before
{
  "version": "1.0.1",
  "ios": { "buildNumber": "2" },
  "android": { "versionCode": 2 }
}

// After
{
  "version": "1.1.0",
  "ios": { "buildNumber": "3" },
  "android": { "versionCode": 3 }
}
```

**시나리오 3: Breaking Changes**
```json
// Before
{
  "version": "1.9.5",
  "ios": { "buildNumber": "20" },
  "android": { "versionCode": 20 }
}

// After
{
  "version": "2.0.0",
  "ios": { "buildNumber": "21" },
  "android": { "versionCode": 21 }
}
```

## 자동 버전 증가 (EAS)

### autoIncrement 설정

```json
// eas.json
{
  "build": {
    "production": {
      "autoIncrement": true
    },
    "preview": {
      "autoIncrement": "version"
    }
  }
}
```

**옵션:**
- `true` - buildNumber/versionCode 자동 증가
- `"version"` - version (Marketing Version/Version Name) 자동 증가
- `false` - 자동 증가 비활성화 (기본값)

### iOS buildNumber 자동 증가

```json
{
  "build": {
    "production": {
      "autoIncrement": true,
      "ios": {
        "buildNumber": "auto"
      }
    }
  }
}
```

**동작:**
- EAS가 App Store Connect에서 마지막 buildNumber 확인
- 자동으로 +1 증가

### Android versionCode 자동 증가

```json
{
  "build": {
    "production": {
      "autoIncrement": true,
      "android": {
        "versionCode": "auto"
      }
    }
  }
}
```

**동작:**
- EAS가 Google Play Console에서 마지막 versionCode 확인
- 자동으로 +1 증가

### 플랫폼별 개별 설정

```json
{
  "build": {
    "production": {
      "ios": {
        "autoIncrement": true
      },
      "android": {
        "autoIncrement": false
      }
    }
  }
}
```

## 버전 스크립트

### package.json 스크립트

```json
{
  "scripts": {
    "version:patch": "node scripts/bump-version.js patch",
    "version:minor": "node scripts/bump-version.js minor",
    "version:major": "node scripts/bump-version.js major"
  }
}
```

### 버전 증가 스크립트

**scripts/bump-version.js:**
```javascript
const fs = require('fs');
const path = require('path');

const APP_JSON_PATH = path.resolve(__dirname, '../app.json');

const bumpVersion = (type) => {
  const appJson = JSON.parse(fs.readFileSync(APP_JSON_PATH, 'utf8'));
  const currentVersion = appJson.expo.version;
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  let newVersion;
  switch (type) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
    default:
      throw new Error('Invalid version type');
  }

  // 버전 업데이트
  appJson.expo.version = newVersion;

  // buildNumber/versionCode 증가
  if (appJson.expo.ios) {
    const currentBuildNumber = parseInt(appJson.expo.ios.buildNumber, 10);
    appJson.expo.ios.buildNumber = (currentBuildNumber + 1).toString();
  }

  if (appJson.expo.android) {
    appJson.expo.android.versionCode += 1;
  }

  // 파일 저장
  fs.writeFileSync(APP_JSON_PATH, JSON.stringify(appJson, null, 2), 'utf8');

  console.log(`✅ Version bumped: ${currentVersion} → ${newVersion}`);
  console.log(`iOS buildNumber: ${appJson.expo.ios?.buildNumber}`);
  console.log(`Android versionCode: ${appJson.expo.android?.versionCode}`);
};

const type = process.argv[2];
if (!['major', 'minor', 'patch'].includes(type)) {
  console.error('Usage: node bump-version.js <major|minor|patch>');
  process.exit(1);
}

bumpVersion(type);
```

**사용:**
```bash
# PATCH 버전 증가 (1.0.0 → 1.0.1)
npm run version:patch

# MINOR 버전 증가 (1.0.1 → 1.1.0)
npm run version:minor

# MAJOR 버전 증가 (1.1.0 → 2.0.0)
npm run version:major
```

## Git 태그로 버전 관리

### 버전 태그 생성

```bash
# 현재 버전을 Git 태그로 생성
git tag -a v1.0.0 -m "Release version 1.0.0"

# 태그를 원격 저장소에 푸시
git push origin v1.0.0

# 모든 태그 푸시
git push origin --tags
```

### 태그 목록 확인

```bash
# 모든 태그 확인
git tag

# 특정 패턴의 태그 확인
git tag -l "v1.*"
```

### 태그 삭제

```bash
# 로컬 태그 삭제
git tag -d v1.0.0

# 원격 태그 삭제
git push origin :refs/tags/v1.0.0
```

### 릴리스 워크플로우와 Git 태그

```bash
# 1. 버전 증가
npm run version:minor

# 2. 변경 사항 커밋
git add app.json
git commit -m "chore: bump version to 1.1.0"

# 3. Git 태그 생성
git tag -a v1.1.0 -m "Release version 1.1.0"

# 4. 푸시
git push origin main
git push origin v1.1.0

# 5. 빌드 및 제출
eas build --profile production --platform all
eas submit --platform all
```

## 버전 확인

### 앱 내에서 버전 확인

```typescript
import Constants from 'expo-constants';

const AppVersion = () => {
  const version = Constants.expoConfig?.version || 'Unknown';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || 'Unknown';

  return (
    <View>
      <Text>Version: {version}</Text>
      <Text>Build: {buildNumber}</Text>
    </View>
  );
};
```

### CLI로 버전 확인

```bash
# app.json에서 버전 확인
cat app.json | grep -A 5 '"version"'

# 또는 jq 사용
jq '.expo.version' app.json
jq '.expo.ios.buildNumber' app.json
jq '.expo.android.versionCode' app.json
```

## 주의사항

### ❌ 버전 감소 금지

**잘못된 예:**
```json
// Bad - 이전 버전보다 낮음
{
  "version": "1.0.0"  // 이전: 1.1.0
}
```

**App Store / Google Play 거절:**
- iOS: "This bundle is invalid. The bundle version must be higher than the previously uploaded version."
- Android: "Version code X has already been used."

### ✅ 항상 증가

```json
// Good
{
  "version": "1.1.1"  // 이전: 1.1.0
}
```

### buildNumber/versionCode 고유성

**iOS:**
- 같은 버전에서도 buildNumber는 고유해야 함
- TestFlight 제출마다 증가

**Android:**
- versionCode는 전역적으로 고유해야 함
- Google Play 제출마다 증가

### 롤백 시 버전

**앱을 이전 버전으로 롤백해야 하는 경우:**
1. 이전 버전 코드로 되돌림
2. 버전 번호는 **증가**
   - `1.1.0` (문제 발생) → `1.1.1` (롤백 + 수정)
3. 같은 버전 번호로 재제출 불가

## 참고 자료

### Semantic Versioning 공식 문서

- https://semver.org/

### Context7 MCP로 최신 문서 조회

```bash
# App Config (version 설정)
mcp__context7__resolve-library-id "expo"
mcp__context7__get-library-docs "/expo/expo" topic: "app.json version"

# EAS Build autoIncrement
mcp__context7__get-library-docs "/expo/expo" topic: "EAS Build autoIncrement"
```

### 공식 문서

- Expo App Config: https://docs.expo.dev/versions/latest/config/app/
- EAS Build Configuration: https://docs.expo.dev/build/eas-json/

---

**이 가이드는 React Native 앱의 버전 번호를 체계적으로 관리하는 방법을 다룹니다.**
