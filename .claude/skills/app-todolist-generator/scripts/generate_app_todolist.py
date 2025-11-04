#!/usr/bin/env python3
"""
App Todolist Generator & Documenter

앱 개발 요구사항을 받아서 체계적이고 실행 가능한 todolist를 생성하고 마크다운으로 문서화하는 스크립트입니다.
"""

import json
import sys
import argparse
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class TodoItem:
    """Todo 항목을 나타내는 데이터 클래스"""
    content: str
    activeForm: str
    status: str = "pending"
    subtasks: List[str] = None


class AppTodolistGenerator:
    """앱 todolist 생성 및 문서화 도구"""

    def __init__(self):
        self.todos: List[TodoItem] = []
        self.analysis: Optional[Dict[str, Any]] = None

    def analyze_requirements(self, requirements: str) -> Dict[str, Any]:
        """
        요구사항을 분석하여 앱 타입과 필요한 기능을 파악합니다.

        Args:
            requirements: 앱 요구사항 문자열

        Returns:
            분석 결과 딕셔너리
        """
        analysis = {
            "app_type": self._detect_app_type(requirements),
            "features": self._extract_features(requirements),
            "tech_stack": self._suggest_tech_stack(requirements),
            "complexity": self._estimate_complexity(requirements)
        }
        self.analysis = analysis
        return analysis

    def _detect_app_type(self, requirements: str) -> str:
        """앱 타입 감지"""
        requirements_lower = requirements.lower()

        if any(keyword in requirements_lower for keyword in ["todo", "task", "할일"]):
            return "todo_app"
        elif any(keyword in requirements_lower for keyword in ["blog", "블로그", "post", "article"]):
            return "blog_app"
        elif any(keyword in requirements_lower for keyword in ["shop", "쇼핑", "ecommerce", "store", "결제", "payment"]):
            return "ecommerce_app"
        elif any(keyword in requirements_lower for keyword in ["chat", "메시지", "message", "채팅"]):
            return "chat_app"
        elif any(keyword in requirements_lower for keyword in ["weather", "날씨"]):
            return "weather_app"
        elif any(keyword in requirements_lower for keyword in ["note", "메모", "노트"]):
            return "note_app"
        else:
            return "generic_app"

    def _extract_features(self, requirements: str) -> List[str]:
        """필요한 기능 추출"""
        features = []
        requirements_lower = requirements.lower()

        # 인증
        if any(keyword in requirements_lower for keyword in ["login", "로그인", "auth", "인증", "sign up", "회원가입"]):
            features.append("authentication")

        # CRUD
        if any(keyword in requirements_lower for keyword in ["create", "생성", "add", "추가"]):
            features.append("create")
        if any(keyword in requirements_lower for keyword in ["read", "조회", "view", "보기", "list", "목록"]):
            features.append("read")
        if any(keyword in requirements_lower for keyword in ["update", "수정", "edit", "편집"]):
            features.append("update")
        if any(keyword in requirements_lower for keyword in ["delete", "삭제", "remove"]):
            features.append("delete")

        # 기타 기능
        if any(keyword in requirements_lower for keyword in ["search", "검색"]):
            features.append("search")
        if any(keyword in requirements_lower for keyword in ["filter", "필터"]):
            features.append("filter")
        if any(keyword in requirements_lower for keyword in ["sort", "정렬"]):
            features.append("sort")
        if any(keyword in requirements_lower for keyword in ["notification", "알림", "push"]):
            features.append("notifications")
        if any(keyword in requirements_lower for keyword in ["offline", "오프라인"]):
            features.append("offline_support")
        if any(keyword in requirements_lower for keyword in ["payment", "결제", "구매"]):
            features.append("payment")
        if any(keyword in requirements_lower for keyword in ["다국어", "i18n", "localization"]):
            features.append("i18n")
        if any(keyword in requirements_lower for keyword in ["real-time", "실시간", "realtime"]):
            features.append("realtime")

        # 기본 CRUD가 없으면 추가
        if not any(f in features for f in ["create", "read", "update", "delete"]):
            features.extend(["create", "read", "update", "delete"])

        return features

    def _suggest_tech_stack(self, requirements: str) -> Dict[str, str]:
        """기술 스택 제안"""
        requirements_lower = requirements.lower()

        # 플랫폼 감지
        if any(keyword in requirements_lower for keyword in ["mobile", "모바일", "ios", "android", "앱"]):
            platform = "mobile"
            framework = "React Native"
        elif any(keyword in requirements_lower for keyword in ["web", "웹", "website"]):
            platform = "web"
            framework = "React"
        else:
            # 기본값
            platform = "mobile"
            framework = "React Native"

        # 백엔드
        if any(keyword in requirements_lower for keyword in ["firebase", "파이어베이스"]):
            backend = "Firebase"
        elif any(keyword in requirements_lower for keyword in ["supabase", "수파베이스"]):
            backend = "Supabase"
        else:
            backend = "Supabase"  # 기본값

        return {
            "platform": platform,
            "framework": framework,
            "backend": backend,
            "state_management": "Zustand + React Query"
        }

    def _estimate_complexity(self, requirements: str) -> str:
        """복잡도 추정"""
        requirements_lower = requirements.lower()
        complexity_score = 0

        # 기능 개수로 복잡도 추정
        if "authentication" in requirements_lower or "로그인" in requirements_lower:
            complexity_score += 2
        if "payment" in requirements_lower or "결제" in requirements_lower:
            complexity_score += 3
        if "admin" in requirements_lower or "관리자" in requirements_lower:
            complexity_score += 2
        if "real-time" in requirements_lower or "실시간" in requirements_lower:
            complexity_score += 3

        # 단어 수
        word_count = len(requirements.split())
        if word_count > 50:
            complexity_score += 2
        elif word_count > 20:
            complexity_score += 1

        if complexity_score >= 5:
            return "complex"
        elif complexity_score >= 2:
            return "medium"
        else:
            return "simple"

    def generate_todolist(self, requirements: str) -> List[Dict[str, Any]]:
        """
        요구사항으로부터 todolist 생성

        Args:
            requirements: 앱 요구사항

        Returns:
            TodoItem 리스트 (dict 형식)
        """
        # 요구사항 분석
        self.analyze_requirements(requirements)

        # 단계별 todolist 생성
        self._add_phase1_todos(self.analysis)
        self._add_phase2_todos(self.analysis)
        self._add_phase3_todos(self.analysis)
        self._add_phase4_todos(self.analysis)
        self._add_phase5_todos(self.analysis)

        # Dict로 변환
        return [asdict(todo) for todo in self.todos]

    def _add_phase1_todos(self, analysis: Dict[str, Any]):
        """Phase 1: 프로젝트 설정"""
        self.todos.append(TodoItem(
            content="프로젝트 초기화 및 기본 구조 설정",
            activeForm="프로젝트 초기화 및 기본 구조 설정 중"
        ))

        if analysis["tech_stack"]["platform"] == "mobile":
            self.todos.append(TodoItem(
                content="React Native 프로젝트 생성 (Expo 또는 CLI)",
                activeForm="React Native 프로젝트 생성 중"
            ))
        else:
            self.todos.append(TodoItem(
                content="React 프로젝트 생성 (Vite 또는 Next.js)",
                activeForm="React 프로젝트 생성 중"
            ))

        self.todos.append(TodoItem(
            content="필수 패키지 설치 (상태관리, UI 라이브러리)",
            activeForm="필수 패키지 설치 중"
        ))

        self.todos.append(TodoItem(
            content="프로젝트 폴더 구조 구성 (features, components, services)",
            activeForm="프로젝트 폴더 구조 구성 중"
        ))

    def _add_phase2_todos(self, analysis: Dict[str, Any]):
        """Phase 2: 백엔드 설정"""
        backend = analysis["tech_stack"]["backend"]

        self.todos.append(TodoItem(
            content=f"{backend} 프로젝트 생성 및 설정",
            activeForm=f"{backend} 프로젝트 생성 및 설정 중"
        ))

        if "authentication" in analysis["features"]:
            self.todos.append(TodoItem(
                content=f"{backend} 인증 설정 (이메일/소셜 로그인)",
                activeForm=f"{backend} 인증 설정 중"
            ))

        self.todos.append(TodoItem(
            content="데이터베이스 스키마 설계 및 생성",
            activeForm="데이터베이스 스키마 설계 및 생성 중"
        ))

        self.todos.append(TodoItem(
            content="API 클라이언트 설정 (React Query)",
            activeForm="API 클라이언트 설정 중"
        ))

    def _add_phase3_todos(self, analysis: Dict[str, Any]):
        """Phase 3: 핵심 기능 구현"""
        app_type = analysis["app_type"]
        features = analysis["features"]

        # 인증 UI
        if "authentication" in features:
            self.todos.append(TodoItem(
                content="로그인 화면 구현",
                activeForm="로그인 화면 구현 중"
            ))
            self.todos.append(TodoItem(
                content="회원가입 화면 구현",
                activeForm="회원가입 화면 구현 중"
            ))

        # 메인 화면
        self.todos.append(TodoItem(
            content=f"{app_type} 메인 화면 UI 구현",
            activeForm=f"{app_type} 메인 화면 UI 구현 중"
        ))

        # CRUD 기능
        if "create" in features:
            self.todos.append(TodoItem(
                content="생성 기능 구현 (Create)",
                activeForm="생성 기능 구현 중"
            ))

        if "read" in features:
            self.todos.append(TodoItem(
                content="조회 기능 구현 (Read/List)",
                activeForm="조회 기능 구현 중"
            ))

        if "update" in features:
            self.todos.append(TodoItem(
                content="수정 기능 구현 (Update)",
                activeForm="수정 기능 구현 중"
            ))

        if "delete" in features:
            self.todos.append(TodoItem(
                content="삭제 기능 구현 (Delete)",
                activeForm="삭제 기능 구현 중"
            ))

        # 추가 기능
        if "search" in features:
            self.todos.append(TodoItem(
                content="검색 기능 구현",
                activeForm="검색 기능 구현 중"
            ))

        if "filter" in features:
            self.todos.append(TodoItem(
                content="필터링 기능 구현",
                activeForm="필터링 기능 구현 중"
            ))

        if "notifications" in features:
            self.todos.append(TodoItem(
                content="푸시 알림 설정 및 구현",
                activeForm="푸시 알림 설정 및 구현 중"
            ))

        if "payment" in features:
            self.todos.append(TodoItem(
                content="결제 시스템 통합 (Google Play/App Store)",
                activeForm="결제 시스템 통합 중"
            ))

        if "i18n" in features:
            self.todos.append(TodoItem(
                content="다국어 지원 설정 (i18next)",
                activeForm="다국어 지원 설정 중"
            ))

        if "realtime" in features:
            self.todos.append(TodoItem(
                content="실시간 기능 구현 (WebSocket/Realtime DB)",
                activeForm="실시간 기능 구현 중"
            ))

    def _add_phase4_todos(self, analysis: Dict[str, Any]):
        """Phase 4: UI/UX 개선"""
        self.todos.append(TodoItem(
            content="로딩 상태 UI 구현 (Skeleton, Spinner)",
            activeForm="로딩 상태 UI 구현 중"
        ))

        self.todos.append(TodoItem(
            content="에러 처리 UI 구현 (Error boundaries, Toast)",
            activeForm="에러 처리 UI 구현 중"
        ))

        self.todos.append(TodoItem(
            content="반응형 디자인 적용 및 스타일링 개선",
            activeForm="반응형 디자인 적용 및 스타일링 개선 중"
        ))

        if analysis["tech_stack"]["platform"] == "mobile":
            self.todos.append(TodoItem(
                content="네이티브 애니메이션 추가",
                activeForm="네이티브 애니메이션 추가 중"
            ))

    def _add_phase5_todos(self, analysis: Dict[str, Any]):
        """Phase 5: 테스트 및 배포"""
        self.todos.append(TodoItem(
            content="기능 테스트 및 버그 수정",
            activeForm="기능 테스트 및 버그 수정 중"
        ))

        self.todos.append(TodoItem(
            content="성능 최적화 (메모이제이션, lazy loading)",
            activeForm="성능 최적화 중"
        ))

        if analysis["tech_stack"]["platform"] == "mobile":
            self.todos.append(TodoItem(
                content="앱 아이콘 및 스플래시 스크린 설정",
                activeForm="앱 아이콘 및 스플래시 스크린 설정 중"
            ))
            self.todos.append(TodoItem(
                content="빌드 및 배포 준비 (App Store/Google Play)",
                activeForm="빌드 및 배포 준비 중"
            ))
        else:
            self.todos.append(TodoItem(
                content="웹 빌드 및 배포 (Vercel/Netlify)",
                activeForm="웹 빌드 및 배포 중"
            ))

    def export_to_markdown(self, title: str = "프로젝트 개발 계획", detailed: bool = False) -> str:
        """
        Todolist를 마크다운 형식으로 변환

        Args:
            title: 문서 제목
            detailed: 상세 정보 포함 여부

        Returns:
            마크다운 형식 문자열
        """
        if not self.analysis:
            raise ValueError("먼저 generate_todolist()를 실행해야 합니다.")

        md = []

        # 제목
        md.append(f"# {title}\n")

        # 메타데이터
        md.append("## 📋 프로젝트 개요\n")
        md.append(f"- **생성일**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        md.append(f"- **작성자**: Claude Code (app-todolist-generator)")
        md.append(f"- **프로젝트 타입**: {self._format_app_type(self.analysis['app_type'])}")
        md.append(f"- **복잡도**: {self._format_complexity(self.analysis['complexity'])}")
        md.append(f"- **총 작업 수**: {len(self.todos)}개")
        md.append(f"- **예상 기간**: {self._estimate_days()}일\n")

        # 기술 스택
        md.append("## 🛠️ 기술 스택\n")
        tech_stack = self.analysis['tech_stack']
        md.append(f"- **플랫폼**: {tech_stack['platform']}")
        md.append(f"- **프레임워크**: {tech_stack['framework']}")
        md.append(f"- **백엔드**: {tech_stack['backend']}")
        md.append(f"- **상태관리**: {tech_stack['state_management']}\n")

        # 주요 기능
        if self.analysis['features']:
            md.append("## ✨ 주요 기능\n")
            for feature in self.analysis['features']:
                md.append(f"- {self._format_feature(feature)}")
            md.append("")

        # Phase별 작업 목록
        current_phase = 1
        phase_start_idx = 0
        phase_todos = self._group_todos_by_phase()

        for phase_num, phase_todo_list in phase_todos.items():
            md.append(f"## 🎯 Phase {phase_num}: {self._get_phase_name(phase_num)}\n")

            for todo in phase_todo_list:
                status_icon = "[ ]"  # pending
                if todo['status'] == "in_progress":
                    status_icon = "[~]"
                elif todo['status'] == "completed":
                    status_icon = "[x]"

                md.append(f"{status_icon} {todo['content']}")

                if detailed:
                    md.append(f"  - _활성 상태: {todo['activeForm']}_")

            md.append("")

        # 진행 상황
        md.append("## 📊 진행 상황\n")
        completed = sum(1 for todo in self.todos if todo.status == "completed")
        total = len(self.todos)
        progress = (completed / total * 100) if total > 0 else 0

        md.append(f"- **완료**: {completed}/{total} ({progress:.1f}%)")
        md.append(f"- **진행 중**: Phase 1")
        md.append(f"- **예상 남은 시간**: {self._estimate_days()}일\n")

        # 푸터
        md.append("---\n")
        md.append("_이 문서는 Claude Code의 app-todolist-generator 스킬로 자동 생성되었습니다._")

        return "\n".join(md)

    def _group_todos_by_phase(self) -> Dict[int, List[Dict[str, Any]]]:
        """Phase별로 todo를 그룹화"""
        phases = {1: [], 2: [], 3: [], 4: [], 5: []}
        todos_per_phase = len(self.todos) // 5

        for idx, todo in enumerate(self.todos):
            phase_num = min((idx // todos_per_phase) + 1, 5)
            phases[phase_num].append(asdict(todo))

        return phases

    def _get_phase_name(self, phase_num: int) -> str:
        """Phase 번호에 해당하는 이름 반환"""
        phase_names = {
            1: "프로젝트 초기 설정",
            2: "백엔드 설정",
            3: "핵심 기능 구현",
            4: "UI/UX 개선",
            5: "테스트 및 배포"
        }
        return phase_names.get(phase_num, "기타")

    def _format_app_type(self, app_type: str) -> str:
        """앱 타입 포맷팅"""
        type_map = {
            "todo_app": "Todo 앱",
            "blog_app": "블로그 앱",
            "ecommerce_app": "이커머스 앱",
            "chat_app": "채팅 앱",
            "weather_app": "날씨 앱",
            "note_app": "노트 앱",
            "generic_app": "일반 앱"
        }
        return type_map.get(app_type, app_type)

    def _format_complexity(self, complexity: str) -> str:
        """복잡도 포맷팅"""
        complexity_map = {
            "simple": "간단 (1-2주)",
            "medium": "중간 (2-4주)",
            "complex": "복잡 (4주 이상)"
        }
        return complexity_map.get(complexity, complexity)

    def _format_feature(self, feature: str) -> str:
        """기능 이름 포맷팅"""
        feature_map = {
            "authentication": "인증 (로그인/회원가입)",
            "create": "생성 기능",
            "read": "조회 기능",
            "update": "수정 기능",
            "delete": "삭제 기능",
            "search": "검색 기능",
            "filter": "필터링 기능",
            "sort": "정렬 기능",
            "notifications": "푸시 알림",
            "offline_support": "오프라인 지원",
            "payment": "결제 시스템",
            "i18n": "다국어 지원",
            "realtime": "실시간 기능"
        }
        return feature_map.get(feature, feature)

    def _estimate_days(self) -> int:
        """예상 개발 기간 계산 (일 단위)"""
        complexity = self.analysis['complexity']
        base_days = {
            "simple": 10,
            "medium": 20,
            "complex": 30
        }

        days = base_days.get(complexity, 15)

        # 기능에 따라 일수 조정
        features = self.analysis['features']
        if "authentication" in features:
            days += 2
        if "payment" in features:
            days += 5
        if "realtime" in features:
            days += 3

        return days


def main():
    """메인 함수"""
    parser = argparse.ArgumentParser(
        description="앱 개발 todolist를 생성하고 문서화합니다.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
사용 예시:
  # JSON 출력 (기본)
  python generate_app_todolist.py "간단한 todo 앱"

  # 마크다운 출력
  python generate_app_todolist.py --format markdown --output plan.md "채팅 앱"

  # 둘 다 출력
  python generate_app_todolist.py --format both --output plan.md "블로그 앱"

  # 상세 정보 포함
  python generate_app_todolist.py --format markdown --output plan.md --detailed "이커머스 앱"
        """
    )

    parser.add_argument(
        "requirements",
        nargs="+",
        help="앱 개발 요구사항"
    )

    parser.add_argument(
        "--format",
        choices=["json", "markdown", "both"],
        default="json",
        help="출력 형식 (기본: json)"
    )

    parser.add_argument(
        "--output",
        help="마크다운 출력 파일 경로"
    )

    parser.add_argument(
        "--title",
        default="프로젝트 개발 계획",
        help="문서 제목 (기본: '프로젝트 개발 계획')"
    )

    parser.add_argument(
        "--detailed",
        action="store_true",
        help="상세 정보 포함"
    )

    args = parser.parse_args()

    # 요구사항 문자열 조합
    requirements = " ".join(args.requirements)

    # Generator 생성 및 todolist 생성
    generator = AppTodolistGenerator()
    todolist = generator.generate_todolist(requirements)

    # JSON 출력
    if args.format in ["json", "both"]:
        json_output = json.dumps(todolist, ensure_ascii=False, indent=2)
        print(json_output)

        # both 모드일 때 JSON 파일도 저장
        if args.format == "both" and args.output:
            json_path = args.output.replace(".md", ".json")
            with open(json_path, "w", encoding="utf-8") as f:
                f.write(json_output)
            print(f"\n✅ JSON 파일 저장: {json_path}", file=sys.stderr)

    # 마크다운 출력
    if args.format in ["markdown", "both"]:
        markdown_output = generator.export_to_markdown(
            title=args.title,
            detailed=args.detailed
        )

        if args.output:
            # 파일로 저장
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(markdown_output)
            print(f"✅ 마크다운 파일 저장: {args.output}", file=sys.stderr)
        else:
            # 표준 출력
            if args.format == "both":
                print("\n--- MARKDOWN OUTPUT ---\n", file=sys.stderr)
            print(markdown_output)


if __name__ == "__main__":
    main()
