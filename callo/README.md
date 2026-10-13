# Callo

A Progressive Web App for tracking nutritional and caloric intake. Scan a product's barcode,
look it up against [Open Food Facts](https://world.openfoodfacts.org) (free, no API key, strong
German/EU coverage), log how much you ate, and optionally sync it into Apple Health.

All data is stored locally on your device (IndexedDB) — there is no backend and no account.

## Developing

```sh
npm install
npm run dev
```

```sh
npm run build    # production build in dist/
npm run lint
npm run preview  # serve the production build locally
```

## Deploying

The build output in `dist/` is static — serve it from any web server. **HTTPS is required**:
both camera access (barcode scanning) and installing the app to an iPhone home screen require a
secure context with a trusted certificate (a self-signed cert will not work on iOS).

A minimal [Caddy](https://caddyserver.com/) config that serves the build with automatic
Let's Encrypt HTTPS and correctly falls back to `index.html` for client-side routes:

```
callo.example.com {
    root * /var/www/callo/dist
    encode gzip
    file_server
    try_files {path} /index.html
}
```

On iPhone, open the site in Safari, tap **Share → Add to Home Screen**, then launch it from the
home screen icon (there is no install-prompt API on iOS — this manual step is the only way to
install a PWA there).

## Apple Health sync

A web app cannot write to HealthKit directly — there is no browser API for it. Instead, each
**"Send to Health"** tap on a logged entry opens the **Shortcuts** app via a `shortcuts://`
deep link, handing it the entry's data as a pipe-delimited string:

```
<productName>|<kcal>|<proteinGrams>|<carbGrams>|<fatGrams>|<quantityGrams>|<isoTimestamp>
```

You build a matching Shortcut once, and the app's "Send to Health" button drives it from then on:

1. Open **Shortcuts** → New Shortcut → name it exactly what's configured in Callo's
   **Settings** page (default: `Log Nutrition`).
2. Add **Split Text** → Custom separator `|`. Input: *Shortcut Input*.
3. Pull out each field (in order: name, kcal, protein, carbs, fat, quantity, timestamp) with
   **Get Item from List** or **Set Variable**, one per field, for clarity.
4. Add a Health-logging action — look in the **Health** category for something like
   **Log Nutrition** / "Log Food" (the exact name and whether it's one combined action or
   separate per-nutrient actions varies by iOS version — use whatever your Shortcuts app
   actually offers). Map the variables into its Energy / Protein / Carbohydrates / Fat inputs.
5. If the action accepts a custom date, set it from the timestamp field so retroactive entries
   log with the right time.
6. Test it: run the Shortcut manually once with sample text, then confirm the entry shows up in
   the Health app under Nutrition.
7. In Callo, go to **Settings** and confirm the shortcut name matches exactly (case-sensitive).

The first time (and possibly every time, depending on iOS version) you trigger the link, iOS
shows an "Open in Shortcuts?" confirmation — that's expected OS behavior, not a bug.

### Known platform gotchas

- Camera access inside an **installed** (home-screen) PWA on iOS has historically been flakier
  than in a regular Safari tab — test the scanner specifically after "Add to Home Screen."
- iOS Safari can evict IndexedDB after long periods of disuse for regular browser tabs (less of
  a risk for installed home-screen apps, but use **Settings → Export data** periodically as a
  backup regardless, since this is the only copy of your data).
- Open Food Facts entries are crowdsourced — some products are missing fields (e.g. no fat
  value). Those show up blank in the confirm screen rather than silently defaulting to 0 — fill
  them in by hand when that happens.
