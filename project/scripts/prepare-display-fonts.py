"""Optional asset maintenance: derive weight-400 display fonts from pinned Fontsource files.
Requires fonttools[woff] (fontTools + Brotli). Generated files are committed, so this
is not a runtime or ordinary build dependency. Retain public/licenses/Newsreader-OFL.txt.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[1]
for style in ("normal", "italic"):
    source = root / "node_modules/@fontsource-variable/newsreader/files" / f"newsreader-latin-wght-{style}.woff2"
    font = TTFont(source)
    instantiateVariableFont(font, {"wght": 400}, inplace=True)
    font.flavor = "woff2"
    destination = root / "src/assets" / f"newsreader-latin-{style}-400.woff2"
    font.save(destination)
    print(f"{destination.name}: {source.stat().st_size} -> {destination.stat().st_size} bytes")
