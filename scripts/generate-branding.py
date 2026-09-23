from PIL import Image
from pathlib import Path

src = Path(r"C:\Users\majol\OneDrive\Pictures\Crawford Logo.jpeg")
root = Path(r"C:\Users\majol\OneDrive\Documentos")
mobile = root / "mobile" / "assets"
web_public = root / "web" / "public"
app_dir = root / "web" / "src" / "app"
mobile.mkdir(parents=True, exist_ok=True)
web_public.mkdir(parents=True, exist_ok=True)
app_dir.mkdir(parents=True, exist_ok=True)

logo = Image.open(src).convert("RGBA")

def square(img, size, bg=None, pad_ratio=0.08):
    img = img.copy()
    side = max(img.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0) if bg is None else bg)
    x = (side - img.width) // 2
    y = (side - img.height) // 2
    canvas.paste(img, (x, y), img)
    inner = int(size * (1 - 2 * pad_ratio))
    canvas = canvas.resize((inner, inner), Image.Resampling.LANCZOS)
    out = Image.new("RGBA", (size, size), bg if bg else (0, 0, 0, 0))
    off = (size - inner) // 2
    out.paste(canvas, (off, off), canvas)
    return out

# App icon 1024
square(logo, 1024, bg=(255, 255, 255, 255), pad_ratio=0.06).save(mobile / "icon.png", "PNG")

# Adaptive icon (transparent bg)
square(logo, 1024, bg=(0, 0, 0, 0), pad_ratio=0.18).save(mobile / "adaptive-icon.png", "PNG")

# Splash — dark bg with crest centered
splash_size = (1284, 2778)
splash = Image.new("RGBA", splash_size, (9, 13, 22, 255))
crest = square(logo, 720, bg=(0, 0, 0, 0), pad_ratio=0.04)
cx = (splash_size[0] - 720) // 2
cy = (splash_size[1] - 720) // 2
splash.paste(crest, (cx, cy), crest)
splash.convert("RGB").save(mobile / "splash.png", "PNG")

# Shared in-app crest (transparent)
crest512 = square(logo, 512, bg=(0, 0, 0, 0), pad_ratio=0.02)
crest512.save(mobile / "crawford-crest.png", "PNG")
crest512.save(web_public / "crawford-crest.png", "PNG")

# Web logo assets
square(logo, 512, bg=(255, 255, 255, 255), pad_ratio=0.05).save(web_public / "logo.png", "PNG")
square(logo, 192, bg=(255, 255, 255, 255), pad_ratio=0.05).save(web_public / "logo-192.png", "PNG")

# Favicons
fav32 = square(logo, 64, bg=(255, 255, 255, 255), pad_ratio=0.04).resize((32, 32), Image.Resampling.LANCZOS)
fav32.save(web_public / "favicon-32.png", "PNG")
fav32.resize((16, 16), Image.Resampling.LANCZOS).save(web_public / "favicon-16.png", "PNG")
try:
    fav32.save(web_public / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
except Exception as e:
    print("web ico warning:", e)

# Next.js App Router icons
square(logo, 512, bg=(255, 255, 255, 255), pad_ratio=0.05).save(app_dir / "icon.png", "PNG")
try:
    fav32.save(app_dir / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
except Exception as e:
    print("app ico warning:", e)

for p in [
    mobile / "icon.png",
    mobile / "adaptive-icon.png",
    mobile / "splash.png",
    mobile / "crawford-crest.png",
    web_public / "logo.png",
    web_public / "crawford-crest.png",
    web_public / "favicon.ico",
    app_dir / "icon.png",
    app_dir / "favicon.ico",
]:
    print(p, p.stat().st_size)
