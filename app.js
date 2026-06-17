// ── Auth guard ────────────────────────────────────────────────
if (!sessionStorage.getItem('zn_auth')) {
  window.location.href = 'login.html';
}

function logout() {
  sessionStorage.removeItem('zn_auth');
  window.location.href = 'login.html';
}

// ── Live clock ────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const timeEl = document.getElementById('header-time');
  const dateEl = document.getElementById('header-date');
  if (timeEl) timeEl.innerText = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  if (dateEl) dateEl.innerText = now.toLocaleDateString('th-TH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Table data ────────────────────────────────────────────────
let tables = [
  { id: 1,  zone: 'Inside',  capacity: '2-4 คน', status: 'available', orders: [], position: { left: '80%', top: '12%', width: '10%', height: '26%' } },
  { id: 2,  zone: 'Inside',  capacity: '2-4 คน', status: 'available', orders: [], position: { left: '60%', top: '12%', width: '10%', height: '26%' } },
  { id: 3,  zone: 'Inside',  capacity: '2-4 คน', status: 'available', orders: [], position: { left: '40%', top: '12%', width: '10%', height: '26%' } },
  { id: 4,  zone: 'Inside',  capacity: '3-6 คน', status: 'available', orders: [], position: { left: '10%', top: '12%', width: '15%', height: '76%' } },
  { id: 5,  zone: 'Inside',  capacity: '2-4 คน', status: 'available', orders: [], position: { left: '80%', top: '62%', width: '10%', height: '26%' } },
  { id: 6,  zone: 'Inside',  capacity: '2-4 คน', status: 'available', orders: [], position: { left: '60%', top: '62%', width: '10%', height: '26%' } },
  { id: 7,  zone: 'Inside',  capacity: '2-4 คน', status: 'available', orders: [], position: { left: '40%', top: '62%', width: '10%', height: '26%' } },
  { id: 8,  zone: 'Outside', capacity: '3-6 คน', status: 'available', orders: [], position: { left: '80%', top: '8%',  width: '15%', height: '40%' } },
  { id: 9,  zone: 'Outside', capacity: '2-4 คน', status: 'available', orders: [], position: { left: '60%', top: '23%', width: '10%', height: '22%' } },
  { id: 10, zone: 'Outside', capacity: '2-4 คน', status: 'available', orders: [], position: { left: '40%', top: '23%', width: '10%', height: '22%' } },
  { id: 11, zone: 'Outside', capacity: '3-6 คน', status: 'available', orders: [], position: { left: '10%', top: '8%',  width: '15%', height: '40%' } },
  { id: 12, zone: 'Outside', capacity: '3-6 คน', status: 'available', orders: [], position: { left: '80%', top: '52%', width: '15%', height: '40%' } },
  { id: 13, zone: 'Outside', capacity: '2-4 คน', status: 'available', orders: [], position: { left: '60%', top: '56%', width: '10%', height: '22%' } },
  { id: 14, zone: 'Outside', capacity: '2-4 คน', status: 'available', orders: [], position: { left: '40%', top: '56%', width: '10%', height: '22%' } },
  { id: 15, zone: 'Outside', capacity: '3-6 คน', status: 'available', orders: [], position: { left: '10%', top: '52%', width: '15%', height: '40%' } },
];

let menuCatalog       = [];
let activeTableId     = null;
let totalRevenue      = 0;
let selectedMenuIndex = null;

async function loadTodayRevenue() {
  try {
    const res  = await fetch('/api/sales?today=true');
    const bills = await res.json();
    return bills.reduce((sum, b) => sum + b.finalTotal, 0);
  } catch { return 0; }
}

// Bill state
let discountMode = 'amount'; // 'amount' | 'percent'
let splitCount   = 1;

// ── Active table persistence ──────────────────────────────────
async function loadActiveTables() {
  try {
    const res  = await fetch('/api/active-tables');
    const rows = await res.json();
    rows.forEach(row => {
      const table = tables.find(t => t.id === row.table_id);
      if (table) {
        table.status = 'occupied';
        table.orders = row.orders || [];
      }
    });
  } catch {}
}

async function saveTableState(tableId) {
  const table = tables.find(t => t.id === tableId);
  if (!table) return;
  if (table.status === 'occupied') {
    await fetch(`/api/active-tables/${tableId}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ zone: table.zone, orders: table.orders }),
    });
  } else {
    await fetch(`/api/active-tables/${tableId}`, { method: 'DELETE' });
  }
}

// ── Boot ──────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  updateClock();
  setInterval(updateClock, 1000);
  showAdminLink();
  await loadActiveTables();
  renderFloorMap();
  totalRevenue = await loadTodayRevenue();
  updateStats();
  setupEventListeners();
  await loadMenu();
});

// ── Admin link ────────────────────────────────────────────────
function showAdminLink() {
  if (sessionStorage.getItem('zn_auth') === 'admin') {
    const link       = document.getElementById('admin-link');
    const reportLink = document.getElementById('report-link');
    if (link)       link.classList.remove('hidden');
    if (reportLink) reportLink.classList.remove('hidden');
  }
}

// ── Menu loading ──────────────────────────────────────────────
async function loadMenu() {
  try {
    const res  = await fetch('/api/menu');
    const all  = await res.json();
    menuCatalog = all.filter(item => item.is_active !== false);
  } catch {
    menuCatalog = [];
  }
  populateMenuCatalog();
}

// ── Stats ─────────────────────────────────────────────────────
function updateStats() {
  const occupied  = tables.filter(t => t.status === 'occupied').length;
  const available = tables.length - occupied;
  document.getElementById('stat-occupied').innerText  = occupied;
  document.getElementById('stat-available').innerText = available;
  document.getElementById('stat-sales').innerText     = `฿${totalRevenue.toLocaleString()}`;
}

// ── Floor map render ──────────────────────────────────────────
function renderFloorMap() {
  const inside  = document.getElementById('inside-zone-map');
  const outside = document.getElementById('outside-zone-map');
  inside.innerHTML  = '';
  outside.innerHTML = '';

  tables.forEach(table => {
    const card = document.createElement('div');
    card.id        = `table-${table.id}`;
    card.className = 'table-card';

    card.style.left   = table.position.left;
    card.style.top    = table.position.top;
    card.style.width  = table.position.width;
    card.style.height = table.position.height;

    const subLabel = table.status === 'occupied'
      ? `${table.orders.length} รายการ`
      : table.capacity;

    card.innerHTML = `
      <div class="table-num">${table.id}</div>
      <div class="table-sub">${subLabel}</div>`;

    card.classList.add(table.status === 'available' ? 'status-available' : 'status-occupied');

    if (activeTableId !== null) {
      card.classList.add(activeTableId === table.id ? 'state-selected' : 'state-dimmed');
    }

    card.addEventListener('click', () => handleTableSelect(table.id));
    (table.zone === 'Inside' ? inside : outside).appendChild(card);
  });
}

// ── Table select ──────────────────────────────────────────────
function handleTableSelect(tableId) {
  activeTableId = tableId;
  renderFloorMap();
  const table = tables.find(t => t.id === tableId);
  if (!table) return;
  document.getElementById('details-drawer').classList.remove('translate-x-full');
  renderTableDetails(table);
}

function closeDetailsDrawer() {
  activeTableId = null;
  renderFloorMap();
  document.getElementById('details-drawer').classList.add('translate-x-full');
  hideAddMenuPanel();
  hideCheckBillConfirm();
}

// ── Drawer details ────────────────────────────────────────────
function renderTableDetails(table) {
  hideCheckBillConfirm();

  document.getElementById('drawer-table-num').innerText  = `โต๊ะ ${table.id}`;
  document.getElementById('drawer-capacity').innerText   = `ขนาด: ${table.capacity}`;
  document.getElementById('drawer-table-zone').innerText = table.zone === 'Inside' ? 'Inside (ด้านใน)' : 'Outside (ด้านนอก)';

  const badge     = document.getElementById('drawer-status-badge');
  const viewAvail = document.getElementById('view-available');
  const viewOcc   = document.getElementById('view-occupied');

  if (table.status === 'available') {
    badge.innerText  = 'ว่าง';
    badge.className  = 'px-3 py-1.5 rounded-full text-white font-bold text-xs bg-green-500 shadow-sm shrink-0';
    viewAvail.classList.remove('hidden');
    viewOcc.classList.add('hidden');
  } else {
    badge.innerText  = 'กำลังใช้บริการ';
    badge.className  = 'px-3 py-1.5 rounded-full text-white font-bold text-xs bg-red-500 shadow-sm shrink-0';
    viewAvail.classList.add('hidden');
    viewOcc.classList.remove('hidden');
    renderOrderSummaryTable(table);
  }
}

// ── Check-in ──────────────────────────────────────────────────
async function handleCheckIn() {
  if (activeTableId === null) return;
  const table = tables.find(t => t.id === activeTableId);
  if (table && table.status === 'available') {
    table.status = 'occupied';
    table.orders = [];
    await saveTableState(table.id);
    renderTableDetails(table);
    renderFloorMap();
    updateStats();
  }
}

// ── Order summary ─────────────────────────────────────────────
function renderOrderSummaryTable(table) {
  const tbody = document.getElementById('order-summary-body');
  tbody.innerHTML = '';
  let total = 0;

  if (table.orders.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="5" class="py-10 text-center text-stone-400 italic text-sm">ยังไม่มีรายการอาหาร</td></tr>`;
  } else {
    table.orders.forEach((item, idx) => {
      const amount = item.price * item.qty;
      total += amount;
      const row = document.createElement('tr');
      row.className = 'order-row-item';
      row.innerHTML = `
        <td class="py-3 px-3 text-center font-eng text-xs" style="color: var(--navy-400);">${idx + 1}</td>
        <td class="py-3 px-3 font-medium text-sm" style="color: var(--navy-800);">${item.menu}</td>
        <td class="py-3 px-3 text-right font-eng text-sm" style="color: var(--navy-500);">฿${item.price}</td>
        <td class="py-3 px-3 text-center">
          <div class="inline-flex items-center gap-2">
            <button onclick="adjustItemQty(${table.id}, ${idx}, -1)" class="qty-btn w-6 h-6 flex items-center justify-center font-bold text-sm leading-none">−</button>
            <span class="w-6 text-center font-bold font-eng text-sm" style="color: var(--navy-800);">${item.qty}</span>
            <button onclick="adjustItemQty(${table.id}, ${idx},  1)" class="qty-btn w-6 h-6 flex items-center justify-center font-bold text-sm leading-none">+</button>
          </div>
        </td>
        <td class="py-3 px-3 text-right font-bold font-eng text-sm" style="color: var(--navy-800);">฿${amount.toLocaleString()}</td>`;
      tbody.appendChild(row);
    });
  }

  document.getElementById('order-total-amount').innerText = `฿${total.toLocaleString()}`;
}

async function adjustItemQty(tableId, itemIndex, delta) {
  const table = tables.find(t => t.id === tableId);
  if (!table) return;
  const item = table.orders[itemIndex];
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) table.orders.splice(itemIndex, 1);
  await saveTableState(tableId);
  renderTableDetails(table);
  updateStats();
}

// ── Menu catalog ──────────────────────────────────────────────
function populateMenuCatalog() {
  const dropdown = document.getElementById('menu-item-select');
  if (!dropdown) return;
  dropdown.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.value    = '';
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.innerText = '— เลือกหมวดหมู่ / เมนู —';
  dropdown.appendChild(placeholder);

  const groups = {};
  menuCatalog.forEach((item, index) => {
    const cat = item.category || 'อื่นๆ';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push({ ...item, index });
  });

  Object.entries(groups).forEach(([cat, items]) => {
    const group = document.createElement('optgroup');
    group.label = cat;
    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value    = item.index;
      opt.innerText = `${item.name}  —  ฿${item.price}`;
      group.appendChild(opt);
    });
    dropdown.appendChild(group);
  });
}

