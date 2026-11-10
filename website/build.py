#!/usr/bin/env python3
"""Build the static site.

Pages live in src/pages/, shared pieces (header, footer, booking form, FAQ,
packages...) live in src/partials/. Edit those, then run:

    python3 build.py

and the finished pages (index.html, portfolio.html, ...) are written next to
this file. No dependencies beyond Python 3.8+.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
SITE_URL = "https://www.coreprewfilms.com"

JSONLD = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Coreprew Films",
    "alternateName": "Coreprew Photography Sydney",
    "description": "Photography and videography for weddings, cultural ceremonies, events, real estate and businesses in Sydney and Bhaktapur, Nepal.",
    "url": SITE_URL + "/",
    "logo": SITE_URL + "/assets/img/logo.webp",
    "image": SITE_URL + "/assets/img/hero/bride-1600.webp",
    "telephone": "+61493843768",
    "email": "coreprewfilms@gmail.com",
    "priceRange": "$250–$1,400",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mount Druitt",
        "addressRegion": "NSW",
        "postalCode": "2770",
        "addressCountry": "AU",
    },
    "areaServed": ["Sydney", "New South Wales", "Kathmandu Valley"],
    "sameAs": [
        "https://www.instagram.com/coreprewphotographysydney/",
        "https://www.facebook.com/coreprewsydney/",
        "https://www.tiktok.com/@coreprew",
        "https://www.youtube.com/@coreprewphotographysydney",
    ],
}


def partial(name: str) -> str:
    return (SRC / "partials" / f"{name}.html").read_text(encoding="utf-8")


def expand(text: str, depth: int = 0) -> str:
    if depth > 5:
        raise RuntimeError("partials nested too deeply")
    return re.sub(r"\{\{>\s*([\w-]+)\s*\}\}", lambda m: expand(partial(m.group(1)), depth + 1), text)


def fill(text: str, vars_: dict) -> str:
    def rep(m):
        key = m.group(1)
        if key not in vars_:
            raise KeyError(f"missing template value: {key}")
        return str(vars_[key])
    return re.sub(r"\{\{\s*(\w+)\s*\}\}", rep, text)


def esc_attr(s: str) -> str:
    return s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def build_page(src: Path) -> str:
    raw = src.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--meta\s*(\{.*?\})\s*-->\s*", raw, re.S)
    if not m:
        raise ValueError(f"{src.name}: missing <!--meta {{...}} --> block")
    meta = json.loads(m.group(1))
    body = expand(raw[m.end():])

    head_extra = ""
    if meta.get("jsonld"):
        head_extra = '  <script type="application/ld+json">' + json.dumps(JSONLD, ensure_ascii=False) + "</script>"
    if src.stem == "index":
        hero = "assets/img/hero/bride-1600.webp"
        head_extra += (
            f'\n  <link rel="preload" as="image" href="{hero}" '
            'imagesrcset="assets/img/hero/bride-900.webp 900w, assets/img/hero/bride-1600.webp 1400w" imagesizes="100vw" fetchpriority="high">'
        )
    scripts = "\n".join(f'<script src="{s}" defer></script>' for s in meta.get("scripts", []))

    vars_ = {
        "title": esc_attr(meta["title"]),
        "description": esc_attr(meta["description"]),
        "path": meta["path"],
        "site_url": SITE_URL,
        "og_image": meta.get("og_image", "bride"),
        "head_extra": head_extra,
        "scripts": scripts,
    }
    out = [
        fill(partial("head"), vars_),
        f'<body data-page="{meta.get("nav", "")}" class="{meta.get("body_class", "")}">',
        (SRC / "partials" / "icons.svg").read_text(encoding="utf-8"),
        partial("header"),
        '<main id="main">',
        body.rstrip(),
        "</main>",
        fill(partial("footer"), vars_),
    ]
    html = "\n".join(out)
    leftover = re.findall(r"\{\{[^}]*\}\}", html)
    if leftover:
        raise ValueError(f"{src.name}: unfilled placeholders {leftover}")
    return html


def main():
    for src in sorted((SRC / "pages").glob("*.html")):
        dest = ROOT / src.name
        dest.write_text(build_page(src), encoding="utf-8")
        print(f"built {dest.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
