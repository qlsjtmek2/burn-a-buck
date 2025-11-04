# Media Library (expo-media-library) 상세 가이드

## 개요

expo-media-library는 디바이스의 사진 및 비디오 갤러리에 접근하고, 미디어를 저장/삭제/관리할 수 있는 기능을 제공합니다.

## Context7 문서 조회

```bash
mcp__context7__get-library-docs "/expo/expo" topic: "MediaLibrary"
```

## 설치

```bash
npx expo install expo-media-library
```

## 권한 요청

```typescript
import * as MediaLibrary from 'expo-media-library';

const requestPermission = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status !== 'granted') {
    alert('갤러리 접근 권한이 필요합니다.');
    return false;
  }

  return true;
};

// 쓰기 권한 별도 요청 (Android)
const requestWritePermission = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync(true);

  if (status !== 'granted') {
    alert('갤러리 쓰기 권한이 필요합니다.');
    return false;
  }

  return true;
};
```

## 미디어 자산 조회

### 1. 전체 미디어 가져오기

```typescript
const getAllMedia = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status !== 'granted') {
    return;
  }

  const media = await MediaLibrary.getAssetsAsync({
    first: 20,              // 가져올 개수
    mediaType: ['photo', 'video'],  // 미디어 타입
    sortBy: MediaLibrary.SortBy.creationTime,  // 정렬 기준
  });

  console.log('총 미디어 개수:', media.totalCount);
  console.log('미디어 목록:', media.assets);

  return media;
};
```

### 2. 페이지네이션

```typescript
const MediaGallery = () => {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [endCursor, setEndCursor] = useState<string>();
  const [hasNextPage, setHasNextPage] = useState(true);

  const loadMoreAssets = async () => {
    if (!hasNextPage) return;

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') return;

    const result = await MediaLibrary.getAssetsAsync({
      first: 20,
      after: endCursor,
      mediaType: ['photo'],
      sortBy: MediaLibrary.SortBy.creationTime,
    });

    setAssets([...assets, ...result.assets]);
    setEndCursor(result.endCursor);
    setHasNextPage(result.hasNextPage);
  };

  return (
    <FlatList
      data={assets}
      renderItem={({ item }) => (
        <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      )}
      onEndReached={loadMoreAssets}
      onEndReachedThreshold={0.5}
    />
  );
};
```

### 3. 특정 앨범의 미디어 가져오기

```typescript
const getAlbumAssets = async (albumId: string) => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') return;

  const assets = await MediaLibrary.getAssetsAsync({
    first: 100,
    album: albumId,
    mediaType: ['photo'],
  });

  return assets.assets;
};
```

## 미디어 자산 정보

```typescript
const getAssetInfo = async (assetId: string) => {
  const assetInfo = await MediaLibrary.getAssetInfoAsync(assetId);

  console.log('URI:', assetInfo.uri);
  console.log('파일명:', assetInfo.filename);
  console.log('미디어 타입:', assetInfo.mediaType);  // 'photo', 'video', 'audio'
  console.log('너비:', assetInfo.width);
  console.log('높이:', assetInfo.height);
  console.log('생성 시간:', assetInfo.creationTime);
  console.log('수정 시간:', assetInfo.modificationTime);
  console.log('파일 크기:', assetInfo.filesize);
  console.log('위치:', assetInfo.location);  // { latitude, longitude }

  if (assetInfo.mediaType === 'video') {
    console.log('비디오 길이:', assetInfo.duration);
  }

  if (assetInfo.exif) {
    console.log('EXIF 데이터:', assetInfo.exif);
  }

  return assetInfo;
};
```

## 갤러리에 저장

### 1. 이미지 저장

```typescript
const saveImageToGallery = async (uri: string) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      alert('갤러리 접근 권한이 필요합니다.');
      return;
    }

    const asset = await MediaLibrary.createAssetAsync(uri);
    console.log('갤러리에 저장됨:', asset.id);

    alert('갤러리에 저장되었습니다.');
    return asset;
  } catch (error) {
    console.error('저장 실패:', error);
    alert('갤러리에 저장할 수 없습니다.');
  }
};
```

