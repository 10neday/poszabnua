// ── Auth guard (admin only) ───────────────────────────────────
if (sessionStorage.getItem('zn_auth') !== 'admin') {
  window.location.href = 'login.html';
}

const SALES_KEY = 'zn_sales_log';

let allBills = [];
let viewMode = 'today'; // 'today' | 'all'

// ── Boot ──────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  loadBills();
  renderStats();
  setFilter('today');
  document.getElementById('filter-today').addEventListener('click', () => setFilter('today'));
  document.getElementById('filter-all').addEventListener('click',   () => setFilter('all'));
});

// ── Load ──────────────────────────────────────────────────────
function loadBills() {
  try {
    allBills = JSON.parse(localStorage.getItem(SALES_KEY) || '[]');
  } catch {
    allBills = [];
  }
  allBills.sort((a, b) => b.id - a.id);
}

// ── Stats ─────────────────────────────────────────────────────
function renderStats() {
  const today      = new Date().toDateString();
  const todayBills = allBills.filter(b => new Date(b.timestamp).toDateString() === today);
  const revenue    = todayBills.reduce((s, b) => s + b.finalTotal, 0);
  const avg        = todayBills.length ? Math.round(revenue / todayBills.length) : 0;

  document.getElementById('stat-today-bills').innerText   = todayBills.length;
  document.getElementById('stat-today-revenue').innerText = `฿${revenue.toLocaleString()}`;
  document.getElementById('stat-today-avg').innerText     = `฿${avg.toLocaleString()}`;
  document.getElementById('stat-all-bills').innerText     = allBills.length;
}

// ── Filter ────────────────────────────────────────────────────
function setFilter(mode) {
  viewMode = mode;

  const todayBtn = document.getElementById('filter-today');
  const allBtn   = document.getElementById('filter-all');

  if (mode === 'today') {
    todayBtn.className = 'px-4 py-2 text-sm font-bold rounded-xl bg-orange-500 text-white shadow-md shadow-orange-100 transition-all duration-200';
    allBtn.className   = 'px-4 py-2 text-sm font-bold rounded-xl bg-stone-100 text-stone-600 transition-all duration-200';
  } else {
    allBtn.className   = 'px-4 py-2 text-sm font-bold rounded-xl bg-orange-500 text-white shadow-md shadow-orange-100 transition-all duration-200';
    todayBtn.className = 'px-4 py-2 text-sm font-bold rounded-xl bg-stone-100 text-stone-600 transition-all duration-200';
  }

  renderBillList();
}