function showAddMenuPanel() {
  document.getElementById('add-menu-panel').classList.remove('hidden');
  document.getElementById('add-menu-qty').value = 1;
  selectedMenuIndex = null;
  const searchInput = document.getElementById('menu-search-input');
  if (searchInput) searchInput.value = '';
  document.getElementById('menu-search-results').classList.add('hidden');
  document.getElementById('selected-menu-display').classList.add('hidden');
  document.getElementById('selected-menu-empty').classList.remove('hidden');
  const dropdown = document.getElementById('menu-item-select');
  if (dropdown) dropdown.value = '';
  setTimeout(() => { if (searchInput) searchInput.focus(); }, 50);
}

function hideAddMenuPanel() {
  document.getElementById('add-menu-panel').classList.add('hidden');
}

function filterMenuSearch(query) {
  const resultsEl = document.getElementById('menu-search-results');
  if (!resultsEl) return;
  const q = query.toLowerCase().trim();
  if (!q) { resultsEl.classList.add('hidden'); return; }

  const matches = menuCatalog
    .map((item, index) => ({ ...item, index }))
    .filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q)
    )
    .slice(0, 20);

  if (matches.length === 0) {
    resultsEl.innerHTML = `<div class="px-4 py-3 text-xs text-center" style="color: var(--navy-400);">ไม่พบเมนู "${query}"</div>`;
  } else {
    resultsEl.innerHTML = matches.map(item => `
      <div onclick="selectMenuItem(${item.index})"
        class="px-3 py-2.5 cursor-pointer hover:bg-amber-50 flex items-center justify-between gap-2 transition-colors"
        style="border-bottom: 1px solid var(--navy-100);">
        <div class="min-w-0">
          <div class="text-sm font-semibold truncate" style="color: var(--navy-800);">${item.name}</div>
          <div class="text-[10px] mt-0.5" style="color: var(--navy-400);">${item.category || ''}</div>
        </div>
        <span class="text-sm font-bold font-eng shrink-0" style="color: var(--gold-600);">฿${item.price}</span>
      </div>`).join('');
  }
  resultsEl.classList.remove('hidden');
}