### 2. 앨범에 저장

```typescript
const saveToAlbum = async (uri: string, albumName: string) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') return;

    // 이미지를 자산으로 생성
    const asset = await MediaLibrary.createAssetAsync(uri);

    // 앨범 찾기 또는 생성
    const album = await MediaLibrary.getAlbumAsync(albumName);

    if (album == null) {
      // 앨범이 없으면 생성
      await MediaLibrary.createAlbumAsync(albumName, asset, false);
      console.log('앨범 생성 및 저장:', albumName);
    } else {
      // 앨범이 있으면 추가
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      console.log('앨범에 추가:', albumName);
    }

    alert(`${albumName} 앨범에 저장되었습니다.`);
  } catch (error) {
    console.error('앨범 저장 실패:', error);
    alert('앨범에 저장할 수 없습니다.');
  }
};

// 사용 예시
await saveToAlbum('file:///path/to/image.jpg', 'MyApp');
```

## 앨범 관리

### 1. 앨범 목록 가져오기

```typescript
const getAllAlbums = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') return;

  const albums = await MediaLibrary.getAlbumsAsync();

  console.log('앨범 목록:', albums);
  albums.forEach(album => {
    console.log(`앨범: ${album.title}, 개수: ${album.assetCount}`);
  });

  return albums;
};
```

### 2. 특정 앨범 가져오기

```typescript
const getAlbum = async (albumName: string) => {
  const album = await MediaLibrary.getAlbumAsync(albumName);

  if (album) {
    console.log('앨범 ID:', album.id);
    console.log('앨범 이름:', album.title);
    console.log('자산 개수:', album.assetCount);
  } else {
    console.log('앨범을 찾을 수 없습니다.');
  }

  return album;
};
```

### 3. 앨범 생성

```typescript
const createAlbum = async (albumName: string) => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') return;

  // 더미 이미지를 생성하여 앨범 생성
  // (앨범 생성 시 최소 1개의 자산 필요)
  const album = await MediaLibrary.createAlbumAsync(albumName);

  console.log('앨범 생성:', album.title);
  return album;
};
```

### 4. 앨범에서 자산 제거

```typescript
const removeFromAlbum = async (assetIds: string[], albumId: string) => {
  await MediaLibrary.removeAssetsFromAlbumAsync(assetIds, albumId);
  console.log('앨범에서 제거 완료');
};
```

### 5. 앨범 삭제

```typescript
const deleteAlbum = async (albumId: string) => {
  const result = await MediaLibrary.deleteAlbumsAsync([albumId], true);
  console.log('앨범 삭제:', result);
};
```

## 미디어 삭제

```typescript
const deleteAsset = async (assetId: string) => {
  try {
    const result = await MediaLibrary.deleteAssetsAsync([assetId]);

    if (result) {
      console.log('미디어 삭제 완료');
      alert('삭제되었습니다.');
    }
  } catch (error) {
    console.error('삭제 실패:', error);
    alert('삭제할 수 없습니다.');
  }
};

// 여러 개 삭제
const deleteMultipleAssets = async (assetIds: string[]) => {
  const result = await MediaLibrary.deleteAssetsAsync(assetIds);
  console.log(`${assetIds.length}개 삭제 완료`);
};
```

## 실전 예제

### 예제 1: 사진 갤러리 뷰어

```typescript
const PhotoGallery = () => {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        loadPhotos();
      }
    })();
  }, []);

  const loadPhotos = async () => {
    const result = await MediaLibrary.getAssetsAsync({
      first: 50,
      mediaType: ['photo'],
      sortBy: MediaLibrary.SortBy.creationTime,
    });

    setPhotos(result.assets);
  };

  if (!hasPermission) {
    return (
      <View>
        <Text>갤러리 접근 권한이 필요합니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      numColumns={3}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => viewPhoto(item)}>
          <Image source={{ uri: item.uri }} style={styles.thumbnail} />
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
    />
  );
};
```

### 예제 2: 카메라로 촬영 후 앨범에 저장

