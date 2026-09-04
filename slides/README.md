# 발표자료 폴더

[slides.html](../slides.html) 뷰어와 홈페이지 마인드맵의 "프로젝트" 카드가
여기 있는 슬라이드 이미지를 읽어 표시합니다.

**pptx·pdf 원본은 저장소에 넣지 않습니다.** 발표자료 원본은 보통 수십~수백 MB라
저장소가 감당하기 어렵고(GitHub은 파일당 100MB가 하드 리밋), git 히스토리에
영구히 남습니다. 그래서 **미리 PNG로 변환한 이미지만** 커밋합니다.

## 구성

| 경로 | 역할 |
|---|---|
| `images/` | 슬라이드 PNG. `<덱이름>-<번호>.png` 형식 |
| `manifest.json` | 표시할 슬라이드의 순서와 전환 효과. **직접 관리하는 파일** |

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

2. **`images/` 에 `<덱이름>-<번호>.png` 형태로 넣습니다.**
   (예: `capstone-1.png`, `capstone-2.png` …)
   PowerPoint가 만든 `슬라이드1.PNG` 같은 이름은 번호만 남기고 바꿔주세요.

3. **`manifest.json` 에 순서대로 항목을 추가합니다.**
   ```json
   [
     { "file": "capstone-1.png", "effect": "fade", "direction": null, "reverse": false, "duration": 600 }
   ]
   ```
   여러 덱을 넣으면 배열에 적힌 순서대로 이어붙여 하나로 표시됩니다.

4. 커밋하고 push하면 끝입니다.

   ```bash
   git add slides/
   git commit -m "Add new deck"
   git push
   ```

## 전환 효과

`manifest.json`의 각 항목에서 지정합니다. 뷰어(`slides-core.js`)가 지원하는 값:

| `effect` | 설명 | `direction` |
|---|---|---|
| `fade` | 서서히 나타남 (기본값) | 사용 안 함 |
| `cut` | 즉시 전환 | 사용 안 함 |
| `zoom` | 살짝 확대되며 등장 | 사용 안 함 |
| `push` | 지정한 방향에서 밀고 들어옴 | `l` `r` `u` `d` `ld` `lu` `rd` `ru` |

- `duration`: 밀리초 (기본 600)
- `reverse`: `true`면 `push` 방향을 반대로 뒤집습니다

## 현재 들어있는 덱

- `buipji-mid-*.png` — "부입지 중간범위 (1차)" 43장 (1600×900).
  원본 pptx가 178.8MB라 로컬 PowerPoint로 변환해 이미지만 넣었습니다(21.8MB).
  원본에 전환 효과가 지정돼 있지 않아 전부 기본 Fade입니다.

## 알려진 한계

- 슬라이드 텍스트는 이미지라 선택·검색이 안 됩니다.
- 원본을 수정하면 PNG를 다시 내보내 교체해야 합니다(자동 변환 없음).
