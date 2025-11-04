# Supabase Edge Functions

Supabase Edge Functions를 사용한 서버리스 로직 구현 가이드입니다.

## 📚 Table of Contents

- [기본 개념](#기본-개념)
- [Edge Function 생성 (with MCP)](#edge-function-생성-with-mcp)
- [Edge Function 호출 (클라이언트)](#edge-function-호출-클라이언트)
- [환경 변수 사용](#환경-변수-사용)
- [Supabase Admin 클라이언트](#supabase-admin-클라이언트)

---

## 기본 개념

**Edge Functions:**
- Deno 기반 서버리스 함수
- 전 세계 Edge 네트워크에서 실행
- PostgreSQL 직접 접근 가능
- 백엔드 로직 구현 (검증, 결제, 알림 등)

---

## Edge Function 생성 (with MCP)

### Supabase MCP로 배포

```bash
# Edge Function 생성
mcp__supabase__deploy_edge_function "project-id" "hello" [
  {
    "name": "index.ts",
    "content": "
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { name } = await req.json();

  return new Response(
    JSON.stringify({ message: \`Hello, \${name}!\` }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
    "
  }
]
```

### 복잡한 로직 예제

```typescript
// Edge Function: send-email
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    // CORS 헤더
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // 요청 파싱
    const { to, subject, body } = await req.json();

    // 검증
    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 이메일 전송 (예: SendGrid API)
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: 'noreply@example.com' },
        subject,
        content: [{ type: 'text/plain', value: body }],
      }),
    });

    if (!response.ok) {
      throw new Error('이메일 전송 실패');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

---

## Edge Function 호출 (클라이언트)

```typescript
import { supabase } from './lib/supabase';

const callEdgeFunction = async () => {
  const { data, error } = await supabase.functions.invoke('hello', {
    body: { name: 'World' },
  });

  if (error) {
    console.error('Edge Function 호출 실패:', error.message);
    throw error;
  }

  console.log('응답:', data); // { message: "Hello, World!" }
  return data;
};
```

### 인증 토큰과 함께 호출

```typescript
const callAuthenticatedFunction = async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('로그인이 필요합니다.');
  }

  const { data, error } = await supabase.functions.invoke('protected-function', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: { userId: session.user.id },
  });

  if (error) throw error;
  return data;
};
```

---

## 환경 변수 사용

### 환경 변수 설정 (Supabase Dashboard)

```
SENDGRID_API_KEY=your-sendgrid-key
STRIPE_SECRET_KEY=your-stripe-key
```

### Edge Function에서 사용

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const apiKey = Deno.env.get('SENDGRID_API_KEY');

  if (!apiKey) {
    return new Response('API Key not configured', { status: 500 });
  }

  // API Key 사용
  const response = await fetch('https://api.sendgrid.com/...', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  return new Response(JSON.stringify(await response.json()));
});
```

---

## Supabase Admin 클라이언트

Edge Function 내에서 RLS를 우회하고 관리자 권한으로 데이터베이스 접근:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  // Supabase Admin 클라이언트 생성
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // ⚠️ Service Role Key
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // RLS 우회하여 데이터 조회
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('role', 'admin');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ data }));
});
```

---

## 실전 예제

### FCM 푸시 알림 전송

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { userId, title, body } = await req.json();

  // Supabase Admin 클라이언트
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // FCM 토큰 가져오기
  const { data: devices } = await supabaseAdmin
    .from('user_devices')
    .select('fcm_token')
    .eq('user_id', userId);

  // FCM API 호출
  for (const device of devices || []) {
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${Deno.env.get('FCM_SERVER_KEY')}`,
      },
      body: JSON.stringify({
        to: device.fcm_token,
        notification: { title, body },
      }),
    });
  }

  return new Response(JSON.stringify({ success: true }));
});
```

### Stripe 결제 처리

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.0.0';

serve(async (req) => {
  const { amount, currency, paymentMethodId } = await req.json();

  // Stripe 초기화
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });

  // 결제 생성
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method: paymentMethodId,
    confirm: true,
  });

  return new Response(JSON.stringify(paymentIntent));
});
```

---

## 베스트 프랙티스

### ✅ 에러 처리

```typescript
serve(async (req) => {
  try {
    const data = await req.json();

    // 비즈니스 로직

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Error:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
```

### ✅ CORS 헤더

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // 비즈니스 로직

  return new Response(JSON.stringify({ data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
```

### ✅ 검증

```typescript
serve(async (req) => {
  const { email, password } = await req.json();

  // 입력 검증
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }),
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return new Response(
      JSON.stringify({ error: 'Password must be at least 8 characters' }),
      { status: 400 }
    );
  }

  // 비즈니스 로직
});
```

---

## Edge Function 목록 조회

```bash
# Supabase MCP로 목록 조회
mcp__supabase__list_edge_functions "project-id"
```

---

## 참고 자료

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Manual](https://deno.land/manual)
- Context7 MCP로 최신 문서 조회:
  ```bash
  mcp__context7__get-library-docs "/supabase/supabase" --topic="edge-functions"
  ```
