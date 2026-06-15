# Graph Report - .  (2026-06-15)

## Corpus Check
- Corpus is ~7,722 words - fits in a single context window. You may not need a graph.

## Summary
- 81 nodes · 159 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Sales Reports & History|Sales Reports & History]]
- [[_COMMUNITY_PIN Auth & Role Guard|PIN Auth & Role Guard]]
- [[_COMMUNITY_POS Order & Checkout|POS Order & Checkout]]
- [[_COMMUNITY_Menu Management Admin|Menu Management Admin]]
- [[_COMMUNITY_Table & Floor Map|Table & Floor Map]]
- [[_COMMUNITY_Menu List & Stats UI|Menu List & Stats UI]]
- [[_COMMUNITY_Bill Calculation & Discounts|Bill Calculation & Discounts]]
- [[_COMMUNITY_Menu Persistence Layer|Menu Persistence Layer]]
- [[_COMMUNITY_UI Panel Controls|UI Panel Controls]]
- [[_COMMUNITY_Menu Form Submission|Menu Form Submission]]
- [[_COMMUNITY_Page Navigation Links|Page Navigation Links]]
- [[_COMMUNITY_Supabase Config (Unused)|Supabase Config (Unused)]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]

## God Nodes (most connected - your core abstractions)
1. `submitForm()` - 8 edges
2. `renderTableDetails()` - 7 edges
3. `saveToStorage()` - 6 edges
4. `updateBillCalculation()` - 6 edges
5. `zn_auth sessionStorage Role Token (staff | admin)` - 6 edges
6. `renderMenuList()` - 5 edges
7. `toggleActive()` - 5 edges
8. `deleteItem()` - 5 edges
9. `showNotification()` - 5 edges
10. `handleAddMenuItem()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `showNotification()` --semantically_similar_to--> `showNotification()`  [INFERRED] [semantically similar]
  poszabnua/admin.js → poszabnua/app.js
- `showNotification()` --semantically_similar_to--> `showToast()`  [INFERRED] [semantically similar]
  poszabnua/app.js → poszabnua/report.js
- `validatePin()` --references--> `index.html – POS Floor Map & Ordering UI`  [EXTRACTED]
  poszabnua/login.js → poszabnua/index.html
- `defaultMenu` --semantically_similar_to--> `fallbackMenu`  [INFERRED] [semantically similar]
  poszabnua/admin.js → poszabnua/app.js
- `loadFromStorage()` --semantically_similar_to--> `loadMenu()`  [INFERRED] [semantically similar]
  poszabnua/admin.js → poszabnua/app.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **PIN Auth + sessionStorage Role Guard (login sets token; admin, app, report enforce it)** — poszabnua_login, poszabnua_concept_zn_auth, poszabnua_admin, poszabnua_app, poszabnua_report [EXTRACTED 1.00]
- **Menu Data Pipeline (admin writes → zn_menu_items → app reads active items)** — poszabnua_admin_savetostorage, poszabnua_concept_menu_key, poszabnua_app_loadmenu [EXTRACTED 1.00]
- **Sales Data Pipeline (app writes bills → zn_sales_log → report reads + today revenue)** — poszabnua_app_savebilltolog, poszabnua_concept_sales_key, poszabnua_report_loadbills, poszabnua_app_loadtodayrevenue [EXTRACTED 1.00]

## Communities (13 total, 2 thin omitted)

### Community 0 - "Sales Reports & History"
Cohesion: 0.23
Nodes (10): loadTodayRevenue(), zn_sales_log localStorage Key, allBills, clearSalesLog(), loadBills(), renderBillList(), renderEmpty(), renderStats() (+2 more)

### Community 1 - "PIN Auth & Role Guard"
Cohesion: 0.33
Nodes (10): showAdminLink(), zn_auth sessionStorage Role Token (staff | admin), backspacePin(), clearPin(), hideError(), login.html – PIN Login UI, pressPin(), showError() (+2 more)

### Community 2 - "POS Order & Checkout"
Cohesion: 0.24
Nodes (5): handleCheckBill(), menuCatalog, printReceipt(), saveBillToLog(), tables

### Community 3 - "Menu Management Admin"
Cohesion: 0.32
Nodes (6): allItems, defaultMenu, hideFormError(), openAddForm(), openEditForm(), fallbackMenu

### Community 4 - "Table & Floor Map"
Cohesion: 0.38
Nodes (7): adjustItemQty(), handleCheckIn(), handleTableSelect(), renderFloorMap(), renderOrderSummaryTable(), renderTableDetails(), updateStats()

### Community 5 - "Menu List & Stats UI"
Cohesion: 0.47
Nodes (6): deleteItem(), renderEmptyState(), renderMenuList(), renderStats(), showNotification(), toggleActive()

### Community 6 - "Bill Calculation & Discounts"
Cohesion: 0.53
Nodes (6): adjustSplit(), getFinalTotal(), getSubtotal(), setDiscountMode(), showCheckBillConfirm(), updateBillCalculation()

### Community 7 - "Menu Persistence Layer"
Cohesion: 0.60
Nodes (5): loadFromStorage(), saveToStorage(), loadMenu(), populateMenuCatalog(), zn_menu_items localStorage Key

### Community 8 - "UI Panel Controls"
Cohesion: 0.40
Nodes (5): closeDetailsDrawer(), handleAddMenuItem(), hideAddMenuPanel(), hideCheckBillConfirm(), showNotification()

### Community 9 - "Menu Form Submission"
Cohesion: 0.50
Nodes (4): closeForm(), nextId(), showFormError(), submitForm()

### Community 10 - "Page Navigation Links"
Cohesion: 1.00
Nodes (3): admin.html – Menu Management UI, index.html – POS Floor Map & Ordering UI, report.html – Sales Report UI

## Knowledge Gaps
- **5 isolated node(s):** `allItems`, `tables`, `menuCatalog`, `allBills`, `README – poszabnua project`
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `zn_auth sessionStorage Role Token (staff | admin)` connect `PIN Auth & Role Guard` to `Sales Reports & History`, `POS Order & Checkout`, `Menu Management Admin`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `login.html – PIN Login UI` connect `PIN Auth & Role Guard` to `Sales Reports & History`, `POS Order & Checkout`, `Menu Management Admin`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `loadMenu()` connect `Menu Persistence Layer` to `POS Order & Checkout`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `allItems`, `tables`, `menuCatalog` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._