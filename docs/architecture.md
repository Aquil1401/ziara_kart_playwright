# ZiaraKart Test Automation Architecture (POM)

This document describes the Page Object Model (POM) architectural design implemented for **[ZiaraKart](https://ziarakart.vercel.app/)** using **Playwright + TypeScript**.

---

## 🏛️ Architectural Overview

The framework follows a strict 4-layer separation of concerns:

```
┌───────────────────────────────────────────────────────────────┐
│                       1. Test Specs Layer                     │
│    (01_homepage, 02_search, 03_guest, 04_dealer, 05_cart)     │
└───────────────────────────────┬───────────────────────────────┘
                                │ Calls business actions & assertions
┌───────────────────────────────▼───────────────────────────────┐
│                    2. Page Object Model Layer                 │
│         (BasePage, HomePage, CartDrawer, CheckoutPage, etc.)  │
└───────────────┬───────────────────────────────┬───────────────┘
                │ Uses locators                 │ Uses data
┌───────────────▼───────────────┐ ┌─────────────▼───────────────┐
│      3. Locators Layer        │ │     4. Test Data Layer      │
│   (*.locators.ts files)       │ │     (ziarakart.data.ts)     │
└───────────────────────────────┘ └─────────────────────────────┘
```

---

## 🧩 Layer Responsibilities

### 1. Locators Layer (`locators/`)
- Pure TypeScript constants storing DOM selectors.
- Decouples selectors from test actions. If the UI changes, changes are localized to a single file.
- Files:
  - `header.locators.ts`: Brand logo, navigation links, search input, cart trigger.
  - `products.locators.ts`: Product cards, title, price, blurred prices, action buttons (`Add`, `+`, `−`, `Request Access`).
  - `cart.locators.ts`: Slide-over cart elements, item rows, total calculation, proceed button.
  - `checkout.locators.ts`: Delivery details inputs (shop, owner, phone, address), order summary.
  - `dealer-modal.locators.ts`: Retailer verification modal form inputs and validation errors.

### 2. Page Object Model Layer (`pages/`)
- Encapsulates UI actions, state handling, and dynamic wait strategies.
- Classes:
  - **`BasePage.ts`**:
    - Centralized `navigate()` with hydration checks.
    - `waitForProductsToLoad()`: Dynamic synchronization waiting for the React catalog to finish loading without hardcoded sleeps.
    - `setupDealerAccess()`: Injects `dealerToken` and mocks approval verification API.
    - `openCart()`: Opens cart drawer with `{ noWaitAfter: true }`.
  - **`HomePage.ts`**:
    - Category filtering via `<select>` dropdown.
    - Search input management and debouncing.
    - Product card interactions (`addProductToCart`, `incrementProductQuantity`, `decrementProductQuantity`).
    - Detection of blurred vs unblurred wholesale pricing.
  - **`CartDrawer.ts`**:
    - Handles CSS transform slide-over transitions (`translate-x-0` vs `translate-x-full`).
    - Reads cart items, totals, and triggers checkout navigation.
  - **`CheckoutPage.ts`**:
    - Fills delivery details form.
    - `submitOrderAndInterceptWhatsApp()`: Intercepts `window.open` calls to capture and validate the generated WhatsApp order message URL and contents.
  - **`DealerModal.ts`**:
    - Handles the guest "Request Access" modal and validates form constraints (10-digit phone, email format, mandatory fields).

### 3. Test Data Layer (`testdata/`)
- `ziarakart.data.ts`: Centralizes expected titles, valid and invalid form payloads, categories, search queries, and support contact details (`917979720438`).

### 4. Test Specifications Layer (`tests/`)
- Clean, declarative, scenario-driven test files:
  - `01_homepage_and_navigation.spec.ts`: Branding, header, multi-page links, footer.
  - `02_product_search_and_filter.spec.ts`: Keyword search, case-insensitivity, category filtering, zero-results.
  - `03_guest_request_access.spec.ts`: Price blurring, guest restrictions, modal validations.
  - `04_dealer_e2e_cart_and_whatsapp_order.spec.ts`: Full end-to-end purchase and WhatsApp URL payload assertion.
  - `05_cart_drawer_edge_cases.spec.ts`: Empty cart states, removal to zero, proceed button disabled state.
