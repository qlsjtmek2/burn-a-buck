/**
 * Root Navigator
 *
 * 앱의 메인 네비게이션 구조
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { checkOnboardingCompleted } from '../utils/onboarding';
import { colors } from '../theme/colors';

// Screens (lazy import for better performance)
import OnboardingScreen from '../features/onboarding/screens/OnboardingScreen';
import MainScreen from '../features/leaderboard/screens/MainScreen';
// NicknameScreen은 온보딩에 통합되어 더 이상 독립 화면으로 사용하지 않음
// import NicknameScreen from '../features/nickname/screens/NicknameScreen';
import DonationCompleteScreen from '../features/donation/screens/DonationCompleteScreen';

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Root Navigator Component
 */
export const RootNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState<
    keyof RootStackParamList
  >('Onboarding');

  useEffect(() => {
    /**
     * 온보딩 완료 여부 확인 및 초기 화면 설정
     */
    async function checkInitialRoute() {
      try {
        const isOnboardingCompleted = await checkOnboardingCompleted();

        // 온보딩 완료 시 메인 화면으로, 미완료 시 온보딩 화면으로
        setInitialRouteName(isOnboardingCompleted ? 'Main' : 'Onboarding');
      } catch (error) {
        console.error('[RootNavigator] Failed to check onboarding:', error);
        // 에러 시 기본값으로 온보딩 화면
        setInitialRouteName('Onboarding');
      } finally {
        setIsLoading(false);
      }
    }

    checkInitialRoute();
  }, []);

  // 초기 로딩 중에는 빈 화면 표시 (또는 스플래시 스크린)
  if (isLoading) {
    return null; // TODO: Replace with SplashScreen component
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false, // 헤더 숨김 (커스텀 헤더 사용)
          cardStyle: { backgroundColor: colors.background }, // 배경색
        }}
      >
        {/* 온보딩 화면 */}
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            headerShown: false,
            gestureEnabled: false, // 뒤로가기 제스처 비활성화
          }}
        />

        {/* 메인 화면 */}
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{
            headerShown: false,
            gestureEnabled: false, // 뒤로가기 제스처 비활성화 (온보딩으로 돌아가지 않도록)
          }}
        />

        {/* 닉네임 입력 화면 - 온보딩에 통합되어 더 이상 사용하지 않음 */}
        {/* <Stack.Screen
          name="Nickname"
          component={NicknameScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        /> */}

        {/* 기부 완료 화면 */}
        <Stack.Screen
          name="DonationComplete"
          component={DonationCompleteScreen}
          options={{
            headerShown: false,
            gestureEnabled: false, // 뒤로가기 제스처 비활성화 (완료 화면에서는 돌아갈 수 없음)
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
