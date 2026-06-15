// Staff PIN: 1234  |  Admin PIN: 9999
const STAFF_PIN = '1234';
const ADMIN_PIN = '9999';

let currentPin = '';
let locked = false;

function pressPin(digit) {
  if (locked || currentPin.length >= 4) return;
  hideError();
  currentPin += digit;
  updateDots();
  if (currentPin.length === 4) {
    locked = true;
    setTimeout(validatePin, 250);
  }
}

function backspacePin() {
  if (locked) return;
  currentPin = currentPin.slice(0, -1);
  updateDots();
  hideError();
}

function clearPin() {
  if (locked) return;
  currentPin = '';
  updateDots();
  hideError();
}

function updateDots() {
  document.querySelectorAll('.pin-dot').forEach((dot, i) => {
    if (i < currentPin.length) {
      dot.classList.add('pin-dot-filled');
    } else {
      dot.classList.remove('pin-dot-filled');
    }
  });
}

function validatePin() {
  if (currentPin === STAFF_PIN) {
    sessionStorage.setItem('zn_auth', 'staff');
    window.location.href = 'index.html';
  } else if (currentPin === ADMIN_PIN) {
    sessionStorage.setItem('zn_auth', 'admin');
    window.location.href = 'index.html';
  } else {
    showError();
    setTimeout(() => {
      locked = false;
      clearPin();
    }, 900);
  }
}

function showError() {
  document.getElementById('pin-error').classList.remove('opacity-0');
}

function hideError() {
  document.getElementById('pin-error').classList.add('opacity-0');
}

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') pressPin(e.key);
  if (e.key === 'Backspace') backspacePin();
  if (e.key === 'Escape') clearPin();
});

// Already logged in — skip login
if (sessionStorage.getItem('zn_auth')) {
  window.location.href = 'index.html';
}
