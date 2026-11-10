# Coreprew Films: redesigned website

A faster, easier-to-use version of [coreprewfilms.com](https://www.coreprewfilms.com). It uses the same photos, prices and text, rebuilt around one goal: **help visitors check a date and contact you in as few taps as possible.**

It is plain HTML, CSS and JavaScript, with no WordPress, framework or database. It works on any web host.

## Preview it

Open `index.html` in a browser, or run a tiny local server from this folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Pages

| File | What's on it |
|---|---|
| `index.html` | Hero, what we shoot, recent work, packages, how booking works, films, clients, FAQ, booking form |
| `portfolio.html` | All 281 galleries in 5 simple categories, with search and "Show more" (24 at a time) |
| `services.html` | Services **and** pricing on one page (replaces the old separate Services and Packages pages) |
| `about-us.html` | Story, values, both studio locations |
| `contact-us.html` | Booking form, every contact method, maps for Sydney and Nepal, FAQ |

## What changed vs the current site

| Problem on current site | Fixed here |
|---|---|
| WhatsApp, Viber and phone links missing the country code (WhatsApp link broken) | `wa.me/61493843768`, `tel:+61…`, `+977…` everywhere |
| Portfolio ~40 MB, ~25 s to load, 200,000 px tall on mobile | 30 KB WebP thumbnails, 24 at a time. The page now loads about 1 MB |
| Homepage ~7.5 MB, 8-slide slider with a duplicate slide | 3 hand-picked photos; only the first loads up front. The homepage is now about 1 MB |
| 35+ messy portfolio categories (duplicate CONCERT, BRIDAL_SHOWER, HORNSBY…) | 5 clear groups with counts: Weddings, Cultural ceremonies, Engagements & couples, Birthdays & family, Commercial & events |
| Services and Packages split across two pages | One "Services & Pricing" page, with a "Book this package" button on every card that pre-fills the form |
| Unlabelled floating colour buttons | Labelled "Chat on WhatsApp" button on desktop; Call / WhatsApp / Check date bar on mobile |
| Contact map pointed to Nepal while showing a Sydney address | Separate, clearly labelled Sydney and Bhaktapur maps that load only when tapped |
| Typos (Photoghapher, Realstate, imaginary), visible `&nbsp;` | Copy cleaned up and rewritten in plain English |
| 14 `<h1>` tags, generic meta description, no social previews | One H1 per page, written descriptions, Open Graph tags, LocalBusiness schema |
| Booking dropdown listed 35 raw category names | 14 grouped options, and a Photo / Video / Both picker |

## How the booking form works

There's no server needed. When someone fills in the form and presses:

- **Send on WhatsApp**: WhatsApp opens with all their details already typed out to **+61 493 843 768**. They just press send.
- **Email instead**: their email app opens with a message to **coreprewfilms@gmail.com**, already filled in.

**Want enquiries to arrive without WhatsApp or email?** Add `data-endpoint="https://…"` to the `<form>` in `src/partials/booking-form.html` and rebuild. The form will then POST to that URL (for example a [Formspree](https://formspree.io) form, or your existing Laravel `/booknow/submit` route once CSRF is handled) and show a thank-you message.

## Editing the site

Shared pieces (header, footer, packages, FAQ, booking form, contact list) are written **once** in `src/partials/`, and each page's content is in `src/pages/`. After editing, run:

```bash
python3 build.py
```

This regenerates the five `.html` pages in this folder. Change prices in `src/partials/packages.html` and they update everywhere.

- **Colours and fonts:** the variables at the top of `assets/css/style.css`.
- **Portfolio list:** `assets/js/portfolio-data.js` (newest first). Add an entry and a 560px-wide `assets/img/work/<id>.webp` thumbnail. Each card links to the full gallery at `coreprewfilms.com/portfolio/<id>/details`.

## Before going live, please check

1. **Add real testimonials.** There's a ready-made section commented out in `src/pages/index.html`. Reviews are the biggest trust boost for a wedding photographer. Only use genuine ones.
2. **Travel in Australia.** The FAQ says "ask us for a quote" for travel inside Australia, because the current site only describes the Nepal travel policy.
3. **Package badges.** Gold is labelled "Full-day coverage" and Signature "Most complete". Change these to "Most popular" if that's true.
4. **Nepal number.** It's written as `+977 976 180 6355`, from `9761806355` on the current site.
5. **Clean URLs.** Canonical links assume `/portfolio`, `/services`, `/about-us` and `/contact-us`, matching the current site. Set your host to serve `portfolio.html` at `/portfolio` (most hosts have a "clean URLs" option), or keep the `.html` addresses and update `SITE_URL`/paths in `build.py`.
6. **Blog.** The footer links to the existing blog at coreprewfilms.com/blogs.
