# 이용수 개인 홈페이지 — 작업 안내

> 이 파일은 새로운 채팅/세션이 이 저장소를 빠르게 파악하기 위한 문서입니다.
> Claude Code는 세션 시작 시 `CLAUDE.md`를 자동으로 읽으므로 파일명을 이렇게 두었습니다.

---

## 1. 이 프로젝트가 무엇인가

- **GitHub Pages 사용자 사이트**: `Carudoor/carudoor.github.io` → https://carudoor.github.io
- 빌드 도구·프레임워크·패키지 매니저 **없음**. 정적 HTML/CSS/JS만 `main` 브랜치 루트에서 그대로 서빙됨.
- 로컬 경로: `C:\Users\yslee\OneDrive\바탕 화면\프로젝트\포트폴리오`

### 파일 구조

| 파일 | 역할 |
|---|---|
| `index.html` | **홈페이지 = 인터랙티브 마인드맵 그 자체.** 콘텐츠·레이아웃·상호작용 전부 여기 인라인 |
| `viewer.html` | 전체화면 STL 3D 뷰어 (홀로그램 스타일 HUD + 모델 목록 대시보드) |
| `stl-core.js` | 두 페이지가 공유하는 STL 파서 + `fitGeometryToSize()` |
| `stl/` | STL 모델 파일들 + `manifest.json`(표시할 목록) + `README.md`(모델 추가법) |

---

## 2. 사용자가 명시적으로 정한 것들 (되돌리지 말 것)

아래는 대화 중 사용자가 직접 요청하거나, 다른 방식을 시도했다가 **명시적으로 되돌린** 결정들입니다.

1. **마인드맵은 별도 섹션·별도 페이지가 아니라 홈페이지 그 자체다.**
   과거에 `mindmap.html`을 따로 만들고 홈에서 링크하는 방식으로 했다가 "그게 아니라 홈 첫 페이지에 넣으란 거였다"는 지적을 받고 `index.html`로 통합, `mindmap.html`은 삭제함.

2. **모델 목록은 `stl/manifest.json` 기반을 유지한다.**
   GitHub Contents API로 `stl/` 폴더를 자동 탐색하는 방식으로 바꿨다가 **되돌려 달라는 요청**을 받음. 자동 탐색으로 다시 바꾸지 말 것.

3. **모델 제목은 파일명에서 자동 생성한다.**
   `manifest.json`에 이름을 일일이 적을 필요 없음 (`_`·`-` → 공백, 대문자). 이름을 직접 지정하고 싶을 때만 `{ "file": ..., "name": ... }` 객체 형태를 씀.

4. **홈페이지 색상은 화이트 톤.** 단, **3D 미리보기 박스만 의도적으로 어둡게** 유지 (STL 뷰어의 조명·재질이 어두운 배경 기준이라 밝게 하면 안 보임). `viewer.html`의 네온 다크 테마는 그대로 유지.

5. **3D 미리보기는 한 번 조작하면 자동 회전이 영구히 멈춘다.**
   "손 뗀 후 2.5초 뒤 재개" 기능을 넣었다가 **삭제 요청**받음. 재개 타이머를 다시 넣지 말 것.

6. **강조선은 그냥 나타나지 않고 "그어지는" 움직임이 있어야 한다.**
   - 세부 항목(리프) 클릭 → 중심(이용수)에서 헤더 쪽으로 **위→아래**
   - 헤더 클릭 → 헤더에서 중심으로 **아래→위**

7. **진단용 HUD(FPS / EDGE SEGS)는 제거된 상태를 유지한다.** 디버깅 후 삭제 요청받음.

8. **매 변경은 로컬 커밋 후 push 여부를 확인받고 진행한다.** (사용자가 "push"라고 답하면 그때 push)

---

## 3. 이미 해결됐거나 코드 문제가 아닌 것들 (다시 파헤치지 말 것)

