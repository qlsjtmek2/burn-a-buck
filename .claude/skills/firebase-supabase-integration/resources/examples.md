# 실전 예제

Firebase와 Supabase를 사용한 실전 예제입니다.

## 📚 Table of Contents

- [예제 1: 소셜 미디어 앱](#예제-1-소셜-미디어-앱)
- [예제 2: 실시간 채팅 앱](#예제-2-실시간-채팅-앱)
- [예제 3: 이미지 공유 앱](#예제-3-이미지-공유-앱)

---

## 예제 1: 소셜 미디어 앱

게시글 + 좋아요 + 댓글 기능을 가진 소셜 미디어 앱

### 데이터베이스 스키마

```sql
-- posts 테이블
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- post_likes 테이블
CREATE TABLE post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- comments 테이블
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT USING (true);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT USING (true);

CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON post_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 게시글 좋아요 토글

```typescript
const toggleLike = async (postId: string) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  // 좋아요 확인
  const { data: existing } = await supabase
    .from('post_likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    // 좋아요 취소
    await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id);

    console.log('좋아요 취소');
  } else {
    // 좋아요 추가
    await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: user.id });

    console.log('좋아요 추가');
  }
};
```

### 실시간 좋아요 수 표시

```typescript
const usePostLikes = (postId: string) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // 초기 좋아요 수 및 상태
    const fetchLikes = async () => {
      const { count } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      setLikes(count || 0);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('post_likes')
          .select('*')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single();

        setIsLiked(!!data);
      }
    };

    fetchLikes();

    // 실시간 구독
    const channel = supabase
      .channel(`post-likes-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLikes((prev) => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            setLikes((prev) => prev - 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  return { likes, isLiked, toggleLike: () => toggleLike(postId) };
};

// 사용 예시
const PostItem = ({ post }: { post: Post }) => {
  const { likes, isLiked, toggleLike } = usePostLikes(post.id);

  return (
    <View>
      <Text>{post.content}</Text>
      <TouchableOpacity onPress={toggleLike}>
        <Icon name={isLiked ? 'heart' : 'heart-outline'} />
        <Text>{likes}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

## 예제 2: 실시간 채팅 앱

### 데이터베이스 스키마

```sql
-- chat_rooms 테이블
CREATE TABLE chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- chat_room_members 테이블
CREATE TABLE chat_room_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- messages 테이블
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Members can view their rooms"
  ON chat_rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_room_members
      WHERE room_id = chat_rooms.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Members can view room members"
  ON chat_room_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_room_members crm
      WHERE crm.room_id = chat_room_members.room_id AND crm.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can view messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_room_members
      WHERE room_id = messages.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Members can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM chat_room_members
      WHERE room_id = messages.room_id AND user_id = auth.uid()
    )
  );
```

### 메시지 전송

```typescript
const sendMessage = async (roomId: string, content: string) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      room_id: roomId,
      user_id: user.id,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error('메시지 전송 실패:', error.message);
    throw error;
  }

  return data;
};
```

### 실시간 메시지 수신

```typescript
const useRoomMessages = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // 초기 메시지 로드
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, users(display_name, avatar_url)')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      setMessages(data || []);
    };

    fetchMessages();

    // 실시간 구독
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          // 사용자 정보 함께 가져오기
          const { data: newMessage } = await supabase
            .from('messages')
            .select('*, users(display_name, avatar_url)')
            .eq('id', payload.new.id)
            .single();

          if (newMessage) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return messages;
};

// 사용 예시
const ChatScreen = ({ roomId }: { roomId: string }) => {
  const messages = useRoomMessages(roomId);
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {
    if (!inputText.trim()) return;

    await sendMessage(roomId, inputText);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble message={item} />
        )}
        keyExtractor={(item) => item.id}
      />
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder="메시지 입력..."
      />
      <Button title="전송" onPress={handleSend} />
    </View>
  );
};
```

---

## 예제 3: 이미지 공유 앱

### 데이터베이스 스키마

```sql
-- photos 테이블
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photos"
  ON photos FOR SELECT USING (true);

CREATE POLICY "Users can upload photos"
  ON photos FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON photos FOR DELETE USING (auth.uid() = user_id);
```

### 이미지 업로드 및 저장

```typescript
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './lib/supabase';

const uploadPhoto = async () => {
  // 1. 이미지 선택
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  const imageUri = result.assets[0].uri;

  // 2. Supabase Storage에 업로드
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const response = await fetch(imageUri);
  const blob = await response.blob();

  const fileName = `${user.id}/${Date.now()}.jpg`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('photos')
    .upload(fileName, blob, {
      contentType: 'image/jpeg',
    });

  if (uploadError) {
    throw uploadError;
  }

  // 3. Public URL 가져오기
  const { data: urlData } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);

  // 4. 데이터베이스에 저장
  const { data: photoData, error: dbError } = await supabase
    .from('photos')
    .insert({
      user_id: user.id,
      image_url: urlData.publicUrl,
      caption: '새 사진',
    })
    .select()
    .single();

  if (dbError) {
    throw dbError;
  }

  console.log('사진 업로드 완료:', photoData);
  return photoData;
};

// 사용 예시
const UploadScreen = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);
    try {
      const photo = await uploadPhoto();
      Alert.alert('성공', '사진이 업로드되었습니다.');
    } catch (error) {
      Alert.alert('오류', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Button
      title="사진 업로드"
      onPress={handleUpload}
      disabled={uploading}
    />
  );
};
```

### 실시간 사진 피드

```typescript
const usePhotoFeed = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    // 초기 사진 로드
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('photos')
        .select('*, users(display_name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(50);

      setPhotos(data || []);
    };

    fetchPhotos();

    // 실시간 구독
    const channel = supabase
      .channel('photos-feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'photos',
        },
        async (payload) => {
          // 사용자 정보 함께 가져오기
          const { data: newPhoto } = await supabase
            .from('photos')
            .select('*, users(display_name, avatar_url)')
            .eq('id', payload.new.id)
            .single();

          if (newPhoto) {
            setPhotos((prev) => [newPhoto, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return photos;
};

// 사용 예시
const FeedScreen = () => {
  const photos = usePhotoFeed();

  return (
    <FlatList
      data={photos}
      renderItem={({ item }) => (
        <PhotoCard photo={item} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};
```

---

## 공통 패턴

### useAuth Hook (모든 예제에서 공통)

```typescript
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';

const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

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

---

## 참고 자료

- [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples)
- [React Native Supabase Examples](https://github.com/supabase/examples-archive/tree/main/supabase-js-v2/react-native-expo)
