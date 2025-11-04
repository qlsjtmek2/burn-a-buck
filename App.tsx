/**
 * App Entry Point
 *
 * "천원 쓰레기통" React Native App
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import RootNavigator from './src/navigation/RootNavigator';
// TODO: Phase 3에서 재활성화
// import { paymentService } from './src/services/payment';
import { initializeI18n } from './src/config/i18n';
import { theme } from './src/theme';

// React Query Client 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // 3회 재시도
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (구 cacheTime)
    },
    mutations: {
      retry: 1, // 1회 재시도
    },
  },
});

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    /**
     * 앱 시작 시 초기화
     * 1. i18n 초기화
     * 2. 결제 서비스 초기화
     */
    async function initializeApp() {
      try {
        console.log('[App] Initializing i18n...');
        await initializeI18n();
        console.log('[App] i18n initialized');

        // TODO: Phase 3에서 재활성화
        // console.log('[App] Initializing payment service...');
        // await paymentService.initialize();
        // console.log('[App] Payment service initialized');

        setIsReady(true);
      } catch (error) {
        console.error('[App] Failed to initialize app:', error);
        // 에러가 발생해도 앱을 실행
        setIsReady(true);
      }
    }

    initializeApp();

    /**
     * 앱 종료 시 정리
     */
    return () => {
      // TODO: Phase 3에서 재활성화
      // console.log('[App] Cleaning up payment service...');
      // paymentService.cleanup();
    };
  }, []);

  // 초기화 중에는 로딩 화면 표시
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <RootNavigator />
            <StatusBar style="auto" />
          </QueryClientProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
