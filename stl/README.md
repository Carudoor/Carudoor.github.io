# STL 모델 폴더

이 폴더에 넣은 `.stl` 파일이 [viewer.html](../viewer.html) 3D 뷰어에 자동으로 표시됩니다.
GitHub API로 이 폴더 내용을 직접 읽어오기 때문에 별도로 목록 파일을 관리할 필요가 없습니다.

## 새 모델 추가하는 법

1. 이 폴더(`stl/`)에 `.stl` 파일을 복사합니다.
2. 커밋하고 push합니다.

   ```bash
   git add stl/
   git commit -m "Add new STL model"
   git push
   ```

3. 잠시 후 https://carudoor.github.io/viewer.html 에서 확인할 수 있습니다.

화면에 표시되는 제목은 파일명에서 자동으로 만들어집니다 (`_`, `-`는 공백으로 바뀌고 대문자로 표시됨).
파일이 2개 이상 있으면 뷰어 오른쪽에 대시보드(모델 목록)가 나타나고, 클릭해서 보고 있는 모델을 바꿀 수 있습니다.