function selectMenuItem(index) {
  selectedMenuIndex = index;
  const item = menuCatalog[index];
  if (!item) return;

  const dropdown = document.getElementById('menu-item-select');
  if (dropdown) dropdown.value = index;

  document.getElementById('selected-menu-name').innerText     = item.name;
  document.getElementById('selected-menu-category').innerText = item.category || '';
  document.getElementById('selected-menu-price').innerText    = `฿${item.price}`;
  document.getElementById('selected-menu-display').classList.remove('hidden');
  document.getElementById('selected-menu-empty').classList.add('hidden');

  const searchInput = document.getElementById('menu-search-input');
  if (searchInput) searchInput.value = '';
  document.getElementById('menu-search-results').classList.add('hidden');
}

async function handleAddMenuItem() {
  if (activeTableId === null) return;
  const table = tables.find(t => t.id === activeTableId);
  if (!table || table.status !== 'occupied') return;

  const selected = selectedMenuIndex !== null ? menuCatalog[selectedMenuIndex] : null;
  const qty      = parseInt(document.getElementById('add-menu-qty').value) || 1;
  if (!selected) { showNotification('กรุณาเลือกเมนูอาหารก่อน'); return; }

  const existing = table.orders.find(o => o.menu === selected.name);
  if (existing) {
    existing.qty += qty;
  } else {
    table.orders.push({ menu: selected.name, price: selected.price, qty });
  }

  await saveTableState(activeTableId);
  hideAddMenuPanel();
  renderTableDetails(table);
  updateStats();
  showNotification(`เพิ่ม "${selected.name}" x${qty} เรียบร้อย`);
}

