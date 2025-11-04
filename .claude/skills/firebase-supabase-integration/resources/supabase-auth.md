# Supabase Authentication

Supabase Auth를 사용한 인증 구현 가이드입니다.

## 📚 Table of Contents

- [Email/Password 인증](#emailpassword-인증)
- [소셜 로그인 (OAuth)](#소셜-로그인-oauth)
- [세션 관리](#세션-관리)
- [비밀번호 재설정](#비밀번호-재설정)
- [Email 확인](#email-확인)

---

## Email/Password 인증

### 회원가입

```typescript
import { supabase } from './lib/supabase';

const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('회원가입 실패:', error.message);
    throw error;
  }

  console.log('회원가입 성공:', data.user);
  return data;
};
```

### 로그인

```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('로그인 실패:', error.message);
    throw error;
  }

  console.log('로그인 성공:', data.user);
  return data;
};
```

### 로그아웃

```typescript
const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('로그아웃 실패:', error.message);
    throw error;
  }

  console.log('로그아웃 성공');
};
```

---

## 소셜 로그인 (OAuth)

### Google 로그인

```typescript
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    console.error('Google 로그인 실패:', error.message);
    throw error;
  }

  return data;
};
```

### Apple 로그인

```typescript
const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
  });

  if (error) {
    console.error('Apple 로그인 실패:', error.message);
    throw error;
  }

  return data;
};
```

### GitHub 로그인

```typescript
const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  });

  if (error) {
    console.error('GitHub 로그인 실패:', error.message);
    throw error;
  }

  return data;
};
```

**참고:** OAuth 공급자는 Supabase 대시보드에서 먼저 설정해야 합니다.

---

## 세션 관리

### useAuth 훅 (Custom Hook)

```typescript
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';

const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 세션 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    session,
    user: session?.user,
    loading,
    signOut,
  };
};

export default useAuth;
```

### 사용 예시

```typescript
import useAuth from './hooks/useAuth';

const App = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View>
      {user ? (
        <>
          <Text>환영합니다, {user.email}</Text>
          <Button title="로그아웃" onPress={signOut} />
        </>
      ) : (
        <LoginScreen />
      )}
    </View>
  );
};
```

---

## 비밀번호 재설정

### 비밀번호 재설정 이메일 전송

```typescript
const sendPasswordResetEmail = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'myapp://reset-password',
  });

  if (error) {
    console.error('비밀번호 재설정 이메일 전송 실패:', error.message);
    throw error;
  }

  console.log('비밀번호 재설정 이메일 전송 완료');
};
```

### 새 비밀번호 설정

```typescript
const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('비밀번호 업데이트 실패:', error.message);
    throw error;
  }

  console.log('비밀번호 업데이트 완료');
};
```

---

## Email 확인

### Email 확인 이메일 재전송

```typescript
const resendVerificationEmail = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    console.error('확인 이메일 재전송 실패:', error.message);
    throw error;
  }

  console.log('확인 이메일 재전송 완료');
};
```

### Email 확인 상태 체크

```typescript
const checkEmailVerified = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const isVerified = user.email_confirmed_at !== null;
  console.log('Email 확인 상태:', isVerified);
  return isVerified;
};
```

---

## 사용자 프로필 업데이트

### 메타데이터 업데이트

```typescript
const updateUserProfile = async (displayName: string, avatarUrl: string) => {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      display_name: displayName,
      avatar_url: avatarUrl,
    },
  });

  if (error) {
    console.error('프로필 업데이트 실패:', error.message);
    throw error;
  }

  console.log('프로필 업데이트 완료:', data.user);
  return data.user;
};
```

### 사용자 정보 가져오기

```typescript
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('사용자 정보 조회 실패:', error.message);
    throw error;
  }

  return user;
};
```

---

## 베스트 프랙티스

### ✅ AsyncStorage 사용 (필수)

```typescript
// lib/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // ✅ 세션 저장용
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### ✅ 에러 처리

```typescript
const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Supabase 에러 메시지 처리
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('로그인 에러:', error);
    throw error;
  }
};
```

### ✅ 로딩 상태 관리

```typescript
const LoginScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('로그인 실패', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button title="로그인" onPress={handleLogin} disabled={loading} />
  );
};
```

---

## 참고 자료

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- Context7 MCP로 최신 문서 조회:
  ```bash
  mcp__context7__get-library-docs "/supabase/supabase" --topic="authentication"
  ```
