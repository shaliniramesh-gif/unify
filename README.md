# UNIFY - Kirana Shop Reconciliation & Daily Alert Engine

A vendor-neutral, mobile-first web app (Capacitor-ready) built with plain HTML, CSS, and vanilla JavaScript that reconciles a neighbourhood kirana or home-based seller's sales records against incoming digital payments.

---

## 1. What This Is
Neighbourhood kirana owners and home-based sellers accept payments via cash, UPI, marketplace payouts, and customer credit (khata). Bills and payments are rarely cross-checked, leading to uncollected credit or forgotten sales.

**UNIFY flags exactly three mismatch exceptions:**
1. **Payment with no bill**: Digital payment arrived in bank/UPI, but no sale was recorded.
2. **Bill with no payment**: Digital or credit bill recorded, but no payment ever arrived.
3. **Possible duplicate**: Identical amount entered twice within 5 minutes with only one payment.

*It is an alert tool only. It gives no tax advice and no legal advice. Unrecorded cash cannot be seen.*

---

## 2. Sample Data Notice
> ⚠️ **Permanent Banner:** "Sample data written by the team to test the logic. Not real shop records."

The app loads 20 synthetic sales bills and 10 synthetic payments for 26 Oct 2026 planting the exact benchmark cases:
- One UPI payment (Rs 450, 4:12 PM) with no bill.
- Credit bill B104 (Rs 820, Ramesh) with no payment.
- Two identical UPI bills (Rs 250, 11:05 and 11:06 AM) with only one payment.
- Credit bill Rs 1,200 (Lakshmi) paid later by Lakshmi at 6:10 PM.
- 9 Cash bills counted as "Cash (cannot verify)".

---

## 3. Key Features Built
- **Dashboard & Exception Cards**: Large "Items to review" counter, stat cards, color-coded red/amber/blue exception cards with amount, time, and reason.
- **English & தமிழ் (Tamil) Support**: Dedicated language switcher using fixed templates (no machine translation).
- **PDF Bill Summary Generator**: Pure vanilla JavaScript PDF-1.4 binary generator (no external libraries) creating clean downloadable reconciliation reports.
- **Direct WhatsApp Sharing**: Formatted daily alert sent directly via WhatsApp click-to-chat (`https://wa.me/?text=...`) or native mobile share.
- **Records Table**: Full searchable records view with status pills (`Matched`, `Cash`, `Unpaid`, `Duplicate`, `No Bill`) and horizontal scrolling for mobile.
- **Local CSV Import**: In-browser CSV parser supporting quotes, CRLF, currency symbols (`Rs 1,200`), and alias matching without any server uploads.
- **Tunable Settings**: `WINDOW_MIN` (default 60m), `DUP_MIN` (default 5m), `CREDIT_MAX_DAYS` (default 7d), and customizable shop name.

---

## 4. Built Now vs Planned

| Built Now | Planned for Future Pilots |
| :--- | :--- |
| Single-page mobile app in pure vanilla JS | Scheduled background daily automated run |
| Reconciliation matching for 3 mismatch types | Connectors for UPI QR soundboxes & POS apps |
| English & Tamil text templates | Fuzzy name matching for spelling differences |
| PDF summary generation & WhatsApp sharing | Part-payment splitting and multi-bill allocations |
| In-browser CSV import with row validation | Sudden-drop-in-sales anomaly detection |
| LocalStorage persistence and dark mode | Multi-store aggregation and cloud sync |

---

## 5. How to Run in the Browser
Simply start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in any modern browser (or inspect with mobile width 375px in DevTools).

---

## 6. How to Run Automated Diagnostic Tests
UNIFY includes 28 rule tests covering exact matching, timing edge cases, midnight crossing, duplicate detection, and parser resilience.

- **Option A (In-Browser UI):** Go to the **Limits** tab and click **"Run All 28 Tests"**.
- **Option B (Browser Console):** Open browser Developer Tools (`F12`), switch to the Console tab, and run:
  ```js
  runTests();
  ```
- **Option C (Dedicated HTML Runner):** Open `tests/tests.html` in your browser.

---

## 7. How to Build the Android App with Capacitor
UNIFY requires no build step. The `www/` folder contains everything needed.

```bash
# 1. Initialize Capacitor in the project root
npm init -y
npm i @capacitor/core @capacitor/cli

# 2. Configure Capacitor pointing to the www directory
npx cap init UNIFY com.unify.app --web-dir=www

# 3. Add Android platform
npm i @capacitor/android
npx cap add android

# 4. Sync web assets
npx cap sync

# 5. Open in Android Studio to build APK or run on emulator/phone
npx cap open android
```

*Note: After any changes in `www/index.html`, run `npx cap sync` before deploying to Android.*
