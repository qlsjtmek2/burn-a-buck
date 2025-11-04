# Image Picker (expo-image-picker) 상세 가이드

## 개요

expo-image-picker는 갤러리에서 이미지/비디오를 선택하거나 카메라로 직접 촬영할 수 있는 간단한 API를 제공합니다. expo-camera보다 간단하지만 커스터마이징이 제한적입니다.

## Context7 문서 조회

```bash
mcp__context7__get-library-docs "/expo/expo" topic: "ImagePicker"
```

## 설치

```bash
npx expo install expo-image-picker
```

## 기본 사용법

### 1. 갤러리에서 이미지 선택

```typescript
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

const ImageSelector = () => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('갤러리 접근 권한이 필요합니다.');
      return;
    }

    // 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <Button title="이미지 선택" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};
```

### 2. 카메라로 직접 촬영

```typescript
const takePhoto = async () => {
  // 카메라 권한 요청
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    alert('카메라 권한이 필요합니다.');
    return;
  }

  // 카메라 실행
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    console.log('촬영한 사진:', result.assets[0].uri);
    setImage(result.assets[0].uri);
  }
};
```

## 옵션 상세 설명

### MediaTypeOptions

```typescript
// 이미지만 선택 가능
mediaTypes: ImagePicker.MediaTypeOptions.Images

// 비디오만 선택 가능
mediaTypes: ImagePicker.MediaTypeOptions.Videos

// 이미지와 비디오 모두 선택 가능
mediaTypes: ImagePicker.MediaTypeOptions.All
```

### launchImageLibraryAsync 옵션

```typescript
const options = {
  // 미디어 타입 (Images, Videos, All)
  mediaTypes: ImagePicker.MediaTypeOptions.Images,

  // 편집 화면 표시 여부
  allowsEditing: true,

  // 편집 화면 aspect ratio (allowsEditing: true일 때만)
  aspect: [16, 9],

  // 이미지 품질 (0-1)
  quality: 0.8,

  // 여러 개 선택 가능 (iOS 14+ / Android)
  allowsMultipleSelection: true,

  // 선택 가능한 최대 개수 (allowsMultipleSelection: true일 때)
  selectionLimit: 5,

  // base64 데이터 포함 여부
  base64: false,

  // EXIF 메타데이터 포함 여부
  exif: false,
};

const result = await ImagePicker.launchImageLibraryAsync(options);
```

### launchCameraAsync 옵션

```typescript
const options = {
  // 미디어 타입
  mediaTypes: ImagePicker.MediaTypeOptions.Images,

  // 편집 화면 표시
  allowsEditing: true,

  // aspect ratio
  aspect: [1, 1],

  // 이미지 품질
  quality: 1,

  // 비디오 품질 (Videos 선택 시)
  videoQuality: ImagePicker.UIImagePickerControllerQualityType.High,

  // 최대 비디오 길이 (초)
  videoMaxDuration: 60,

  // base64 포함
  base64: false,

  // EXIF 포함
  exif: true,
};

const result = await ImagePicker.launchCameraAsync(options);
```

## 결과 처리

### 단일 선택 결과

```typescript
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
});

if (!result.canceled) {
  const asset = result.assets[0];
  console.log('URI:', asset.uri);
  console.log('너비:', asset.width);
  console.log('높이:', asset.height);
  console.log('타입:', asset.type); // 'image' or 'video'
  console.log('파일명:', asset.fileName);
  console.log('파일 크기:', asset.fileSize);

  if (asset.type === 'video') {
    console.log('비디오 길이:', asset.duration);
  }

  if (asset.exif) {
    console.log('EXIF:', asset.exif);
  }
}
```

### 다중 선택 결과

```typescript
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsMultipleSelection: true,
  selectionLimit: 5,
});

if (!result.canceled) {
  result.assets.forEach((asset, index) => {
    console.log(`이미지 ${index + 1}:`, asset.uri);
  });
}
```

## 실전 예제

### 예제 1: 프로필 사진 업데이트

