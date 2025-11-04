# Location (expo-location) 상세 가이드

## 개요

expo-location은 디바이스의 현재 위치, 백그라운드 위치 추적, 지오코딩(주소 ↔ 좌표 변환) 등의 위치 기반 서비스를 제공합니다.

## Context7 문서 조회

```bash
mcp__context7__get-library-docs "/expo/expo" topic: "Location"
```

## 설치

```bash
npx expo install expo-location
```

## 기본 사용법

### 1. 현재 위치 가져오기

```typescript
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

const CurrentLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // 권한 요청
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setError('위치 권한이 거부되었습니다.');
          return;
        }

        // 현재 위치 가져오기
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation(currentLocation);
      } catch (err) {
        setError('위치를 가져올 수 없습니다.');
        console.error(err);
      }
    })();
  }, []);

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!location) {
    return <Text>위치 가져오는 중...</Text>;
  }

  return (
    <View>
      <Text>위도: {location.coords.latitude}</Text>
      <Text>경도: {location.coords.longitude}</Text>
      <Text>정확도: {location.coords.accuracy}m</Text>
      <Text>고도: {location.coords.altitude}m</Text>
      <Text>속도: {location.coords.speed}m/s</Text>
    </View>
  );
};
```

### 2. 위치 정확도 설정

```typescript
// 가장 정확한 위치 (배터리 소모 많음)
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Highest,
});

// 균형잡힌 정확도 (권장)
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Balanced,
});

// 낮은 정확도 (배터리 절약)
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Low,
});

// 최저 정확도 (배터리 최대 절약)
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Lowest,
});
```

## 고급 기능

### 1. 실시간 위치 업데이트

```typescript
import { useEffect, useState } from 'react';

const LiveLocationTracking = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        alert('위치 권한이 필요합니다.');
        return;
      }

      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,      // 5초마다 업데이트
          distanceInterval: 10,    // 10미터 이동 시 업데이트
        },
        newLocation => {
          setLocation(newLocation);
          console.log('위치 업데이트:', newLocation.coords);
        }
      );

      setSubscription(sub);
    };

    startWatching();

    return () => {
      // 언마운트 시 구독 해제
      subscription?.remove();
    };
  }, []);

  return (
    <View>
      {location && (
        <Text>
          현재 위치: {location.coords.latitude}, {location.coords.longitude}
        </Text>
      )}
    </View>
  );
};
```

### 2. 백그라운드 위치 추적

```typescript
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_LOCATION_TASK = 'background-location-task';

// 백그라운드 작업 정의
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
  if (error) {
    console.error('백그라운드 위치 에러:', error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    console.log('백그라운드 위치:', locations);

    // 서버에 위치 데이터 전송
    locations.forEach(location => {
      sendLocationToServer(location);
    });
  }
});

const BackgroundTracking = () => {
  const [isTracking, setIsTracking] = useState(false);

  const startBackgroundTracking = async () => {
    try {
      // 백그라운드 권한 요청
      const { status } = await Location.requestBackgroundPermissionsAsync();

      if (status !== 'granted') {
        alert('백그라운드 위치 권한이 필요합니다.');
        return;
      }

      // 백그라운드 위치 추적 시작
      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,     // 10초마다
        distanceInterval: 100,   // 100미터마다
        foregroundService: {
          notificationTitle: '위치 추적 중',
          notificationBody: '앱이 위치를 추적하고 있습니다.',
        },
      });

      setIsTracking(true);
    } catch (error) {
      console.error('백그라운드 추적 시작 실패:', error);
    }
  };

  const stopBackgroundTracking = async () => {
    try {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      setIsTracking(false);
    } catch (error) {
      console.error('백그라운드 추적 중지 실패:', error);
    }
  };

  return (
    <View>
      <Button
        title={isTracking ? '추적 중지' : '추적 시작'}
        onPress={isTracking ? stopBackgroundTracking : startBackgroundTracking}
      />
    </View>
  );
};
```

### 3. 지오코딩 (주소 ↔ 좌표 변환)

```typescript
// 좌표 → 주소 (Reverse Geocoding)
const getAddressFromCoords = async (latitude: number, longitude: number) => {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addresses.length > 0) {
      const address = addresses[0];
      console.log('주소:', address);
      console.log('도시:', address.city);
      console.log('거리:', address.street);
      console.log('우편번호:', address.postalCode);
      console.log('국가:', address.country);

      return address;
    }
  } catch (error) {
    console.error('주소 변환 실패:', error);
  }
};

// 주소 → 좌표 (Geocoding)
const getCoordsFromAddress = async (address: string) => {
  try {
    const locations = await Location.geocodeAsync(address);

    if (locations.length > 0) {
      const { latitude, longitude } = locations[0];
      console.log('좌표:', latitude, longitude);

      return { latitude, longitude };
    }
  } catch (error) {
    console.error('좌표 변환 실패:', error);
  }
};

// 사용 예시
const AddressSearch = () => {
  const [address, setAddress] = useState('');

  const searchAddress = async () => {
    const coords = await getCoordsFromAddress(address);
    if (coords) {
      console.log('검색 결과 좌표:', coords);
      // 지도에 마커 표시 등
    }
  };

  return (
    <View>
      <TextInput
        placeholder="주소 입력"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="검색" onPress={searchAddress} />
    </View>
  );
};
```

### 4. 지오펜싱 (특정 영역 진입/이탈 감지)

