# UNIFY MASTER PROMPT (paste everything below into your coding AI)

## 0. YOUR ROLE AND HOW TO WORK

You are a senior developer pair-programming with a first-year B.Tech CSE student.
The student knows HTML, CSS and JavaScript, and is learning Python and DSA.
The student must be able to explain EVERY line to hackathon judges.

Rules for how you write code:
- Use plain HTML, CSS and vanilla JavaScript (ES modules are fine). No React, no Vue, no TypeScript, no bundler.
- No backend, no server, no database server, no login, no cloud.
- No machine learning. No external AI API. Matching is rule-based only.
- Short functions (max about 25 lines). One job per function.
- Meaningful names. A one-line comment above every function saying what it does and why.
- Put every tunable number in ONE settings object. Never hide numbers inside logic.
- No clever one-liners. Prefer for-loops over long chains of map/filter/reduce.
- Never invent library names, plugin names or API features. If unsure, say so in a comment: // VERIFY.
- Build step by step in the order in section 13. After each step, tell the student what to test in the browser before moving on.

## 1. WHAT UNIFY IS

UNIFY is a vendor-neutral reconciliation and alert tool for neighbourhood kirana shops and home-based sellers.
These owners take money by cash, UPI, marketplace payouts and credit (khata), and write sales in a notebook or a basic billing app.
Those two records never get cross-checked.

UNIFY reads two simple files (sales and payments), matches them, and shows the owner a plain-language daily alert in Tamil or English.

It flags exactly THREE things:
1. PAYMENT WITH NO BILL: money arrived, no sale recorded.
2. BILL WITH NO PAYMENT: a digital or credit bill with no matching payment (credit given and forgotten).
3. POSSIBLE DUPLICATE: the same amount logged twice within a few minutes, with only one payment.

It is an ALERT tool only. It gives no tax advice and no legal advice.
It cannot see cash that was never recorded, and it must say so in the app.

## 2. HONESTY RULES (very important, judges reward honesty)

- Every screen that shows sample data must show a visible banner: "Sample data written by the team. Not real shop records."
- Never write "100% accurate", "AI-powered", "guaranteed", "compliant", or "every rupee verified" anywhere in the UI or code comments.
- Flags are called "possible" mismatches. The owner decides.
- Cash bills are counted but NEVER flagged and NEVER called "verified". Label them "Cash (cannot verify)".
- The Limits screen (section 8.5) must always be reachable from the bottom navigation.
- Anything not built must NOT appear as a working button. Put it in a "Planned" list on the Limits screen instead.
- Do not claim any real billing app or bank has an API or export format. CSV import is generic.

## 3. TECH CONSTRAINTS

Built now:
- Single-page app, mobile-first, works in a phone browser.
- Data lives in memory plus localStorage (private to the device).
- CSV import done in the browser with the File API and a small hand-written parser (no library).
- Wrapped as an Android app with Capacitor (section 10).

Planned (show only on the Limits screen, never as working features):
- Automatic daily run on a schedule.
- Real SMS or WhatsApp delivery.
- Connectors for specific billing apps and UPI platforms.
- Name matching that tolerates spelling differences.
- Part-payment handling.
- Sudden-drop-in-sales detection.

## 4. FILE STRUCTURE (create exactly this)

```
unify-app/
  www/
    index.html          page shell, bottom nav, script tags
    css/style.css       all styles, CSS variables for theme
    js/settings.js      the SETTINGS object (all tunable numbers)
    js/sampleData.js    the 30 synthetic records (20 bills + 10 payments)
    js/csv.js           CSV text -> array of row objects, header detection
    js/normalize.js     raw rows -> clean bill and payment objects
    js/matcher.js       the reconciliation logic (pure functions, no DOM)
    js/i18n.js          English and Tamil text templates
    js/storage.js       localStorage save and load helpers
    js/ui.js            rendering functions (DOM only, no matching logic)
    js/app.js           starts the app, wires buttons to functions
    tests/tests.html    open in browser, runs assert tests, shows pass or fail
    tests/tests.js      the test cases (section 11)
  capacitor.config.json
  package.json
  README.md             how to run, how to test, what is built vs planned
```

