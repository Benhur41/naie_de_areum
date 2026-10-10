"""원본 사진을 홈페이지용 WebP 3종(480/800/1170px)으로 변환합니다.

사용법:
    python tools/optimize_images.py <원본파일> <출력경로(확장자·크기 제외)>

예:
    python tools/optimize_images.py ~/새사진/웨딩/IMG_1234.jpg images/wedding/daegu-wedding-nail-white-pearl-french
    → images/wedding/daegu-wedding-nail-white-pearl-french-{480,800,1170}.webp 생성

출력의 width/height 값을 <img>의 width/height 속성에 그대로 넣으세요(레이아웃 이동 방지).
필요: Python 3 + Pillow (pip install pillow)
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

WIDTHS = (480, 800, 1170)
QUALITY = 78


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    src, base = Path(sys.argv[1]).expanduser(), Path(sys.argv[2])
    base.parent.mkdir(parents=True, exist_ok=True)

    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")  # 휴대폰 사진 회전 정보 반영
    print(f"원본: {src.name} {im.width}x{im.height}")
    for w in WIDTHS:
        if w > im.width:
            print(f"  건너뜀: {w}px (원본보다 큼)")
            continue
        h = round(im.height * w / im.width)
        out = base.parent / f"{base.name}-{w}.webp"
        im.resize((w, h), Image.LANCZOS).save(out, "WEBP", quality=QUALITY, method=6)
        print(f"  {out.as_posix()}  width={w} height={h}  {out.stat().st_size // 1024}KB")


if __name__ == "__main__":
    main()
