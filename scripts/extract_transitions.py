"""
slides/*.pptx 안에 저장된 실제 전환효과(<p:transition>)를 읽어서
slides/manifest.json 을 생성한다.

지원(방향/속도까지 원본과 동일하게 재현):
  fade, cut, zoom, push, cover, uncover, wipe, blinds, split

미지원(자동으로 fade로 대체됨 — CSS로 재현 불가능한 3D/렌더링 계열):
  morph, cube, vortex, honeycomb, ripple, gallery, doors, window,
  ferris, conveyor, wheel(복잡한 회전형), 기타 인식 못하는 모든 효과
"""
import glob
import json
import os
import re
import sys

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


def slide_transition(slide):
    sld = slide._element
    trans = sld.find(qn("p:transition"))
    if trans is None:
        return {"effect": "fade", "direction": None, "reverse": False, "duration": 600}

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
        return {"effect": "fade", "direction": None, "reverse": False, "duration": duration}

    tag = effect_el.tag.split("}")[-1]
    mapped, uses_dir, reverse = EFFECT_MAP.get(tag, ("fade", False, False))
    direction = effect_el.get("dir") if uses_dir else None

    return {"effect": mapped, "direction": direction, "reverse": reverse, "duration": duration}


def slide_num(path):
    m = re.search(r"-(\d+)\.png$", path)
    return int(m.group(1)) if m else 0


def main():
    manifest = []
    for pptx_path in sorted(glob.glob("slides/*.pptx")):
        base = os.path.splitext(os.path.basename(pptx_path))[0]
        images = sorted(glob.glob(f"slides/images/{base}-*.png"), key=slide_num)

        prs = Presentation(pptx_path)
        slides = list(prs.slides)

        for i, image_path in enumerate(images):
            info = (
                slide_transition(slides[i])
                if i < len(slides)
                else {"effect": "fade", "direction": None, "reverse": False, "duration": 600}
            )
            manifest.append({"file": os.path.basename(image_path), **info})

    with open("slides/manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"Wrote manifest.json with {len(manifest)} slides")


if __name__ == "__main__":
    main()
