# 발표자료 폴더

[slides.html](../slides.html) 뷰어와 홈페이지 마인드맵의 "프로젝트" 카드가
여기 있는 슬라이드 이미지를 읽어 표시합니다.

**pptx·pdf 원본은 저장소에 넣지 않습니다.** 발표자료 원본은 보통 수십~수백 MB라
저장소가 감당하기 어렵고(GitHub은 파일당 100MB가 하드 리밋), git 히스토리에
영구히 남습니다. 그래서 **미리 PNG로 변환한 이미지만** 커밋합니다.

## 구성

**발표자료 하나 = 폴더 하나**입니다.

```
slides/
  manifest.json      ← 어떤 덱이 있는지 적는 목록
  buipji-mid/        ← 발표자료 1
    1.png
    2.png
    …
  capstone/          ← 발표자료 2
    1.png
    …
```

이미지는 각 폴더 안에서 **`1.png`, `2.png` … 순번**으로 저장합니다.
폴더가 이름을 구분해 주므로 파일명에 덱 이름을 넣을 필요가 없습니다.

## 새 발표자료 추가하는 법

1. **슬라이드를 PNG로 내보냅니다.**
   - PowerPoint: `파일 → 내보내기 → 파일 형식 변경 → PNG` (모든 슬라이드)
   - 또는 PowerShell + PowerPoint COM으로 해상도를 지정해 일괄 내보내기:
     ```powershell
     $app = New-Object -ComObject PowerPoint.Application
     $pres = $app.Presentations.Open("C:\경로\deck.pptx", $true, $false, $false)
     $pres.Export("C:\출력폴더", "PNG", 1600, 900)   # 가로 1600px
     $pres.Close(); $app.Quit()
     ```
   - 1600×900(16:9) 정도면 웹에서 충분히 선명합니다.

2. **`slides/<덱이름>/` 폴더를 만들고 `1.png`, `2.png` … 로 넣습니다.**
   PowerPoint가 만든 `슬라이드1.PNG` 같은 이름은 번호만 남기고 바꿔주세요.
   폴더 이름은 URL에 들어가므로 영문·숫자·하이픈을 권장합니다.

3. **`manifest.json` 에 덱을 한 줄 추가합니다.**
   ```json
   [
     { "name": "부입지 중간범위 (1차)", "dir": "buipji-mid", "count": 43 },
     { "name": "캡스톤 최종발표",       "dir": "capstone",   "count": 25 }
   ]
   ```
   | 필드 | 뜻 |
   |---|---|
   | `name` | 화면에 표시할 이름 (덱이 2개 이상일 때 상단 탭에 나옴) |
   | `dir` | 이미지가 들어있는 폴더 이름 |
   | `count` | 슬라이드 장수. `1.png` ~ `<count>.png` 를 순서대로 읽습니다 |

   순번이 아닌 파일명을 쓰고 싶다면 `count` 대신 `files` 배열을 적어도 됩니다:
   ```json
   { "name": "…", "dir": "…", "files": ["cover.png", "body.png"] }
   ```

4. 커밋하고 push하면 끝입니다.

   ```bash
   git add slides/
   git commit -m "Add new deck"
   git push
   ```

## 뷰어 동작

- **덱이 1개면** 바로 그 덱이 보입니다.
- **덱이 2개 이상이면** 위쪽에 덱 선택 탭이 나타납니다.
  (홈페이지 인라인 카드도 동일)
- 조작: 좌우 화살표 버튼 / 우측 점 클릭 / 모바일 스와이프,
  전체 화면(`slides.html`)에서는 `←` `→` `Space` 키
- 슬라이드는 효과 없이 바로 전환됩니다.

## 현재 들어있는 덱

- `buipji-mid/` — "부입지 중간범위 (1차)" 43장 (1600×900).
  원본 pptx가 178.8MB라 로컬 PowerPoint로 변환해 이미지만 넣었습니다(21.8MB).
- `mulgeomi-cup/` — "물거미배 포켓몬 대회 중계" 12장 (1600×900, 2.2MB).
  원본은 `바탕 화면\포켓몬스터\물거미배 포켓몬 대회\대회 중계용.pptx` (5.7MB).

## 알려진 한계

- 슬라이드 텍스트는 이미지라 선택·검색이 안 됩니다.
- 원본을 수정하면 PNG를 다시 내보내 교체해야 합니다(자동 변환 없음).

## 매니페스트 형식을 바꿀 때 (주의)

`slides-core.js`는 `manifest.json`의 형식을 전제로 동작합니다. 둘을 함께 바꿔서
배포하면, **이미 사이트를 방문한 적 있는 사람**의 브라우저에는 캐시된 옛
`slides-core.js`가 남아 새 매니페스트를 잘못 읽어 화면이 깨질 수 있습니다.

그래서 HTML에서 자산을 버전과 함께 부릅니다:

```html
<link rel="stylesheet" href="slides-core.css?v=2">
<script src="slides-core.js?v=2"></script>
```

**매니페스트 형식이나 뷰어 동작을 바꿀 때는 이 `?v=` 숫자를 함께 올려주세요.**
그러면 브라우저가 새 파일을 받아 옛 코드와 섞이지 않습니다.
