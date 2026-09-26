# ZiaraKart Setup & Test Execution Guide

This document provides instructions for installing dependencies, running tests across various modes, inspecting reports, and configuring CI/CD.

---

## 📋 Prerequisites
- **Node.js**: Version 18, 20, or 22+
- **NPM**: Version 9+
- **OS**: Windows, macOS, or Linux

---

## 📦 Installation

```bash
# 1. Clone repository
git clone https://github.com/Aquil1401/ziara_kart_playwright.git
cd ziara_kart_playwright

# 2. Install dependencies
npm install

# 3. Install Playwright browser binaries
npx playwright install --with-deps chromium
```

---

## 🚀 Running Tests

### 1. Headless Mode (Fast Execution)
Runs all 15 test cases in the background with maximum speed:
```bash
npm test
```

### 2. Headed Mode (Watch Browser Live)
Opens a single focused browser window on your desktop to watch each user interaction:
```bash
npm run test:headed
```

### 3. Interactive UI Mode
Opens Playwright's time-travel UI runner to step through tests, inspect DOM snapshots, and view locator pickers:
```bash
npm run test:ui
```

### 4. Running a Specific Test File
```bash
# Run only Homepage and Navigation tests
npx playwright test tests/01_homepage_and_navigation.spec.ts

# Run only Search & Filter tests
npx playwright test tests/02_product_search_and_filter.spec.ts

# Run only Guest Access tests
npx playwright test tests/03_guest_request_access.spec.ts

# Run only Dealer E2E & WhatsApp tests
npx playwright test tests/04_dealer_e2e_cart_and_whatsapp_order.spec.ts

# Run only Cart Drawer Edge Cases
npx playwright test tests/05_cart_drawer_edge_cases.spec.ts
```

---

## 📊 Viewing HTML Reports & Failure Artifacts

After any test execution, open the rich HTML report:
```bash
npm run test:report
```

### Artifact Policies:
- **Screenshots**: Automatically taken **only on test failure**.
- **Videos**: Automatically recorded and retained **only on test failure**.
- **Traces**: Recorded and attached to the report **only on test failure**.

---

## 🔄 CI/CD Pipeline

The framework includes a ready-to-run GitHub Actions workflow at `.github/workflows/playwright.yml`.

Whenever code is pushed or a PR is created to `main` or `master`:
1. GitHub spins up an `ubuntu-latest` runner.
2. Installs Node.js 20 and dependencies.
3. Installs Playwright Chromium.
4. Executes the test suite headless.
5. If any test fails, it uploads the `playwright-report/` containing screenshots and traces as a workflow artifact.
