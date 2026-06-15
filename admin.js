// ── Auth guard (admin only) ───────────────────────────────────
if (sessionStorage.getItem('zn_auth') !== 'admin') {
  window.location.href = 'login.html';
}

// ── localStorage key ──────────────────────────────────────────
const MENU_KEY = 'zn_menu_items';

// ── Default menu (used on first ever run) ─────────────────────
const defaultMenu = [
  { id: 1,  name: 'ตำข้าวโพด + ปลากรอบ', price: 60,  category: 'ส้มตำ',      is_active: true },
  { id: 2,  name: 'ตำกุ้งสด',             price: 60,  category: 'ส้มตำ',      is_active: true },
  { id: 3,  name: 'ส้มตำไทย',             price: 50,  category: 'ส้มตำ',      is_active: true },
  { id: 4,  name: 'ข้าวเหนียว',           price: 10,  category: 'ข้าว/เส้น',  is_active: true },
  { id: 5,  name: 'เส้นลวก',              price: 10,  category: 'ข้าว/เส้น',  is_active: true },
  { id: 6,  name: 'คอหมูย่าง',            price: 80,  category: 'อาหาร',      is_active: true },
  { id: 7,  name: 'ไก่ย่างครึ่งตัว',      price: 120, category: 'อาหาร',      is_active: true },
  { id: 8,  name: 'น้ำตกหมู',             price: 70,  category: 'อาหาร',      is_active: true },
  { id: 9,  name: 'ลาบหมู',               price: 65,  category: 'อาหาร',      is_active: true },
  { id: 10, name: 'โค้ก',                 price: 20,  category: 'เครื่องดื่ม', is_active: true },
  { id: 11, name: 'น้ำเปล่า + น้ำแข็ง',   price: 15,  category: 'เครื่องดื่ม', is_active: true },
];

let allItems = [];

// ── localStorage helpers ──────────────────────────────────────
function loadFromStorage() {
  const stored = localStorage.getItem(MENU_KEY);
  if (stored) {
    try {
      allItems = JSON.parse(stored);
    } catch {
      allItems = [...defaultMenu];
      saveToStorage();
    }
  } else {
    // First run — seed defaults
    allItems = [...defaultMenu];
    saveToStorage();
  }
}

function saveToStorage() {
  localStorage.setItem(MENU_KEY, JSON.stringify(allItems));
}

function nextId() {
  return allItems.length > 0 ? Math.max(...allItems.map(i => i.id)) + 1 : 1;
}

// ── Boot ──────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  renderStats();
  renderMenuList();
});

// ── Stats ─────────────────────────────────────────────────────
function renderStats() {
  const active   = allItems.filter(i => i.is_active).length;
  const inactive = allItems.length - active;
  document.getElementById('stat-total').innerText    = allItems.length;
  document.getElementById('stat-active').innerText   = active;
  document.getElementById('stat-inactive').innerText = inactive;
}

// ── Menu list ─────────────────────────────────────────────────
function renderMenuList() {
  const container = document.getElementById('menu-list-body');
  container.className = ''; // clear loading-state flex classes

  if (allItems.length === 0) {
    container.innerHTML = renderEmptyState('ยังไม่มีเมนูอาหาร กด "เพิ่มเมนูใหม่" เพื่อเริ่มต้น');
    return;
  }

  // Group by category
  const groups = {};
  allItems.forEach(item => {
    const cat = item.category || 'อื่นๆ';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  });

  let html = '';
  Object.entries(groups).forEach(([category, items]) => {
    html += `
      <div class="border-b border-stone-100 last:border-0">
        <div class="bg-stone-50 px-5 py-2.5 flex items-center gap-2 border-b border-stone-100">
          <span class="text-xs font-bold uppercase tracking-wider text-stone-500">หมวด: ${category}</span>
          <span class="text-[10px] font-semibold text-stone-400 bg-stone-200 px-1.5 py-0.5 rounded-full">${items.length} รายการ</span>
        </div>
        <table class="w-full text-left text-sm">
          <tbody class="divide-y divide-stone-50">
            ${items.map(item => renderRow(item)).join('')}
          </tbody>
        </table>
      </div>`;
  });

  container.innerHTML = html;
}

function renderRow(item) {
  const activeClass  = item.is_active ? 'text-stone-800' : 'text-stone-400 line-through';
  const badgeClass   = item.is_active
    ? 'bg-green-100 text-green-700 border border-green-200'
    : 'bg-stone-100 text-stone-400 border border-stone-200';
  const toggleLabel  = item.is_active ? 'ปิดเมนู' : 'เปิดเมนู';
  const toggleClass  = item.is_active
    ? 'text-stone-400 hover:text-amber-600 hover:bg-amber-50'
    : 'text-stone-400 hover:text-green-600 hover:bg-green-50';

  return `
    <tr class="hover:bg-stone-50 transition-colors group">
      <td class="py-3 px-5 ${activeClass} font-medium">${item.name}</td>
      <td class="py-3 px-3 font-bold font-eng ${item.is_active ? 'text-orange-600' : 'text-stone-400'} w-20">฿${item.price.toLocaleString()}</td>
      <td class="py-3 px-3 w-16">
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}">${item.is_active ? 'เปิด' : 'ปิด'}</span>
      </td>
      <td class="py-3 px-3 w-48">
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onclick="openEditForm(${item.id})" class="text-[11px] font-bold text-stone-500 hover:text-orange-600 hover:bg-orange-50 px-2.5 py-1 rounded-lg transition-colors">แก้ไข</button>
          <button onclick="toggleActive(${item.id})" class="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${toggleClass}">${toggleLabel}</button>
          <button onclick="deleteItem(${item.id})" class="text-[11px] font-bold text-stone-400 hover:text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors">ลบ</button>
        </div>
      </td>
    </tr>`;
}

