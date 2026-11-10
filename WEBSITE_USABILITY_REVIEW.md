# coreprewfilms.com — Usability Review

Reviewed 10 Nov 2026 on desktop (1366px) and on an emulated iPhone 13. Pages checked: Home, About, Portfolio, Services, Blog, Packages, Contact.

## What already works
- Clear top menu, with a "Book Now" button that is always visible.
- Prices are shown publicly (Birthday $500, Silver $1,200, Gold $1,400 AUD). Most competitors hide theirs, so this builds trust.
- Callback and Book Now forms use the right input types (email, tel, a date picker that blocks past dates).
- An FAQ that answers real booking questions, client logos, and social links.
- No horizontal scrolling on mobile, and the text is a readable 16px.

---

## 🔴 Fix first (these cost you bookings)

| # | Problem | Fix |
|---|---|---|
| 1 | **WhatsApp, Viber and call buttons use `0493843768` with no country code.** The WhatsApp link `api.whatsapp.com/send?phone=0493843768` does not open a chat, and overseas visitors (including Nepal) cannot call the `tel:` link. | Use `https://wa.me/61493843768`, `viber://chat?number=%2B61493843768` and `tel:+61493843768`. Add `+977` to the Nepal number. |
| 2 | **The Portfolio page is far too heavy:** about 310 requests and ~40 MB, taking ~25 s to load. On mobile it is about 200,000 px tall. Most visitors on phone data will leave before it finishes. | Show 12–24 projects with a "Load more" button or pages. Lazy-load the thumbnails (none of the 8 `<img>` tags have `loading="lazy"`; the rest are background images). Resize thumbnails to about 600px wide. |
| 3 | **The homepage hero images are oversized** (1.6 MB and 1.3 MB for single slides; 7.5 MB for the whole page). On mobile the hero showed a black screen for several seconds before the photo appeared. | Export slider images at 1920px wide (≤300 KB WebP) plus a 1080px version for mobile using `srcset`. Load only the first slide right away. |
| 4 | **The contact map points to Bhaktapur, Nepal ("COREprew Audio Video Mill"), but the address shown is Mount Druitt, NSW.** Sydney clients will be confused. | Show the Sydney location (or both, clearly labelled "Sydney HQ" and "Nepal studio"). |
| 5 | **The floating red, purple and green side buttons have no text label or `aria-label`.** First-time visitors do not know what they do, and screen readers announce nothing. On mobile they also cover part of the hero and its buttons. | Use one floating "Chat / Call" button that expands into WhatsApp, Viber and Call, with labels. Move it to the bottom-right corner. |

## 🟠 Clarity & trust

6. **The hero slider has 8 slides and repeats itself**: "PREGNANCY" and "PREGNANCY SHOOT" are back to back, and most slides have no subtitle. Use 3–4 slides, or one strong video loop. Give it a single headline that says what you do and where, for example: *"Wedding, Event & Portrait Photography in Sydney & Nepal"*, with one main button: **Check my date**.
7. **No testimonials or reviews anywhere.** This is the biggest trust gap for a wedding photographer. Add 3–6 quotes with the couple's photo, plus your Google review rating and a link to your reviews.
8. **"Services", "Packages" and "Services & Pricing" overlap.** Merge them into a single **Services & Pricing** menu item, with each service linking to its packages. A shorter menu reads as: *Portfolio · Services & Pricing · About · Blog · Contact · [Book Now]*.
9. **Package cards**: the "Silver 6hrs" card has a grey placeholder with no image. List what is included in the same order on every card (hours, photographers, videographers, number of photos, delivery time). Mark one package as "Most popular". The Real Estate packages (Elevate, Launch, Prestige, Signature) are hidden behind a tab, so give them their own section.
10. **The Portfolio filter has 35+ categories** in mixed formats: "CONCERT" appears twice, "BRIDAL_SHOWER" has an underscore, "HORNSBY" is a suburb, and "REALSTATE" is misspelt. Group them into about 6: *Weddings · Engagements & Pre-wedding · Cultural Ceremonies (Pasni, Bratabandha, Gufa…) · Birthdays & Events · Portraits & Maternity · Commercial & Real Estate*.
11. **Latest Works** shows 4 photos and then 1 orphan photo on its own row. Show 4 or 8.
12. **The blog was last updated Oct 2023.** Post regularly (short "featured wedding" stories also help SEO), or hide the dates.

## 🟡 Text fixes (quick wins)

- "Photoghapher" → **Photographer** (Home and Packages pages)
- "Realstate" / "REALSTATE" → **Real Estate** (Services, Portfolio, Packages)
- "stunning imaginary" → **stunning imagery** (Services → Real Estate)
- Raw code shows as text on the Services page: `&nbsp;` and `&amp;`. Clean up the descriptions in the admin panel.
- "About-Coreprewfilms" heading → **About Coreprew Films**
- Footer heading "- Creative Photo & Video Studio" starts with a stray dash, so the brand name is missing in front of it.
- The AU and NP phone numbers appear twice on the Contact page.
- Use the same spelling of the brand name everywhere ("Coreprew Films", not "Coreprew films" or "COREprew").

## 🟢 SEO & technical

- **Meta description** is only "Coreprew Films — Photography & Videography". Write about 150 characters naming Sydney, weddings and the Nepali ceremonies you specialise in.
- **The homepage has 14 `<h1>` tags** (one per slide and section). Keep one H1 per page and make the others H2.
- **No Open Graph tags**, so shared links on Facebook, WhatsApp and Instagram appear with no preview image. Add `og:title`, `og:description` and `og:image`.
- **No LocalBusiness schema and no canonical tag.** Add JSON-LD (`LocalBusiness` / `ProfessionalService` with address, phone and `sameAs` social links) to help Google Maps and local search.
- **Image alt text is generic** ("Client", "Recent work"). Describe what is in each photo, for example "Hindu wedding ceremony in Sydney – Ganga & Hussein".
- The favicon is a large PNG. Provide 32×32 and 180×180 (Apple touch) versions.
- `toastr.js/latest` is loaded without a pinned version, so a future release could break the site. Pin it (e.g. `2.1.4`).
- The page loads about 15 jQuery-era plugins (animsition, isotope, owl, YTPlayer, lightgallery…). Load YouTube and the gallery only on pages that use them.

---

## Suggested homepage order
1. **Hero** – one headline + "Check my date" button + small "★ 4.9 from 120 Google reviews"
2. **What we shoot** – 6 tiles (Weddings, Cultural ceremonies, Pre-wedding, Events, Portraits/Maternity, Commercial/Real Estate)
3. **Featured work** – 8 photos + 1 showreel video
4. **Packages** – 3 cards, one marked "Most popular", with "Custom package? Talk to us"
5. **Testimonials**
6. **How booking works** – 1) Enquire 2) Get a quote 3) Pay deposit 4) Shoot day 5) Gallery delivered in X weeks
7. **FAQ**
8. **Final CTA** – short form (name, date, event type, phone) + WhatsApp button
9. **Footer** – address, phone, email, hours, socials, service areas (Sydney, NSW, Nepal)

## Priority checklist
- [ ] Fix WhatsApp, Viber and phone links (+61 / +977)
- [ ] Fix the contact map location
- [ ] Paginate and compress the Portfolio
- [ ] Compress hero images and cut the slider to 3–4 slides
- [ ] Label the floating contact buttons
- [ ] Fix typos and visible `&nbsp;` / `&amp;`
- [ ] Add testimonials and Google review rating
- [ ] Merge Services and Packages
- [ ] Simplify portfolio categories
- [ ] Meta description, single H1, Open Graph, LocalBusiness schema
