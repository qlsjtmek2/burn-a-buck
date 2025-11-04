# 실전 예제 모음

## 개요

이 문서는 네이티브 모듈을 활용한 실전 예제들을 제공합니다. 각 예제는 실제 앱에서 자주 사용되는 패턴을 기반으로 작성되었습니다.

## 예제 1: 프로필 사진 업데이트

카메라 촬영 또는 갤러리 선택을 통해 프로필 사진을 업데이트하는 완전한 예제입니다.

```typescript
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const ProfilePhotoUpdate = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const showImageOptions = () => {
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
    try {
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
    } catch (error) {
      console.error('갤러리 선택 에러:', error);
      Alert.alert('오류', '이미지를 선택할 수 없습니다.');
    }
  };

  const takePhoto = async () => {
    try {
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
    } catch (error) {
      console.error('카메라 촬영 에러:', error);
      Alert.alert('오류', '사진을 촬영할 수 없습니다.');
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

      const response = await fetch('https://api.example.com/upload-profile', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPhotoUri(data.photoUrl);
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
      <TouchableOpacity onPress={showImageOptions} disabled={isUploading}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text>사진 없음</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.hint}>
        {isUploading ? '업로드 중...' : '탭하여 사진 변경'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    marginTop: 10,
    color: '#666',
  },
});
```

## 예제 2: 주변 장소 찾기 (위치 기반)

사용자의 현재 위치를 기반으로 주변 장소를 찾는 예제입니다.

```typescript
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, ActivityIndicator } from 'react-native';

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
}

const NearbyPlaces = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocationAndFetchPlaces();
  }, []);

  const getCurrentLocationAndFetchPlaces = async () => {
    try {
      setLoading(true);

      // 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('위치 권한이 필요합니다.');
        setLoading(false);
        return;
      }

      // 현재 위치 가져오기
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);

      // 주변 장소 API 호출
      const nearbyPlaces = await fetchNearbyPlaces(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        1000 // 1km 반경
      );

      setPlaces(nearbyPlaces);
    } catch (err) {
      console.error('위치 가져오기 실패:', err);
      setError('위치를 가져올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyPlaces = async (
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<Place[]> => {
    try {
      const response = await fetch(
        `https://api.example.com/places?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );

      const data = await response.json();

      // 거리 계산 후 정렬
      const placesWithDistance = data.places.map((place: any) => ({
        ...place,
        distance: calculateDistance(
          latitude,
          longitude,
          place.latitude,
          place.longitude
        ),
      }));

      return placesWithDistance.sort((a: Place, b: Place) => a.distance - b.distance);
    } catch (error) {
      console.error('장소 조회 실패:', error);
      return [];
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // 지구 반경 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>주변 장소 검색 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <Text style={styles.locationText}>
          현재 위치: {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
        </Text>
      )}
      <FlatList
        data={places}
        renderItem={({ item }) => (
          <View style={styles.placeItem}>
            <Text style={styles.placeName}>{item.name}</Text>
            <Text style={styles.placeDistance}>
              {item.distance < 1
                ? `${(item.distance * 1000).toFixed(0)}m`
                : `${item.distance.toFixed(2)}km`}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>주변에 장소가 없습니다.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  placeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeDistance: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});
```

## 예제 3: 할 일 알림 앱

특정 시간에 알림을 받을 수 있는 할 일 관리 예제입니다.

```typescript
import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  notificationId?: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const TodoWithNotifications = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
      alert('알림 권한이 필요합니다.');
      return false;
    }

    return true;
  };

  const addTodo = async () => {
    if (!title.trim()) {
      alert('할 일 제목을 입력해주세요.');
      return;
    }

    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      dueDate,
    };

    // 알림 예약
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '할 일 알림',
          body: title,
          data: { todoId: newTodo.id },
          sound: true,
        },
        trigger: {
          date: dueDate,
        },
      });

      newTodo.notificationId = notificationId;
      setTodos([...todos, newTodo]);

      // 입력 필드 초기화
      setTitle('');
      setDescription('');
      setDueDate(new Date());

      alert('할 일이 추가되었습니다.');
    } catch (error) {
      console.error('알림 예약 실패:', error);
      alert('알림을 예약할 수 없습니다.');
    }
  };

  const completeTodo = async (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);

    if (todo?.notificationId) {
      // 알림 취소
      await Notifications.cancelScheduledNotificationAsync(todo.notificationId);
    }

    setTodos(todos.filter(t => t.id !== todoId));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>할 일 추가</Text>

      <TextInput
        style={styles.input}
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="설명 (선택)"
        value={description}
        onChangeText={setDescription}
      />

      <Button
        title={`알림 시간: ${dueDate.toLocaleString()}`}
        onPress={() => setShowDatePicker(true)}
      />

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDueDate(selectedDate);
            }
          }}
        />
      )}

      <Button title="추가" onPress={addTodo} />

      <Text style={styles.listHeader}>할 일 목록</Text>

      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <View style={styles.todoContent}>
              <Text style={styles.todoTitle}>{item.title}</Text>
              {item.description && (
                <Text style={styles.todoDescription}>{item.description}</Text>
              )}
              <Text style={styles.todoDueDate}>
                알림: {item.dueDate.toLocaleString()}
              </Text>
            </View>
            <Button title="완료" onPress={() => completeTodo(item.id)} />
          </View>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>할 일이 없습니다.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  todoDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  todoDueDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
```

## 예제 4: 오프라인 이미지 캐시

다운로드한 이미지를 캐시하여 오프라인에서도 사용할 수 있는 예제입니다.

```typescript
import * as FileSystem from 'expo-file-system';
import { useState, useEffect } from 'react';
import { Image, View, StyleSheet, ActivityIndicator } from 'react-native';

class ImageCacheManager {
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

  async getCachedImage(url: string): Promise<string> {
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
    // URL을 파일명으로 변환
    return url.split('/').pop() || `image-${Date.now()}.jpg`;
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

const imageCache = new ImageCacheManager();

interface CachedImageProps {
  url: string;
  style?: any;
}

const CachedImage = ({ url, style }: CachedImageProps) => {
  const [cachedUri, setCachedUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadImage();
  }, [url]);

  const loadImage = async () => {
    try {
      setLoading(true);
      setError(false);

      const uri = await imageCache.getCachedImage(url);
      setCachedUri(uri);
    } catch (err) {
      console.error('이미지 로드 실패:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[style, styles.loadingContainer]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !cachedUri) {
    return (
      <View style={[style, styles.errorContainer]}>
        <Text>이미지를 불러올 수 없습니다</Text>
      </View>
    );
  }

  return <Image source={{ uri: cachedUri }} style={style} />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
  },
});

export { CachedImage, imageCache };
```

## 더 많은 예제

각 모듈별 더 자세한 예제는 다음 파일을 참조하세요:

- **Camera**: `references/modules/camera.md`
- **Image Picker**: `references/modules/image-picker.md`
- **Location**: `references/modules/location.md`
- **Notifications**: `references/modules/notifications.md`
- **File System**: `references/modules/filesystem.md`
- **Media Library**: `references/modules/media-library.md`
