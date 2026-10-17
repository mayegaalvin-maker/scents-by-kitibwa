# Scents By Kitiibwa

A React and Vite storefront for fragrances, cosmetics and skincare in Kampala.

## Run locally

```powershell
npm install
npm run dev
```

Create a production build with `npm run build`; use `npm run preview` to inspect that build locally.

## Publish with GitHub Pages

The site is published at https://mayegaalvin-maker.github.io/scents-by-kitibwa/. GitHub Actions builds and deploys updates whenever changes are pushed to `main`.

## Product listings

Open **Owner** in the site navigation, create an owner PIN on the first visit, then add listings with up to five product photos, category, price, currency and description. Listings can be edited or removed. Photos are resized in the browser before they are stored.

This starter stores its catalog and PIN hash in the current browser's local storage. The PIN is only a convenience lock, not server-side authentication, and catalog edits are not shared with other devices or website visitors. A shared database, image storage and server-side owner authentication are required before publishing owner-managed product updates to customers.
