"""원본 사진을 홈페이지용 WebP 3종(-480 / -800 / -1170)으로 변환합니다.

사용법:
    python tools/optimize_images.py <원본파일> <출력경로(확장자·크기 제외)>

예:
    python tools/optimize_images.py ~/새사진/웨딩/IMG_1234.jpg public/images/wedding/daegu-wedding-nail-white-pearl-french
    → public/images/wedding/daegu-wedding-nail-white-pearl-french-{480,800,1170}.webp 생성
    (HTML 에서는 public/ 을 뺀 images/... 경로로 씁니다)

- 파일 이름 끝의 숫자는 "크기 단계"입니다. 원본이 1170px보다 좁으면 `-1170` 파일은
  원본 폭 그대로 저장되므로, srcset 에는 출력에 표시된 **실제 폭**(예: 1125w)을 쓰세요.
- 출력의 width/height 값을 <img>의 width/height 속성에 그대로 넣으세요(레이아웃 이동 방지).
- 필요: Python 3 + Pillow (pip install pillow)
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

STEPS = (480, 800, 1170)
QUALITY = 78


def optimize(src, base, method=6):
    """src 를 변환해 [(파일경로, 실제폭, 실제높이), ...] 를 돌려준다."""
    src, base = Path(src).expanduser(), Path(base)
    base.parent.mkdir(parents=True, exist_ok=True)
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")  # 휴대폰 사진 회전 정보 반영
    results = []
    for step in STEPS:
        w = min(step, im.width)
        h = round(im.height * w / im.width)
        out = base.parent / f"{base.name}-{step}.webp"
        im.resize((w, h), Image.LANCZOS).save(out, "WEBP", quality=QUALITY, method=method)
        results.append((out, w, h))
    return results


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    print(f"원본: {Path(sys.argv[1]).name}")
    for out, w, h in optimize(sys.argv[1], sys.argv[2]):
        print(f"  {out.as_posix()}  width={w} height={h}  {out.stat().st_size // 1024}KB")


if __name__ == "__main__":
    main()