```typescript
import * as TaskManager from 'expo-task-manager';

const GEOFENCING_TASK = 'geofencing-task';

TaskManager.defineTask(GEOFENCING_TASK, ({ data, error }) => {
  if (error) {
    console.error('지오펜싱 에러:', error);
    return;
  }

  if (data) {
    const { eventType, region } = data as {
      eventType: Location.GeofencingEventType;
      region: Location.LocationRegion;
    };

    if (eventType === Location.GeofencingEventType.Enter) {
      console.log(`영역 진입: ${region.identifier}`);
      // 알림 표시 등
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log(`영역 이탈: ${region.identifier}`);
    }
  }
});

const Geofencing = () => {
  const startGeofencing = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();

    if (status !== 'granted') {
      alert('백그라운드 위치 권한이 필요합니다.');
      return;
    }

    await Location.startGeofencingAsync(GEOFENCING_TASK, [
      {
        identifier: 'home',
        latitude: 37.5665,
        longitude: 126.9780,
        radius: 100,  // 100미터 반경
        notifyOnEnter: true,
        notifyOnExit: true,
      },
      {
        identifier: 'office',
        latitude: 37.5172,
        longitude: 127.0473,
        radius: 50,
        notifyOnEnter: true,
        notifyOnExit: false,
      },
    ]);
  };

  return (
    <Button title="지오펜싱 시작" onPress={startGeofencing} />
  );
};
```

## 권한 관리

### 1. 포그라운드 권한

```typescript
// 권한 상태 확인
const { status } = await Location.getForegroundPermissionsAsync();

// 권한 요청
const { status } = await Location.requestForegroundPermissionsAsync();
```

### 2. 백그라운드 권한

```typescript
// 백그라운드 권한 상태 확인
const { status } = await Location.getBackgroundPermissionsAsync();

// 백그라운드 권한 요청
const { status } = await Location.requestBackgroundPermissionsAsync();
```

### 3. 권한 상태별 처리

```typescript
const checkLocationPermission = async () => {
  const { status } = await Location.getForegroundPermissionsAsync();

  switch (status) {
    case 'granted':
      console.log('권한 승인됨');
      break;
    case 'denied':
      console.log('권한 거부됨 - 설정에서 변경 필요');
      Linking.openSettings();
      break;
    case 'undetermined':
      console.log('권한 미결정 - 요청 가능');
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      break;
  }
};
```

## 실전 예제

### 예제 1: 주변 장소 찾기

```typescript
const NearbyPlaces = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    getCurrentLocationAndFetchPlaces();
  }, []);

  const getCurrentLocationAndFetchPlaces = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        alert('위치 권한이 필요합니다.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);

      // 주변 장소 API 호출
      const nearbyPlaces = await fetchNearbyPlaces(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        1000  // 1km 반경
      );

      setPlaces(nearbyPlaces);
    } catch (error) {
      console.error('위치 가져오기 실패:', error);
      alert('위치를 가져올 수 없습니다.');
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 지구 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  return (
    <View>
      {location && (
        <Text>
          현재 위치: {location.coords.latitude}, {location.coords.longitude}
        </Text>
      )}
      <FlatList
        data={places}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>
              거리: {calculateDistance(
                location.coords.latitude,
                location.coords.longitude,
                item.latitude,
                item.longitude
              ).toFixed(2)}km
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
```

### 예제 2: 거리 추적

```typescript
const DistanceTracker = () => {
  const [totalDistance, setTotalDistance] = useState(0);
  const [lastPosition, setLastPosition] = useState<Location.LocationObject | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    if (isTracking) {
      (async () => {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          position => {
            if (lastPosition) {
              const distance = calculateDistance(
                lastPosition.coords.latitude,
                lastPosition.coords.longitude,
                position.coords.latitude,
                position.coords.longitude
              );

              setTotalDistance(prev => prev + distance);
            }

            setLastPosition(position);
          }
        );
      })();
    }

    return () => {
      subscription?.remove();
    };
  }, [isTracking, lastPosition]);

  const startTracking = () => {
    setIsTracking(true);
    setTotalDistance(0);
    setLastPosition(null);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  return (
    <View>
      <Text>총 이동 거리: {(totalDistance * 1000).toFixed(2)}m</Text>
      <Button
        title={isTracking ? '추적 중지' : '추적 시작'}
        onPress={isTracking ? stopTracking : startTracking}
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
        "NSLocationWhenInUseUsageDescription": "주변 장소를 찾기 위해 위치 정보가 필요합니다.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "백그라운드에서도 위치를 추적하기 위해 항상 접근 권한이 필요합니다.",
        "NSLocationAlwaysUsageDescription": "백그라운드에서 위치를 추적합니다.",
        "UIBackgroundModes": ["location"]
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
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION"
      ]
    }
  }
}
```

## 베스트 프랙티스

1. **적절한 정확도 선택**: 용도에 맞는 정확도 설정 (배터리 절약)
2. **구독 해제**: 컴포넌트 언마운트 시 반드시 구독 해제
3. **권한 설명**: 사용자에게 위치 권한이 왜 필요한지 명확히 설명
4. **에러 처리**: 위치를 가져올 수 없는 경우 대비
5. **백그라운드 주의**: 백그라운드 추적은 배터리 소모가 크므로 신중히 사용

## 주의사항

1. **iOS 백그라운드 권한**: 앱 스토어 심사 시 백그라운드 위치 사용 이유 명확히 설명 필요
2. **Android 11+**: 백그라운드 위치 권한은 별도 요청 필요
3. **배터리 최적화**: 불필요한 위치 업데이트 방지
4. **정확도 vs 배터리**: 높은 정확도는 배터리 소모가 크므로 균형 필요

## 관련 모듈

- **expo-task-manager**: 백그라운드 작업 관리
- **react-native-maps**: 지도 표시 및 마커 추가