function renderEmptyState(msg) {
  return `
    <div class="flex flex-col items-center justify-center py-20 text-stone-400 gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-sm font-medium">${msg}</p>
    </div>`;
}

// ── Add / Edit Form ───────────────────────────────────────────
function openAddForm() {
  document.getElementById('form-panel-title').innerText  = 'เพิ่มเมนูใหม่';
  document.getElementById('form-submit-label').innerText = 'บันทึก';
  document.getElementById('form-item-id').value          = '';
  document.getElementById('form-name').value             = '';
  document.getElementById('form-price').value            = '';
  document.getElementById('form-category').value         = 'ส้มตำ';
  document.getElementById('form-category-custom').value  = '';
  hideFormError();
  document.getElementById('form-panel').classList.remove('translate-x-full');
  document.getElementById('form-name').focus();
}

function openEditForm(itemId) {
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;

  const knownCategories = ['ส้มตำ', 'อาหาร', 'ข้าว/เส้น', 'เครื่องดื่ม', 'ของหวาน', 'อื่นๆ'];
  const isKnown = knownCategories.includes(item.category);

  document.getElementById('form-panel-title').innerText  = 'แก้ไขเมนู';
  document.getElementById('form-submit-label').innerText = 'บันทึกการแก้ไข';
  document.getElementById('form-item-id').value          = item.id;
  document.getElementById('form-name').value             = item.name;
  document.getElementById('form-price').value            = item.price;
  document.getElementById('form-category').value         = isKnown ? item.category : 'อื่นๆ';
  document.getElementById('form-category-custom').value  = isKnown ? '' : item.category;
  hideFormError();
  document.getElementById('form-panel').classList.remove('translate-x-full');
  document.getElementById('form-name').focus();
}

function closeForm() {
  document.getElementById('form-panel').classList.add('translate-x-full');
}

function submitForm() {
  const id        = document.getElementById('form-item-id').value;
  const name      = document.getElementById('form-name').value.trim();
  const price     = parseInt(document.getElementById('form-price').value);
  const catSelect = document.getElementById('form-category').value;
  const catCustom = document.getElementById('form-category-custom').value.trim();
  const category  = catCustom || catSelect;

  if (!name)             { showFormError('กรุณาใส่ชื่อเมนู'); return; }
  if (!price || price < 0) { showFormError('กรุณาใส่ราคาที่ถูกต้อง'); return; }

  if (id) {
    // Edit existing
    const item = allItems.find(i => i.id === parseInt(id));
    if (item) {
      item.name     = name;
      item.price    = price;
      item.category = category;
    }
    showNotification(`แก้ไข "${name}" เรียบร้อย`);
  } else {
    // Add new
    allItems.push({ id: nextId(), name, price, category, is_active: true });
    showNotification(`เพิ่ม "${name}" เรียบร้อย`);
  }

  saveToStorage();
  closeForm();
  renderStats();
  renderMenuList();
}

// ── Toggle active ─────────────────────────────────────────────
function toggleActive(itemId) {
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;
  item.is_active = !item.is_active;
  saveToStorage();
  renderStats();
  renderMenuList();
  showNotification(`"${item.name}" — ${item.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}แล้ว`);
}

// ── Delete ────────────────────────────────────────────────────
function deleteItem(itemId) {
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;
  if (!confirm(`ลบ "${item.name}" ออกจากเมนู?\nการกระทำนี้ไม่สามารถย้อนกลับได้`)) return;
  allItems = allItems.filter(i => i.id !== itemId);
  saveToStorage();
  renderStats();
  renderMenuList();
  showNotification(`ลบ "${item.name}" เรียบร้อย`);
}

// ── Form helpers ──────────────────────────────────────────────
function showFormError(msg) {
  const el = document.getElementById('form-error');
  el.innerText = msg;
  el.classList.remove('opacity-0');
}

function hideFormError() {
  document.getElementById('form-error').classList.add('opacity-0');
}

// ── Toast ─────────────────────────────────────────────────────
function showNotification(msg) {
  const toast = document.getElementById('toast-notification');
  document.getElementById('toast-text').innerText = msg;
  toast.classList.remove('translate-y-24', 'opacity-0');
  setTimeout(() => toast.classList.add('translate-y-24', 'opacity-0'), 4000);
}

// ── Keyboard ──────────────────────────────────────────────────
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeForm();
  if (e.key === 'Enter' && !document.getElementById('form-panel').classList.contains('translate-x-full')) {
    submitForm();
  }
});
