"""
slides/ 폴더의 발표자료에서 슬라이드 목록과 전환 효과를 읽어
slides/manifest.json 을 생성한다.

- .pptx : 파일 안에 저장된 실제 전환효과(<p:transition>)를 그대로 읽어온다.
- .pdf  : 전환 정보가 존재하지 않는 포맷이므로 전부 기본값(fade 600ms)을 쓴다.

pptx에서 지원(방향/속도까지 원본과 동일하게 재현):
  fade, cut, zoom, push, cover, uncover, wipe, blinds, split

미지원(자동으로 fade로 대체됨 — CSS로 재현 불가능한 3D/렌더링 계열):
  morph, cube, vortex, honeycomb, ripple, gallery, doors, window,
  ferris, conveyor, wheel(복잡한 회전형), 기타 인식 못하는 모든 효과
"""
import glob
import json
import os
import re

from pptx import Presentation
from pptx.oxml.ns import qn

# pptx 전환 태그 -> (우리 CSS 이펙트, 방향 사용 여부, 역방향 여부)
EFFECT_MAP = {
    "fade":    ("fade", False, False),
    "cut":     ("cut", False, False),
    "zoom":    ("zoom", False, False),
    "push":    ("push", True, False),
    "cover":   ("push", True, False),
    "pull":    ("push", True, True),
    "uncover": ("push", True, True),
    "wipe":    ("push", True, False),
    "blinds":  ("push", True, False),
    "split":   ("push", True, False),
}

SPEED_MS = {"slow": 1000, "med": 750, "fast": 500}

DEFAULT_TRANSITION = {"effect": "fade", "direction": None, "reverse": False, "duration": 600}


def slide_transition(slide):
    sld = slide._element
    trans = sld.find(qn("p:transition"))
    if trans is None:
        return dict(DEFAULT_TRANSITION)

    dur_attr = trans.get("dur")
    spd_attr = trans.get("spd", "fast")
    duration = int(dur_attr) if dur_attr else SPEED_MS.get(spd_attr, 500)

    effect_el = None
    for child in trans:
        tag = child.tag.split("}")[-1]
        if tag in ("sndAc", "extLst"):
            continue
        effect_el = child
        break

    if effect_el is None:
        return {**DEFAULT_TRANSITION, "duration": duration}

    tag = effect_el.tag.split("}")[-1]
    mapped, uses_dir, reverse = EFFECT_MAP.get(tag, ("fade", False, False))
    direction = effect_el.get("dir") if uses_dir else None

    return {"effect": mapped, "direction": direction, "reverse": reverse, "duration": duration}


def slide_num(path):
    m = re.search(r"-(\d+)\.png$", path)
    return int(m.group(1)) if m else 0


def image_prefix(source_path):
    """워크플로우가 이미지를 저장할 때 쓴 접두어와 동일한 규칙.

    확장자를 접두어에 포함시켜(deck_pptx / deck_pdf) 같은 이름의
    pptx와 pdf가 함께 있어도 이미지가 서로 덮어써지지 않게 한다.
    """
    base = os.path.basename(source_path)
    stem, ext = os.path.splitext(base)
    return f"{stem}_{ext.lstrip('.').lower()}"


def main():
    manifest = []
    sources = sorted(glob.glob("slides/*.pptx") + glob.glob("slides/*.pdf"))

    for source_path in sources:
        prefix = image_prefix(source_path)
        images = sorted(glob.glob(f"slides/images/{prefix}-*.png"), key=slide_num)

        if source_path.lower().endswith(".pptx"):
            slides = list(Presentation(source_path).slides)
            for i, image_path in enumerate(images):
                info = slide_transition(slides[i]) if i < len(slides) else dict(DEFAULT_TRANSITION)
                manifest.append({"file": os.path.basename(image_path), **info})
        else:
            # pdf에는 전환 정보가 없다 -> 전부 기본값
            for image_path in images:
                manifest.append({"file": os.path.basename(image_path), **DEFAULT_TRANSITION})

        print(f"{source_path}: {len(images)} slides")

    with open("slides/manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"Wrote manifest.json with {len(manifest)} slides from {len(sources)} file(s)")


if __name__ == "__main__":
    main()