Rules:
- matcher.js must NOT touch the DOM. It takes arrays in, returns a result object out. That is what makes it testable.
- ui.js must NOT contain matching rules.
- Load scripts with <script type="module"> and import/export.
- If ES modules fail from file:// on the phone browser, tell the student to use `npx serve www` for local testing.

## 5. DATA FORMATS

### 5.1 Clean bill object (after normalising)
```
{
  id: "B101",              // generated if missing, B + running number
  time: Date,              // full date and time, so midnight crossing works
  amount: 250,             // positive number, rupees
  mode: "cash" | "upi" | "marketplace" | "credit",
  customer: "Ramesh" | ""  // used for credit only
}
```

### 5.2 Clean payment object
```
{
  id: "P1",
  time: Date,
  amount: 250,
  channel: "upi" | "marketplace" | "cash",
  payer: "Lakshmi" | "",
  matchedBillId: null      // filled by the matcher
}
```

### 5.3 Result object returned by the matcher
```
{
  summary: { bills, payments, matchedDigital, cashUnverified, flagged },
  paymentsWithNoBill: [payment, ...],
  billsWithNoPayment: [bill, ...],
  possibleDuplicates: [ { first: bill, second: bill }, ... ],
  matches: [ { billId, paymentId, minutesApart }, ... ],
  skipped: [ { rowNumber, file, reason }, ... ]   // bad rows, see section 5.5
}
```

### 5.4 CSV file formats the app accepts

sales.csv (header names are matched case-insensitively, ignoring spaces):
- date: aliases: date, day
- time: aliases: time, timestamp
- amount: aliases: amount, total, rs, rupees, value
- mode: aliases: mode, type, payment_mode, method
- customer: aliases: customer, name, party

payments.csv:
- date, time, amount (same aliases as above)
- channel: aliases: channel, mode, source, method
- payer: aliases: payer, from, name, sender

Details:
- Accept date as YYYY-MM-DD or DD-MM-YYYY or DD/MM/YYYY.
- Accept time as HH:MM (24-hour) or HH:MM AM/PM.
- If there is a single column called "datetime" or "timestamp", split it.
- Accept amount with commas or an "Rs" prefix, e.g. "1,200" or "Rs 450". Strip those.
- Mode values: map "cash", "upi", "gpay", "phonepe", "paytm" all to the right bucket. Put the mapping table in settings.js so the student can edit it.
  - cash -> cash
  - upi, gpay, phonepe, paytm, qr -> upi
  - marketplace, payout, online -> marketplace
  - credit, khata, udhar -> credit
- Unknown mode values: skip the row and add a reason (section 5.5).

### 5.5 Bad rows (never crash, always explain)
Skip the row and record it in result.skipped with a plain reason when:
- amount is blank or not a number -> "Amount missing or not a number"
- amount is zero or negative -> "Refund or zero amount, not handled yet"
- date or time cannot be read -> "Date or time not readable"
- mode or channel unknown -> "Unknown payment type"
Also handle an empty file (show "File has no rows") and a file with a header but no data.
Show the skipped count on the Today screen with a tap to see the reasons.

## 6. THE MATCHING LOGIC (matcher.js) - THE HEART OF THE PROJECT

Settings used (all from settings.js):
```
WINDOW_MIN = 60     // a digital payment matches a bill if within 60 min either side
DUP_MIN = 5         // same-amount bills within 5 min can be a possible duplicate
CREDIT_MAX_DAYS = 7 // a credit payment can arrive up to 7 days after the bill
```
These are the team's GUESSES. Add a comment saying "to be tuned with real shops".

### 6.1 Order of work
1. Sort bills by time (oldest first). Sort payments by time.
2. Count cash bills. They are recorded but cannot be verified. Never flag them.
3. Match digital bills (upi, marketplace) to payments.
4. Match credit bills to payments.
5. Anything left unmatched is classified (steps 6 to 8).
6. Leftover payments -> paymentsWithNoBill.
7. Leftover non-cash bills -> check duplicate rule first, otherwise billsWithNoPayment.
8. Build the summary.

### 6.2 Matching a digital bill (upi or marketplace)
For each bill in time order:
- Look at payments that are not yet used, have exactly the same amount, and have the SAME channel as the bill mode (a upi bill must not match a marketplace payment).
- Keep only those within WINDOW_MIN minutes of the bill (before or after, use absolute difference).
- Among those, pick the one closest in time.
- If found: mark the payment used, store matchedBillId, record the match.
- If not found: leave the bill for step 7.

