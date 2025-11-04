# Camera (expo-camera) 상세 가이드

## 개요

expo-camera는 React Native에서 카메라 촬영, 바코드/QR 코드 스캔, 얼굴 인식 등의 기능을 제공하는 Expo SDK 모듈입니다.

## Context7 문서 조회

```bash
mcp__context7__get-library-docs "/expo/expo" topic: "Camera"
```

최신 API 변경사항과 플랫폼별 제약사항을 확인하려면 반드시 Context7로 문서를 조회하세요.

## 설치

```bash
npx expo install expo-camera
```

## 기본 사용법

### 1. 카메라 권한 요청

```typescript
import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';

const CameraScreen = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // 권한 정보 로딩 중
    return <View />;
  }

  if (!permission.granted) {
    // 권한 미승인 상태
    return (
      <View style={styles.container}>
        <Text>카메라 권한이 필요합니다</Text>
        <Button onPress={requestPermission} title="권한 요청" />
      </View>
    );
  }

  // 권한 승인됨 - 카메라 사용 가능
  return <CameraView />;
};
```

### 2. 카메라 컴포넌트 구현

```typescript
import { Camera, CameraType } from 'expo-camera';
import { useRef, useState } from 'react';

const CameraView = () => {
  const cameraRef = useRef<Camera>(null);
  const [type, setType] = useState(CameraType.back);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        });
        console.log('사진 URI:', photo.uri);
        // 사진 처리 로직
      } catch (error) {
        console.error('사진 촬영 실패:', error);
        alert('사진을 촬영할 수 없습니다.');
      }
    }
  };

  const toggleCameraType = () => {
    setType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <Button title="전환" onPress={toggleCameraType} />
          <Button title="촬영" onPress={takePicture} />
        </View>
      </Camera>
    </View>
  );
};
```

## 고급 기능

### 1. 바코드/QR 코드 스캔

```typescript
import { Camera, BarCodeScanner } from 'expo-camera';
import { useState } from 'react';

const BarcodeScanner = () => {
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log(`바코드 타입: ${type}`);
    console.log(`데이터: ${data}`);
    alert(`스캔 완료: ${data}`);

    // 2초 후 다시 스캔 가능하도록
    setTimeout(() => setScanned(false), 2000);
  };

  return (
    <Camera
      style={styles.camera}
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      barCodeScannerSettings={{
        barCodeTypes: [
          BarCodeScanner.Constants.BarCodeType.qr,
          BarCodeScanner.Constants.BarCodeType.ean13,
        ],
      }}
    />
  );
};
```

### 2. 얼굴 인식

```typescript
import { Camera, FaceDetector } from 'expo-camera';

const FaceDetection = () => {
  const handleFacesDetected = ({ faces }) => {
    console.log(`감지된 얼굴 수: ${faces.length}`);
    faces.forEach((face, index) => {
      console.log(`얼굴 ${index + 1}:`);
      console.log('  웃음 확률:', face.smilingProbability);
      console.log('  왼쪽 눈 열림:', face.leftEyeOpenProbability);
      console.log('  오른쪽 눈 열림:', face.rightEyeOpenProbability);
    });
  };

  return (
    <Camera
      style={styles.camera}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 100,
        tracking: true,
      }}
    />
  );
};
```

### 3. 비디오 녹화

```typescript
const VideoRecording = () => {
  const cameraRef = useRef<Camera>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({
          maxDuration: 60, // 최대 60초
          quality: Camera.Constants.VideoQuality['720p'],
        });
        console.log('비디오 URI:', video.uri);
      } catch (error) {
        console.error('녹화 실패:', error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera}>
        <View style={styles.buttonContainer}>
          {!isRecording ? (
            <Button title="녹화 시작" onPress={startRecording} />
          ) : (
            <Button title="녹화 중지" onPress={stopRecording} />
          )}
        </View>
      </Camera>
    </View>
  );
};
```

## 카메라 설정 옵션

### takePictureAsync 옵션

```typescript
const options = {
  quality: 0.8,              // 이미지 품질 (0-1)
  base64: false,             // base64 데이터 포함 여부
  exif: true,                // EXIF 메타데이터 포함 여부
  skipProcessing: false,     // 이미지 처리 건너뛰기
  onPictureSaved: (photo) => {
    console.log('사진 저장됨:', photo);
  },
};

const photo = await cameraRef.current.takePictureAsync(options);
```

### recordAsync 옵션

```typescript
const options = {
  maxDuration: 60,           // 최대 녹화 시간 (초)
  maxFileSize: 100 * 1024 * 1024, // 최대 파일 크기 (바이트)
  quality: Camera.Constants.VideoQuality['720p'],
  mute: false,               // 음소거 여부
};

const video = await cameraRef.current.recordAsync(options);
```

## 플랫폼별 차이점

### iOS

```typescript
// iOS에서는 카메라 사용 이유를 Info.plist에 명시해야 함
// app.json 설정:
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "프로필 사진 촬영에 카메라가 필요합니다.",
        "NSMicrophoneUsageDescription": "비디오 녹화에 마이크가 필요합니다."
      }
    }
  }
}
```

### Android

```typescript
// Android에서는 manifest에 권한 추가 필요
// app.json 설정:
{
  "expo": {
    "android": {
      "permissions": [
        "CAMERA",
        "RECORD_AUDIO"
      ]
    }
  }
}
```

## 에러 처리

### 일반적인 에러 케이스

```typescript
const takePicture = async () => {
  try {
    if (!cameraRef.current) {
      throw new Error('카메라가 준비되지 않았습니다.');
    }

    const photo = await cameraRef.current.takePictureAsync();
    return photo;
  } catch (error) {
    if (error.message.includes('permission')) {
      alert('카메라 권한이 필요합니다.');
    } else if (error.message.includes('Camera is not running')) {
      alert('카메라가 실행되지 않았습니다.');
    } else {
      console.error('카메라 에러:', error);
      alert('사진을 촬영할 수 없습니다.');
    }
    throw error;
  }
};
```

## 성능 최적화

### 1. 카메라 해제

```typescript
useEffect(() => {
  return () => {
    // 컴포넌트 언마운트 시 카메라 리소스 해제
    if (cameraRef.current) {
      cameraRef.current.pausePreview();
    }
  };
}, []);
```

### 2. 미리보기 일시정지/재개

```typescript
// 백그라운드로 갈 때
const pauseCamera = () => {
  cameraRef.current?.pausePreview();
};

// 다시 포그라운드로 올 때
const resumeCamera = () => {
  cameraRef.current?.resumePreview();
};

useEffect(() => {
  const subscription = AppState.addEventListener('change', state => {
    if (state === 'background') {
      pauseCamera();
    } else if (state === 'active') {
      resumeCamera();
    }
  });

  return () => subscription.remove();
}, []);
```

## 베스트 프랙티스

1. **권한 먼저 확인**: 카메라 사용 전 항상 권한을 확인하고 요청
2. **에러 처리 필수**: try-catch로 모든 카메라 작업을 감싸기
3. **리소스 관리**: 컴포넌트 언마운트 시 카메라 리소스 해제
4. **플랫폼 권한 설정**: app.json에 플랫폼별 권한 설정 추가
5. **품질 vs 성능**: 이미지 품질과 앱 성능 간 균형 맞추기

## 관련 모듈

- **expo-image-picker**: 갤러리에서 이미지 선택 또는 카메라 촬영 (간단한 사용 시)
- **expo-media-library**: 촬영한 사진/비디오를 갤러리에 저장
- **expo-file-system**: 촬영한 파일을 앱 내부 저장소에 저장
