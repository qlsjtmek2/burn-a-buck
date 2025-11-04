# File System (expo-file-system) 상세 가이드

## 개요

expo-file-system은 파일 읽기/쓰기, 디렉토리 관리, 파일 다운로드/업로드 등 파일 시스템 작업을 제공합니다.

## Context7 문서 조회

```bash
mcp__context7__get-library-docs "/expo/expo" topic: "FileSystem"
```

## 설치

```bash
npx expo install expo-file-system
```

## 기본 경로

```typescript
import * as FileSystem from 'expo-file-system';

// 앱 전용 문서 디렉토리 (백업됨, 사용자에게 보이지 않음)
const documentDirectory = FileSystem.documentDirectory;
// 예: file:///data/user/0/com.example.app/files/

// 캐시 디렉토리 (시스템이 자동으로 정리 가능)
const cacheDirectory = FileSystem.cacheDirectory;
// 예: file:///data/user/0/com.example.app/cache/

console.log('문서 디렉토리:', documentDirectory);
console.log('캐시 디렉토리:', cacheDirectory);
```

## 파일 읽기/쓰기

### 1. 텍스트 파일 쓰기

```typescript
const writeTextFile = async (filename: string, content: string) => {
  try {
    const fileUri = FileSystem.documentDirectory + filename;

    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log('파일 저장 완료:', fileUri);
    return fileUri;
  } catch (error) {
    console.error('파일 쓰기 실패:', error);
    throw error;
  }
};

// 사용 예시
await writeTextFile('notes.txt', '메모 내용입니다.');
```

### 2. 텍스트 파일 읽기

```typescript
const readTextFile = async (filename: string) => {
  try {
    const fileUri = FileSystem.documentDirectory + filename;

    const content = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log('파일 내용:', content);
    return content;
  } catch (error) {
    console.error('파일 읽기 실패:', error);
    throw error;
  }
};

// 사용 예시
const content = await readTextFile('notes.txt');
```

### 3. Base64로 읽기/쓰기

```typescript
// Base64로 쓰기
const writeBase64File = async (filename: string, base64Data: string) => {
  const fileUri = FileSystem.documentDirectory + filename;

  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });
};

// Base64로 읽기
const readBase64File = async (filename: string) => {
  const fileUri = FileSystem.documentDirectory + filename;

  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return base64;
};
```

## 파일 정보 조회

```typescript
const getFileInfo = async (fileUri: string) => {
  try {
    const info = await FileSystem.getInfoAsync(fileUri, {
      size: true,
      md5: true,
    });

    console.log('파일 존재:', info.exists);

    if (info.exists) {
      console.log('파일 크기:', info.size, 'bytes');
      console.log('수정 시간:', info.modificationTime);
      console.log('디렉토리 여부:', info.isDirectory);
      console.log('MD5 해시:', info.md5);
    }

    return info;
  } catch (error) {
    console.error('파일 정보 조회 실패:', error);
    throw error;
  }
};
```

## 디렉토리 관리

### 1. 디렉토리 생성

```typescript
const createDirectory = async (dirname: string) => {
  try {
    const dirUri = FileSystem.documentDirectory + dirname;

    await FileSystem.makeDirectoryAsync(dirUri, {
      intermediates: true,  // 중간 디렉토리도 생성
    });

    console.log('디렉토리 생성:', dirUri);
    return dirUri;
  } catch (error) {
    console.error('디렉토리 생성 실패:', error);
    throw error;
  }
};

// 사용 예시
await createDirectory('images/thumbnails/');
```

### 2. 디렉토리 내용 읽기

```typescript
const readDirectory = async (dirUri: string) => {
  try {
    const files = await FileSystem.readDirectoryAsync(dirUri);

    console.log('파일 목록:', files);
    return files;
  } catch (error) {
    console.error('디렉토리 읽기 실패:', error);
    throw error;
  }
};

// 사용 예시
const files = await readDirectory(FileSystem.documentDirectory!);
```

## 파일/디렉토리 삭제

```typescript
const deleteFile = async (fileUri: string) => {
  try {
    await FileSystem.deleteAsync(fileUri, {
      idempotent: true,  // 파일이 없어도 에러 발생 안함
    });

    console.log('파일 삭제 완료:', fileUri);
  } catch (error) {
    console.error('파일 삭제 실패:', error);
    throw error;
  }
};

// 디렉토리 전체 삭제
const deleteDirectory = async (dirUri: string) => {
  await FileSystem.deleteAsync(dirUri, {
    idempotent: true,
  });
};
```

## 파일 이동/복사

### 1. 파일 이동

