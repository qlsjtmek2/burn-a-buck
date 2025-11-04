# Complete Examples

## 📚 Table of Contents

- [Example 1: Authentication System](#example-1-authentication-system)
- [Example 2: Shopping Cart](#example-2-shopping-cart)
- [Example 3: Social Media Feed](#example-3-social-media-feed)

---

## Example 1: Authentication System

**Zustand + Async Storage + React Query 조합**

### 1. Auth Store (Zustand + Persist)

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const response = await fetch('https://api.example.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error('Login failed');
          }

          const { token, user } = await response.json();

          set({
            token,
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 2. Protected API Hook (React Query)

```typescript
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from './authStore';

// API 클라이언트
export const apiClient = {
  get: async (url: string) => {
    const token = useAuthStore.getState().token;

    const response = await fetch(`https://api.example.com${url}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // 토큰 만료 시 로그아웃
      useAuthStore.getState().logout();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return response.json();
  },
};

// Protected query hook
export const useProtectedQuery = <T,>(
  key: string[],
  url: string
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<T>({
    queryKey: key,
    queryFn: () => apiClient.get(url),
    enabled: isAuthenticated, // 로그인 시에만 실행
  });
};
```

### 3. Login Screen

```typescript
const LoginScreen = () => {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      // 로그인 성공 시 자동으로 홈 스크린으로 이동 (Navigation 설정에 따라)
    } catch (error) {
      Alert.alert('로그인 실패', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="로그인"
        onPress={handleLogin}
        disabled={loading || !email || !password}
      />

      {loading && <ActivityIndicator />}
    </View>
  );
};
```

### 4. Profile Screen (Protected)

```typescript
const ProfileScreen = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // 보호된 데이터 가져오기
  const { data: profile, isLoading } = useProtectedQuery<UserProfile>(
    ['profile', user?.id],
    `/users/${user?.id}/profile`
  );

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>이름: {user?.name}</Text>
      <Text>이메일: {user?.email}</Text>
      <Text>가입일: {profile?.joinedAt}</Text>

      <Button title="로그아웃" onPress={handleLogout} />
    </View>
  );
};
```

### 5. Navigation Guard

```typescript
const AppNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          // 로그인 후
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          // 로그인 전
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

---

## Example 2: Shopping Cart

**Zustand (Persist) + React Query**

### 1. Cart Store

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 2. Product List Screen

```typescript
import { useQuery } from '@tanstack/react-query';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const ProductListScreen = () => {
  const addItem = useCartStore((state) => state.addItem);
  const itemCount = useCartStore((state) => state.itemCount);

  // React Query로 상품 목록 가져오기
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () =>
      fetch('https://api.example.com/products').then((r) => r.json()),
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {/* 장바구니 아이콘 */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>🛒</Text>
        {itemCount > 0 && (
          <View style={styles.badge}>
            <Text>{itemCount}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>

            <Button
              title="장바구니 담기"
              onPress={() => addItem(item)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
```

### 3. Cart Screen

```typescript
const CartScreen = () => {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const { mutate: checkout, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch('https://api.example.com/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) throw new Error('Checkout failed');
      return response.json();
    },
    onSuccess: () => {
      clearCart();
      Alert.alert('성공', '주문이 완료되었습니다!');
      navigation.navigate('OrderConfirmation');
    },
    onError: (error) => {
      Alert.alert('실패', error.message);
    },
  });

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text>장바구니가 비어있습니다</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.thumbnail} />

            <View style={styles.info}>
              <Text>{item.name}</Text>
              <Text>${item.price}</Text>
            </View>

            <View style={styles.quantity}>
              <Button
                title="-"
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              />
              <Text>{item.quantity}</Text>
              <Button
                title="+"
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              />
            </View>

            <Button
              title="삭제"
              onPress={() => removeItem(item.id)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.summary}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

        <Button
          title="결제하기"
          onPress={() => checkout()}
          disabled={isPending}
        />

        {isPending && <ActivityIndicator />}
      </View>
    </View>
  );
};
```

---

## Example 3: Social Media Feed

**React Query (Infinite Scroll) + Zustand + Optimistic Updates**

### 1. Feed Hook

```typescript
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Post {
  id: number;
  author: { id: number; name: string; avatar: string };
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

export const useFeed = () => {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `https://api.example.com/posts?page=${pageParam}&limit=10`
      );
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) =>
      fetch(`https://api.example.com/posts/${postId}/like`, {
        method: 'POST',
      }),

    // Optimistic update
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });

      const previousFeed = queryClient.getQueryData(['feed']);

      queryClient.setQueryData(['feed'], (old: any) => ({
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: Post) =>
            post.id === postId
              ? { ...post, likes: post.likes + (post.isLiked ? -1 : 1), isLiked: !post.isLiked }
              : post
          ),
        })),
      }));

      return { previousFeed };
    },

    onError: (err, postId, context) => {
      queryClient.setQueryData(['feed'], context?.previousFeed);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};
```

### 2. Feed Screen

```typescript
const FeedScreen = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isFetching,
  } = useFeed();

  const likeMutation = useLikePost();

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onLike={() => likeMutation.mutate(item.id)}
        />
      )}
      keyExtractor={(item) => item.id.toString()}

      // Pull to refresh
      refreshing={isFetching && !isFetchingNextPage}
      onRefresh={refetch}

      // Infinite scroll
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}

      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : null
      }
    />
  );
};
```

### 3. Post Card Component

```typescript
const PostCard = ({ post, onLike }: { post: Post; onLike: () => void }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
        <Text style={styles.authorName}>{post.author.name}</Text>
        <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onLike} style={styles.likeButton}>
          <Text>{post.isLiked ? '❤️' : '🤍'}</Text>
          <Text>{post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.commentButton}>
          <Text>💬 Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton}>
          <Text>📤 Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

### 4. Create Post (useMutation)

```typescript
const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('https://api.example.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },

    onSuccess: () => {
      // Feed 재조회
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

const CreatePostScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const createMutation = useCreatePost();

  const handlePost = () => {
    createMutation.mutate(content, {
      onSuccess: () => {
        setContent('');
        navigation.goBack();
        Alert.alert('성공', '게시글이 작성되었습니다.');
      },
      onError: (error) => {
        Alert.alert('실패', error.message);
      },
    });
  };

  return (
    <View>
      <TextInput
        placeholder="무슨 생각을 하고 계신가요?"
        value={content}
        onChangeText={setContent}
        multiline
        style={styles.input}
      />

      <Button
        title="게시"
        onPress={handlePost}
        disabled={!content.trim() || createMutation.isPending}
      />

      {createMutation.isPending && <ActivityIndicator />}
    </View>
  );
};
```

---

**이 3가지 예제는 실제 프로덕션 앱에서 사용할 수 있는 패턴입니다.**