// ── Discount + Split bill ─────────────────────────────────────
function getSubtotal() {
  if (activeTableId === null) return 0;
  const table = tables.find(t => t.id === activeTableId);
  return table ? table.orders.reduce((s, i) => s + i.price * i.qty, 0) : 0;
}

function getFinalTotal() {
  const subtotal = getSubtotal();
  const discountVal = parseFloat(document.getElementById('discount-input')?.value) || 0;
  const discount = discountMode === 'percent'
    ? Math.floor(subtotal * Math.min(discountVal, 100) / 100)
    : Math.min(discountVal, subtotal);
  return Math.max(0, subtotal - discount);
}

function setDiscountMode(mode) {
  discountMode = mode;
  const amountBtn  = document.getElementById('discount-mode-amount');
  const percentBtn = document.getElementById('discount-mode-percent');

  if (mode === 'amount') {
    amountBtn.classList.add('bg-white', 'text-stone-800', 'shadow-sm');
    amountBtn.classList.remove('text-stone-400');
    percentBtn.classList.remove('bg-white', 'text-stone-800', 'shadow-sm');
    percentBtn.classList.add('text-stone-400');
  } else {
    percentBtn.classList.add('bg-white', 'text-stone-800', 'shadow-sm');
    percentBtn.classList.remove('text-stone-400');
    amountBtn.classList.remove('bg-white', 'text-stone-800', 'shadow-sm');
    amountBtn.classList.add('text-stone-400');
  }
  updateBillCalculation();
}