```typescript
const moveFile = async (fromUri: string, toUri: string) => {
  try {
    await FileSystem.moveAsync({
      from: fromUri,
      to: toUri,
    });

    console.log('파일 이동 완료');
  } catch (error) {
    console.error('파일 이동 실패:', error);
    throw error;
  }
};
```

### 2. 파일 복사

```typescript
const copyFile = async (fromUri: string, toUri: string) => {
  try {
    await FileSystem.copyAsync({
      from: fromUri,
      to: toUri,
    });

    console.log('파일 복사 완료');
  } catch (error) {
    console.error('파일 복사 실패:', error);
    throw error;
  }
};
```

## 파일 다운로드

### 1. 기본 다운로드

```typescript
const downloadFile = async (url: string, filename: string) => {
  try {
    const fileUri = FileSystem.documentDirectory + filename;

    const { uri } = await FileSystem.downloadAsync(url, fileUri);

    console.log('다운로드 완료:', uri);
    return uri;
  } catch (error) {
    console.error('다운로드 실패:', error);
    throw error;
  }
};

// 사용 예시
const uri = await downloadFile(
  'https://example.com/image.jpg',
  'downloaded-image.jpg'
);
```

### 2. 진행상황 추적 다운로드

```typescript
const downloadWithProgress = async (url: string, filename: string) => {
  const fileUri = FileSystem.documentDirectory + filename;

  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    fileUri,
    {},
    (downloadProgress) => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      console.log(`다운로드 진행: ${(progress * 100).toFixed(0)}%`);
    }
  );

  try {
    const result = await downloadResumable.downloadAsync();
    console.log('다운로드 완료:', result?.uri);
    return result?.uri;
  } catch (error) {
    console.error('다운로드 실패:', error);
    throw error;
  }
};
```

### 3. 다운로드 일시정지/재개

```typescript
const DownloadWithPauseResume = () => {
  const [downloadResumable, setDownloadResumable] = useState<FileSystem.DownloadResumable | null>(null);
  const [progress, setProgress] = useState(0);

  const startDownload = async () => {
    const url = 'https://example.com/large-file.zip';
    const fileUri = FileSystem.documentDirectory + 'large-file.zip';

    const resumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      (downloadProgress) => {
        const prog = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setProgress(prog);
      }
    );

    setDownloadResumable(resumable);

    try {
      const result = await resumable.downloadAsync();
      console.log('다운로드 완료:', result?.uri);
    } catch (error) {
      console.error('다운로드 에러:', error);
    }
  };

  const pauseDownload = async () => {
    if (downloadResumable) {
      await downloadResumable.pauseAsync();
      console.log('다운로드 일시정지');
    }
  };

  const resumeDownload = async () => {
    if (downloadResumable) {
      try {
        const result = await downloadResumable.resumeAsync();
        console.log('다운로드 재개/완료:', result?.uri);
      } catch (error) {
        console.error('다운로드 재개 실패:', error);
      }
    }
  };

  return (
    <View>
      <Text>진행: {(progress * 100).toFixed(0)}%</Text>
      <Button title="다운로드 시작" onPress={startDownload} />
      <Button title="일시정지" onPress={pauseDownload} />
      <Button title="재개" onPress={resumeDownload} />
    </View>
  );
};
```

## 파일 업로드

```typescript
const uploadFile = async (fileUri: string) => {
  try {
    const uploadResult = await FileSystem.uploadAsync(
      'https://api.example.com/upload',
      fileUri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN',
        },
        parameters: {
          userId: 'user123',
        },
      }
    );

    console.log('업로드 완료:', uploadResult.status);
    console.log('응답:', uploadResult.body);

    return uploadResult;
  } catch (error) {
    console.error('업로드 실패:', error);
    throw error;
  }
};
```

## 실전 예제

### 예제 1: 이미지 캐시 관리

```typescript
class ImageCache {
  private cacheDir: string;

  constructor() {
    this.cacheDir = FileSystem.cacheDirectory + 'images/';
    this.initCache();
  }

  private async initCache() {
    const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.cacheDir, {
        intermediates: true,
      });
    }
  }

  async getCachedImage(url: string): Promise<string | null> {
    const filename = this.urlToFilename(url);
    const fileUri = this.cacheDir + filename;

    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (fileInfo.exists) {
      console.log('캐시에서 이미지 로드:', fileUri);
      return fileUri;
    }

    // 캐시에 없으면 다운로드
    return await this.downloadAndCache(url);
  }

  private async downloadAndCache(url: string): Promise<string> {
    const filename = this.urlToFilename(url);
    const fileUri = this.cacheDir + filename;

    console.log('이미지 다운로드 시작:', url);

    const { uri } = await FileSystem.downloadAsync(url, fileUri);
    console.log('캐시에 저장:', uri);

    return uri;
  }

  private urlToFilename(url: string): string {
    // URL을 파일명으로 변환 (MD5 해시 사용 권장)
    return url.split('/').pop() || 'cached-image.jpg';
  }

  async clearCache() {
    await FileSystem.deleteAsync(this.cacheDir, { idempotent: true });
    await this.initCache();
    console.log('캐시 삭제 완료');
  }

  async getCacheSize(): Promise<number> {
    const files = await FileSystem.readDirectoryAsync(this.cacheDir);
    let totalSize = 0;

    for (const file of files) {
      const fileUri = this.cacheDir + file;
      const info = await FileSystem.getInfoAsync(fileUri, { size: true });

      if (info.exists && !info.isDirectory) {
        totalSize += info.size || 0;
      }
    }

    return totalSize;
  }
}

// 사용 예시
const imageCache = new ImageCache();
const cachedUri = await imageCache.getCachedImage('https://example.com/image.jpg');
```