```typescript
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

const ProfilePhoto = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const showImagePickerOptions = () => {
    Alert.alert(
      '프로필 사진 변경',
      '사진을 선택하는 방법을 선택해주세요.',
      [
        {
          text: '갤러리에서 선택',
          onPress: pickFromGallery,
        },
        {
          text: '카메라로 촬영',
          onPress: takePhoto,
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ]
    );
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadPhoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadPhoto(result.assets[0].uri);
    }
  };

  const uploadPhoto = async (uri: string) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('photo', {
        uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await fetch('https://api.example.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        setPhotoUri(uri);
        Alert.alert('성공', '프로필 사진이 업데이트되었습니다.');
      } else {
        throw new Error('업로드 실패');
      }
    } catch (error) {
      console.error('업로드 에러:', error);
      Alert.alert('오류', '사진 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholder}>
          <Text>사진 없음</Text>
        </View>
      )}
      <Button
        title={isUploading ? '업로드 중...' : '사진 변경'}
        onPress={showImagePickerOptions}
        disabled={isUploading}
      />
    </View>
  );
};
```

### 예제 2: 여러 이미지 업로드

```typescript
const MultipleImageUpload = () => {
  const [images, setImages] = useState<string[]>([]);

  const pickMultipleImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('갤러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View>
      <Button title="이미지 추가" onPress={pickMultipleImages} />
      <ScrollView horizontal>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.thumbnail} />
            <Button title="삭제" onPress={() => removeImage(index)} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
```

## 플랫폼별 차이점

### iOS

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "프로필 사진 선택을 위해 갤러리 접근이 필요합니다.",
        "NSCameraUsageDescription": "프로필 사진 촬영에 카메라가 필요합니다.",
        "NSPhotoLibraryAddUsageDescription": "촬영한 사진을 저장하기 위해 갤러리 접근이 필요합니다."
      }
    }
  }
}
```

### Android

```json
{
  "expo": {
    "android": {
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "CAMERA"
      ]
    }
  }
}
```

## 에러 처리

```typescript
const pickImageWithErrorHandling = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        '권한 필요',
        '갤러리 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
        [
          { text: '취소', style: 'cancel' },
          { text: '설정 열기', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      // 파일 크기 제한 (예: 5MB)
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        Alert.alert('오류', '파일 크기가 너무 큽니다. 5MB 이하의 이미지를 선택해주세요.');
        return;
      }

      // 이미지 처리
      setImage(asset.uri);
    }
  } catch (error) {
    console.error('이미지 선택 에러:', error);
    Alert.alert('오류', '이미지를 선택할 수 없습니다.');
  }
};
```

## 베스트 프랙티스

1. **권한 먼저 확인**: 이미지 선택/촬영 전 항상 권한 확인
2. **파일 크기 검증**: 업로드 전 파일 크기 제한 확인
3. **품질 조절**: 용도에 맞는 적절한 품질 설정 (프로필: 0.7-0.8, 원본: 1.0)
4. **에러 처리**: try-catch와 Alert로 사용자에게 명확한 피드백 제공
5. **로딩 상태**: 업로드 중 로딩 상태 표시로 UX 개선

## expo-camera vs expo-image-picker

| 기능 | expo-camera | expo-image-picker |
|------|-------------|-------------------|
| 커스텀 UI | ✅ 가능 | ❌ 시스템 UI만 |
| 실시간 미리보기 | ✅ 가능 | ❌ 불가 |
| 바코드 스캔 | ✅ 가능 | ❌ 불가 |
| 얼굴 인식 | ✅ 가능 | ❌ 불가 |
| 구현 난이도 | 중상 | 하 |
| 사용 권장 | 고급 카메라 기능 | 간단한 이미지 선택/촬영 |

## 관련 모듈

- **expo-media-library**: 선택한 이미지를 갤러리에 저장
- **expo-file-system**: 이미지를 앱 내부 저장소에 저장/관리
- **expo-camera**: 더 많은 커스터마이징이 필요한 경우