function adjustSplit(delta) {
  splitCount = Math.max(1, splitCount + delta);
  document.getElementById('split-count').innerText = splitCount;
  const perPersonEl = document.getElementById('split-per-person');
  if (splitCount > 1) {
    perPersonEl.classList.remove('hidden');
  } else {
    perPersonEl.classList.add('hidden');
  }
  updateBillCalculation();
}

function updateBillCalculation() {
  const subtotal   = getSubtotal();
  const finalTotal = getFinalTotal();
  const cash       = parseFloat(document.getElementById('check-bill-cash-input')?.value) || 0;

  const subtotalEl  = document.getElementById('bill-subtotal');
  const finalEl     = document.getElementById('bill-final-total');
  const changeEl    = document.getElementById('check-bill-change-amount');
  const confirmBtn  = document.getElementById('btn-confirm-check-bill-ok');
  const perPersonEl = document.getElementById('per-person-amount');

  if (subtotalEl) subtotalEl.innerText = `฿${subtotal.toLocaleString()}`;
  if (finalEl)    finalEl.innerText    = `฿${finalTotal.toLocaleString()}`;
  if (perPersonEl && splitCount > 1) {
    perPersonEl.innerText = `฿${Math.ceil(finalTotal / splitCount).toLocaleString()}`;
  }

  if (!changeEl || !confirmBtn) return;

  if (cash < finalTotal) {
    changeEl.innerText  = 'เงินไม่พอ';
    changeEl.className  = 'text-base font-extrabold font-eng text-red-500';
    confirmBtn.disabled = true;
    confirmBtn.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    changeEl.innerText  = `฿${(cash - finalTotal).toLocaleString()}`;
    changeEl.className  = 'text-base font-extrabold font-eng text-green-600';
    confirmBtn.disabled = false;
    confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

// ── Check-bill ────────────────────────────────────────────────
function showCheckBillConfirm() {
  if (activeTableId === null) return;
  const table = tables.find(t => t.id === activeTableId);
  if (!table || table.orders.length === 0) {
    showNotification('ยังไม่มีรายการอาหาร');
    return;
  }

  splitCount = 1;
  discountMode = 'amount';
  document.getElementById('split-count').innerText = 1;
  document.getElementById('split-per-person').classList.add('hidden');
  document.getElementById('discount-input').value = 0;

  setDiscountMode('amount');

  const finalTotal = getFinalTotal();
  document.getElementById('check-bill-cash-input').value = finalTotal;

  updateBillCalculation();

  document.getElementById('btn-check-bill').classList.add('hidden');
  document.getElementById('check-bill-confirm-panel').classList.remove('hidden');
}

function hideCheckBillConfirm() {
  const panel = document.getElementById('check-bill-confirm-panel');
  const btn   = document.getElementById('btn-check-bill');
  if (panel) panel.classList.add('hidden');
  if (btn)   btn.classList.remove('hidden');
}

// ── Save bill to DB ───────────────────────────────────────────
async function saveBillToLog(table, finalTotal, cash, change) {
  const subtotal = table.orders.reduce((s, i) => s + i.price * i.qty, 0);
  await fetch('/api/sales', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableId:    table.id,
      zone:       table.zone,
      items:      table.orders.map(o => ({ menu: o.menu, price: o.price, qty: o.qty })),
      subtotal,
      discount:   subtotal - finalTotal,
      finalTotal,
      cash,
      change,
      splitCount,
    }),
  });
}

