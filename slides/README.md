# 발표자료 폴더 (PPTX · PDF)

이 폴더에 `.pptx` 또는 `.pdf` 파일을 넣고 push하면, GitHub Actions가 자동으로
슬라이드를 이미지로 변환해서 [slides.html](../slides.html) 뷰어에 표시합니다.

## 새 발표자료 추가하는 법

1. 이 폴더(`slides/`)에 `.pptx` 또는 `.pdf` 파일을 복사합니다.
2. 커밋하고 push합니다.

   ```bash
   git add slides/
   git commit -m "Add new deck"
   git push
   ```

3. GitHub Actions(`Build slides from PPTX/PDF`)가 1~2분 정도 실행되며 자동으로
   `slides/images/*.png` 와 `slides/manifest.json` 을 만들어 커밋합니다.
   진행 상황은 저장소 **Actions** 탭에서 볼 수 있습니다.
4. 완료되면 https://carudoor.github.io/slides.html 에서 확인할 수 있습니다.

> `slides/images/` 와 `slides/manifest.json` 은 **자동 생성물**입니다.
> 직접 편집하지 마세요 — 다음 빌드 때 덮어써집니다.
> 사람이 관리하는 건 `.pptx` / `.pdf` 원본뿐입니다.

## 전환 효과

| 형식 | 전환 효과 |
|---|---|
| `.pptx` | PowerPoint에서 지정한 효과를 **그대로 읽어와 재현** |
| `.pdf` | PDF 포맷에는 전환 정보가 없어 **전부 기본값(Fade, 600ms)** |

pptx 기준:

- **원본대로 재현**: Fade, Cut, Zoom, Push, Cover, Uncover, Wipe, Blinds, Split
  (방향·속도 포함)
- **Fade로 대체**: Morph, Cube, Vortex, Honeycomb, Ripple, Gallery, Doors,
  Window, Ferris, Conveyor 등 3D/렌더링 계열 — CSS로는 동일하게 그릴 수 없어
  가장 무난한 Fade로 대체됩니다.
- 전환 효과를 지정하지 않은 슬라이드는 기본값(Fade, 600ms)이 적용됩니다.

## 파일 이름 규칙

변환된 이미지는 `<파일명>_<확장자>-<쪽번호>.png` 형태로 저장됩니다
(예: `capstone.pptx` → `capstone_pptx-1.png`, `report.pdf` → `report_pdf-1.png`).
확장자를 접두어에 넣기 때문에 **같은 이름의 pptx와 pdf를 함께 두어도**
이미지가 서로 덮어써지지 않습니다.

여러 파일을 넣으면 파일명 순서대로 이어붙여 하나의 덱으로 표시됩니다.

## 알려진 한계

- 슬라이드 안의 텍스트는 이미지라 선택·검색이 안 됩니다.
- 폰트가 변환 서버(Ubuntu)에 없으면 대체 폰트로 렌더링될 수 있습니다.
  (PDF는 폰트가 파일에 embed되어 있는 경우가 많아 이 문제가 적습니다.)
- 오브젝트 단위 애니메이션(슬라이드 "내부" 효과)은 다루지 않습니다.
  여기서 재현하는 건 슬라이드 "전환" 효과입니다.