- **Firefox에서 FPS가 낮았던 건 코드 문제가 아니라 브라우저 하드웨어 가속이 꺼져 있어서였음.**
  `backdrop-filter` 제거 / `DoubleSide`→`FrontSide` / 안티앨리어싱·해상도 조정 / blend-mode 제거 등을 시도했으나 효과 없었고, 사용자가 `about:support`에서 하드웨어 가속을 켜자 해결됨. **이 최적화 시도들은 전부 되돌려진 상태이며, 다시 시도할 필요 없음.**

- **Claude의 브라우저 도구로 검증할 때 애니메이션이 전혀 안 움직이는 것은 도구 환경 문제.**
  Browser 패널이 숨김 상태면 그 탭은 `window.innerWidth === 0`, `document.hidden === true`가 되고 **`requestAnimationFrame`도 CSS 트랜지션도 전혀 진행되지 않음**. 이때 캔버스가 0×0으로 나오거나 클릭해도 아무 일이 없는 것처럼 보이는데 **코드 버그가 아님**.
  → 검증 전에 `preview_start`로 패널을 열고 `window.innerWidth`/`document.hidden`을 먼저 확인할 것.

- **로컬에 python·node가 설치돼 있지 않아 로컬 서버를 띄울 수 없음.**
  `file://`로 열면 `fetch`가 막혀 STL/manifest 로딩이 실패함. **검증은 push 후 라이브 URL에서만 가능.**

- **GitHub Pages 배포 반영에 보통 1~2분 걸림.** 확인할 때는 `?v=N` 같은 쿼리로 캐시를 우회하고, 한 번에 안 되면 조금 기다렸다 다시 시도할 것.

- **저장소를 private으로 바꾸면 Pages가 죽는다** (무료 플랜은 public 저장소만 배포 가능). 실제로 겪었고 다시 public으로 되돌려 해결함.

---

## 4. 코드에서 꼭 알아야 할 핵심

### 4.1 `index.html` — 마인드맵 구조

- 전체가 하나의 IIFE. 최상단 **`data` 객체가 콘텐츠의 유일한 소스**:
  ```js
  { label: '이용수', children: [
      { label: '소개', color: '#2563eb', children: [
          { label: '자기소개', text: '...' },                 // 일반 텍스트 본문
          { label: '3D 모델 뷰어', render: function (body) {...} } // 커스텀 DOM(링크·3D 캔버스 등)
      ]}
  ]}
  ```
  현재 브랜치: **소개**(자기소개·학력사항) / **3D 모델 · 프로젝트**(3D 모델 뷰어·프로젝트) / **연락처**(이메일).

- **`render(body)`는 섹션이 문서에 붙은 뒤에 호출된다.** 순서를 바꾸면 안 됨 — 3D 미리보기가 `clientWidth/clientHeight`를 읽는데, 아직 DOM에 붙지 않은 노드는 **0**이라 캔버스가 0×0으로 생성되는 버그가 있었음.

- **좌표계가 두 개다. 이게 이 파일에서 가장 헷갈리는 부분:**
  - 메인 `<svg>`: `viewBox="0 0 680 430"` (뷰박스 좌표, CSS로 스케일됨)
  - `#mm-leader-overlay` `<svg>`: **페이지 픽셀 좌표** (문서 전체를 덮는 절대 위치)
  - 강조선(`mm-trace`)은 중심~헤더를 하나의 선으로 이어야 하는데 이 둘을 가로지르므로,
    **모든 점을 `getBoundingClientRect()`로 실제 렌더 위치를 읽어 페이지 좌표로 통일**해서 오버레이에 그린다 (`pointOf()` / `buildTracePoints()`).

- **오버레이 크기는 절대 `document.documentElement.scrollHeight`로 재면 안 된다.**
  오버레이 자신이 그 높이에 포함되므로, 한 번이라도 크게 측정되면 페이지가 계속 부풀고 되돌아오지 않는 래칫 버그가 생김(실제로 6211px까지 부푼 적 있음). 현재는 **footer의 실제 위치**를 기준으로 계산함.