### 6.3 Matching a credit bill
- The payment must have the same amount.
- The payer name must equal the bill customer, compared case-insensitively after trimming spaces.
- The payment time must be AFTER or equal to the bill time.
- The payment must be within CREDIT_MAX_DAYS days of the bill.
- Pick the earliest qualifying unused payment.
- Known limits (write them in the Limits screen): "Ramesh K" will not match "Ramesh"; part-payments will not match.

### 6.4 Possible duplicate rule (runs AFTER matching, on leftover bills only)
A leftover (unmatched) non-cash bill is a POSSIBLE DUPLICATE when there is another bill that:
- has the same amount and the same mode,
- is within DUP_MIN minutes of it,
- and WAS matched to a payment.
Then record { first: matchedBill, second: leftoverBill } in possibleDuplicates and do NOT also list it as "bill with no payment".

Why this order: two genuine sales of Rs 250 a minute apart, both paid, are both matched and never flagged.
Two bills of Rs 250 with only one payment are flagged as a possible duplicate.
Explain this reasoning in a comment in the code.

Cash duplicates are ignored by design (cash cannot be verified). Say so in the Limits screen.

### 6.5 Leftover payments
Every payment that is still unused after steps 3 and 4 goes into paymentsWithNoBill.
Cash-channel payments, if present in the file, are not flagged (same reason as cash bills).

### 6.6 Summary numbers
- bills: total number of valid bills
- payments: total number of valid payments
- matchedDigital: number of bills matched to a payment
- cashUnverified: number of cash bills
- flagged: paymentsWithNoBill.length + billsWithNoPayment.length + possibleDuplicates.length

### 6.7 Expected result on the sample data (use as a test)
Running the 30 sample records must give exactly:
- flagged = 3
- paymentsWithNoBill: one payment of Rs 450 at 4:12 PM (upi)
- billsWithNoPayment: B104, Rs 820, customer Ramesh
- possibleDuplicates: B105 (11:05) and B106 (11:06), Rs 250
- matchedDigital = 9 (includes the Lakshmi credit bill of Rs 1200, matched to the 6:10 PM payment)
- cashUnverified = 9

## 7. LANGUAGE (i18n.js)

