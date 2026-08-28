# STL 모델 폴더

이 폴더에 넣은 `.stl` 파일이 [viewer.html](../viewer.html) 3D 뷰어에 자동으로 표시됩니다.

## 새 모델 추가하는 법

1. 이 폴더(`stl/`)에 `.stl` 파일을 복사합니다.
2. `manifest.json`을 열어서 파일명만 배열에 추가합니다. 이게 전부입니다 — 화면에 표시되는 제목은 파일명에서 자동으로 만들어집니다 (`_`, `-`는 공백으로 바뀌고 대문자로 표시됨).
   ```json
   [
     "example.stl"
   ]
   ```

   자동으로 만들어지는 제목 대신 직접 이름을 지정하고 싶을 때만 아래 형태를 쓰면 됩니다 (선택사항):
   ```json
   [
     { "file": "example.stl", "name": "예시 모델" }
   ]
   ```

   두 형태를 섞어서 써도 됩니다.

3. 변경사항을 커밋하고 push합니다.

   ```bash
   git add stl/
   git commit -m "Add new STL model"
   git push
   ```

4. 잠시 후 https://carudoor.github.io/viewer.html 에서 확인할 수 있습니다.

`manifest.json`에 파일이 2개 이상 있으면 뷰어 오른쪽에 대시보드(모델 목록)가 나타나고, 클릭해서 보고 있는 모델을 바꿀 수 있습니다.
