# Graph Report - .  (2026-06-15)

## Corpus Check
- 10 files · ~10,408 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 164 nodes · 324 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_POS App Core (Old Path)|POS App Core (Old Path)]]
- [[_COMMUNITY_POS App Logic|POS App Logic]]
- [[_COMMUNITY_Admin & Menu CRUD|Admin & Menu CRUD]]
- [[_COMMUNITY_Menu Management (Old Path)|Menu Management (Old Path)]]
- [[_COMMUNITY_Sales Reports (Old Path)|Sales Reports (Old Path)]]
- [[_COMMUNITY_Auth & Page Navigation|Auth & Page Navigation]]
- [[_COMMUNITY_Sales Reporting|Sales Reporting]]
- [[_COMMUNITY_PIN Login (Old Path)|PIN Login (Old Path)]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]

## God Nodes (most connected - your core abstractions)
1. `submitForm()` - 9 edges
2. `submitForm()` - 8 edges
3. `renderTableDetails()` - 7 edges
4. `renderTableDetails()` - 7 edges
5. `handleCheckBill()` - 7 edges
6. `saveToStorage()` - 6 edges
7. `updateBillCalculation()` - 6 edges
8. `zn_auth sessionStorage Role Token (staff | admin)` - 6 edges
9. `saveToStorage()` - 6 edges
10. `renderMenuList()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `loadFromStorage()` --semantically_similar_to--> `loadBills()`  [INFERRED] [semantically similar]
  admin.js → report.js
- `renderStats()` --semantically_similar_to--> `renderStats()`  [INFERRED] [semantically similar]
  admin.js → report.js
- `defaultMenu` --semantically_similar_to--> `fallbackMenu`  [INFERRED] [semantically similar]
  admin.js → app.js
- `filterMenuList()` --semantically_similar_to--> `filterMenuSearch()`  [INFERRED] [semantically similar]
  admin.js → app.js
- `Admin Page — Menu Management` --references--> `openAddForm()`  [EXTRACTED]
  admin.html → admin.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **PIN Authentication Flow — login writes token, three pages gate on it** — login_validatepin, zn_auth_store, admin_html, index_html, report_html [INFERRED 0.95]
- **Menu Data Pipeline — Admin writes to localStorage, POS reads and renders it** — admin_savetostorage, zn_menu_items_store, app_loadmenu, app_populatemenucatalog [INFERRED 0.95]
- **Sales Billing Pipeline — checkout saves to log, report page reads it** — app_handlecheckbill, app_savebilltolog, zn_sales_log_store, report_loadbills [INFERRED 0.95]

## Communities (10 total, 1 thin omitted)

### Community 0 - "POS App Core (Old Path)"
Cohesion: 0.13
Nodes (24): adjustItemQty(), adjustSplit(), closeDetailsDrawer(), getFinalTotal(), getSubtotal(), handleAddMenuItem(), handleCheckBill(), handleCheckIn() (+16 more)

### Community 1 - "POS App Logic"
Cohesion: 0.14
Nodes (22): adjustItemQty(), adjustSplit(), closeDetailsDrawer(), getFinalTotal(), getSubtotal(), handleAddMenuItem(), handleCheckBill(), handleCheckIn() (+14 more)

### Community 2 - "Admin & Menu CRUD"
Cohesion: 0.13
Nodes (26): allItems, closeForm(), defaultMenu, deleteItem(), filterMenuList(), hideFormError(), loadFromStorage(), nextId() (+18 more)

### Community 3 - "Menu Management (Old Path)"
Cohesion: 0.17
Nodes (21): allItems, closeForm(), defaultMenu, deleteItem(), hideFormError(), loadFromStorage(), nextId(), openAddForm() (+13 more)

### Community 4 - "Sales Reports (Old Path)"
Cohesion: 0.18
Nodes (13): admin.html – Menu Management UI, loadTodayRevenue(), zn_sales_log localStorage Key, index.html – POS Floor Map & Ordering UI, allBills, clearSalesLog(), report.html – Sales Report UI, loadBills() (+5 more)

### Community 5 - "Auth & Page Navigation"
Cohesion: 0.32
Nodes (12): Admin Page — Menu Management, Index Page — POS Floor Map, backspacePin(), clearPin(), hideError(), Login Page — PIN Entry, pressPin(), showError() (+4 more)

### Community 6 - "Sales Reporting"
Cohesion: 0.24
Nodes (9): loadTodayRevenue(), allBills, clearSalesLog(), loadBills(), renderBillList(), renderEmpty(), renderStats(), setFilter() (+1 more)

### Community 7 - "PIN Login (Old Path)"
Cohesion: 0.33
Nodes (10): showAdminLink(), zn_auth sessionStorage Role Token (staff | admin), backspacePin(), clearPin(), hideError(), login.html – PIN Login UI, pressPin(), showError() (+2 more)

## Ambiguous Edges - Review These
- `zn_menu_items localStorage (Shared Menu Store)` → `Supabase Config Placeholder (Unused)`  [AMBIGUOUS]
  config.js · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `allItems`, `tables`, `menuCatalog`, `allBills`, `README – poszabnua project` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `zn_menu_items localStorage (Shared Menu Store)` and `Supabase Config Placeholder (Unused)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `showNotification()` connect `Admin & Menu CRUD` to `POS App Logic`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `allItems`, `tables`, `menuCatalog` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `POS App Core (Old Path)` be split into smaller, more focused modules?**
  _Cohesion score 0.1310344827586207 - nodes in this community are weakly interconnected._
- **Should `POS App Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._
- **Should `Admin & Menu CRUD` be split into smaller, more focused modules?**
  _Cohesion score 0.1349206349206349 - nodes in this community are weakly interconnected._