// ── Receipt ───────────────────────────────────────────────────
function printReceipt(table, cash, change, finalTotal) {
  const subtotal = table.orders.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = subtotal - finalTotal;
  const now      = new Date();
  const date     = now.toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const time     = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  let itemsHTML = '';
  table.orders.forEach(item => {
    itemsHTML += `
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:11px;line-height:1.5;">
        <span style="width:55%;font-family:sans-serif;">${item.menu}</span>
        <span style="width:15%;text-align:center;font-family:monospace;">${item.qty}x</span>
        <span style="width:30%;text-align:right;font-family:monospace;">฿${(item.price * item.qty).toLocaleString()}</span>
      </div>`;
  });

  const discountRow = discount > 0 ? `
    <div style="display:flex;justify-content:space-between;margin-bottom:3px;color:#666;">
      <span>ส่วนลด</span><span>-฿${discount.toLocaleString()}</span>
    </div>` : '';

  const splitRow = splitCount > 1 ? `
    <div style="border-top:1px dashed #ccc;padding-top:6px;margin-top:6px;display:flex;justify-content:space-between;font-weight:bold;color:#555;font-size:11px;">
      <span>ต่อคน (${splitCount} คน)</span>
      <span>฿${Math.ceil(finalTotal / splitCount).toLocaleString()}</span>
    </div>` : '';

  document.getElementById('receipt-print-area').innerHTML = `
    <div style="padding:20px;font-family:'Courier New',Courier,monospace;max-width:80mm;margin:0 auto;background:#fff;color:#000;">
      <div style="text-align:center;margin-bottom:14px;">
        <h2 style="margin:0;font-size:20px;font-weight:800;font-family:sans-serif;letter-spacing:1px;">RECEIPT</h2>
        <p style="margin:4px 0 0;font-size:13px;font-weight:700;font-family:sans-serif;">แซ่บนัวกาฬสินธุ์</p>
        <p style="margin:2px 0;font-size:10px;color:#333;font-family:sans-serif;">สาขากาญจนบุรี</p>
        <p style="margin:2px 0;font-size:10px;color:#333;font-family:sans-serif;">โทร: 095 228 1911</p>
      </div>
      <div style="border-top:1px dashed #000;border-bottom:1px dashed #000;padding:6px 0;margin-bottom:10px;font-size:11px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
          <span>โต๊ะ: <strong>โต๊ะ ${table.id}</strong></span>
          <span>โซน: ${table.zone}</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span>วันที่: ${date}</span><span>เวลา: ${time}</span>
        </div>
      </div>
      <div style="margin-bottom:10px;">
        <div style="border-bottom:1px dashed #000;margin-bottom:7px;padding-bottom:4px;font-weight:700;font-size:11px;display:flex;justify-content:space-between;">
          <span style="width:55%;">รายการ</span>
          <span style="width:15%;text-align:center;">จำนวน</span>
          <span style="width:30%;text-align:right;">รวม</span>
        </div>
        ${itemsHTML}
      </div>
      <div style="border-top:1px dashed #000;padding-top:8px;margin-bottom:10px;font-size:11px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
          <span>ยอดอาหาร</span><span>฿${subtotal.toLocaleString()}</span>
        </div>
        ${discountRow}
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:14px;margin-top:4px;margin-bottom:6px;border-top:1px solid #eee;padding-top:6px;">
          <span>TOTAL</span><span>฿${finalTotal.toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
          <span>CASH</span><span>฿${cash.toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span>CHANGE</span><span>฿${change.toLocaleString()}</span>
        </div>
        ${splitRow}
      </div>
      <div style="border-top:1px dashed #000;padding-top:10px;text-align:center;font-size:14px;font-weight:800;letter-spacing:2px;margin-bottom:14px;font-family:sans-serif;">THANK YOU</div>
      <div style="display:flex;justify-content:center;margin-bottom:8px;opacity:.85;">
        <svg style="height:30px;width:140px;" viewBox="0 0 100 20" preserveAspectRatio="none">
          <rect x="0" width="2" height="20" fill="black"></rect><rect x="3" width="1" height="20" fill="black"></rect>
          <rect x="5" width="3" height="20" fill="black"></rect><rect x="10" width="1" height="20" fill="black"></rect>
          <rect x="12" width="2" height="20" fill="black"></rect><rect x="16" width="4" height="20" fill="black"></rect>
          <rect x="21" width="1" height="20" fill="black"></rect><rect x="23" width="2" height="20" fill="black"></rect>
          <rect x="27" width="3" height="20" fill="black"></rect><rect x="32" width="1" height="20" fill="black"></rect>
          <rect x="35" width="2" height="20" fill="black"></rect><rect x="38" width="4" height="20" fill="black"></rect>
          <rect x="44" width="1" height="20" fill="black"></rect><rect x="47" width="3" height="20" fill="black"></rect>
          <rect x="52" width="2" height="20" fill="black"></rect><rect x="58" width="4" height="20" fill="black"></rect>
          <rect x="64" width="2" height="20" fill="black"></rect><rect x="71" width="3" height="20" fill="black"></rect>
          <rect x="76" width="2" height="20" fill="black"></rect><rect x="83" width="4" height="20" fill="black"></rect>
          <rect x="89" width="2" height="20" fill="black"></rect><rect x="96" width="3" height="20" fill="black"></rect>
        </svg>
      </div>
      <div style="text-align:center;font-size:8px;color:#888;font-family:sans-serif;">* แซ่บนัว POS System *</div>
      <div style="margin-top:14px;">
        <svg style="width:100%;height:8px;display:block;" viewBox="0 0 100 10" preserveAspectRatio="none">
          <polygon points="0,0 2.5,10 5,0 7.5,10 10,0 12.5,10 15,0 17.5,10 20,0 22.5,10 25,0 27.5,10 30,0 32.5,10 35,0 37.5,10 40,0 42.5,10 45,0 47.5,10 50,0 52.5,10 55,0 57.5,10 60,0 62.5,10 65,0 67.5,10 70,0 72.5,10 75,0 77.5,10 80,0 82.5,10 85,0 87.5,10 90,0 92.5,10 95,0 97.5,10 100,0 100,10 0,10" fill="#e2e8f0"></polygon>
        </svg>
      </div>
    </div>`;
}

