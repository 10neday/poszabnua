# Graph Report - .  (2026-06-17)

## Corpus Check
- 11 files · ~11,879 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 192 nodes · 377 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_POS Order Management|POS Order Management]]
- [[_COMMUNITY_Admin Menu Management|Admin Menu Management]]
- [[_COMMUNITY_POS Table & Order UI|POS Table & Order UI]]
- [[_COMMUNITY_Admin Panel Functions|Admin Panel Functions]]
- [[_COMMUNITY_API Server & Database|API Server & Database]]
- [[_COMMUNITY_Sales Report Module|Sales Report Module]]
- [[_COMMUNITY_Pages & Auth Store|Pages & Auth Store]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_PIN Login Flow (AST)|PIN Login Flow (AST)]]
- [[_COMMUNITY_Login Authentication|Login Authentication]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]

## God Nodes (most connected - your core abstractions)
1. `submitForm()` - 11 edges
2. `submitForm()` - 8 edges
3. `renderTableDetails()` - 7 edges
4. `renderTableDetails()` - 7 edges
5. `handleCheckBill()` - 7 edges
6. `clearSalesLog()` - 7 edges
7. `loadFromDb()` - 7 edges
8. `saveToStorage()` - 6 edges
9. `updateBillCalculation()` - 6 edges
10. `zn_auth sessionStorage Role Token (staff | admin)` - 6 edges

## Surprising Connections (you probably didn't know these)
- `loadFromStorage()` --semantically_similar_to--> `loadBills()`  [INFERRED] [semantically similar]
  admin.js → report.js
- `renderStats()` --semantically_similar_to--> `renderStats()`  [INFERRED] [semantically similar]
  admin.js → report.js
- `Report Page — Sales History` --references--> `loadBills()`  [INFERRED]
  report.html → report.js
- `defaultMenu` --semantically_similar_to--> `fallbackMenu`  [INFERRED] [semantically similar]
  admin.js → app.js
- `filterMenuList()` --semantically_similar_to--> `filterMenuSearch()`  [INFERRED] [semantically similar]
  admin.js → app.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Bill Checkout Flow - Print, Save, Update** — app_handlecheckbill, app_savebilltolog, app_printreceipt, server [EXTRACTED 1.00]
- **Admin-Only Auth Guard Across All Protected Pages** — admin, report, login_html, concept_auth_guard [EXTRACTED 1.00]
- **Menu CRUD Pipeline - Admin to DB** — admin_loadfromdb, admin_submitform, server, concept_menu_items_schema [EXTRACTED 1.00]

## Communities (12 total, 1 thin omitted)

### Community 0 - "POS Order Management"
Cohesion: 0.13
Nodes (24): adjustItemQty(), adjustSplit(), closeDetailsDrawer(), getFinalTotal(), getSubtotal(), handleAddMenuItem(), handleCheckBill(), handleCheckIn() (+16 more)

### Community 1 - "Admin Menu Management"
Cohesion: 0.14
Nodes (27): allItems, closeForm(), defaultMenu, deleteItem(), filterMenuList(), hideFormError(), loadFromDb(), loadFromStorage() (+19 more)

### Community 2 - "POS Table & Order UI"
Cohesion: 0.14
Nodes (21): adjustItemQty(), adjustSplit(), closeDetailsDrawer(), getFinalTotal(), getSubtotal(), handleAddMenuItem(), handleCheckBill(), handleCheckIn() (+13 more)

### Community 3 - "Admin Panel Functions"
Cohesion: 0.17
Nodes (21): allItems, closeForm(), defaultMenu, deleteItem(), hideFormError(), loadFromStorage(), nextId(), openAddForm() (+13 more)

### Community 4 - "API Server & Database"
Cohesion: 0.15
Nodes (17): loadMenu(), loadTodayRevenue(), populateMenuCatalog(), saveBillToLog(), menu_items DB Table Schema, sales_log DB Table Schema, { Pool }, Package Manifest - poszabnua (+9 more)

### Community 5 - "Sales Report Module"
Cohesion: 0.18
Nodes (13): admin.html – Menu Management UI, loadTodayRevenue(), zn_sales_log localStorage Key, index.html – POS Floor Map & Ordering UI, allBills, clearSalesLog(), report.html – Sales Report UI, loadBills() (+5 more)

### Community 6 - "Pages & Auth Store"
Cohesion: 0.26
Nodes (10): Admin Page — Menu Management, Index Page — POS Floor Map, allBills, clearSalesLog(), Report Page — Sales History, renderBillList(), renderEmpty(), renderStats() (+2 more)

### Community 7 - "Package Dependencies"
Cohesion: 0.17
Nodes (11): dependencies, cors, dotenv, express, pg, main, name, scripts (+3 more)

### Community 8 - "PIN Login Flow (AST)"
Cohesion: 0.33
Nodes (10): showAdminLink(), zn_auth sessionStorage Role Token (staff | admin), backspacePin(), clearPin(), hideError(), login.html – PIN Login UI, pressPin(), showError() (+2 more)

### Community 9 - "Login Authentication"
Cohesion: 0.50
Nodes (8): backspacePin(), clearPin(), hideError(), Login Page — PIN Entry, pressPin(), showError(), updateDots(), validatePin()

## Ambiguous Edges - Review These
- `zn_menu_items localStorage (Shared Menu Store)` → `Supabase Config Placeholder (Unused)`  [AMBIGUOUS]
  config.js · relation: conceptually_related_to

## Knowledge Gaps
- **25 isolated node(s):** `allItems`, `tables`, `menuCatalog`, `allBills`, `README – poszabnua project` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `zn_menu_items localStorage (Shared Menu Store)` and `Supabase Config Placeholder (Unused)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Login Page — PIN Entry` connect `Login Authentication` to `Admin Menu Management`, `POS Table & Order UI`, `Pages & Auth Store`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `sessionStorage PIN Auth Guard Pattern` connect `Admin Menu Management` to `POS Table & Order UI`, `Pages & Auth Store`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `zn_auth sessionStorage Role Token (staff | admin)` connect `PIN Login Flow (AST)` to `POS Order Management`, `Admin Panel Functions`, `Sales Report Module`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `allItems`, `tables`, `menuCatalog` to the rest of the system?**
  _26 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `POS Order Management` be split into smaller, more focused modules?**
  _Cohesion score 0.1310344827586207 - nodes in this community are weakly interconnected._
- **Should `Admin Menu Management` be split into smaller, more focused modules?**
  _Cohesion score 0.1354679802955665 - nodes in this community are weakly interconnected._