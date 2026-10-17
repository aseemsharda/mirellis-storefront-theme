# Deploying the 17 October privacy changes to the live store

The live theme ("Mirellis at Work: For organisations nav 2026-10-16", ID 147052953666) is not connected to this repo, and this repo's `main` is a 4 September snapshot. Do **not** publish this repo over the live theme: it would remove a month of changes. Apply the edits below to a copy of the live theme instead.

Checked against the live theme on 17 October 2026: nine of the files below are byte-identical to the repo, so the edits match exactly. `layout/theme.liquid` and `sections/footer.liquid` differ from the repo elsewhere, but the lines edited here are the same in both.

## 0. Make a copy

Online Store → Themes → the live theme → **⋯ → Duplicate**. Do every step below in the copy (**⋯ → Edit code**).

## 1. Stop GA before consent — `layout/theme.liquid`

Find:
```
if (analyticsLoaded || !window.Shopify?.customerPrivacy?.analyticsProcessingAllowed()) return;
```
Replace with:
```
const visitor = window.Shopify?.customerPrivacy?.currentVisitorConsent?.();
if (analyticsLoaded || visitor?.analytics !== 'yes') return;
```

## 2. Add the newsletter notice snippet

Snippets → **Add a new snippet** → name it `mirellis-newsletter-notice` → paste the whole of `snippets/mirellis-newsletter-notice.liquid` from this repo → Save.

## 3. Show it in every newsletter form

In each file below, find the line shown and add this line **directly above it**:
```
{%- render 'mirellis-newsletter-notice' -%}
```

| File | Line to add it above |
|---|---|
| `sections/footer.liquid` | the `{%- endform -%}` right after the `render 'input', name: 'contact[email]'` line |
| `sections/newsletter-popup.liquid` | the second `{%- endform -%}` (the one after `contact[tags]`) |
| `sections/newsletter.liquid` | `{%- endform -%}` |
| `sections/main-blog.liquid` | both `{%- endform -%}` lines (two forms) |
| `sections/main-password.liquid` | the first `{%- endform -%}` |
| `sections/observatory-landing.liquid` | `{%- endform -%}` |
| `sections/observatory-article.liquid` | `{%- endform -%}` |
| `sections/community-stay-connected.liquid` | `{% endform %}` |

## 4. Contact page — `sections/contact.liquid`

Copy the `<p class="mirellis-form-notice">` paragraph (and the comment above it) from this repo's `sections/contact.liquid` and paste it in the same place: after the `contact[body]` input's closing `</div>`, before the submit button's `<div>`.

## 5. Product experience form — `sections/mirellis-participation-form.liquid`

Replace the file's contents with this repo's version. The file was identical to the live one before the change, so nothing else is lost. It corrects the note that said details are not shared with third parties (they go to Shopify and the courier) and points the privacy link at the store policy of record (`/policies/privacy-policy`) instead of the older August page at `/pages/privacy-policy`.

## 6. Check, then publish

Preview the copy and look at the footer, the contact page and `/pages/explore-your-rhythm`. Then publish it (**⋯ → Publish**).

## 7. Shopify settings (not theme code)

- **Settings → Customer privacy → Cookie banner:** turn it on for India and set it to require consent before tracking. Without this, the Google tag `GT-NBPNV7VB` (Google & YouTube channel) keeps sending to Merchant Center before any choice, and storefront GA cannot start because no one is ever asked.
- **Settings → Customer events:** delete the custom pixel that still sends to `G-1R1RFYJBJ8`. That is the directory's retired GA property; nothing should be reporting to it.
- **Settings → Policies → Privacy policy:** paste the HTML from `mirellis-directory/docs/operations/privacy-drafts/store-privacy-policy-v2.html` (use the editor's `<>` HTML view).

## Update, 17 October: done for you

The edits above are already applied in an unpublished theme, **"Privacy notices 2026-10-17"** (ID 147086278722), copied from the live theme, with every file checked against this repo by checksum. Preview it, then publish it from Online Store → Themes. Section 7 (Shopify settings) still needs doing by hand, and so does one more item: unpublish the old **Privacy Policy page** (`/pages/privacy-policy`, last edited August 2026) so the store has a single privacy policy.

The Google & YouTube channel also sends to `G-L0Y4QXC97D` on its own, so storefront GA keeps firing before consent until the cookie banner requires consent (section 7). The theme's own GA no longer does.

