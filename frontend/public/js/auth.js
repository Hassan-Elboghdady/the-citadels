// ─── Password Show/Hide Toggle ───

document.querySelectorAll('.password-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (!input) return;

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    const openIcon = btn.querySelector('.eye-open');
    const closedIcon = btn.querySelector('.eye-closed');
    if (openIcon && closedIcon) {
      openIcon.style.display = isPassword ? 'none' : '';
      closedIcon.style.display = isPassword ? '' : 'none';
    }

    btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });
});

// ─── Password Strength + Rule Checks ───

const passwordInput = document.getElementById('signup-password');
const strengthFill = document.getElementById('strength-fill');
const strengthLabel = document.getElementById('strength-label');
const rulesContainer = document.getElementById('password-rules');

if (passwordInput && strengthFill && strengthLabel) {
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    const checks = {
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      digit: /[0-9]/.test(val),
      special: /[^A-Za-z0-9]/.test(val)
    };

    // Update rule indicators
    if (rulesContainer) {
      rulesContainer.querySelectorAll('li').forEach(li => {
        const rule = li.getAttribute('data-rule');
        if (rule && checks[rule] !== undefined) {
          li.classList.toggle('rule-pass', checks[rule]);
        }
      });
    }

    // Calculate strength score
    const passed = Object.values(checks).filter(Boolean).length;
    let pct = 0;
    let label = '';
    let color = '';

    if (val.length === 0) {
      pct = 0;
      label = '';
      color = 'var(--border)';
    } else if (passed <= 2) {
      pct = 20;
      label = 'Weak';
      color = '#B43C3C';
    } else if (passed <= 3) {
      pct = 45;
      label = 'Fair';
      color = '#B48C3C';
    } else if (passed === 4) {
      pct = 70;
      label = 'Good';
      color = '#3C7AB4';
    } else {
      pct = 100;
      label = 'Strong';
      color = '#2D6A32';
    }

    strengthFill.style.width = pct + '%';
    strengthFill.style.backgroundColor = color;
    strengthLabel.textContent = label;
    strengthLabel.style.color = color;
  });
}