// ── Bill list ─────────────────────────────────────────────────
function renderBillList() {
  const container = document.getElementById('bill-list-body');
  const today     = new Date().toDateString();
  const bills     = viewMode === 'today'
    ? allBills.filter(b => new Date(b.timestamp).toDateString() === today)
    : allBills;

  if (bills.length === 0) {
    container.innerHTML = renderEmpty(
      viewMode === 'today' ? 'ยังไม่มีการขายวันนี้' : 'ยังไม่มีประวัติการขาย'
    );
    return;
  }

  // Group by calendar date
  const groups = {};
  bills.forEach(b => {
    const key = new Date(b.timestamp).toLocaleDateString('th-TH', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    if (!groups[key]) groups[key] = { bills: [], revenue: 0 };
    groups[key].bills.push(b);
    groups[key].revenue += b.finalTotal;
  });

  let html = '';
  Object.entries(groups).forEach(([date, group]) => {
    html += `
      <div class="border-b border-stone-100 last:border-0">
        <div class="bg-gradient-to-r from-orange-50 to-stone-50 px-5 py-3 flex items-center justify-between border-b border-orange-100">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-sm font-bold text-stone-700">${date}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-semibold text-stone-400 bg-stone-200 px-2 py-0.5 rounded-full">${group.bills.length} บิล</span>
            <span class="text-sm font-extrabold font-eng text-orange-600">฿${group.revenue.toLocaleString()}</span>
          </div>
        </div>
        ${group.bills.map(b => renderBillRow(b)).join('')}
      </div>`;
  });

  container.innerHTML = html;
}

function renderBillRow(bill) {
  const time       = new Date(bill.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  const itemCount  = bill.items.reduce((s, i) => s + i.qty, 0);
  const hasDisc    = bill.discount > 0;
  const hasSplit   = bill.splitCount > 1;

  const itemsHTML = bill.items.map(item => `
    <tr class="border-b border-stone-100 last:border-0">
      <td class="py-1.5 px-3 text-xs text-stone-700">${item.menu}</td>
      <td class="py-1.5 px-3 text-xs text-center font-eng text-stone-500">${item.qty}x</td>
      <td class="py-1.5 px-3 text-xs text-right font-eng font-semibold text-stone-700">฿${(item.price * item.qty).toLocaleString()}</td>
    </tr>`).join('');

  const detailLine = [
    `ยอดอาหาร ฿${bill.subtotal.toLocaleString()}`,
    hasDisc  ? `ส่วนลด ฿${bill.discount.toLocaleString()}`          : null,
    hasSplit ? `แบ่งจ่าย ${bill.splitCount} คน`                     : null,
    `รับเงิน ฿${bill.cash.toLocaleString()}`,
    `ทอน ฿${bill.change.toLocaleString()}`
  ].filter(Boolean).join(' · ');

  return `
    <div class="border-b border-stone-50 last:border-0">
      <div onclick="toggleBill('bill-${bill.id}')" class="flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50 transition-colors cursor-pointer group">
        <div class="w-14 shrink-0 text-xs font-bold font-eng text-stone-500">${time}</div>
        <div class="w-24 shrink-0 flex items-center gap-1.5">
          <span class="text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-lg">โต๊ะ ${bill.tableId}</span>
          <span class="text-[10px] text-stone-400">${bill.zone}</span>
        </div>
        <div class="flex-grow text-xs text-stone-400">
          ${itemCount} รายการ${hasSplit ? ` · ${bill.splitCount} คน` : ''}
        </div>
        ${hasDisc ? `<div class="text-xs text-stone-300 line-through font-eng">฿${bill.subtotal.toLocaleString()}</div>` : ''}
        <div class="text-sm font-extrabold font-eng text-orange-600 shrink-0">฿${bill.finalTotal.toLocaleString()}</div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-stone-300 group-hover:text-stone-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div id="bill-${bill.id}" class="hidden bg-stone-50 px-5 pb-4 border-t border-stone-100">
        <table class="w-full text-left mt-3 mb-3">
          <thead>
            <tr class="border-b border-stone-200">
              <th class="pb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">เมนู</th>
              <th class="pb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 text-center w-16">จำนวน</th>
              <th class="pb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 text-right w-24">รวม</th>
            </tr>
          </thead>
          <tbody>${itemsHTML}</tbody>
        </table>
        <div class="text-[11px] text-stone-400 font-medium border-t border-stone-200 pt-2">${detailLine}</div>
      </div>
    </div>`;
}

function toggleBill(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden');
}

function renderEmpty(msg) {
  return `
    <div class="flex flex-col items-center justify-center py-20 text-stone-400 gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-sm font-medium">${msg}</p>
    </div>`;
}

// ── Clear log ─────────────────────────────────────────────────
function clearSalesLog() {
  if (!confirm('ลบประวัติการขายทั้งหมด?\nการกระทำนี้ไม่สามารถย้อนกลับได้')) return;
  localStorage.removeItem(SALES_KEY);
  allBills = [];
  renderStats();
  renderBillList();
  showToast('ล้างข้อมูลเรียบร้อย');
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  document.getElementById('toast-text').innerText = msg;
  toast.classList.remove('translate-y-24', 'opacity-0');
  setTimeout(() => toast.classList.add('translate-y-24', 'opacity-0'), 4000);
}
