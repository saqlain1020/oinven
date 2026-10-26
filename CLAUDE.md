# oinven — Knowledge Graph

Inventory / buy-sell / receipt management for **Prime Tech**, a mobile phone shop
(Shop # F-50, Prime Tech, Amma Tower Saddar, Karachi; phone 0306-2217011). Currency **PKR**, timezone **Asia/Karachi**.
A product (usually a used phone) is **bought from** a customer and later **sold to** a customer; each side
can be paid in installments (credit). Also tracks shop expenses and a supplier/shop ledger (khata).

## Stack
- Next.js 14.2 App Router + **Server Actions** (no REST API for app data), React 18, TypeScript
- MongoDB via **Mongoose 8** (app models) + raw `MongoClient` (only for the NextAuth adapter) — both in `lib/db.ts`
- NextAuth v5 beta (Google provider only), MongoDB adapter, `basePath: "/auth"`
- MUI 5 (dark copper/bronze/brown theme — `brandColors` in `src/config/theme.ts`; primary copper `#C8864E`, secondary bronze `#CD7F32`, bg espresso `#1C140F`), MUI X DataGrid + DatePickers (moment adapter), `react-imask`, SWR (ledger only), `next-nprogress-bar`
- Path aliases (tsconfig): `src/*` → `./src/*`, `auth` → `./auth`. Models are imported by relative path (`../../../lib/models/...`).
- Env: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `MONGODB_URI` (template in `env.test`)
- Scripts: `dev`, `build`, `start`, `lint`. No tests. Both `yarn.lock` and an untracked `bun.lock` exist.

## Graph: data model (Mongoose, `lib/models/`)
```
AllowedUser {email unique}                         ← auth whitelist
Customer {name, nic unique, phone}                 ← looked up/created by NIC
Product {
  name(idx), description, category: ProductCategory,
  attributes: [{name, value}],                     ← IMEI, Color, Storage, PTA...
  boughtAt, buyPrice, boughtFrom → Customer,
  buyPayments: [{date, amount, type: PaymentType, account?}],
  soldAt, sellPrice, soldTo → Customer,
  payments:    [{date, amount, type: PaymentType, account?}],   ← SELL-side payments
  timestamps
}   pre(/^find/) auto-populates soldTo + boughtFrom (NOT applied to aggregate())
Expense {reason, date, amount}                      ← amount = expense − income (can be negative)
LedgerMember {name unique, particulars, lastAmount, balance}   ← denormalized summary
Ledger {member → LedgerMember (idx), particulars, date, rate, amount, balance}
          amount = credit − debit; balance = running sum sorted by date
```
Enums (`src/types/product.ts`): `ProductCategory = Phone | Accessory | Other`, `PaymentType = Cash | Account`.
`AttributesOptions` = default attribute names (Imei, Imei-2, Color, Storage, Battery Health, Manufacturer,
CPLC Status, CPLC Counter, Accessories, PTA, Ram, Condition). The add form pre-fills the first 10.

### Derived states of a Product (the key domain concept)
| State | Rule | Where |
|---|---|---|
| In inventory (unsold) | `sellPrice == null` | `getInventory` |
| Sale completed | `sellPrice != null && sum(payments) == sellPrice` + has `soldTo` | `getSales` |
| Credit to receive | `sum(payments) != sellPrice` + has `soldTo` | `getCreditsToReceive` |
| Credit to pay | `sum(buyPayments) != buyPrice` + has `boughtFrom` | `getCreditsToPay` |
| "Credit Due" warning icon | sellPrice set, ≥1 payment, paid < sellPrice | `InventoryTable` |

## Graph: server actions (`src/app/actions/`, all `"use server"`)
- **product.ts** → Product, Customer, Expense
  - `createOrUpdateProduct(prev, formData)` — used via `useFormState`. Parses flat FormData; keys
    `attributes.{i}.{field}` / `payments.{i}.{field}` are rebuilt into arrays. Upserts Customer by NIC for
    buying (`buyingName/Phone/Nic`) and selling (`sellingName/Phone/Nic`) sides. With `productId` →
    `findOneAndUpdate` + revalidate edit page; without → create + `redirect("/products")`.
  - `deleteProduct(prev, id)`, `getProduct(id)` (populated, `.toJSON()`), `getInventory()`, `getSales()`
  - `getAttributesNames()` — distinct attribute names in DB ∪ `AttributesOptions` (autocomplete options)
  - `getTodaysData` / `getCurrentWeekData` / `getCurrentMonthsData` — three copy-pasted functions; same
    algorithm, different window. Bought = Σ buyPayments in window; Sold = Σ payments in window;
    Expense = Σ Expense.amount in window; Profit = Σ per-sold-item profit − expense, where per item:
    if payments before the window > buyPrice → profit = payments in window, else profit = total payments − buyPrice.
  - `getCreditsToReceive()`, `getCreditsToPay()` — aggregates with `$lookup` on `customers`
- **expense.ts** → Expense: `addExpense(reason, date, amount)`, `getExpenses()`, `deleteExpense(id)`
- **ledger.ts** → Ledger, LedgerMember
  - `addLedgerEntry(particulars, rate, amount, date, memberId?, memberName?)` — creates member if only a name is given
  - `modifyBalances(memberId)` (internal) — recomputes every entry's running `balance` sorted by date and
    writes `balance/particulars/lastAmount` (from the latest entry) to the LedgerMember
  - `getMemberLedgerEntries`, `getLedgerMembers`, `addLedgerMember`, `updateLedgerMember`, `deleteLedgerEntry`
- **users.ts** → AllowedUser: `getAllowedUsers`, `addAllowedUser(formData)`, `deleteAllowedUser(formData)`

## Graph: routes → components → actions
Root `src/app/layout.tsx`: `auth()`; redirects to `auth/signin` if no session. MUI theme provider.
`(with_drawer)/layout.tsx`: LocalizationProvider(moment) + `components/Drawer` (sidebar nav + signout) + progress bar.

| Route | Page (server) | Client components | Actions |
|---|---|---|---|
| `/` Dashboard | `(with_drawer)/page.tsx` | `components/CreditsTable` (type `sell`/`buy`) | today/week/month data, credits to receive/pay, deleteProduct |
| `/products` Inventory | `(with_drawer)/products/page.tsx` | `components/InventoryTable` (Sell/Edit/Delete) | getInventory, deleteProduct |
| `/products/add[?rebuyid=]` | `products/add/page.tsx` | `products/add/_components/AddProductComponent` | getAttributesNames, getProduct (rebuy prefill), createOrUpdateProduct |
| `/products/edit/[id]` | `products/edit/[id]/page.tsx` | `products/edit/[id]/_components/EditPageComp` (+ links to receipts) | getProduct, getAttributesNames, createOrUpdateProduct |
| `/sales` | `sales/page.tsx` | `sales/_components/SalesTable` (Rebuy/Edit/Delete) | getSales, deleteProduct |
| `/expenses` | `expenses/page.tsx` | `AddExpenseModal`, `ExpensesTable` | add/get/deleteExpense |
| `/ledger` | `ledger/page.tsx` | `AddLedgerEntryModal`, `MainLedgerContent` (accordion per member, SWR-loaded entries) | ledger actions; SWR keys in `src/config/swrKeys.ts` |
| `/manage_users` | `manage_users/page.tsx` (server-only forms) | — | users actions |
| `/products/receipt/[id]/sell` | outside drawer; A4 print layout (`receipt/layout.css`) | — | getProduct → soldTo, payments, sellPrice |
| `/products/receipt/[id]/buy` | same layout | — | getProduct → boughtFrom, buyPayments, buyPrice |
| `/test` | scratch page, stale fields (`paymentType`) | — | direct Product.aggregate |
| `/auth/*`, `/api/auth/*` | NextAuth handlers; `/api/protected` sample route | | |

"Rebuy" flow: from Sales, `/products/add?rebuyid=<id>` prefills a new product from a sold one (the shop buys the same device back).
Receipts: "Prime Tech" + phone header, "INVOICE # SELL/BUY", customer name/NIC/phone, attributes list, payment rows, total/paid/balance due, terms
("No warranty of camera, touch, and lcd after leaving counter."), stamp line, footer with shop address + phone. (The buy receipt has terms commented out.)

## Auth graph
`middleware.ts` exports `auth` as middleware (matcher excludes api/_next/favicon). `auth.ts` `signIn` callback
allows login only if the Google email exists in `AllowedUser`. The `authorized` callback returns true for all
normal paths; the actual gate is the root layout redirect. Adding a user = `/manage_users`.

## Conventions
- Pages are async server components that call actions directly; interactive parts are `"use client"` components in `_components/`.
- Mutations call `revalidatePath(...)`; the product form uses `useFormState` + `useFormStatus` (`LoadingButton`).
- Lean docs are made serializable with `JSON.parse(JSON.stringify(...))` or `_id.toString()`.
- Form field names are the contract with `createOrUpdateProduct`: `name, category, description, buyingName,
  buyingPhone, buyingNic, boughtAt, buyPrice, sellingName, sellingPhone, sellingNic, soldAt, sellPrice,
  attributes.i.name/value, payments.i.date/amount/type/account, buyPayments.i.*, productId` (edit only).
- NIC input mask `00000-0000000-0` (Pakistani CNIC). Number inputs blur on wheel.
- Styles: MUI `sx`; `makeStyles` / `useSxStyles` helpers in `src/hooks/useSxStyles.ts`. Global `.center` class in `globals.css`.
- Commit style: `chore: <short description>`.

## Known quirks / likely bugs (verify before relying on these)
- `createOrUpdateProduct` rebuilds `attributes`, `payments` and `buyPayments` arrays from FormData and sorts both
  payment arrays by date. Receipts render installments via `src/app/products/receipt/_components/PaymentsSummary.tsx`
  (per-payment remaining balance, totals, "to be paid later" / "Paid in full").
- The Customer is upserted by NIC only; changing name/phone for an existing NIC is ignored.
- `deleteLedgerEntry` calls `modifyBalances` without `await`.
- Aggregates skip the `pre(/^find/)` populate, which is why they use a manual `$lookup`. `$unwind` without
  preserveNull drops products that have no customer.
- Credits-to-receive also matches unsold items whose `sellPrice` is null (null ≠ 0) but have a `soldTo`.
- `authorized` callback contains leftover example paths; `/test` page is dead code. (Old branding "Osama Enterprises" was replaced by "Prime Tech".)
- The three period-stat functions are duplicated, so a fix in one must be made in all three.
