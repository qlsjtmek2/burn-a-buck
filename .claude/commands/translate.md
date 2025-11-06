# Multi-Language Translation Command

번역할 내용 또는 파일 경로를 입력받아 11개 언어로 병렬 번역하고 `/translate/` 디렉토리에 저장합니다.

## 사용법

```
/translate <텍스트 또는 파일 경로>
```

## 번역 대상 언어

1. 독일어 (de-DE)
2. 스페인어 미국 (es-US)
3. 스페인어 스페인 (es-ES)
4. 영어 미국 (en-US)
5. 영어 영국 (en-GB)
6. 이탈리아어 (it-IT)
7. 일본어 (ja-JP)
8. 포르투갈어 브라질 (pt-BR)
9. 포르투갈어 포르투갈 (pt-PT)
10. 프랑스어 캐나다 (fr-CA)
11. 프랑스어 프랑스 (fr-FR)

## 작업 흐름

1. **입력 처리**:
   - 인자가 파일 경로인 경우: Read tool로 파일 내용 읽기
   - 인자가 텍스트인 경우: 직접 번역에 사용

2. **디렉토리 생성**:
   ```bash
   mkdir -p /home/qlsjt/releases/_burn-a-buck/translate
   ```

3. **병렬 번역**:
   - 11개 언어를 병렬로 번역 (Task tool 사용)
   - 각 언어별로 독립적인 번역 agent 실행
   - 모든 agent가 동시에 실행되어 시간 절약

4. **파일 저장**:
   - 각 번역 결과를 `/translate/{locale}.md` 파일로 저장
   - 예: `/translate/de-DE.md`, `/translate/ja-JP.md` 등

5. **완료 보고**:
   - 번역된 파일 목록 출력
   - 각 파일 경로 표시

## 번역 품질 지침

각 번역은 다음 원칙을 따릅니다:

1. **로케일 맞춤**:
   - en-US vs en-GB: 철자, 표현 차이 (color vs colour, elevator vs lift)
   - es-US vs es-ES: 어휘, 문법 차이 (computadora vs ordenador)
   - pt-BR vs pt-PT: 철자, 어휘 차이 (você vs tu)
   - fr-CA vs fr-FR: 어휘, 표현 차이

2. **자연스러움**:
   - 기계 번역이 아닌 원어민 수준의 자연스러운 표현
   - 각 언어의 관용구와 문화적 맥락 고려

3. **일관성**:
   - 기술 용어는 일관되게 번역
   - 원문의 구조와 의미 유지

4. **포맷 유지**:
   - Markdown 형식 보존
   - 코드 블록, 링크, 이미지 등은 원문 그대로 유지

## 예시

### 입력 (텍스트)
```
/translate "Welcome to Burn a Buck! Donate ₩1,000 to get on the leaderboard."
```

### 입력 (파일)
```
/translate ./README.md
```

### 출력
```
✅ 11개 언어로 번역 완료!

번역된 파일:
- /home/qlsjt/releases/_burn-a-buck/translate/de-DE.md (독일어)
- /home/qlsjt/releases/_burn-a-buck/translate/es-US.md (스페인어 미국)
- /home/qlsjt/releases/_burn-a-buck/translate/es-ES.md (스페인어 스페인)
- /home/qlsjt/releases/_burn-a-buck/translate/en-US.md (영어 미국)
- /home/qlsjt/releases/_burn-a-buck/translate/en-GB.md (영어 영국)
- /home/qlsjt/releases/_burn-a-buck/translate/it-IT.md (이탈리아어)
- /home/qlsjt/releases/_burn-a-buck/translate/ja-JP.md (일본어)
- /home/qlsjt/releases/_burn-a-buck/translate/pt-BR.md (포르투갈어 브라질)
- /home/qlsjt/releases/_burn-a-buck/translate/pt-PT.md (포르투갈어 포르투갈)
- /home/qlsjt/releases/_burn-a-buck/translate/fr-CA.md (프랑스어 캐나다)
- /home/qlsjt/releases/_burn-a-buck/translate/fr-FR.md (프랑스어 프랑스)
```

## 실행 지시사항

**CRITICAL**: 다음 순서대로 정확히 실행하세요.

### Step 1: 입력 확인 및 원본 텍스트 준비

```typescript
// 인자 파싱
const args = "$ARGUMENTS";

if (!args || args.trim() === "") {
  throw new Error("번역할 텍스트 또는 파일 경로를 입력하세요.\n사용법: /translate <텍스트 또는 파일 경로>");
}

let sourceText: string;

// 파일 경로인지 확인 (. 또는 /로 시작)
if (args.startsWith('./') || args.startsWith('/') || args.startsWith('.\\')) {
  // Read tool로 파일 읽기
  sourceText = await readFile(args);
} else {
  // 직접 입력된 텍스트
  sourceText = args;
}
```

