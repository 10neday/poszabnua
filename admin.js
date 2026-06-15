// ── Auth guard (admin only) ───────────────────────────────────
if (sessionStorage.getItem('zn_auth') !== 'admin') {
  window.location.href = 'login.html';
}

// ── localStorage keys ─────────────────────────────────────────
const MENU_KEY         = 'zn_menu_items';
const MENU_VERSION_KEY = 'zn_menu_version';
const MENU_VERSION     = 2; // bump to force re-seed from defaultMenu

// ── Default menu (seeded from Menu Master.csv) ────────────────
const defaultMenu = [
  { id: 1,   name: 'ตำปลาร้า',                              price: 30,  category: 'เมนูตำ',               is_active: true },
  { id: 2,   name: 'ตำหอยดอง',                              price: 30,  category: 'เมนูตำ',               is_active: true },
  { id: 3,   name: 'ตำปู',                                   price: 30,  category: 'เมนูตำ',               is_active: true },
  { id: 4,   name: 'ตำไทย',                                  price: 30,  category: 'เมนูตำ',               is_active: true },
  { id: 5,   name: 'ตำไทยไข่เค็ม',                          price: 35,  category: 'เมนูตำ',               is_active: true },
  { id: 6,   name: 'ตำไทยไข่เค็ม',                          price: 40,  category: 'เมนูตำ',               is_active: true },
  { id: 7,   name: 'ตำปลากรอบ',                              price: 40,  category: 'เมนูตำ',               is_active: true },
  { id: 8,   name: 'ตำซั่ว',                                 price: 40,  category: 'เมนูตำ',               is_active: true },
  { id: 9,   name: 'ตำซั่วแตง',                              price: 40,  category: 'เมนูตำ',               is_active: true },
  { id: 10,  name: 'ตำขนมจีน',                               price: 50,  category: 'เมนูตำ',               is_active: true },
  { id: 11,  name: 'ตำป่า',                                  price: 50,  category: 'เมนูตำ',               is_active: true },
  { id: 12,  name: 'ตำข้าวโพด+ปลากรอบ',                     price: 50,  category: 'เมนูตำ',               is_active: true },
  { id: 13,  name: 'ตำถั่ว',                                 price: 40,  category: 'เมนูตำ',               is_active: true },
  { id: 14,  name: 'ตำแตง',                                  price: 40,  category: 'เมนูตำ',               is_active: true },
  { id: 15,  name: 'ตำทะเล',                                 price: 80,  category: 'เมนูตำ',               is_active: true },
  { id: 16,  name: 'ตำเส้นแก้วทะเล',                        price: 80,  category: 'เมนูตำ',               is_active: true },
  { id: 17,  name: 'ตำหอยแครง',                              price: 80,  category: 'เมนูตำ',               is_active: true },
  { id: 18,  name: 'ตำมาม่าทะเล',                            price: 80,  category: 'เมนูตำ',               is_active: true },
  { id: 19,  name: 'ตำกุ้งสด',                               price: 60,  category: 'เมนูตำ',               is_active: true },
  { id: 20,  name: 'ตำกุ้งลวก',                              price: 60,  category: 'เมนูตำ',               is_active: true },
  { id: 21,  name: 'หลดบัวทะเล',                             price: 80,  category: 'เมนูตำ',               is_active: true },
  { id: 22,  name: 'หลดบัวกุ้งสด',                           price: 80,  category: 'เมนูตำ',               is_active: true },
  { id: 23,  name: 'ตำตีนไก่',                               price: 60,  category: 'เมนูตำ',               is_active: true },
  { id: 24,  name: 'ตำสามหมู',                               price: 70,  category: 'เมนูตำ',               is_active: true },
  { id: 25,  name: 'ตำแคปหมู',                               price: 50,  category: 'เมนูตำ',               is_active: true },
  { id: 26,  name: 'ตำหมูยอ',                                price: 50,  category: 'เมนูตำ',               is_active: true },
  { id: 27,  name: 'ตำหลวงงพระบาง',                         price: 50,  category: 'เมนูตำ',               is_active: true },
  { id: 28,  name: 'ตำโคราช',                                price: 50,  category: 'เมนูตำ',               is_active: true },
  { id: 29,  name: 'ตำหลดบัว',                               price: 50,  category: 'เมนูตำ',               is_active: true },
  { id: 30,  name: 'ตำเส้นแก้ว',                             price: 50,  category: 'เมนูตำ',               is_active: true },
  { id: 31,  name: 'ตำมะม่วงกุ้งสด',                        price: 70,  category: 'เมนูตำ',               is_active: true },
  { id: 32,  name: 'ตำปูจืด',                                price: 60,  category: 'เมนูตำ',               is_active: true },
  { id: 33,  name: 'ตำเล็บมือนาง',                           price: 60,  category: 'เมนูตำ',               is_active: true },
  { id: 34,  name: 'ข้าวปุ้นซายน้ำปลาร้า',                  price: 50,  category: 'เมนูตำ',               is_active: true },
  { id: 35,  name: 'ตำข้าวโพดปลาร้า',                       price: 40,  category: 'เมนูตำ',               is_active: true },
  { id: 36,  name: 'ตำข้าวโพดกุ้งสด',                       price: 70,  category: 'เมนูตำ',               is_active: true },
  { id: 37,  name: 'ตำข้าวโพดกุ้งลวก',                      price: 70,  category: 'เมนูตำ',               is_active: true },
  { id: 38,  name: 'ตำหน่อไม้หมูยอ',                        price: 60,  category: 'เมนูตำ',               is_active: true },
  { id: 39,  name: 'ตำหน่อไม้ทะเล',                         price: 80,  category: 'เมนูตำ',               is_active: true },
  { id: 40,  name: 'ตำแซลมอน',                               price: 120, category: 'เมนูตำ',               is_active: true },
  { id: 41,  name: 'ตำคอหมูย่าง',                            price: 80,  category: 'เมนูตำ',               is_active: true },
  { id: 42,  name: 'หมูตกครก',                               price: 80,  category: 'เมนูตำ',               is_active: true },
  { id: 43,  name: 'เหลาหมูยอ',                              price: 60,  category: 'เมนูเหลา',             is_active: true },
  { id: 44,  name: 'เหลาปูอัด',                              price: 60,  category: 'เมนูเหลา',             is_active: true },
  { id: 45,  name: 'เหลาตีนไก่',                             price: 70,  category: 'เมนูเหลา',             is_active: true },
  { id: 46,  name: 'เหลาเล็บมือนาง',                        price: 70,  category: 'เมนูเหลา',             is_active: true },
  { id: 47,  name: 'เหลากุ้งสด',                             price: 70,  category: 'เมนูเหลา',             is_active: true },
  { id: 48,  name: 'เหลากุ้งลวก',                            price: 70,  category: 'เมนูเหลา',             is_active: true },
  { id: 49,  name: 'เหลาหอยแครง',                            price: 80,  category: 'เมนูเหลา',             is_active: true },
  { id: 50,  name: 'เหลาหอยนางรม',                          price: 80,  category: 'เมนูเหลา',             is_active: true },
  { id: 51,  name: 'เหลาปูม้าสด',                            price: 100, category: 'เมนูเหลา',             is_active: true },
  { id: 52,  name: 'เหลาปูม้าลวก',                          price: 100, category: 'เมนูเหลา',             is_active: true },
  { id: 53,  name: 'เหลา 3 หอย',                             price: 120, category: 'เมนูเหลา',             is_active: true },
  { id: 54,  name: 'เหลาแซลมอน',                             price: 120, category: 'เมนูเหลา',             is_active: true },
  { id: 55,  name: 'เหลาทะเล',                               price: 100, category: 'เมนูเหลา',             is_active: true },
  { id: 56,  name: 'เหลารวมมิตร',                            price: 150, category: 'เมนูเหลา',             is_active: true },
  { id: 57,  name: 'เหลาทะเลถาด',                            price: 350, category: 'เมนูเหลา',             is_active: true },
  { id: 58,  name: 'ยำมะม่วงกุ้งสด',                        price: 70,  category: 'เมนูยำ',               is_active: true },
  { id: 59,  name: 'ยำมะม่วงกุ้งลวก',                       price: 70,  category: 'เมนูยำ',               is_active: true },
  { id: 60,  name: 'ยำมาม่า',                                price: 50,  category: 'เมนูยำ',               is_active: true },
  { id: 61,  name: 'ยำวุ้นเส้น',                             price: 50,  category: 'เมนูยำ',               is_active: true },
  { id: 62,  name: 'ยำมาม่าทะเล',                            price: 80,  category: 'เมนูยำ',               is_active: true },
  { id: 63,  name: 'ยำวุ้นเส้นทะเล',                        price: 80,  category: 'เมนูยำ',               is_active: true },
  { id: 64,  name: 'ยำหอยนางรมปลาร้า',                      price: 80,  category: 'เมนูยำ',               is_active: true },
  { id: 65,  name: 'ยำหอยนางรมไม่ปลาร้า',                   price: 80,  category: 'เมนูยำ',               is_active: true },
  { id: 66,  name: 'ยำหมูยอ',                                price: 60,  category: 'เมนูยำ',               is_active: true },
  { id: 67,  name: 'ยำปูอัด',                                price: 60,  category: 'เมนูยำ',               is_active: true },
  { id: 68,  name: 'ยำคอหมูย่างปลาร้า',                     price: 80,  category: 'เมนูยำ',               is_active: true },
  { id: 69,  name: 'ยำคอหมูย่างไม่ปลาร้า',                  price: 80,  category: 'เมนูยำ',               is_active: true },
  { id: 70,  name: 'ยำกุ้งสด',                               price: 70,  category: 'เมนูยำ',               is_active: true },
  { id: 71,  name: 'ยำกุ้งลวก',                              price: 70,  category: 'เมนูยำ',               is_active: true },
  { id: 72,  name: 'ยำทะเลรวมมิตร',                         price: 120, category: 'เมนูยำ',               is_active: true },
  { id: 73,  name: 'ยำไข่แดงเค็ม',                          price: 80,  category: 'เมนูยำ',               is_active: true },
  { id: 74,  name: 'ลาบหมู',                                 price: 60,  category: 'เมนูลาบ-ก้อย',         is_active: true },
  { id: 75,  name: 'ลาบไก่',                                 price: 60,  category: 'เมนูลาบ-ก้อย',         is_active: true },
  { id: 76,  name: 'ลาบไส้อ่อน',                             price: 80,  category: 'เมนูลาบ-ก้อย',         is_active: true },
  { id: 77,  name: 'ลาบทะเล',                                price: 80,  category: 'เมนูลาบ-ก้อย',         is_active: true },
  { id: 78,  name: 'ตับหวาน',                                price: 60,  category: 'เมนูลาบ-ก้อย',         is_active: true },
  { id: 79,  name: 'ก้อยเนื้อ',                              price: 120, category: 'เมนูลาบ-ก้อย',         is_active: true },
  { id: 80,  name: 'ก้อยหมู',                                price: 120, category: 'เมนูลาบ-ก้อย',         is_active: true },
  { id: 81,  name: 'ซกเล็กเนื้อ',                            price: 120, category: 'เมนูลาบ-ก้อย',         is_active: true },
  { id: 82,  name: 'ซกเล็กหมู',                              price: 120, category: 'เมนูลาบ-ก้อย',         is_active: true },
  { id: 83,  name: 'น้ำตกหมู',                               price: 120, category: 'เมนูลาบ-ก้อย',         is_active: true },
  { id: 84,  name: 'น้ำตกเนื้อ',                             price: 120, category: 'เมนูลาบ-ก้อย',         is_active: true },
  { id: 85,  name: 'น้ำตกคอหมูย่าง',                        price: 80,  category: 'เมนูลาบ-ก้อย',         is_active: true },
  { id: 86,  name: 'ต้มแซ่บกระดูกอ่อน(ถ้วย)',               price: 80,  category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 87,  name: 'ต้มแซ่บกระดูกอ่อน(หม้อ)',               price: 120, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 88,  name: 'ต้มแซ่บตีนไก่(ถ้วย)',                   price: 80,  category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 89,  name: 'ต้มแซ่บตีนไก่(หม้อ)',                   price: 120, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 90,  name: 'ต้มยำทะเลข้น(ถ้วย)',                    price: 100, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 91,  name: 'ต้มยำทะเลข้น(หม้อ)',                    price: 150, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 92,  name: 'ต้มยำทะเลใส(ถ้วย)',                     price: 100, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 93,  name: 'ต้มยำทะเลใส(หม้อ)',                     price: 150, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 94,  name: 'ต้มซุปเปอร์ตีนไก่น้ำแดง(ถ้วย)',         price: 80,  category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 95,  name: 'ต้มซุปเปอร์ตีนไก่น้ำแดง(หม้อ)',         price: 120, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 96,  name: 'แกงเห็ดรวม(ถ้วย)',                      price: 80,  category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 97,  name: 'แกงเห็ดรวม(หม้อ)',                      price: 120, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 98,  name: 'แกงวุ้นเส้นปลากระป๋อง(ถ้วย)',           price: 80,  category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 99,  name: 'แกงวุ้นเส้นปลากระป๋อง(หม้อ)',           price: 120, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 100, name: 'อ่อมหมู(ถ้วย)',                          price: 120, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 101, name: 'อ่อมหมู(หม้อ)',                          price: 200, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 102, name: 'อ่อมเนื้อ(ถ้วย)',                        price: 120, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 103, name: 'อ่อมเนื้อ(หม้อ)',                        price: 200, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 104, name: 'อ่อมเครื่องในไก่(ถ้วย)',                price: 120, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 105, name: 'อ่อมเครื่องในไก่(หม้อ)',                price: 200, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 106, name: 'อ่อมปลาดุก(ถ้วย)',                      price: 120, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 107, name: 'อ่อมปลาดุก(หม้อ)',                      price: 200, category: 'เมนูต้ม-แกง-อ่อม',     is_active: true },
  { id: 108, name: 'หอยแครงลวก',                            price: 100, category: 'เมนูลวก',              is_active: true },
  { id: 109, name: 'ทะเลลวกจิ้ม',                           price: 200, category: 'เมนูลวก',              is_active: true },
  { id: 110, name: 'หมูมะนาว',                               price: 120, category: 'เมนูลวก',              is_active: true },
  { id: 111, name: 'กุ้งแช่น้ำปลา',                         price: 120, category: 'เมนูลวก',              is_active: true },
  { id: 112, name: 'ทะเลดำ',                                 price: 200, category: 'เมนูลวก',              is_active: true },
  { id: 113, name: 'เมี่ยงปลาทู',                            price: 150, category: 'เมนูลวก',              is_active: true },
  { id: 114, name: 'เมี่ยงทะเล',                             price: 200, category: 'เมนูลวก',              is_active: true },
  { id: 115, name: 'ปีกไก่ทอด 4 ชิ้น',                      price: 50,  category: 'เมนูย่าง-ทอด-อบ',       is_active: true },
  { id: 116, name: 'หมูแดดเดียว',                            price: 100, category: 'เมนูย่าง-ทอด-อบ',       is_active: true },
  { id: 117, name: 'เนื้อแดดเดียว',                         price: 120, category: 'เมนูย่าง-ทอด-อบ',       is_active: true },
  { id: 118, name: 'คอหมูทอด',                               price: 100, category: 'เมนูย่าง-ทอด-อบ',       is_active: true },
  { id: 119, name: 'ไส้อ่อนทอดกระเทียม',                    price: 120, category: 'เมนูย่าง-ทอด-อบ',       is_active: true },
  { id: 120, name: 'คอหมูย่าง',                              price: 80,  category: 'เมนูย่าง-ทอด-อบ',       is_active: true },
  { id: 121, name: 'ปีกไก่อบ',                               price: 50,  category: 'เมนูย่าง-ทอด-อบ',       is_active: true },
  { id: 122, name: 'ลูกชิ้นทอด',                             price: 50,  category: 'เมนูย่าง-ทอด-อบ',       is_active: true },
  { id: 123, name: 'เฟรนซ์ฟรายส์',                          price: 50,  category: 'เมนูย่าง-ทอด-อบ',       is_active: true },
  { id: 124, name: 'ชีสบอล',                                 price: 50,  category: 'เมนูย่าง-ทอด-อบ',       is_active: true },
  { id: 125, name: 'กุ้งชุบแป้งทอด',                        price: 80,  category: 'เมนูย่าง-ทอด-อบ',       is_active: true },
  { id: 126, name: 'นักเก็ต',                                price: 50,  category: 'เมนูย่าง-ทอด-อบ',       is_active: true },
  { id: 127, name: 'กะเพราหมู',                              price: 40,  category: 'เมนูอาหารจานเดียว',     is_active: true },
  { id: 128, name: 'กะเพราไก่',                              price: 40,  category: 'เมนูอาหารจานเดียว',     is_active: true },
  { id: 129, name: 'กะเพราเนื้อ',                            price: 50,  category: 'เมนูอาหารจานเดียว',     is_active: true },
  { id: 130, name: 'กะเพราทะเล',                             price: 60,  category: 'เมนูอาหารจานเดียว',     is_active: true },
  { id: 131, name: 'ข้าวผัดหมู(เล็ก)',                      price: 50,  category: 'เมนูอาหารจานเดียว',     is_active: true },
  { id: 132, name: 'ข้าวผัดหมู(ใหญ่)',                      price: 80,  category: 'เมนูอาหารจานเดียว',     is_active: true },
  { id: 133, name: 'ข้าวผัดไก่(เล็ก)',                      price: 50,  category: 'เมนูอาหารจานเดียว',     is_active: true },
  { id: 134, name: 'ข้าวผัดไก่(ใหญ่)',                      price: 80,  category: 'เมนูอาหารจานเดียว',     is_active: true },
  { id: 135, name: 'ข้าวผัดทะเล(เล็ก)',                     price: 60,  category: 'เมนูอาหารจานเดียว',     is_active: true },
  { id: 136, name: 'ข้าวผัดทะเล(ใหญ่)',                     price: 120, category: 'เมนูอาหารจานเดียว',     is_active: true },
  { id: 137, name: 'ชุดหมู',                                 price: 199, category: 'เมนูแจ่วฮ้อนหม้อดิน',   is_active: true },
  { id: 138, name: 'ชุดเนื้อ',                               price: 259, category: 'เมนูแจ่วฮ้อนหม้อดิน',   is_active: true },
  { id: 139, name: 'ชุดรวมหมู+เนื้อ',                       price: 299, category: 'เมนูแจ่วฮ้อนหม้อดิน',   is_active: true },
  { id: 140, name: 'เพิ่มหมู',                               price: 79,  category: 'เมนูแจ่วฮ้อนหม้อดิน',   is_active: true },
  { id: 141, name: 'เพิมเนื้อ',                              price: 99,  category: 'เมนูแจ่วฮ้อนหม้อดิน',   is_active: true },
  { id: 142, name: 'เพิ่มหมู+เนื้อ',                        price: 159, category: 'เมนูแจ่วฮ้อนหม้อดิน',   is_active: true },
  { id: 143, name: 'เพิ่มผัก+วุ้นเส้น',                     price: 49,  category: 'เมนูแจ่วฮ้อนหม้อดิน',   is_active: true },
  { id: 144, name: 'เพิ่มชุดพริก กระเทียม มะนาว',           price: 10,  category: 'เมนูแจ่วฮ้อนหม้อดิน',   is_active: true },
  { id: 145, name: 'เพิ่มน้ำจิ้มแจ่ว สุกี้',                price: 15,  category: 'เมนูแจ่วฮ้อนหม้อดิน',   is_active: true },
  { id: 146, name: 'ข้าวเหนียว',                             price: 10,  category: 'เมนูข้าว/เครื่องเคียง',  is_active: true },
  { id: 147, name: 'ข้าวสวย',                                price: 10,  category: 'เมนูข้าว/เครื่องเคียง',  is_active: true },
  { id: 148, name: 'ขนมจีน',                                 price: 10,  category: 'เมนูข้าว/เครื่องเคียง',  is_active: true },
  { id: 149, name: 'เส้นเล็กลวก',                            price: 10,  category: 'เมนูข้าว/เครื่องเคียง',  is_active: true },
  { id: 150, name: 'มาม่าลวก',                               price: 15,  category: 'เมนูข้าว/เครื่องเคียง',  is_active: true },
  { id: 151, name: 'ขนมจีนสด+ผักลวก',                       price: 30,  category: 'เมนูข้าว/เครื่องเคียง',  is_active: true },
  { id: 152, name: 'แคปหมู',                                 price: 30,  category: 'เมนูข้าว/เครื่องเคียง',  is_active: true },
  { id: 153, name: 'ไข่เค็ม',                                price: 10,  category: 'เมนูข้าว/เครื่องเคียง',  is_active: true },
  { id: 154, name: 'ไข่เยี่ยวม้า',                           price: 10,  category: 'เมนูข้าว/เครื่องเคียง',  is_active: true },
  { id: 155, name: 'โค้ก(ใหญ่)',                             price: 40,  category: 'เครื่องดื่ม',            is_active: true },
  { id: 156, name: 'โค้ก(เล็ก)',                             price: 20,  category: 'เครื่องดื่ม',            is_active: true },
  { id: 157, name: 'โค้กแก้วโอ่ง',                          price: 25,  category: 'เครื่องดื่ม',            is_active: true },
  { id: 158, name: 'น้ำเปล่า(ใหญ่)',                         price: 20,  category: 'เครื่องดื่ม',            is_active: true },
  { id: 159, name: 'น้ำเปล่า(เล็ก)',                         price: 10,  category: 'เครื่องดื่ม',            is_active: true },
  { id: 160, name: 'น้ำแข็งถัง(ใหญ่)',                      price: 20,  category: 'เครื่องดื่ม',            is_active: true },
  { id: 161, name: 'น้ำแข็งถัง(เล็ก)',                      price: 10,  category: 'เครื่องดื่ม',            is_active: true },
  { id: 162, name: 'เบียร์ช้าง',                             price: 65,  category: 'เครื่องดื่ม',            is_active: true },
  { id: 163, name: 'เบียร์ลีโอ',                             price: 70,  category: 'เครื่องดื่ม',            is_active: true },
  { id: 164, name: 'เบียร์สิงห์',                            price: 80,  category: 'เครื่องดื่ม',            is_active: true },
  { id: 165, name: 'เบียร์ไฮเนเก้น',                        price: 80,  category: 'เครื่องดื่ม',            is_active: true },
  { id: 166, name: 'ตำถาดแซ่บนัว',                          price: 199, category: 'เมนูแนะนำ',              is_active: true },
  { id: 167, name: 'ตำถาดปูปลาร้า',                         price: 139, category: 'เมนูแนะนำ',              is_active: true },
  { id: 168, name: 'ตำถาดป่า',                               price: 139, category: 'เมนูแนะนำ',              is_active: true },
  { id: 169, name: 'ตำถาดทะเล',                              price: 150, category: 'เมนูแนะนำ',              is_active: true },
  { id: 170, name: 'ตำซั่วทะเลเดือด',                       price: 150, category: 'เมนูแนะนำ',              is_active: true },
  { id: 171, name: 'เหลาถาด 4 อย่าง(กุ้ง หอย หมึก ปู) สด', price: 199, category: 'เมนูแนะนำ',             is_active: true },
  { id: 172, name: 'เหลาถาด 4 อย่าง(กุ้ง หอย หมึก ปู) ลวก', price: 199, category: 'เมนูแนะนำ',            is_active: true },
  { id: 173, name: 'ตำหลดบัวแซลมอน',                        price: 150, category: 'เมนูแนะนำ',              is_active: true },
  { id: 174, name: 'ตำลาวแซ่บนัว',                          price: 60,  category: 'เมนูแนะนำ',              is_active: true },
  { id: 175, name: 'ตำหอยเชอรี่',                            price: 60,  category: 'เมนูแนะนำ',              is_active: true },
  { id: 176, name: 'ซุปหน่อไม้',                             price: 50,  category: 'เมนูแนะนำ',              is_active: true },
  { id: 177, name: 'ก้อยหอยเชอรี่',                         price: 80,  category: 'เมนูแนะนำ',              is_active: true },
  { id: 178, name: 'หอยนางรมทรงเครื่อง',                    price: 120, category: 'เมนูแนะนำ',              is_active: true },
  { id: 179, name: 'ยำไข่เยี่ยวม้า',                        price: 80,  category: 'เมนูแนะนำ',              is_active: true },
];