- 강조선 애니메이션은 `stroke-dasharray`/`stroke-dashoffset` + CSS 트랜지션.
  방향 전환은 **경로 점 배열을 뒤집어서**(`pts.reverse()`) 처리 — dashoffset 부호를 뒤집는 방식은 쓰지 않음(1-value dasharray에서는 주기성 때문에 동작하지 않음).

- 리사이즈 시 `layoutLeaderLines()`가 스파인·점을 다시 배치하고, 떠 있는 강조선도 `refreshHighlightGeometry()`로 새 좌표에 맞춘다.

### 4.2 STL 관련

- **STL은 Y축이 위(three.js 규약)여야 한다.**
  CAD 관례대로 Z-up으로 만들면 모델이 옆으로 누워서 렌더링됨. `small-city.stl`을 이 이유로 Y-up으로 다시 생성한 적 있음. 새로 생성하는 모델도 Y-up으로 만들 것.

- 모델 추가: `stl/`에 파일 넣고 → `stl/manifest.json` 배열에 파일명 한 줄 추가 → 커밋·push. (자세한 내용은 `stl/README.md`)

- 파일명은 URL-safe하게 (공백·괄호 X). 예: `WWII Janpanese Dagger_July 2020 (2).stl` → `wwii-japanese-dagger-2020.stl`

- fetch 캐시 정책: **`manifest.json`만 `cache:'no-store'`** (새 항목 즉시 반영), 모델 파일은 브라우저 캐시 사용 (파일명이 곧 버전).

### 4.3 `viewer.html`

- `manifest.json`을 읽어 목록을 만들고, 첫 모델을 자동 로드. 2개 이상이면 오른쪽 대시보드가 열림.
- 조작: 드래그(회전) / 휠(줌) / Shift+드래그(팬) / `SPACE`(자동회전) / `R`(초기화) / **`D`(대시보드)**
  - `D`인 이유: 예전엔 `Tab`이었는데 `Tab`을 가로채면 키보드 탐색이 불가능해져서 변경함. **다시 `Tab`으로 바꾸지 말 것.**
- 한 번 읽은 STL은 `bufferCache`에 보관해 모델 전환이 즉시 이뤄짐.

### 4.4 접근성 관련 의도적 선택

- 본문 헤더는 `<h3>` 안에 `<button>`을 중첩한 구조. `<h3 role="button">`로 되돌리면 제목 시맨틱이 사라지고 `aria-label`이 제목 텍스트를 덮어써서 스크린리더가 모든 헤더를 똑같이 읽음.
- `prefers-reduced-motion`에서 JS 애니메이션 + CSS 트랜지션 둘 다 꺼짐. 뷰어는 자동회전이 꺼진 상태로 시작.
- JS가 꺼진 환경을 위한 `<noscript>` 대체 콘텐츠가 `index.html`에 있음 (마인드맵·본문이 전부 JS 생성이라 없으면 백지).

---

## 5. 자주 하는 작업

```bash
# 저장소 위치
cd "C:\Users\yslee\OneDrive\바탕 화면\프로젝트\포트폴리오"
```

| 하고 싶은 것 | 건드릴 곳 |
|---|---|
| 마인드맵 항목/문구 변경 | `index.html` 스크립트 최상단 `data` 객체 |
| 새 STL 모델 추가 | `stl/`에 파일 + `stl/manifest.json`에 파일명 |
| 홈 색상 변경 | `index.html`의 `:root { --mm-* }` |
| 뷰어 색상 변경 | `viewer.html`의 `:root { --cyan 등 }` |
| 3D 미리보기에 띄울 모델 교체 | `index.html`의 `initModelPreview` 안 `fetch('stl/small-city.stl')` |

---

## 6. 아직 안 된 것 / 확인 필요

- `stl/teil_1~4.stl`, `stl/innen.stl`이 **실제로 무슨 프로젝트인지 정보 없음.** 그래서 마인드맵 "프로젝트" 항목에는 설명 가능한 `WWII Japanese Dagger`, `Small City`만 적혀 있음. 내용을 알게 되면 추가할 것.
- 학력사항에 재학/졸업 연도가 비어 있음 (사용자가 알려주지 않아 임의로 채우지 않음).
