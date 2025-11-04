# Deprecated Skills

이 디렉토리에는 더 이상 활성화되지 않는 스킬들이 보관되어 있습니다.

## 통합된 스킬

### skill-developer + skill-creator → skill-development-guide

**통합 날짜:** 2025-11-03

**이유:**
- 두 스킬이 서로 다른 측면(기술 구현 vs 설계 방법론)을 다루지만 실제로는 단일 워크플로우의 일부
- 트리거 패턴이 중복되어 혼란 발생
- 완전한 end-to-end 워크플로우를 제공하지 못함
- 중복된 콘텐츠 (progressive disclosure, skill anatomy 등)

**새로운 통합 스킬:** `.claude/skills/skill-development-guide/`

**통합 내용:**
- Phase 1: Design & Planning (skill-creator 기반)
- Phase 2: Technical Implementation (skill-developer 기반)
- Phase 3: Testing & Iteration (통합)

**변경 사항:**
- 단일 진입점으로 트리거 충돌 해소
- 설계부터 배포까지 완전한 워크플로우 제공
- 중복 제거 및 내용 통합
- 6개 참조 파일을 resources/ 디렉토리로 통합

**마이그레이션:**
새로운 스킬을 사용하세요: `skill-development-guide`

**기존 파일 보관:**
- `skill-developer/` - 기술 구현 가이드 (426줄 + 6개 참조 파일)
- `skill-creator/` - 설계 방법론 가이드 (209줄)

참조용으로만 보관되며, skill-rules.json에서 제거되었습니다.