let allItems   = [];
let searchQuery = '';

// ── localStorage helpers ──────────────────────────────────────
function loadFromStorage() {
  const stored  = localStorage.getItem(MENU_KEY);
  const version = parseInt(localStorage.getItem(MENU_VERSION_KEY) || '0');

  if (stored && version === MENU_VERSION) {
    try {
      allItems = JSON.parse(stored);
    } catch {
      allItems = defaultMenu.map(i => ({ ...i }));
      saveToStorage();
    }
  } else {
    // First run or version mismatch — replace with new menu
    allItems = defaultMenu.map(i => ({ ...i }));
    saveToStorage();
    localStorage.setItem(MENU_VERSION_KEY, MENU_VERSION);
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

// ── Search ────────────────────────────────────────────────────
function filterMenuList(query) {
  searchQuery = query.toLowerCase().trim();
  renderMenuList();
}

// ── Menu list ─────────────────────────────────────────────────
function renderMenuList() {
  const container = document.getElementById('menu-list-body');
  container.className = '';

  const filtered = searchQuery
    ? allItems.filter(i =>
        i.name.toLowerCase().includes(searchQuery) ||
        (i.category || '').toLowerCase().includes(searchQuery))
    : allItems;

  if (allItems.length === 0) {
    container.innerHTML = renderEmptyState('ยังไม่มีเมนูอาหาร กด "เพิ่มเมนูใหม่" เพื่อเริ่มต้น');
    return;
  }
  if (filtered.length === 0) {
    container.innerHTML = renderEmptyState(`ไม่พบเมนูที่ค้นหา "${searchQuery}"`);
    return;
  }

  // Group by category
  const groups = {};
  filtered.forEach(item => {
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
          <span class="text-[10px] font-semibold text-stone-400 bg-stone-200 px-1.5 py-0.5 rounded-full">${items.length} รายการ${searchQuery ? ` (ค้นหา)` : ''}</span>
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
