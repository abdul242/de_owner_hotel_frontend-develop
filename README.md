# De Owner Hotel & Lounge

Public website, reservation system and admin dashboard for **De Owner Hotel & Lounge**
(18A Cobahm Street off Akinola Sholanke Street, Ajao Estate, Isolo, Lagos).

There is **no online payment gateway**. Guests reserve online, pay by bank transfer, and a receptionist verifies the
payment, checks the guest in, and the stay completes itself when check-out time passes.

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Roles and permissions](#roles-and-permissions)
- [Reservation lifecycle](#reservation-lifecycle)
- [API integration](#api-integration)
- [Design system](#design-system)
- [Adding a new module](#adding-a-new-module)
- [Conventions](#conventions)
- [Content and open questions](#content-and-open-questions)
- [Roadmap](#roadmap)

## Features

### Public website

| Page | Route | Notes |
|---|---|---|
| Home | `/` | Hero, accommodation, about, bars and lounge, why stay, gallery preview |
| About | `/about` | Hotel profile, values, facilities, location |
| Accommodation | `/accommodation` | Rooms and studio apartments with prices and amenities |
| Gallery | `/gallery` | Category filters and a keyboard-navigable lightbox |
| Contact | `/contact` | Details, validated form, map link |
| Book | `/book` | Step-by-step booking: accommodation, dates, guest details, review |
| Confirmation | `/book/confirmation` | Reservation number and the manual **payment information** |
| Verify reservation | `/verify-reservation` | Public status check by reservation reference (limited, masked view) |

### Admin dashboard (`/admin`)

| Area | Route | Notes |
|---|---|---|
| Sign in / forgot / reset password | `/admin/login`, `/forgot-password`, `/reset-password` | |
| Dashboard | `/admin/dashboard` | Summary cards, recent reservations, active stays, upcoming check-ins |
| Reservations | `/admin/reservations` | Search, status / accommodation / check-in date filters, pagination (filters live in the URL) |
| New reservation | `/admin/reservations/new` | Admin-created booking (walk-ins included) |
| Reservation details | `/admin/reservations/:id` | Guest, stay, payment, timeline, status actions |
| Active reservations | `/admin/active-reservations` | Live countdowns, cards or table, recently ended stays |
| Accommodation | `/admin/accommodations` (+ `/new`, `/:id`, `/:id/edit`) | CRUD with photo upload (managers only) |
| Admins | `/admin/admins`, `/admin/admins/:id` | Staff accounts, roles, activate / deactivate, set password (managers only) |
| Audit logs | `/admin/audit-logs` | Who did what (managers only) |
| Settings | `/admin/settings` | Planned, see [Roadmap](#roadmap) |

## Tech stack

| | |
|---|---|
| UI | React 18+, JSX (no TypeScript) |
| Build | Vite |
| Styling | Tailwind CSS v3 + CSS variables (`src/index.css`) |
| Routing | React Router v6 |
| State / data | Redux Toolkit + React Redux (`createAsyncThunk` for all API calls) |
| HTTP | axios (wrapped in `src/api/client.js`) |
| Session | `js-cookie` (`admin_auth_token` cookie) |
| Fonts | Cormorant Garamond (headings), DM Sans (UI), via Google Fonts |

## Getting started

**Requirements:** Node.js 18 or newer, and the backend API running (separate repository).

```bash
npm install
cp .env.example .env     # then edit VITE_API_URL
npm run dev
```

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend. Each service file appends its own prefix. | `http://localhost:5000` |

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |

`/styleguide` renders every design token and UI primitive (a development aid).

## Project structure

The app is organised by **domain**. Each domain owns its pages, components, hooks and services, so a feature can be
read, changed, or copied to another project without hunting across the codebase.

```text
src/
├── api/
│   ├── client.js              axios instance + ApiGet / ApiPost / ApiPatch / ApiPut / ApiDelete (+ NoAuth variants)
│   └── query.js               toQueryString(): builds ?a=1&b=2, skipping empty values
├── assets/hotel/              the hotel's own photos
├── components/ui/             shared primitives: Button, Input, Select, Textarea, Card, Badge, Modal/ConfirmDialog,
│                              Drawer, Dropdown, Toast, Table, Pagination, Skeleton, EmptyState, Alert, Avatar,
│                              StatCard, Countdown, Icon, Spinner
├── data/                      static content: hotel info, facilities, gallery, image registry
├── domain/
│   ├── public/                the guest-facing website
│   │   ├── pages/
│   │   ├── components/        Navbar, Footer, PublicLayout, booking steps, Lightbox, ...
│   │   ├── hooks/
│   │   └── services/
│   └── admin/                 the staff dashboard
│       ├── pages/
│       │   ├── auth/          login, forgot-password, reset-password
│       │   └── authenticated/ dashboard, reservations, reservation-details, reservation-create,
│       │                      active-reservations, accommodations*, admins, admin-details, AuditLogs
│       ├── components/        AdminLayout, Sidebar, Topbar, ProtectedRoute, dialogs, tables, filters
│       │   ├── accommodation/ form, photo picker, amenities input, cards
│       │   └── reservation/   create form, accommodation picker
│       ├── hooks/             useAuth, useReservationSync, useOnVersionChange
│       ├── services/          authService, adminService, accommodationService, reservationService, ...
│       └── utils/             permissions, notifications
├── hooks/                     shared hooks: useAsync, useCountdown, useNow, useDocumentTitle
├── store/
│   ├── index.js               configureStore
│   ├── session.js             token cookie helpers
│   ├── thunkError.js          shared thunk catch-handler (401 → session expired)
│   ├── utils.js               normalizers + error message helper
│   └── slices/                adminSlice (session), staffSlice, accommodationSlice, reservationSlice, ...
├── utils/                     formatCurrency, formatDate, calculateNights, getReservationStatus, validators, ...
├── dev/StyleGuide.jsx
├── App.jsx                    all routes
├── main.jsx                   providers (Redux, Router, Toast)
└── index.css                  design tokens + global styles
```

**Placement rules**

- Used by **both** domains → `components/ui`, `hooks`, or `utils`.
- Used by **one** domain → inside that domain. Do not import from another domain's `components`.
- Pages never call `axios` or services directly: they dispatch thunks and read selectors.

## Architecture

### Data flow

```text
page  ──dispatch──▶  thunk (slice)  ──▶  service  ──▶  api/client  ──▶  backend
  ▲                       │
  └────── selectors ◀─────┴── reducers update state
```

**Service**: one object per backend module, one line per endpoint, nothing else.

```js
// domain/admin/services/accommodationService.js
const BASE = '/v1/accommodation';
export const accommodationService = {
  getAllAccommodations: (params) => ApiGet(`${BASE}${toQueryString(params)}`),
  getAccommodationById: (id) => ApiGet(`${BASE}/${id}`),
  updateAccommodationStatus: (id, status) => ApiPatch(`${BASE}/${id}/status`, { status }),
};
```

**Slice**: thunks, state, reducers and selectors in one file.

```js
// store/slices/accommodationSlice.js
export const fetchAccommodationById = createAsyncThunk('accommodation/fetchById', async (id, api) => {
  try {
    const res = await accommodationService.getAccommodationById(id);
    return normalize(res.data.accommodation);   // API body is { data: ... }
  } catch (error) {
    return fail(error, 'Failed to fetch accommodation', api);   // rejects with the server's message
  }
});
```

**Page**: dispatch, then `.unwrap()` when you need success or failure.

```jsx
await dispatch(updateAccommodationStatus({ id, status })).unwrap();   // throws the server message (a string)
```

Details worth knowing:

- Thunks reject with a **string** (the server's `message`), so `catch (message)` gives you something displayable.
- `fail()` signs the user out on a **401** (`sessionExpired`); a 403 just shows the message.
- Background refreshes pass `{ silent: true }` so lists don't flash a loading state.
- Mongo documents arrive with `_id`; slices normalise to `id`.
- Reservation `checkIn` / `checkOut` are normalised to plain `YYYY-MM-DD` strings, so a date never shifts with the browser's time zone.

### Auth and session

- Login stores the JWT in the **`admin_auth_token` cookie** (7 days with "Remember me", otherwise a session cookie). `api/client.js` reads it and sends `Authorization: Bearer …`.
- `AdminRoot` restores the session on page load (`GET /me`). A bad token is cleared; a network error is not.
- `ProtectedRoute` guards `/admin/*`. `<ProtectedRoute managersOnly />` additionally requires Super Admin or Admin.
- `useAuth()` wraps the session slice: `user`, `isManager`, `login`, `logout`, `refresh`.

### Keeping the admin fresh

`ReservationSyncProvider` (inside `AdminLayout`) bumps a `version` every 30 seconds while the tab is visible, and when
you return to it. Pages refetch silently on a version change (`useOnVersionChange`). The same provider loads
`GET /reservation/stats`, which feeds the sidebar badges, the notification bell, and the dashboard cards.

Stays are completed **by the server** when check-out time passes. The browser only looks again.

### Routing

All routes are declared in `src/App.jsx`: the public site under `PublicLayout`, and `/admin/*` under `AdminRoot` →
`ProtectedRoute` → `AdminLayout`. Static routes (`reservations/new`) are declared before dynamic ones
(`reservations/:id`).

## Roles and permissions

| Capability | Super Admin | Admin | Receptionist |
|---|:-:|:-:|:-:|
| Reservations: view, create, mark paid, start, complete | ✅ | ✅ | ✅ |
| Cancel a reservation | ✅ | ✅ | ❌ |
| Accommodation management | ✅ | ✅ | ❌ |
| Audit logs | ✅ | ✅ | ❌ |
| Manage staff | everyone | receptionists only | ❌ |
| Change your own role, or deactivate / delete yourself | ❌ | ❌ | ❌ |

The UI mirrors the rules (`domain/admin/utils/permissions.js`). **The API is the enforcer**; hiding a button is only
convenience.

## Reservation lifecycle

```text
PENDING_PAYMENT ──mark paid──▶ PAID ──start (ID checked)──▶ ACTIVE ──check-out time / complete──▶ COMPLETED
       │                        │
       └────────── cancel ──────┴──▶ CANCELLED   (reason required, managers only)
```

| Step | Who / what | Rules |
|---|---|---|
| Guest books | Public site or an admin | Price is calculated by the server. Dates must be free. Starts as `PENDING_PAYMENT`. |
| Mark as paid | Any staff | Record the **sender's bank name and account name** from the bank alert (no payment reference to type). Revertable to pending while still `PAID`. |
| Start | Any staff | Must be `PAID`. Staff must confirm the guest's **ID was checked**. Sets the expected check-out time. |
| Complete | Server scheduler (or staff for an early check-out) | `ACTIVE` stays complete automatically once `expectedCheckoutAt` passes. |
| Cancel | Super Admin / Admin | A reason is mandatory and stored. Refunds are handled outside the system. |

Check-out time is **12:00 hotel time** by default (server setting). Dates are calendar dates in hotel time (Lagos, UTC+1).

## API integration

The backend is a separate service. Responses look like `{ message, data }`; errors carry `{ message }`.

Each service file has a `BASE` constant (for example `/reservation`). **That prefix must match how your backend mounts the
router.**

| Module | Main endpoints (relative to its `BASE`) |
|---|---|
| Auth and staff | `POST /login`, `/forgot-password`, `/reset-password` · `GET/PATCH /me`, `PATCH /me/password` · `GET/POST /` · `GET/PATCH/DELETE /:id` · `PATCH /:id/status`, `/:id/password` |
| Accommodation | `GET /` (public; with an admin token it returns every status) · `GET /:id`, `/slug/:slug` · `POST /` · `PATCH /:id` · `PATCH /:id/status` · `DELETE /:id` |
| Reservation | `POST /` (public, or admin with a token) · `GET /verify/:reference` · `GET /` (filters, sorting) · `GET /stats` · `GET /:id`, `/:id/activity` · `PATCH /:id`, `/:id/payment-status`, `/:id/start`, `/:id/complete`, `/:id/cancel` |
| Audit logs | See the `audit-log` module |

**Things that bite**

- **Uploads** (accommodation create / update) are `multipart/form-data`. `amenities` and `removeImages` are sent as JSON strings. `ApiPatch` does not detect `FormData` the way `ApiPost` does, so the service passes `{ isJsonRequest: false, isFormData: true }` for PATCH uploads.
- **Reservation list filters:** `status` takes one value or a comma-separated list (`PENDING_PAYMENT,PAID`); `checkInFrom` / `checkInTo` are `YYYY-MM-DD`.
- **Phone numbers** sent to the API must be digits only (optional leading `+`, 7 to 15 digits). The forms strip spaces and dashes before sending.
- **Backend email links:** the reset-password and welcome emails use `ADMIN_PANEL_URL`. Because this app serves the admin at `/admin`, set it to end in `/admin` (for example `https://example.com/admin`) or the links will 404.

## Design system

Every colour, radius, shadow and font is a **CSS variable in `src/index.css`**; `tailwind.config.js` only maps them to
class names. To re-tint the site, change the values there.

- **Palette:** ivory background, warm near-black text, brass (`primary`) for actions, marble black (`secondary`) for dark surfaces, plus soft-tinted success / warning / danger / info.
- **Typography:** Cormorant Garamond for headings, DM Sans for everything else. Type scale lives in `tailwind.config.js` (`text-display-*`, `text-body`, `text-sm`, `text-caption`, `text-eyebrow`).
- **Dark sections:** add `section-dark` (dark background) or `on-dark` (text only) to a wrapper. The semantic tokens are remapped inside it, so buttons, cards and inputs re-theme with no extra classes. The public footer and the admin sidebar use it.
- **Layout helpers:** `container-page`, `section-y`, `eyebrow`, `brass-rule`, `photo-scrim`.
- **Status colours** are never the only signal: badges always include a text label.
- **Accessibility:** semantic HTML, labelled inputs with `aria-describedby` errors, native `<dialog>` for modals and drawers (focus trap, Esc), visible focus rings, `prefers-reduced-motion` respected.

Open `/styleguide` to see it all.

## Adding a new module

A checklist you can follow for any backend module (and reuse in another project built on this structure):

1. **Service**: `domain/<area>/services/<name>Service.js` with a `BASE` constant, one function per endpoint.
2. **Slice**: `store/slices/<name>Slice.js`
   - thunks using `createAsyncThunk` and `fail()` from `store/thunkError.js`
   - state shaped as `{ list, filters, selected, ... }`, each with `{ data, isLoading, error }`
   - selectors at the bottom
3. **Register** the reducer in `store/index.js`.
4. **Pages**: `domain/<area>/pages/...` that dispatch thunks and read selectors.
5. **Components**: `domain/<area>/components/<name>/...` for anything the pages share.
6. **Route**: add it in `App.jsx` (static routes before dynamic ones; wrap in `managersOnly` if needed).
7. **Navigation**: add an item in `domain/admin/components/adminNav.js` and its page title.
8. **Permissions**: update `utils/permissions.js` if roles differ.

## Conventions

- **JavaScript + JSX**, no TypeScript. Tailwind utility classes; no UI library.
- **`useEffect` bodies use braces** unless they return a cleanup function. A one-line arrow that calls a function returns that function's result, and React throws `destroy is not a function`.
- **Dates** are `YYYY-MM-DD` strings in the UI. Use `utils/formatDate` (it parses date-only strings as local dates).
- **Money** is a number of naira; format with `utils/formatCurrency` (`₦60,000`).
- **No secrets in the frontend.** Passwords are never stored client-side; the only persisted credential is the token cookie.
- **Errors** shown to people use the server's message when it exists, with a generic "Something went wrong. Please try again." fallback.

## Content and open questions

Static hotel content lives in `src/data`. It comes from the hotel's own documents; anything not in those documents was left out
rather than invented.

Still to confirm with the hotel:

- Email address, WhatsApp number, social links and reception hours (none were provided)
- Check-out time (12:00 is a default) and any cancellation / refund policy
- Which photos are real versus promotional renders (the two bar images came from a flyer)
- Whether "Executive Rooms" are a separate tier. With one rate per accommodation, create each tier as its own accommodation.
- The bank details shown to guests after booking

## Roadmap

## License

Private project. Add a license here if it is ever published.