### Step 2: 디렉토리 생성

```bash
mkdir -p /home/qlsjt/releases/_burn-a-buck/translate
```

### Step 3: 11개 언어로 병렬 번역

**IMPORTANT**: 단일 메시지에서 11개 Task tool을 동시에 호출하여 병렬 실행합니다.

각 Task는 다음 형식으로 호출:

```typescript
// 11개 Task tool 동시 호출 (병렬 실행)
const languages = [
  { locale: 'de-DE', name: '독일어', nativeName: 'Deutsch' },
  { locale: 'es-US', name: '스페인어 미국', nativeName: 'Español (Estados Unidos)' },
  { locale: 'es-ES', name: '스페인어 스페인', nativeName: 'Español (España)' },
  { locale: 'en-US', name: '영어 미국', nativeName: 'English (United States)' },
  { locale: 'en-GB', name: '영어 영국', nativeName: 'English (United Kingdom)' },
  { locale: 'it-IT', name: '이탈리아어', nativeName: 'Italiano' },
  { locale: 'ja-JP', name: '일본어', nativeName: '日本語' },
  { locale: 'pt-BR', name: '포르투갈어 브라질', nativeName: 'Português (Brasil)' },
  { locale: 'pt-PT', name: '포르투갈어 포르투갈', nativeName: 'Português (Portugal)' },
  { locale: 'fr-CA', name: '프랑스어 캐나다', nativeName: 'Français (Canada)' },
  { locale: 'fr-FR', name: '프랑스어 프랑스', nativeName: 'Français (France)' },
];

// 각 언어별 Task agent 실행
for (const lang of languages) {
  Task({
    subagent_type: 'general-purpose',
    description: `Translate to ${lang.locale}`,
    prompt: `
Translate the following Korean text to ${lang.nativeName} (${lang.locale}).

**Translation Guidelines:**
1. **Locale-specific**: Use ${lang.locale}-specific vocabulary, spelling, and expressions
2. **Natural**: Write as a native speaker would, not literal translation
3. **Consistent**: Keep technical terms consistent
4. **Format**: Preserve Markdown formatting (headings, lists, code blocks, links)
5. **Cultural**: Adapt cultural references appropriately

**Source Text:**
${sourceText}

**Your Task:**
1. Translate the text to ${lang.nativeName} (${lang.locale})
2. Write the translation to: /home/qlsjt/releases/_burn-a-buck/translate/${lang.locale}.md
3. Use the Write tool to save the file
4. Return only "✅ ${lang.locale} translation complete" when done
    `
  });
}
```

### Step 4: 완료 보고

모든 agent가 완료되면:

```markdown
✅ 11개 언어로 번역 완료!

번역된 파일:
- /home/qlsjt/releases/_burn-a-buck/translate/de-DE.md (독일어)
- /home/qlsjt/releases/_burn-a-buck/translate/es-US.md (스페인어 미국)
- /home/qlsjt/releases/_burn-a-buck/translate/es-ES.md (스페인어 스페인)
- /home/qlsjt/releases/_burn-a-buck/translate/en-US.md (영어 미국)
- /home/qlsjt/releases/_burn-a-buck/translate/en-GB.md (영어 영국)
- /home/qlsjt/releases/_burn-a-buck/translate/it-IT.md (이탈리아어)
- /home/qlsjt/releases/_burn-a-buck/translate/ja-JP.md (일본어)
- /home/qlsjt/releases/_burn-a-buck/translate/pt-BR.md (포르투갈어 브라질)
- /home/qlsjt/releases/_burn-a-buck/translate/pt-PT.md (포르투갈어 포르투갈)
- /home/qlsjt/releases/_burn-a-buck/translate/fr-CA.md (프랑스어 캐나다)
- /home/qlsjt/releases/_burn-a-buck/translate/fr-FR.md (프랑스어 프랑스)

번역 확인:
```bash
ls -lh /home/qlsjt/releases/_burn-a-buck/translate/
```
```

## Notes

- 병렬 실행으로 11개 언어를 동시에 번역하여 시간 절약
- 각 언어별 로케일 차이를 정확히 반영
- Markdown 형식 유지로 문서 구조 보존
- 기술 문서, 마케팅 자료, README 등 모든 종류의 텍스트 번역 가능