### 예제 2: 오프라인 데이터 저장

```typescript
class OfflineStorage {
  private dataDir: string;

  constructor() {
    this.dataDir = FileSystem.documentDirectory + 'data/';
    this.initStorage();
  }

  private async initStorage() {
    const dirInfo = await FileSystem.getInfoAsync(this.dataDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.dataDir, {
        intermediates: true,
      });
    }
  }

  async saveData<T>(key: string, data: T): Promise<void> {
    const fileUri = this.dataDir + key + '.json';
    const jsonData = JSON.stringify(data);

    await FileSystem.writeAsStringAsync(fileUri, jsonData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log('데이터 저장:', key);
  }

  async loadData<T>(key: string): Promise<T | null> {
    const fileUri = this.dataDir + key + '.json';
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      return null;
    }

    const jsonData = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return JSON.parse(jsonData) as T;
  }

  async deleteData(key: string): Promise<void> {
    const fileUri = this.dataDir + key + '.json';

    await FileSystem.deleteAsync(fileUri, { idempotent: true });
    console.log('데이터 삭제:', key);
  }

  async getAllKeys(): Promise<string[]> {
    const files = await FileSystem.readDirectoryAsync(this.dataDir);
    return files.map(file => file.replace('.json', ''));
  }
}

// 사용 예시
const storage = new OfflineStorage();

interface User {
  id: string;
  name: string;
  email: string;
}

await storage.saveData<User>('user', {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
});

const user = await storage.loadData<User>('user');
```

### 예제 3: 파일 압축 및 공유

```typescript
import * as Sharing from 'expo-sharing';

const exportData = async () => {
  try {
    // 데이터 준비
    const data = {
      users: [...],
      settings: {...},
    };

    // 파일 생성
    const filename = `export-${Date.now()}.json`;
    const fileUri = FileSystem.cacheDirectory + filename;

    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2));

    // 공유 가능 여부 확인
    const canShare = await Sharing.isAvailableAsync();

    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: '데이터 내보내기',
      });
    } else {
      alert('공유 기능을 사용할 수 없습니다.');
    }
  } catch (error) {
    console.error('내보내기 실패:', error);
    alert('데이터 내보내기에 실패했습니다.');
  }
};
```

## 플랫폼별 차이점

### iOS

```typescript
// iOS에서는 사용자에게 보이는 파일 접근 시 권한 필요
// Info.plist 설정:
{
  "ios": {
    "infoPlist": {
      "UIFileSharingEnabled": true,
      "LSSupportsOpeningDocumentsInPlace": true
    }
  }
}
```

### Android

```typescript
// Android 10+ (API 29)부터는 Scoped Storage 적용
// app.json 설정:
{
  "android": {
    "permissions": [
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  }
}
```

## 베스트 프랙티스

1. **적절한 디렉토리 사용**:
   - 영구 데이터 → `documentDirectory`
   - 임시 데이터 → `cacheDirectory`

2. **에러 처리**: 모든 파일 작업은 try-catch로 감싸기

3. **파일 존재 확인**: 읽기/삭제 전 `getInfoAsync`로 존재 확인

4. **캐시 관리**: 주기적으로 캐시 크기 확인 및 정리

5. **비동기 처리**: 파일 작업은 모두 비동기이므로 await 사용

## 주의사항

1. **파일 URI**: 반드시 `file://` 형식의 절대 경로 사용
2. **권한**: 외부 저장소 접근 시 권한 필요 (Android)
3. **캐시 자동 삭제**: `cacheDirectory`의 파일은 시스템이 자동으로 삭제할 수 있음
4. **대용량 파일**: 매우 큰 파일은 메모리 문제 발생 가능

## 관련 모듈

- **expo-sharing**: 파일 공유
- **expo-document-picker**: 문서 선택
- **expo-media-library**: 갤러리 접근
