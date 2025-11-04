# Supabase Storage

Supabase Storage를 사용한 파일 업로드/다운로드 가이드입니다.

## 📚 Table of Contents

- [버킷 생성](#버킷-생성)
- [파일 업로드](#파일-업로드)
- [파일 다운로드](#파일-다운로드)
- [파일 삭제](#파일-삭제)
- [Public URL 가져오기](#public-url-가져오기)
- [Signed URL (임시 URL)](#signed-url-임시-url)

---

## 버킷 생성

Supabase Dashboard에서 버킷을 먼저 생성해야 합니다.

**버킷 유형:**
- **Public** - 누구나 파일 접근 가능
- **Private** - RLS 정책에 따라 접근 제어

---

## 파일 업로드

### 이미지 업로드 (Image Picker)

```typescript
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './lib/supabase';

const uploadImage = async (userId: string) => {
  // 1. 이미지 선택
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  const imageUri = result.assets[0].uri;

  // 2. 파일 읽기
  const response = await fetch(imageUri);
  const blob = await response.blob();

  // 3. Supabase Storage에 업로드
  const fileName = `${userId}/${Date.now()}.jpg`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, blob, {
      contentType: 'image/jpeg',
      upsert: false, // 기존 파일 덮어쓰기 방지
    });

  if (error) {
    console.error('업로드 실패:', error.message);
    throw error;
  }

  // 4. Public URL 가져오기
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  console.log('업로드 완료:', urlData.publicUrl);
  return urlData.publicUrl;
};
```

### 카메라로 촬영 후 업로드

```typescript
const uploadCameraPhoto = async (userId: string) => {
  // 카메라 권한 요청
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('카메라 권한이 필요합니다.');
  }

  // 카메라 실행
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  const imageUri = result.assets[0].uri;

  // 업로드 (위와 동일)
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const fileName = `${userId}/camera-${Date.now()}.jpg`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, blob, {
      contentType: 'image/jpeg',
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};
```

### 파일 업로드 (일반)

```typescript
const uploadFile = async (fileUri: string, bucketName: string, filePath: string) => {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, blob, {
      upsert: true, // 기존 파일 덮어쓰기
    });

  if (error) {
    console.error('업로드 실패:', error.message);
    throw error;
  }

  return data;
};
```

---

## 파일 다운로드

```typescript
const downloadImage = async (path: string) => {
  const { data, error } = await supabase.storage
    .from('avatars')
    .download(path);

  if (error) {
    console.error('다운로드 실패:', error.message);
    throw error;
  }

  // Blob을 URI로 변환
  const fr = new FileReader();
  fr.readAsDataURL(data);

  return new Promise<string>((resolve, reject) => {
    fr.onload = () => {
      const imageUri = fr.result as string;
      resolve(imageUri);
    };
    fr.onerror = () => reject(new Error('파일 읽기 실패'));
  });
};

// 사용 예시
const imageUri = await downloadImage('user-id/123456.jpg');
console.log('다운로드 완료:', imageUri);
```

---

## 파일 삭제

```typescript
const deleteImage = async (path: string) => {
  const { error } = await supabase.storage
    .from('avatars')
    .remove([path]);

  if (error) {
    console.error('삭제 실패:', error.message);
    throw error;
  }

  console.log('삭제 완료');
};

// 여러 파일 삭제
const deleteMultipleImages = async (paths: string[]) => {
  const { error } = await supabase.storage
    .from('avatars')
    .remove(paths);

  if (error) throw error;
  console.log('삭제 완료:', paths.length, '개');
};
```

---

## Public URL 가져오기

### Public 버킷 (누구나 접근 가능)

```typescript
const getPublicUrl = (path: string) => {
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(path);

  return data.publicUrl;
};

// 사용 예시
const avatarUrl = getPublicUrl('user-id/avatar.jpg');
console.log('Public URL:', avatarUrl);

// Image 컴포넌트에서 사용
<Image source={{ uri: avatarUrl }} style={styles.avatar} />
```

---

## Signed URL (임시 URL)

Private 버킷의 경우 임시 URL을 생성해야 합니다.

```typescript
const getSignedUrl = async (path: string, expiresIn: number = 3600) => {
  const { data, error } = await supabase.storage
    .from('private-files')
    .createSignedUrl(path, expiresIn); // expiresIn: 초 단위 (기본 1시간)

  if (error) {
    console.error('Signed URL 생성 실패:', error.message);
    throw error;
  }

  return data.signedUrl;
};

// 사용 예시 (1시간 유효한 URL)
const signedUrl = await getSignedUrl('user-id/private-doc.pdf', 3600);
console.log('Signed URL:', signedUrl);

// 24시간 유효한 URL
const longSignedUrl = await getSignedUrl('user-id/photo.jpg', 86400);
```

---

## 파일 목록 조회

```typescript
const listFiles = async (folder: string) => {
  const { data, error } = await supabase.storage
    .from('avatars')
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error('파일 목록 조회 실패:', error.message);
    throw error;
  }

  return data;
};

// 사용 예시
const files = await listFiles('user-id');
console.log('파일 목록:', files);
```

---

## 업로드 진행률 표시

```typescript
import { useState } from 'react';

const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const upload = async (fileUri: string, path: string) => {
    setUploading(true);
    setProgress(0);

    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Supabase는 아직 진행률 콜백을 지원하지 않음
      // 대신 파일 크기에 따라 예상 진행률 표시
      const fileSize = blob.size;
      let uploadedSize = 0;

      const { data, error } = await supabase.storage
        .from('files')
        .upload(path, blob);

      if (error) throw error;

      setProgress(100);
      return data;
    } finally {
      setUploading(false);
    }
  };

  return { upload, progress, uploading };
};

// 사용 예시
const UploadScreen = () => {
  const { upload, progress, uploading } = useFileUpload();

  const handleUpload = async (uri: string) => {
    const fileName = `uploads/${Date.now()}.jpg`;
    await upload(uri, fileName);
  };

  return (
    <View>
      {uploading && (
        <ProgressBar progress={progress / 100} />
      )}
      <Button title="업로드" onPress={handleUpload} disabled={uploading} />
    </View>
  );
};
```

---

## 베스트 프랙티스

### ✅ 파일 이름 규칙

```typescript
// Good - 사용자별 폴더 + 타임스탬프
const fileName = `${userId}/${Date.now()}.jpg`;

// Good - UUID 사용
import { v4 as uuidv4 } from 'uuid';
const fileName = `${userId}/${uuidv4()}.jpg`;

// Bad - 중복 가능성 있음
const fileName = 'avatar.jpg';
```

### ✅ 파일 크기 제한

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const uploadImageWithSizeCheck = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  if (blob.size > MAX_FILE_SIZE) {
    throw new Error('파일 크기는 5MB를 초과할 수 없습니다.');
  }

  // 업로드 진행
};
```

### ✅ 이미지 압축

```typescript
import * as ImageManipulator from 'expo-image-manipulator';

const compressAndUpload = async (uri: string) => {
  // 이미지 압축
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1024 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );

  // 압축된 이미지 업로드
  const response = await fetch(manipResult.uri);
  const blob = await response.blob();

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`${userId}/${Date.now()}.jpg`, blob);

  if (error) throw error;
  return data;
};
```

### ✅ 에러 처리

```typescript
const safeUpload = async (uri: string, path: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from('files')
      .upload(path, blob);

    if (error) {
      // Supabase Storage 에러 처리
      if (error.message.includes('Duplicate')) {
        throw new Error('이미 존재하는 파일입니다.');
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('업로드 에러:', error);
    throw error;
  }
};
```

---

## 참고 자료

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- Context7 MCP로 최신 문서 조회:
  ```bash
  mcp__context7__get-library-docs "/supabase/supabase" --topic="storage"
  ```