- Two languages: "en" and "ta" (Tamil).
- Use FIXED TEMPLATES with placeholders. Do NOT use machine translation, and do NOT call any translation API.
- Each template is a function that takes the data and returns a string, so numbers always come from the data.
- Keep a TEXT object: TEXT.en and TEXT.ta with identical keys.
- Add a comment at the top of the Tamil block: "// NEEDS REVIEW by a native Tamil speaker / shop owner before showing to anyone".
- Keys needed (at least): appName, sampleBanner, navToday, navImport, navHistory, navLimits, itemsToReview, recordsChecked, digitalMatched, cashCannotVerify, noBillTitle, noPaymentTitle, duplicateTitle, noBillLine(payment), noPaymentLine(bill), duplicateLine(first, second), allClear, copyAlert, copied, importTitle, chooseSales, choosePayments, runMatching, skippedRows, limitsTitle, limitsList (array), settingsTitle, windowLabel, dupLabel.
- Amounts print as "Rs 450" in English and "ரூ 450" in Tamil.
- Times print in 12-hour format like "4:12 PM".
- The language choice is saved in localStorage and restored on start.
- Set document.documentElement.lang to "ta" or "en" when switching.
- Tamil needs a font that supports it. Use font-family: "Noto Sans Tamil", "Hind Madurai", system-ui, sans-serif. For the Capacitor app, tell the student the font may need to be bundled for offline use (// VERIFY).

### 7.1 The alert text (this is the product)
buildAlertText(result, lang) returns plain text, no HTML, safe for SMS or sharing:
```
UNIFY Daily Alert (<shop name>, <date>)
Items to review: 3
- Payment with no bill: Rs 450 received at 4:12 PM (UPI)
- Bill with no payment: B104, Rs 820, Ramesh
- Possible duplicate: Rs 250 logged twice (B105 11:05 AM, B106 11:06 AM)
Note: these are possible mismatches. Unrecorded cash cannot be seen.
```
- If flagged is 0, the alert says all clear plus the same note.
- Same structure in Tamil using the Tamil templates.

## 8. SCREENS (ui.js, mobile-first)

Bottom navigation with 4 tabs: Today, Import, History, Limits.
Top bar: app name "UNIFY", shop name, and an EN / தமிழ் toggle.
The sample-data banner sits under the top bar whenever sample data is loaded.

### 8.1 Today
- Hero block: the big number of items to review, with a label.
- Three small stat cards: records checked, digital bills matched, cash bills (cannot verify).
- Three sections, each with a count in its heading and a coloured left border:
  - Payment with no bill (red)
  - Bill with no payment (amber)
  - Possible duplicate (blue)
- Each item shows the line text, the amount on the right, and the time.
- If a section is empty, show a short "None found" line, not a blank gap.
- If flagged is 0 show an all-clear message.
- Skipped rows: if any, show "N rows skipped" that expands to the reasons.
- Alert preview box showing buildAlertText(...) exactly as it would be sent.
- Button: "Copy alert text" using navigator.clipboard.writeText, with a fallback textarea and document.execCommand("copy") if clipboard is not available. Button text changes to "Copied" for 2 seconds.
- Button: "Share alert". If Capacitor Share plugin is present use it, otherwise hide the button. (// VERIFY plugin name against the Capacitor docs.)
- Empty state when no data is loaded: "No records yet. Import your files or load the sample data." with two buttons.

### 8.2 Import
- Button: "Load sample data" (loads sampleData.js, sets the sample banner flag).
- Two file pickers: Sales CSV and Payments CSV (input type=file, accept=".csv,text/csv").
- After a file is chosen show: file name, number of rows read, number of rows skipped.
- Show a preview table of the first 5 rows after normalising so the owner can see the columns were understood.
- If a required column is not found, show which column is missing and the accepted header names. Do not crash.
- Button: "Run matching" (disabled until both files are loaded or sample data is loaded).
- Button: "Download sample CSV templates" that creates two small CSV files via a Blob so the owner can see the format.
- Loading real files clears the sample banner. Make clear that files never leave the phone ("Your files stay on this device").

### 8.3 History
- List of past runs saved in localStorage: date, flagged count, tap to reopen that day's result.
- Keep only the latest 30 runs. Delete the oldest beyond that.
- Button: "Clear history" with a confirm dialog.
- Empty state message when there are none.

### 8.4 Settings (a section at the bottom of the History tab, or a small panel)
- Shop name (text).
- WINDOW_MIN, DUP_MIN, CREDIT_MAX_DAYS number inputs with the default shown and a "Reset to defaults" button.
- Validate: whole numbers only, WINDOW_MIN between 5 and 240, DUP_MIN between 1 and 30, CREDIT_MAX_DAYS between 1 and 60.
- Saved in localStorage, read by the matcher through the SETTINGS object.
- Changing a setting does not rerun automatically; show a "Run matching again" button.

### 8.5 Limits
A plain list, in the chosen language, with two groups:
What UNIFY cannot do:
- Cash that was never recorded is invisible.
- It flags possible mismatches only; no tax or legal advice.
- Names and amounts must match exactly; part-payments and spelling differences are not handled yet.
- The 60-minute and 5-minute rules are our guesses, to be tuned with real shops.
- Cash duplicates are not checked.
- Refunds are skipped.
Built now vs planned:
- Built: CSV import, matching on three mismatch types, English and Tamil alert text, copy and share.
- Planned: daily automatic run, real SMS or WhatsApp sending, billing-app connectors, sudden-drop detection, fuzzy name matching.

## 9. STORAGE (storage.js)

localStorage keys (prefix everything with "unify."):
- unify.lang
- unify.settings
- unify.history   (array of runs: { date, flagged, result })
- unify.lastData  (the last imported clean bills and payments, so the app reopens with data)

Rules:
- Wrap every localStorage call in try/catch. If storage fails, the app still works for the session.
- Dates inside stored JSON become strings. When loading, convert time fields back into Date objects in ONE function called reviveDates().
- Never store anything outside the device. No network calls anywhere in the app.
- Write a clearAll() helper used by a "Delete all my data" button on the Limits screen.

## 10. CAPACITOR (mobile app)

Do not change app logic for Capacitor. The same www folder is the app.

capacitor.config.json:
```
{ "appId": "com.unify.app", "appName": "UNIFY", "webDir": "www" }
```

Commands to put in README.md:
```
npm init -y
npm i @capacitor/core @capacitor/cli
npx cap init UNIFY com.unify.app --web-dir=www
npm i @capacitor/android
npx cap add android
npx cap sync
npx cap open android
```
Notes to put in README.md:
- Needs Node.js and Android Studio.
- After every change in www, run `npx cap sync` again.
- Test in the browser first; test on the phone second.
- Share plugin: check the current Capacitor docs for the exact package name before installing (// VERIFY).
- Do not list any iOS steps (not part of this prototype).

Mobile polish (required):
- <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
- Respect safe areas: padding with env(safe-area-inset-top) and env(safe-area-inset-bottom).
- Bottom navigation must not hide content: add bottom padding to the page.
- All tap targets at least 48px tall.
- Wide tables scroll inside their own overflow-x container; the page never scrolls sideways.

## 11. TESTS (tests/tests.html and tests/tests.js)

Create a tiny test runner with NO libraries:
```
function check(name, actual, expected) -> logs PASS or FAIL with both values
```
tests.html imports matcher.js and normalize.js, runs every test, and shows green or red rows plus a final "X of Y passed".

Write each test with a tiny dataset (2 to 4 records) built in the test itself.

Required test cases:
1. Sample data gives flagged = 3, matchedDigital = 9, cashUnverified = 9 (section 6.7).
2. Exact upi bill plus upi payment 1 minute later -> matched, flagged 0.
3. Payment arrives 5 minutes BEFORE the bill (upi) -> matched.
4. Payment 61 minutes away with WINDOW_MIN 60 -> NOT matched: one bill with no payment AND one payment with no bill.
5. Same amount but upi bill vs marketplace payment -> NOT matched.
6. Two genuine Rs 250 upi bills 1 minute apart, TWO payments -> both matched, no duplicate.
7. Two Rs 250 upi bills 1 minute apart, ONE payment -> one matched, one possible duplicate, no "bill with no payment".
8. Two Rs 250 upi bills 30 minutes apart, one payment -> one matched, one bill with no payment (not a duplicate, gap above DUP_MIN).
9. Two bills of the same amount at different times, one payment -> the payment goes to the closest bill, the other is left over.
10. Cash bill with no payment -> never flagged, counted in cashUnverified.
11. Cash duplicates (two cash Rs 100 bills a minute apart) -> not flagged.
12. Credit bill for "Ramesh", payment from "ramesh " (lowercase, trailing space) after the bill -> matched.
13. Credit bill for "Ramesh", payment from "Ramesh K" -> NOT matched (documented limit).
14. Credit payment BEFORE the bill time -> NOT matched.
15. Credit payment 10 days after with CREDIT_MAX_DAYS 7 -> NOT matched.
16. Part-payment (bill 820, payment 500) -> bill with no payment AND payment with no bill (documented limit).
17. Bill at 23:55 and payment at 00:03 the next day -> matched (needs full Date objects).
18. Empty bills and empty payments -> no crash, flagged 0.
19. Payments only (no bills) -> every payment is a payment with no bill.
20. Bills only (no payments) -> every non-cash bill is a bill with no payment.
21. Normalise: amount "Rs 1,200" becomes 1200.
22. Normalise: amount "abc", "0" and "-50" are skipped with the right reasons.
23. Normalise: time "4:12 PM" becomes 16:12.
24. Normalise: mode "GPay" becomes "upi", "Khata" becomes "credit", "xyz" is skipped.
25. CSV parser: a quoted field containing a comma, e.g. "Sharma, R", stays as one field.
26. CSV parser: Windows line endings (\r\n) and a trailing blank line are handled.
27. buildAlertText with flagged 0 contains the all-clear text in both languages.
28. buildAlertText Tamil and English contain the same numbers (amount and bill id) for the same result.

For each test add a short comment: "what this proves".

## 12. DESIGN DIRECTION

Goal: calm, readable at a glance, built for a busy shop owner holding a phone.

- Palette (use CSS variables on :root): ink #1F2A44, background #F4F6F3, card white, green #2E7D5B (matched, ok), red #C2412D (no bill), amber #B07A00 (no payment), blue #4A5FC1 (duplicate).
- Dark mode: redefine the same variables inside @media (prefers-color-scheme: dark) with readable lighter versions. Every text colour and its background must both come from variables.
- One typeface family that supports Latin and Tamil. Sizes: body 16px, headings 16 to 22px, big number 56px.
- Sentence case everywhere. No all-caps labels. No emoji in the UI.
- Plain words: "Payment with no bill", not "unreconciled inflow".
- Colour is never the only signal: every flagged item also has a text tag ("Check this").
- Visible keyboard focus on all buttons.
- No animation except a simple state change when a button is pressed. Respect prefers-reduced-motion.
- No decorative gradients, no heavy shadows.

## 13. BUILD ORDER (do one step, tell me how to test it, wait for me)

Step 1. settings.js and sampleData.js
  Create the 20 bills and 10 payments (the same 30 records as the Python prototype unify_match.py).
  Test: console.log the arrays in the browser, counts are 20 and 10.

Step 2. matcher.js (pure logic)
  Implement section 6 exactly. Export one function: reconcile(bills, payments, settings).
  Test: in the console, run it on the sample data and compare with section 6.7.

Step 3. tests.html and tests.js
  Write the 28 tests. Fix matcher bugs until they pass.
  Test: open tests.html, all green.

Step 4. i18n.js and buildAlertText
  Test: console.log(buildAlertText(result, "en")) and "ta".

Step 5. index.html, style.css, Today screen
  Render the Today screen from the sample result. Include the banner, language toggle, alert preview, copy button.
  Test: open on phone width (browser dev tools, 375px).

Step 6. csv.js and normalize.js
  Add the tests for them (21 to 26). Then build the Import screen.
  Test: import the downloaded sample templates and a deliberately broken file.

Step 7. storage.js, History, Settings, Limits screens
  Test: refresh the page, data and language are still there. Change a setting and rerun.

Step 8. Polish and mobile checks
  Safe areas, 48px targets, table scroll, dark mode, empty states, error states.

Step 9. Capacitor
  Add config and README, run the commands, open in Android Studio.
  Test: run on a real phone or emulator.

Step 10. README
  Sections: What this is, How to run in the browser, How to run the tests, How to build the Android app, Built now vs planned, Known limits, Sample data notice.

## 14. DEFINITION OF DONE (check each item before saying the project is finished)

- [ ] Sample data run gives exactly 3 flags as described in 6.7.
- [ ] All 28 tests pass in tests.html.
- [ ] Today, Import, History, Limits tabs all work on a 375px wide screen.
- [ ] English and Tamil toggle changes every visible string, including the alert text.
- [ ] Sample banner shows when sample data is loaded and disappears when real files are loaded.
- [ ] A broken CSV never crashes the app; it shows skipped rows with reasons.
- [ ] Refreshing the page keeps language, settings, last data and history.
- [ ] No network request is made anywhere (check the Network tab, other than Google Fonts if used).
- [ ] No sentence in the UI claims 100 percent accuracy, AI, compliance, or tax/legal authority.
- [ ] Limits screen lists the real limits and the built-vs-planned split.
- [ ] The Android app opens and shows the same Today screen.
- [ ] Every function has a one-line comment explaining why it exists.

## 15. DO NOT BUILD (the review does not need it and the student cannot explain it)

- No backend, no accounts, no login, no cloud sync.
- No machine learning, no AI calls, no machine translation.
- No real SMS or WhatsApp sending, no payment gateway calls, no bank connections.
- No charts or graphs, no analytics, no tracking.
- No notifications, no background jobs, no scheduler.
- No fuzzy name matching, no part-payment logic, no refund logic.
- No inventory, GST, invoicing or PDF export.
- No framework, no bundler, no TypeScript, no UI library.
- No extra screens beyond the four tabs.
- No fake numbers: no invented prices, market sizes, user counts or accuracy rates anywhere in the app or README.

## 16. HOW TO REPLY AFTER EACH STEP

After each step, reply with:
1. The files created or changed (names only).
2. What I should test right now (3 to 5 concrete actions, with the expected result).
3. Two short questions that check I understand the step well enough to explain it to a judge.
4. Anything you were unsure about, marked // VERIFY, listed in plain words.

Then STOP and wait for me to say "next".
