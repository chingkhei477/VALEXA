# Valexa — Cashback Platform (Front End)

A complete, working front end for a cashback platform: 15 pages, search/filter,
registration, login, a dashboard, cashback history, and profile management.
It runs entirely as static files — open `index.html` in a browser, or serve
the folder with any static host, and everything works.

## What's real right now

- All pages, navigation, and responsive layout are fully built and functional.
- Registration, login, session handling, and profile editing work end-to-end,
  backed by the browser's `localStorage` (see `js/auth.js`).
- Passwords are hashed (SHA-256 + per-user salt) before being stored — never
  in plain text.
- Cashback offers, categories, search and filtering are all live (`js/data.js`).
- The cashback tracking flow is real in structure: a logged-in user confirms
  an order amount on an offer page, and the platform calculates and logs
  cashback as **pending**, exactly as a real tracking pixel/postback would,
  just triggered manually instead of automatically (see `js/offer-details.js`).

## What a production launch still needs

This runs entirely in the browser, which is why two things are stubbed
rather than fully real — both are marked clearly in the code:

1. **A real backend for accounts and cashback data.** `js/auth.js` is
   written so every function already returns `{ ok, error, data }`, matching
   what an API response would look like. Swapping the `localStorage` reads
   and writes inside it for real HTTP calls to your own auth/database service
   is the only change needed — no page or other script needs to change.
2. **Real merchant tracking and payment integration.** Offer links in
   `js/data.js` are placeholders (`#`). Going live means replacing these
   with real affiliate/tracking links per merchant, and adding a webhook
   endpoint that receives order confirmations from partner networks
   automatically (instead of the manual "confirm your purchase" step used
   here) and a payout mechanism (UPI/bank transfer) for crediting real money.

## Structure

```
valexa/
├── index.html, offers.html, categories.html, offer-details.html
├── how-it-works.html, about.html, contact.html
├── login.html, register.html
├── dashboard.html, cashback-history.html, profile.html
├── terms.html, privacy.html, refund-policy.html
├── css/style.css
└── js/
    ├── config.js      — company contact details (fill in and it appears; leave blank and it's hidden)
    ├── data.js         — offers & categories data layer
    ├── auth.js         — accounts, sessions, cashback records
    ├── app.js          — shared header/footer, icons, UI helpers
    └── offers.js, offer-details.js, dashboard.js, history.js, profile.js
```

## Filling in your business details

Open `js/config.js` and set `phone`, `address`, and `openingHours`. Anything
left blank is automatically hidden from the footer and Contact page — the
site never ships with unfilled placeholder text.