async function handleCheckBill() {
  if (activeTableId === null) return;
  const table = tables.find(t => t.id === activeTableId);
  if (!table || table.status !== 'occupied') return;

  const finalTotal = getFinalTotal();
  const cash       = parseFloat(document.getElementById('check-bill-cash-input').value) || finalTotal;
  const change     = Math.max(0, cash - finalTotal);

  await saveBillToLog(table, finalTotal, cash, change);
  printReceipt(table, cash, change, finalTotal);

  html2canvas(document.getElementById('receipt-print-area'), {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false
  }).then(async canvas => {
    const link    = document.createElement('a');
    link.download = `receipt_table${table.id}_${Date.now()}.jpg`;
    link.href     = canvas.toDataURL('image/jpeg', 0.95);
    link.click();

    totalRevenue += finalTotal;
    table.orders  = [];
    table.status  = 'available';
    splitCount    = 1;
    await saveTableState(table.id);
    closeDetailsDrawer();
    updateStats();
    renderFloorMap();
    showNotification(`เช็คบิล โต๊ะ ${table.id} สำเร็จ — ดาวน์โหลดใบเสร็จแล้ว`);
  }).catch(async () => {
    totalRevenue += finalTotal;
    table.orders  = [];
    table.status  = 'available';
    splitCount    = 1;
    await saveTableState(table.id);
    closeDetailsDrawer();
    updateStats();
    renderFloorMap();
  });
}

// ── Toast ─────────────────────────────────────────────────────
function showNotification(msg) {
  const toast = document.getElementById('toast-notification');
  document.getElementById('toast-text').innerText = msg;
  toast.classList.remove('translate-y-24', 'opacity-0');
  setTimeout(() => toast.classList.add('translate-y-24', 'opacity-0'), 4000);
}

// ── Event listeners ───────────────────────────────────────────
function setupEventListeners() {
  document.getElementById('btn-close-drawer').addEventListener('click', closeDetailsDrawer);
  document.getElementById('btn-check-in').addEventListener('click', handleCheckIn);
  document.getElementById('btn-expand-add-menu').addEventListener('click', showAddMenuPanel);
  document.getElementById('btn-confirm-add-menu').addEventListener('click', handleAddMenuItem);
  document.getElementById('btn-cancel-add-menu').addEventListener('click', hideAddMenuPanel);
  document.getElementById('btn-check-bill').addEventListener('click', showCheckBillConfirm);
  document.getElementById('btn-confirm-check-bill-cancel').addEventListener('click', hideCheckBillConfirm);
  document.getElementById('btn-confirm-check-bill-ok').addEventListener('click', handleCheckBill);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetailsDrawer(); });

  const menuSearchInput   = document.getElementById('menu-search-input');
  const menuSearchResults = document.getElementById('menu-search-results');
  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', () => filterMenuSearch(menuSearchInput.value));
    menuSearchInput.addEventListener('blur', () => {
      setTimeout(() => document.getElementById('menu-search-results')?.classList.add('hidden'), 200);
    });
    if (menuSearchResults) {
      menuSearchResults.addEventListener('mousedown', (e) => { e.preventDefault(); });
    }
  }

  const menuItemSelect = document.getElementById('menu-item-select');
  if (menuItemSelect) {
    menuItemSelect.addEventListener('change', () => {
      const idx = parseInt(menuItemSelect.value);
      if (!isNaN(idx)) selectMenuItem(idx);
    });
  }
}