```typescript
import * as ImagePicker from 'expo-image-picker';

const CameraAndSave = () => {
  const takePhotoAndSave = async () => {
    // 카메라 권한 확인
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      alert('카메라 권한이 필요합니다.');
      return;
    }

    // 갤러리 권한 확인
    const mediaPermission = await MediaLibrary.requestPermissionsAsync();
    if (mediaPermission.status !== 'granted') {
      alert('갤러리 권한이 필요합니다.');
      return;
    }

    // 사진 촬영
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      // 갤러리에 저장
      const asset = await MediaLibrary.createAssetAsync(uri);

      // 특정 앨범에 추가
      const albumName = 'MyApp Photos';
      const album = await MediaLibrary.getAlbumAsync(albumName);

      if (album == null) {
        await MediaLibrary.createAlbumAsync(albumName, asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      alert('사진이 갤러리에 저장되었습니다.');
    }
  };

  return (
    <Button title="사진 촬영 및 저장" onPress={takePhotoAndSave} />
  );
};
```

### 예제 3: 사진 선택 및 삭제

```typescript
const PhotoSelector = () => {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('삭제할 사진을 선택해주세요.');
      return;
    }

    Alert.alert(
      '삭제 확인',
      `${selectedIds.length}개의 사진을 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            await MediaLibrary.deleteAssetsAsync(selectedIds);
            setPhotos(photos.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
            alert('삭제 완료');
          },
        },
      ]
    );
  };

  return (
    <View>
      <Button title="선택 삭제" onPress={deleteSelected} />
      <FlatList
        data={photos}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleSelect(item.id)}>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            {selectedIds.includes(item.id) && (
              <View style={styles.selectedOverlay}>
                <Text>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
```

## 플랫폼별 설정

### iOS (app.json)

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "프로필 사진 선택을 위해 갤러리 접근이 필요합니다.",
        "NSPhotoLibraryAddUsageDescription": "촬영한 사진을 저장하기 위해 갤러리 접근이 필요합니다."
      }
    }
  }
}
```

### Android (app.json)

```json
{
  "expo": {
    "android": {
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_MEDIA_LOCATION"
      ]
    }
  }
}
```

## 미디어 타입

```typescript
// 사진만
mediaType: ['photo']

// 비디오만
mediaType: ['video']

// 사진과 비디오 모두
mediaType: ['photo', 'video']

// 오디오 포함
mediaType: ['photo', 'video', 'audio']
```

## 정렬 옵션

```typescript
// 생성 시간 기준
sortBy: MediaLibrary.SortBy.creationTime

// 수정 시간 기준
sortBy: MediaLibrary.SortBy.modificationTime

// 미디어 타입 기준
sortBy: MediaLibrary.SortBy.mediaType

// 너비 기준
sortBy: MediaLibrary.SortBy.width

// 높이 기준
sortBy: MediaLibrary.SortBy.height

// 파일 크기 기준
sortBy: MediaLibrary.SortBy.duration
```

## 베스트 프랙티스

1. **권한 먼저 확인**: 갤러리 작업 전 항상 권한 확인
2. **페이지네이션**: 많은 미디어를 한 번에 로드하지 말고 페이지네이션 사용
3. **썸네일 사용**: 갤러리 뷰에서는 썸네일 크기 이미지 사용
4. **메모리 관리**: 대용량 이미지는 메모리 문제 발생 가능
5. **삭제 확인**: 미디어 삭제 전 사용자 확인 필수

## 주의사항

1. **iOS 권한**: 읽기와 쓰기 권한이 분리되어 있음
2. **Android Scoped Storage**: Android 10+ 에서는 Scoped Storage 적용
3. **위치 정보**: 미디어의 위치 정보는 별도 권한 필요 (Android)
4. **삭제 제한**: 다른 앱에서 생성한 미디어는 삭제 불가할 수 있음

## 관련 모듈

- **expo-image-picker**: 갤러리에서 이미지 선택
- **expo-camera**: 카메라로 촬영
- **expo-sharing**: 미디어 공유
